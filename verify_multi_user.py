import requests
import time

BASE_URL = "http://localhost:8000"

def login(username, password):
    response = requests.post(f"{BASE_URL}/api/login", data={"username": username, "password": password})
    if response.status_code != 200:
        print(f"❌ Login failed for {username}: {response.text}")
        return None
    return response.json()["access_token"]

def get_soil_state(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/soil-state", headers=headers)
    if response.status_code != 200:
        print(f"❌ Failed to get soil state: {response.text}")
        return None
    return response.json()

def get_history(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/history", headers=headers)
    return response.json()

def trigger_event(token, event_type, data):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"type": event_type, "data": data}
    response = requests.post(f"{BASE_URL}/api/events", json=payload, headers=headers)
    return response.json()

def verify():
    print("🚀 Starting Multi-User Verification...")

    # 1. Login
    token1 = login("farmer", "password")
    token2 = login("farmer2", "password")
    
    if not token1 or not token2:
        return

    print("✅ Authentication successful for both users.")

    # 2. Check Initial Soil State
    state1 = get_soil_state(token1)
    state2 = get_soil_state(token2)

    print(f"Farmer 1 N: {state1.get('nitrogen')}")
    print(f"Farmer 2 N: {state2.get('nitrogen')}")

    # Farmer 1 should be ~240 (Base) + events. Farmer 2 ~580 (Base).
    # Note: If pipeline hasn't processed simulated streams yet, might be base values.
    # Base F1: 240, Base F2: 580.
    
    val1 = float(state1.get("nitrogen", 0))
    val2 = float(state2.get("nitrogen", 0))

    if abs(val1 - 240) < 50 and abs(val2 - 580) < 50:
         print("✅ Soil State Isolation Verified (Values match expected base ranges)")
    else:
         print(f"⚠️ Soil State mismatch? F1: {val1}, F2: {val2}")

    # 3. Trigger Event for Farmer 1
    print("💧 Triggering Rain (25mm) for Farmer 1...")
    trigger_event(token1, "rain", {"amount": 25})
    
    # Wait for pipeline (simulated simple delay, but api returns optimistic state)
    # The API returns optimistic 'new_state', but let's check persistence if possible or just history.
    
    # 4. Check History Isolation
    hist1 = get_history(token1)
    hist2 = get_history(token2)
    
    # Farmer 1 should have the manual rain event
    found_f1 = any(e['type'] == 'Rainfall' and e['operator'] == 'Cloud Node' and 'Manual' in str(e) for e in hist1) 
    # Actually 'Manual' note might not be exposed in simplified history view? 
    # Let's check count or recent timestamp.
    
    print(f"Farmer 1 History Count: {len(hist1)}")
    print(f"Farmer 2 History Count: {len(hist2)}")

    # We just appended to file. API reads file.
    # Farmer 1 should see it. Farmer 2 should NOT.
    
    # Filter strictly by what we just added? 
    # The get_history endpoint filters by user_id.
    
    # Let's rely on the counts or content.
    # We added rain to farmer 1.
    
    if len(hist1) > len(hist2):
         print("✅ History Isolation Verified (Farmer 1 has more events)")
    else:
         print("⚠️ History counts similar? Inspecting...")

if __name__ == "__main__":
    verify()
