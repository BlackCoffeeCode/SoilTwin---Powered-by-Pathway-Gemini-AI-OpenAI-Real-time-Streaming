import pathway as pw

class SoilState(pw.Schema):
    """
    Represents the digital twin state of the soil.
    Fields match the Soil Health Card parameters.
    """
    uid: str = pw.column_definition(primary_key=True)
    location: str
    nitrogen: float
    phosphorus: float
    potassium: float
    organic_carbon: float
    ph: float
    moisture: float
    # last_updated: float  # Not in CSV

# Research-based Thresholds (Source: ICAR/TNAU)
THRESHOLDS = {
    'nitrogen': {'low': 280, 'high': 560},  # kg/ha
    'phosphorus': {'low': 11, 'high': 22},  # kg/ha
    'potassium': {'low': 120, 'high': 280}, # kg/ha
    'organic_carbon': {'low': 0.5, 'high': 0.75}, # %
    'ph': {'min': 6.0, 'max': 8.5}, # Acceptable range
    'moisture': {'low': 15, 'high': 35} # % (Approx for wheat/general)
}

def get_status(value: float, nutrient: str) -> str:
    """
    Returns visual status key (red/yellow/green) based on thresholds.
    Used for frontend display logic (though frontend can also compute this).
    """
    if nutrient not in THRESHOLDS:
        return "unknown"
    
    t = THRESHOLDS[nutrient]
    
    if nutrient == 'ph':
        if t['min'] <= value <= t['max']:
            return "green"
        return "red"
    
    # Generic low/medium/high logic
    if value < t['low']:
        return "red"   # Deficient
    elif value > t['high']:
        return "green" # High/Sufficient (Note: Too high might differ, but for simplicity green)
    else:
        return "yellow" # Medium
