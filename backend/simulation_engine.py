import csv
import os
import datetime

DATA_DIR = "./data"
STATE_FILE = f"{DATA_DIR}/current_state.csv"
SHC_FILE = f"{DATA_DIR}/SHC.csv"

def get_current_state():
    # Try to read current state, else fall back to SHC
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            reader = csv.DictReader(f)
            data = list(reader)
            if data: return data[0]
            
    if os.path.exists(SHC_FILE):
        with open(SHC_FILE, 'r') as f:
            reader = csv.DictReader(f)
            data = list(reader)
            if data: return data[0]
            
    return None

def save_state(state):
    # Calculate status colors
    n = float(state.get('nitrogen', 0))
    p = float(state.get('phosphorus', 0))
    k = float(state.get('potassium', 0))
    m = float(state.get('moisture', 0))
    
    state['status_n'] = 'green' if n > 280 else 'yellow' if n > 140 else 'red'
    state['status_p'] = 'green' if p > 25 else 'yellow' if p > 10 else 'red'
    state['status_k'] = 'green' if k > 280 else 'yellow' if k > 140 else 'red'
    state['status_m'] = 'green' if m > 50 else 'yellow' if m > 30 else 'red'
    state['time'] = str(datetime.datetime.now().timestamp())
    state['diff'] = "1" # Flag to show it's updated
    
    with open(STATE_FILE, 'w') as f:
        writer = csv.DictWriter(f, fieldnames=state.keys())
        writer.writeheader()
        writer.writerow(state)

def process_event(event_type, event_data):
    state = get_current_state()
    if not state: return
    
    n = float(state.get('nitrogen', 0))
    p = float(state.get('phosphorus', 0))
    k = float(state.get('potassium', 0))
    m = float(state.get('moisture', 0))
    
    print(f"Processing {event_type}: {event_data} on State N={n}, M={m}")

    if event_type == "rain":
        mm = float(event_data.get("amount", 0))
        # Logic: N -= 1.2 * mm, M += 0.4 * mm
        n -= (mm * 1.2)
        m += (mm * 0.4)
        
    elif event_type == "irrigation":
        liters = float(event_data.get("liters", 0))
        # Logic: 50k L -> +20% moisture. Factor 0.0004
        m += (liters * 0.0004)
        
    elif event_type == "fertilizer":
        ftype = str(event_data.get("type", "")).lower()
        amt = float(event_data.get("amount", 0))
        if 'urea' in ftype:
            n += (amt * 0.46)
        elif 'dap' in ftype:
            n += (amt * 0.18)
            p += (amt * 0.46)
        elif 'potash' in ftype:
            k += (amt * 0.60)
            
    # Clamp Moisture
    m = max(0.0, min(100.0, m))
    
    # Update State
    state['nitrogen'] = str(round(n, 2))
    state['phosphorus'] = str(round(p, 2))
    state['potassium'] = str(round(k, 2))
    state['moisture'] = str(round(m, 2))
    
    # save_state(state)  <-- DISABLED: Pathway is the Single Source of Truth for DB/CSV writes.
    # We only return 'state' here for Optimistic UI updates.
    return state
