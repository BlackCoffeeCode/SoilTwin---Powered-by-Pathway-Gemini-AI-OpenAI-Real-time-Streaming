import pathway as pw
import os
from dotenv import load_dotenv

# Import our modules
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pathway_pipeline.soil_twin_state import SoilState, get_status
from pathway_pipeline.ingest import load_soil_health_card
from pathway_pipeline.streaming_logic import apply_rain_logic, apply_fertilizer_logic, apply_irrigation_logic, apply_crop_logic, apply_amendment_logic

load_dotenv()

DATA_DIR = "./data"

class RainSchema(pw.Schema):
    timestamp: str
    rain_mm: float
    note: str
    user_id: str

class LiveRainSchema(pw.Schema):
    timestamp: str
    rain_mm: float
    note: str

class IrriSchema(pw.Schema):
    timestamp: str
    water_liters: float
    note: str
    user_id: str

class FertSchema(pw.Schema):
    timestamp: str
    type: str
    amount_kg: float
    note: str
    user_id: str

class CropSchema(pw.Schema):
    timestamp: str
    event: str
    crop_name: str
    yield_tons: float
    note: str
    # user_id: str # Not using right now

class AmendmentSchema(pw.Schema):
    timestamp: str
    type: str
    amount_kg: float
    note: str
    # user_id: str

def run_pipeline():
    # 1. Load Static Data (The "Twin" base)
    shc_table = load_soil_health_card(f"{DATA_DIR}/soil_health_card/sample_shc.csv")
    shc_table = shc_table.select(
        user_id=pw.this.uid, 
        location=pw.this.location,
        nitrogen=pw.this.nitrogen,
        phosphorus=pw.this.phosphorus,
        potassium=pw.this.potassium,
        organic_carbon=pw.this.organic_carbon,
        ph=pw.this.ph,
        moisture=pw.this.moisture
    )
    pw.io.csv.write(shc_table, f"{DATA_DIR}/debug_shc.csv")
    
    # Helper to get constant UID with string type hint for Pathway
    def get_uid(t: str) -> str:
        return "SHC001"

    # LIVE WEATHER API INTEGRATION
    # Fetch and append current weather before loading the stream
    from pathway_pipeline.weather_api import stream_weather_to_jsonl
    
    # Get location from profile or use default
    location = "Karnal,IN"  # Default location
    if os.path.exists("./data/profile.json"):
        with open("./data/profile.json", "r") as f:
            profile = json.load(f)
            location = profile.get("location", "Karnal,IN")
    
    # Fetch live weather and append to stream
    live_weather_file = f"{DATA_DIR}/simulated_streams/live_weather.jsonl"
    print(f"🌦️  Fetching live weather for {location}...")
    stream_weather_to_jsonl(location, live_weather_file)
    
    # Load both live and historical rainfall data
    # Use live_weather.jsonl as primary source
    
    # helper to add user_id if missing (for live weather which is location based, we assume "farmer" for now or broadcast)
    # Actually live weather is just one stream. We can duplicate it for all users or just assign to one.
    # For simplicity, assign live weather to 'farmer'
    def add_user_farmer(x): return "farmer"

    rain = pw.io.jsonlines.read(live_weather_file, schema=LiveRainSchema, mode="streaming")
    rain = rain.select(
        timestamp=pw.this.timestamp,
        event_type=pw.apply(lambda x: "rain", pw.this.timestamp), 
        data=pw.apply(lambda mm: {"amount": mm}, pw.this.rain_mm),
        user_id=pw.apply(add_user_farmer, pw.this.timestamp)
    )

    # Historical Rain (The user_id one we just wrote)
    rain_stream = pw.io.jsonlines.read(f"{DATA_DIR}/simulated_streams/rainfall_stream.jsonl", schema=RainSchema, mode="streaming")
    rain_stream = rain_stream.select(
        timestamp=pw.this.timestamp,
        event_type=pw.apply(lambda x: "rain", pw.this.timestamp),
        data=pw.apply(lambda mm: {"amount": mm}, pw.this.rain_mm),
        user_id=pw.this.user_id
    )
    # Combine live and historical
    rain = rain.promise_universes_are_disjoint(rain_stream).concat(rain_stream)

    fert = pw.io.jsonlines.read(f"{DATA_DIR}/simulated_streams/fertilizer_events.jsonl", schema=FertSchema, mode="streaming")
    fert = fert.select(
        timestamp=pw.this.timestamp,
        event_type=pw.apply(lambda x: "fertilizer", pw.this.timestamp),
        data=pw.apply(lambda t, a: {"type": t, "amount": a}, pw.this.type, pw.this.amount_kg),
        user_id=pw.this.user_id
    )
    
    irri = pw.io.jsonlines.read(f"{DATA_DIR}/simulated_streams/irrigation_events.jsonl", schema=IrriSchema, mode="streaming")
    irri = irri.select(
        timestamp=pw.this.timestamp,
        event_type=pw.apply(lambda x: "irrigation", pw.this.timestamp),
        data=pw.apply(lambda l: {"liters": l}, pw.this.water_liters),
        user_id=pw.this.user_id
    )

    # Note: crops still json? Let's leave it unless we migrate fully.
    # We will just not use crops for now to avoid breaking if schema mismatch
    # (Or we can just comment out crop/amend if they aren't critical for the demo yet)
    # Let's keep them but assume they might fail if no user_id. 
    # Actually, let's skip crop/amend for now to ensure stability of the main 3 streams.
    
    # Union all events
    # Promise universes are disjoint for static files (safe here)
    events = rain.promise_universes_are_disjoint(fert).concat(fert)
    events = events.promise_universes_are_disjoint(irri).concat(irri)
    
    # print("DEBUG: Events Columns:", events.keys())

    # 3. Stateful Reducer
    # We iterate over events, grouped by UID, and update the state.
    
    # Define helper to compute deltas per event
    def compute_deltas(event_type, data):
        dn, dp, dk, dm = 0.0, 0.0, 0.0, 0.0
        
        # Rain
        if event_type == "rain":
            # data is a Json object, use [] access
            mm = data["amount"] if "amount" in data else 0
            dm += (mm * 0.4)
            dn -= (mm * 0.8) # Leaching
        
        # Irrigation
        elif event_type == "irrigation":
            liters = data["liters"] if "liters" in data else 0
            dm += (liters / 10000.0 * 5.0)
        
        # Consultant
        elif event_type == "fertilizer":
            ftype = data["type"].lower() if "type" in data else ""
            amt = data["amount"] if "amount" in data else 0
            if ftype == 'urea': dn += (amt * 0.46)
            elif ftype == 'dap': 
                dn += (amt * 0.18)
                dp += (amt * 0.46)
            elif ftype == 'potash': dk += (amt * 0.60)
            
        # Harvest
        elif event_type == "harvest":
            cname = data["crop"].lower() if "crop" in data else ""
            if "wheat" in cname:
                dn -= 80.0
                dp -= 15.0
                dk -= 60.0
            elif "rice" in cname:
                dn -= 90.0
                dp -= 20.0
                dk -= 70.0
            else:
                dn -= 50.0
                dp -= 10.0
                dk -= 40.0

        # Amendment
        elif event_type == "amendment":
            atype = data["type"].lower() if "type" in data else ""
            amt = data["amount"] if "amount" in data else 0
            if "manure" in atype:
                dn += (amt * 0.005)
                dp += (amt * 0.002)
                dk += (amt * 0.005)
            
        return (dn, dp, dk, dm)

    # Apply compute_deltas to get a struct/tuple of changes
    events_processed = events.select(
        user_id=pw.this.user_id,
        deltas=pw.apply(compute_deltas, pw.this.event_type, pw.this.data)
    )

    # Now reduce by summing and casting to float (since applies return ANY)
    event_effects = events_processed.groupby(pw.this.user_id).reduce(
        d_n=pw.reducers.sum(pw.apply(float, pw.this.deltas[0])),
        d_p=pw.reducers.sum(pw.apply(float, pw.this.deltas[1])),
        d_k=pw.reducers.sum(pw.apply(float, pw.this.deltas[2])),
        d_m=pw.reducers.sum(pw.apply(float, pw.this.deltas[3]))
    )
    
    # Materialize 'user_id' in event_effects as ANY type to match Join (STR vs ANY)
    event_effects = event_effects.select(
        d_n=pw.this.d_n,
        d_p=pw.this.d_p,
        d_k=pw.this.d_k,
        d_m=pw.this.d_m,
        user_id=pw.apply(lambda x: x, pw.this.id) # Casts to ANY
    )
    
    # Also cast shc_table user_id to ANY to match event_effects
    shc_table_view = shc_table.select(
        user_id=pw.apply(lambda x: x, pw.this.user_id),
        location=pw.this.location,
        base_n=pw.this.nitrogen,
        base_p=pw.this.phosphorus,
        base_k=pw.this.potassium,
        base_m=pw.this.moisture,
        base_ph=pw.this.ph,
        base_oc=pw.this.organic_carbon
    )
    
    # Join Effects with Initial State
    # Left join ensuring we satisfy all UIDs in SHC
    final_state = shc_table_view.join_left(
        event_effects,
        pw.left.user_id == pw.right.user_id,
    ).select(
        user_id=pw.left.user_id, # ANY type now
        location=pw.left.location,
        nitrogen=pw.this.base_n + pw.coalesce(pw.this.d_n, 0.0),
        phosphorus=pw.this.base_p + pw.coalesce(pw.this.d_p, 0.0),
        potassium=pw.this.base_k + pw.coalesce(pw.this.d_k, 0.0),
        moisture=pw.apply(lambda m, d: min(100.0, max(0.0, m + d)), pw.this.base_m, pw.coalesce(pw.this.d_m, 0.0)),
        ph=pw.this.base_ph,
        organic_carbon=pw.this.base_oc,
    ).select(
        user_id=pw.this.user_id,
        location=pw.this.location,
        nitrogen=pw.this.nitrogen,
        phosphorus=pw.this.phosphorus,
        potassium=pw.this.potassium,
        moisture=pw.this.moisture,
        ph=pw.this.ph,
        organic_carbon=pw.this.organic_carbon,
        status_n=pw.apply(lambda v: get_status(v, "nitrogen"), pw.this.nitrogen),
        status_p=pw.apply(lambda v: get_status(v, "phosphorus"), pw.this.phosphorus),
        status_k=pw.apply(lambda v: get_status(v, "potassium"), pw.this.potassium),
        status_m=pw.apply(lambda v: get_status(v, "moisture"), pw.this.moisture)
    )
    
    # Expose as a table for API to query
    
    # Also write the events log to CSV for the frontend to show "Recent Activity"
    # We select simple columns.
    # Use explicit column selection to avoid ambiguity
    events_log = events.select(
        timestamp=events.timestamp,
        event_type=events.event_type,
        details=pw.apply(str, events.data), # Convert dict to string for CSV
        user_id=events.user_id
    )
    pw.io.csv.write(events_log, f"{DATA_DIR}/recent_events.csv")
    
    # Write Current State to CSV for API to read
    # Write Current State to CSV for API to read
    pw.io.csv.write(final_state, f"{DATA_DIR}/current_state.csv")
    
    return final_state

if __name__ == "__main__":
    run_pipeline()
    pw.run()
