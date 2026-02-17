
import json
import os
import datetime

def get_history_log():
    events = []
    
    def read_jsonl(filepath, event_type, subtype_key=None, amount_key=None):
        if not os.path.exists(filepath): 
            print(f"File not found: {filepath}")
            return
        
        print(f"Reading {filepath}...")
        with open(filepath, 'r') as f:
            for line in f:
                try:
                    data = json.loads(line.strip())
                    print(f"Parsed line: {data}")
                    
                    # Logic from api_routes.py
                    ts_str = data["timestamp"]
                    # datetime.datetime.fromisoformat requires valid ISO. 
                    # If milliseconds exist, they must be handled.
                    # Python 3.7+ supports it. Let's see what happens.
                    dt = datetime.datetime.fromisoformat(ts_str)
                    
                    id_val = str(int(float(dt.timestamp() * 1000)))
                    
                    evt = {
                        "id": id_val, 
                        "timestamp": data["timestamp"],
                        "type": event_type,
                        "subtype": data.get(subtype_key, "General") if subtype_key else "Standard",
                        "amount": f"{data.get(amount_key, 0)}", 
                        "status": "Logged",
                        "operator": "User/System"
                    }
                    print(f"Created event: {evt}")
                    events.append(evt)
                except Exception as e:
                    print(f"Error parsing line: {e}")
                    continue

    read_jsonl("./data/simulated_streams/rainfall_stream.jsonl", "Rainfall", amount_key="rain_mm")
    print(f"Total events found: {len(events)}")
    return events

if __name__ == "__main__":
    get_history_log()
