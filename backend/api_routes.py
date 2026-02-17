from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from slowapi import Limiter
from slowapi.util import get_remote_address
import json
import os

# Local imports
from .simulation_engine import process_event
from .auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_active_user
)
from .crud.user_crud import create_user, get_user_by_username, get_user_by_email, update_user_password
from .crud.password_reset_crud import create_reset_token, verify_reset_token, mark_token_used
from .crud.refresh_token_crud import create_refresh_token, verify_refresh_token, revoke_refresh_token
from .crud.user_crud import get_user_by_id

router = APIRouter()

# Rate limiter for API endpoints
limiter = Limiter(key_func=get_remote_address)

# Output file for Pathway state
OUTPUT_FILE = "./data/current_state.csv"

# Pydantic Models
class Event(BaseModel):
    type: str
    amount: Optional[float] = 0.0
    data: Optional[dict] = {}

class Question(BaseModel):
    text: str

class SimulateRequest(BaseModel):
    days: int


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@router.post("/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    User login endpoint.
    Returns JWT access token and refresh token for authentication.
    
    Credentials:
    - Username: admin, Password: admin123 (admin role)
    - Username: farmer, Password: farmer123 (farmer role)
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect username or password"
        )
    
    # Create JWT access token (short-lived, 30 minutes)
    access_token = create_access_token(data={"sub": user["username"]})
    
    # Create refresh token (long-lived, 30 days)
    refresh_token_info = create_refresh_token(str(user["_id"]))
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_info["token"],
        "token_type": "bearer",
        "username": user["username"],
        "role": user.get("role", "farmer"),
        "expires_in": 1800  # 30 minutes in seconds
    }


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    fullname: str
    password: str

@router.post("/register")
@limiter.limit("3/minute")  # Max 3 registration attempts per minute
async def register_user(request: Request, data: RegisterRequest):
    """
    User registration endpoint.
    Creates new user account with farmer role.
    
    Validation:
    - Username: 3-20 characters, alphanumeric
    - Password: Minimum 8 characters
    - Email: Valid format
    - Unique username and email
    """
    # Validate username length
    if len(data.username) < 3 or len(data.username) > 20:
        raise HTTPException(
            status_code=400,
            detail="Username must be between 3-20 characters"
        )
    
    # Validate password strength
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )
    
    # Check if password has at least one number
    if not any(char.isdigit() for char in data.password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )
    
    # Check if username already exists
    if get_user_by_username(data.username):
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    # Check if email already exists
    if get_user_by_email(data.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    try:
        # Create new user with farmer role
        user = create_user(
            username=data.username,
            email=data.email,
            fullname=data.fullname,
            password=data.password,
            role="farmer"
        )
        
        return {
            "message": "Registration successful",
            "username": data.username,
            "email": data.email
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
@limiter.limit("3/minute")  # Max 3 forgot password attempts per minute
async def forgot_password(request: Request, data: ForgotPasswordRequest):
    """
    Forgot password endpoint.
    Generates a 6-digit reset token for the user.
    
    In production, this would send an email with the token.
    For development, the token is returned in the response.
    """
    # Find user by email
    user = get_user_by_email(data.email)
    if not user:
        # Don't reveal if email exists - return success anyway
        return {
            "message": "If that email exists, a reset code has been sent",
            "token": None  # In production, don't return token
        }
    
    try:
        # Create reset token
        token_info = create_reset_token(user["_id"])
        
        # In production: Send email with token_info["token"]
        # For now, return it in response for testing
        
        return {
            "message": "Reset code generated successfully",
            "token": token_info["token"],  # Remove in production
            "expires_in": "15 minutes"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate reset token: {str(e)}"
        )


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str

@router.post("/reset-password")
@limiter.limit("5/minute")  # Max 5 reset attempts per minute
async def reset_password(request: Request, data: ResetPasswordRequest):
    """
    Reset password endpoint.
    Verifies the reset token and updates the password.
    """
    # Find user by email
    user = get_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or token"
        )
    
    # Validate new password
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )
    
    if not any(char.isdigit() for char in data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )
    
    # Verify reset token
    if not verify_reset_token(user["_id"], data.token):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    try:
        # Update password
        update_user_password(user["_id"], data.new_password)
        
        # Mark token as used
        mark_token_used(user["_id"], data.token)
        
        return {
            "message": "Password reset successful",
            "username": user["username"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Password reset failed: {str(e)}"
        )


class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/refresh")
async def refresh_access_token(data: RefreshTokenRequest):
    """
    Refresh access token endpoint.
    Takes a valid refresh token and returns a new access token.
    """
    # Verify refresh token
    token_doc = verify_refresh_token(data.refresh_token)
    if not token_doc:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )
    
    # Get user by ID
    user = get_user_by_id(token_doc["user_id"])
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Create new access token
    access_token = create_access_token(data={"sub": user["username"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 1800  # 30 minutes
    }


@router.post("/logout")
async def logout(data: RefreshTokenRequest):
    """
    Logout endpoint.
    Revokes the refresh token to prevent future refreshes.
    """
    revoked = revoke_refresh_token(data.refresh_token)
    
    return {
        "message": "Logged out successfully" if revoked else "Token invalid or already revoked"
    }


@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_active_user)):
    """
    Get current authenticated user profile.
    Requires valid JWT token.
    """
    return current_user


# ============================================================================
# FARMER PROFILE MANAGEMENT
# ============================================================================



@router.get("/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    """
    Returns the current farmer profile.
    """
    # For now, we still read the single profile.json but could easily multiplex
    if not os.path.exists("./data/profile.json"):
        return {"status": "No profile", "data": None}
    
    with open("./data/profile.json", "r") as f:
        data = json.load(f)
        # Mock override for farmer2 to show different location
        if isinstance(current_user, dict):
            c_username = current_user.get("username")
        else:
            c_username = current_user

        if c_username == "farmer2": 
            data["location"] = "Ludhiana,IN"
            data["name"] = "Suresh Singh"
        return {"status": "Found", "data": data}

@router.get("/soil-state")
def get_soil_state(current_user: str = Depends(get_current_user)):
    """
    Get current soil state. Requires authentication.
    Returns the latest computed soil state for the logged-in user.
    """
    if not os.path.exists(OUTPUT_FILE):
        return {"status": "Initializing...", "data": None}
    
    # Parse CSV 
    import csv
    with open(OUTPUT_FILE, 'r') as f:
        reader = csv.DictReader(f)
        # Filter for current user's state
        # user_id column is now in CSV from pipeline
        if isinstance(current_user, dict):
            target_user = current_user.get("username")
        else:
            target_user = current_user
            
        # We need the LATEST state for this user.
        # Since CSV in Pathway writes updates, we scan all rows (or read reversed if large).
        # For small demo file, reading all is fine.
        user_rows = [row for row in reader if row.get("user_id") == target_user]
        
        if user_rows:
            return user_rows[-1] # Return last (latest) state
            
    return {"status": "No data", "data": None}

@router.post("/events")
def trigger_event(event: Event, current_user: str = Depends(get_current_user)):
    """
    Manually inject an event into the stream. Requires authentication.
    """
    # We append to the JSON files that Pathway is watching!
    
    target_file = ""
    entry = {}
    
    import datetime
    ts = datetime.datetime.now().isoformat()
    
    # Get user_id
    if isinstance(current_user, dict):
        user_id = current_user.get("username")
    else:
        user_id = current_user

    # Handle aliases from frontend
    if event.type == "rain25":
        event.type = "rain"
        if not event.data: event.data = {}
        event.data["amount"] = 25.0
        
    common_fields = {"timestamp": ts, "note": "Manual trigger", "user_id": user_id}

    if event.type == "rain":
        target_file = "./data/simulated_streams/rainfall_stream.jsonl"
        entry = {**common_fields, "rain_mm": float(event.data.get("amount", 0))}
        
    elif event.type == "irrigation":
        target_file = "./data/simulated_streams/irrigation_events.jsonl"
        entry = {**common_fields, "water_liters": float(event.data.get("liters", 0))}
        
    elif event.type == "fertilizer":
        target_file = "./data/simulated_streams/fertilizer_events.jsonl"
        entry = {
            **common_fields,
            "amount_kg": float(event.data.get("amount", 0)), 
            "type": event.data.get("type", "Urea")
        }

    elif event.type == "harvest":
        target_file = "./data/simulated_streams/crop_events.json" # Not migrated yet
        entry = {
            **common_fields,
            "event": "harvest",
            "crop_name": event.data.get("crop", "Wheat"),
            "yield_tons": 4.0
        }

    elif event.type == "amendment":
        target_file = "./data/simulated_streams/soil_amendments.json" # Not migrated
        entry = {
            **common_fields,
            "type": event.data.get("type", "manure"),
            "amount_kg": float(event.data.get("amount", 0))
        }
    
    if target_file and entry:
        # Append to JSONL file (Efficient)
        try:
            with open(target_file, 'a') as f:
                f.write(json.dumps(entry) + "\n")
            
            # FAST PATH: Optimistic UI Update.
            # We calculate what the state *should* be and return it immediately.
            # The actual persistent state will be updated by Pathway (Single Source of Truth) asynchronously.
            new_state = process_event(event.type, event.data)
            
            return {"status": "Event Injected", "event": entry, "new_state": new_state}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    return {"status": "Ignored", "detail": "Unknown event type"}

@router.get("/history")
def get_history_log(limit: int = 50, current_user: str = Depends(get_current_user)):
    """
    Fetch aggregated history of all simulated events (Rain, Irrigation, Fertilizer).
    Reads from local JSONL files.
    """
    events = []
    if isinstance(current_user, dict):
        target_user = current_user.get("username", "farmer")
    else:
        target_user = current_user
    
    # helper to read jsonl
    def read_jsonl(filepath, event_type, subtype_key=None, amount_key=None):
        if not os.path.exists(filepath): return
        
        with open(filepath, 'r') as f:
            for line in f:
                try:
                    data = json.loads(line.strip())
                    
                    # Filter by user
                    if data.get("user_id", "farmer") != target_user:
                        continue
                        
                    # Normalize for frontend
                    evt = {
                        "id": str(int(float(datetime.fromisoformat(data["timestamp"]).timestamp() * 1000))), # diverse ID
                        "timestamp": data["timestamp"],
                        "type": event_type,
                        "subtype": data.get(subtype_key, "General") if subtype_key else "Standard",
                        "amount": f"{data.get(amount_key, 0)}", # keep simple
                        "status": "Logged",
                        "operator": "User/System"
                    }
                    
                    # Custom formatting for specific types
                    if event_type == "Rainfall":
                        evt["subtype"] = "Natural"
                        evt["amount"] = f"{data.get('rain_mm', 0)} mm"
                        evt["operator"] = "Cloud Node"
                    elif event_type == "Irrigation":
                        evt["subtype"] = "Tube Well"
                        evt["amount"] = f"{data.get('water_liters', 0)} L"
                        evt["operator"] = "Smart Valve"
                    elif event_type == "Fertilizer":
                        # fertilizer_events.jsonl: {"amount_kg": 20, ...} 
                        evt["amount"] = f"{data.get('amount_kg', 0)} kg"
                        
                    events.append(evt)
                except Exception as e:
                    # print(f"Error parsing line in {filepath}: {e}")
                    continue

    # Read all streams
    read_jsonl("./data/simulated_streams/rainfall_stream.jsonl", "Rainfall", amount_key="rain_mm")
    read_jsonl("./data/simulated_streams/irrigation_events.jsonl", "Irrigation", amount_key="water_liters")
    read_jsonl("./data/simulated_streams/fertilizer_events.jsonl", "Fertilizer", amount_key="amount_kg")
    
    # Sort by timestamp desc
    events.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return events[:limit]


@router.get("/external/ogd/{resource_id}")
async def get_ogd_data(resource_id: str):
    """
    Proxy to fetch data from data.gov.in using the server-side API key.
    Usage: GET /api/external/ogd/<resource_id>
    """
    api_key =os.getenv("DATA_GOV_IN_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OGD API Key not configured on server")
    
    url = f"https://api.data.gov.in/resource/{resource_id}?api-key={api_key}&format=json"
    
    try:
        import urllib.request
        import json
        
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                raise HTTPException(status_code=response.status, detail="External API Error")
            data = json.loads(response.read().decode())
            return data
            
    except Exception as e:
        print(f"OGD Proxy Error: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch from OGD: {str(e)}")

@router.get("/external/weather")
async def get_weather_data(location: str = "Ludhiana,IN"):
    """
    Fetches real-time weather from OpenWeatherMap.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        # Fallback for demo if key missing
        return {
            "temp": 28.5,
            "humidity": 65,
            "rain": 0,
            "description": "Sunny (Demo)",
            "icon": "01d",
            "impact": "Ideal for harvest"
        }
        
    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
    
    try:
        import urllib.request
        import json
        
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(url, context=ctx) as response:
            if response.status != 200:
                 raise HTTPException(status_code=502, detail="Weather API Error")
            
            data = json.loads(response.read().decode())
            
            # Simplified payload for Frontend
            rain_mm = data.get("rain", {}).get("1h", 0)
            hum = data.get("main", {}).get("humidity", 0)
            
            # Logic for Soil Impact Label
            impact = "Stable"
            if rain_mm > 5: impact = "Soil Saturation Likely"
            elif hum < 30: impact = "High Evaporation Risk"
            elif hum > 80: impact = "Fungal Risk High"
            
            return {
                "temp": data.get("main", {}).get("temp"),
                "humidity": hum,
                "rain": rain_mm,
                "description": data.get("weather", [{}])[0].get("description", "Clear"),
                "icon": data.get("weather", [{}])[0].get("icon", "01d"),
                "impact": impact
            }
            
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Return sensible fallback instead of crashing the dashboard
        return {
            "temp": "--",
            "humidity": "--",
            "rain": 0,
            "description": "Unavailable",
            "icon": "unknown",
            "impact": "Data Offline"
        }

@router.post("/ask")
@limiter.limit("10/minute")  # Max 10 questions per minute
async def ask_question(request: Request, q: Question, current_user: str = Depends(get_current_user)):
    """
    RAG-based Question Answering with Pathway-Native Vector Retrieval.
    Uses Pathway's streaming vector engine for semantic search.
    Requires authentication.
    RAG-based Question Answering with Pathway-Native Vector Retrieval.
    Uses Pathway's streaming vector engine for semantic search.
    """
    # 1. Get Current State
    state = get_soil_state()
    
    # 2. RAG Retrieval - Use Pathway vector store
    try:
        from pathway_pipeline.rag_store import query_vector_store, setup_rag_store
        
        # Initialize vector store (cached after first call)
        if not hasattr(ask_question, 'vector_store'):
            print("🔧 Initializing Pathway vector store...")
            ask_question.vector_store = setup_rag_store("./docs")
        
        # Query for relevant documents
        relevant_chunks = query_vector_store (ask_question.vector_store, q.text, k=3)
        
        if relevant_chunks:
            guidelines = "\n\n".join(relevant_chunks)
            print(f"✅ Retrieved {len(relevant_chunks)} chunks via Pathway vector search")
        else:
            # Fallback if no results
            guidelines = "Agricultural guidelines unavailable."
            
    except Exception as e:
        print(f"RAG Error: {e}. Using direct file loading...")
        # Ultimate fallback: direct file reading
        guidelines = ""
        try:
            with open("./docs/fertilizer_guidelines.txt", "r") as f: 
                guidelines += f.read() + "\n"
            with open("./docs/crop_nutrient_rules.txt", "r") as f: 
                guidelines += f.read() + "\n"
        except:
            guidelines = "Guidelines unavailable."

    # 3. Call LLM (Gemini) using .env key
    import google.generativeai as genai
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or "your_api_key_here" in api_key:
        return {
            "answer": "AI API Key missing. Please update .env file.",
            "cost_saving": "N/A"
        }
        
    genai.configure(api_key=api_key)
    # Use gemini-2.0-flash-lite based on available models for this key
    model = genai.GenerativeModel('gemini-2.0-flash-lite')

    prompt = f"""
    You are an agricultural expert helping an Indian farmer.
    
    Current Soil Status (Live from Pathway Streaming Engine):
    Nitrogen: {state.get('nitrogen')} kg/ha ({state.get('status_n')})
    Phosphorus: {state.get('phosphorus')} kg/ha ({state.get('status_p')})
    Potassium: {state.get('potassium')} kg/ha ({state.get('status_k')})
    Moisture: {state.get('moisture')}%
    
    Relevant Agricultural Knowledge (from Pathway Vector RAG):
    {guidelines[:3000]}
    (End of Context)
    
    Farmer Question: {q.text}
    
    Instructions:
    - Answer in simple Hinglish (Hindi + English mix) or English as appropriate.
    - Be brief and actionable.
    - If suggesting fertilizer, mention estimated cost savings if they skip unnecessary application.
    - Use the provided Context Guidelines to support your answer.
    """
    
    try:
        response = model.generate_content(prompt)
        answer_text = response.text
        
        return {
            "answer": answer_text,
            "cost_saving": "Calculated in advice" 
        }
    except Exception as e:
        # FALLBACK FOR DEMO: If API fails (Rate Limit), return a deterministic rule-based answer
        print(f"AI API Error: {e}")
        
        # FALLBACK: Robust Rule-Based Expert System (Offline Mode)
        # This simulates the AI's logic when the LLM API is rate-limited or unavailable.
        print(f"Switched to Expert Rule Engine due to API: {e}")
        
        n_val = float(state.get('nitrogen', 0))
        p_val = float(state.get('phosphorus', 0))
        k_val = float(state.get('potassium', 0))
        h2o = float(state.get('moisture', 0))

        advice_parts = []
        cost_savings = 0.0
        
        # 1. Nitrogen Analysis
        if n_val < 280:
            advice_parts.append(f"⚠️ **Nitrogen is critically low ({n_val} kg/ha).** Immediate application of Urea (40kg/acre) is recommended to prevent yellowing.")
            cost_savings += 0 # Cost incurred
        elif n_val > 560:
            advice_parts.append(f"✅ **Nitrogen levels are high ({n_val} kg/ha).** You can safely SKIP the next scheduled Urea dosage.")
            cost_savings += 450 # Approx saving
        else:
            advice_parts.append(f"✅ **Nitrogen is optimal.** Maintain current schedule.")

        # 2. Moisture Analysis
        if h2o < 30:
            advice_parts.append(f"💧 **Soil moisture is low ({h2o}%).** Irrigation is required within 24 hours.")
        elif h2o > 80:
             advice_parts.append(f"⚠️ **Soil is saturated ({h2o}%).** Delay irrigation to prevent root rot.")
        
        # 3. Overall Recommendation
        if not advice_parts:
             advice_parts.append("Soil parameters are within the ideal range for Wheat.")

        final_advice = " ".join(advice_parts)
        
        saving_text = f"₹ {int(cost_savings)} estimated savings" if cost_savings > 0 else "Yield Protection Mode"

        return {
            "answer": final_advice,
            "cost_saving": saving_text
        }
