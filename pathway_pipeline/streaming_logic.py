import pathway as pw

# Fertilizer conversion factors (Source: FCO India)
# How much of the nutrient is available in 1kg of fertilizer?
TRANSFORMATIONS = {
    'urea': {'nitrogen': 0.46},          # 46% N
    'dap': {'nitrogen': 0.18, 'phosphorus': 0.46}, # 18% N, 46% P2O5
    'potash': {'potassium': 0.60},       # 60% K2O (MOP)
    'ssp': {'phosphorus': 0.16},         # 16% P (Single Super Phosphate) - optional add
}

# Source: Research on N leaching in Indian soils (approx 0.5-1.2 kg N per 10mm rain)
# Demo Coefficient: 0.8 to show visible effect
LEACHING_COEFF_N = 0.8 

# Moisture retention: 0.4% increase per mm rain ( Simplified for demo)
MOISTURE_RAIN_FACTOR = 0.4
MOISTURE_IRRIGATION_FACTOR = 0.0005 # % increase per liter? No, let's say per liter/acre. 
# Better: Assume standard irrigation event adds ~5-10% moisture
# Simplified: 1mm rain ~ 10,000 liters/hectare. 
# Let's keep logic simple: Input is likely just "Irrigation Event" or "Liters".
# If liters, we need area. Assume 2 acres (0.8 ha) from profile.

def apply_rain_logic(state, rain_mm):
    """
    Computes new state after rain.
    - Nitrogen decreases (leaching)
    - Moisture increases
    """
    # Create new values
    new_n = state['nitrogen'] - (rain_mm * LEACHING_COEFF_N)
    new_moisture = state['moisture'] + (rain_mm * MOISTURE_RAIN_FACTOR)
    
    # Clamping
    new_n = max(0.0, new_n)
    new_moisture = min(100.0, new_moisture)
    
    return state.with_columns(
        nitrogen=new_n,
        moisture=new_moisture
    )

def apply_fertilizer_logic(state, fert_type, amount_kg):
    """
    Computes new state after fertilizer application.
    """
    # Normalize string
    ftype = fert_type.lower()
    
    if ftype not in TRANSFORMATIONS:
        return state # No change if unknown
    
    comp = TRANSFORMATIONS[ftype]
    
    # Calculate added nutrients (kg/ha)
    # Assuming standard field size of ~1 ha for the calc (simplified for Hackathon)
    # Or strict conversion: amount_kg * content. 
    # If state is kg/ha, and farmer adds X kg to their field.
    # To keep demo simple: Assume specific field addition translates directly to standard boost.
    # Actually, let's just do: N_new = N_old + (Amount * Content * Efficiency)
    # Efficiency is rarely 100%, but for demo visual, let's use 100% or close.
    
    updates = {}
    
    if 'nitrogen' in comp:
        updates['nitrogen'] = state['nitrogen'] + (amount_kg * comp['nitrogen'])
    
    if 'phosphorus' in comp:
        updates['phosphorus'] = state['phosphorus'] + (amount_kg * comp['phosphorus'])
        
    if 'potassium' in comp:
        updates['potassium'] = state['potassium'] + (amount_kg * comp['potassium'])
        
    return state.with_columns(**updates)

def apply_irrigation_logic(state, liters):
    """
    Simple moisture boost.
    """
    # Simplified: 10k liters = ~5% moisture boost for demo
    boost = (liters / 10000.0) * 5.0 
    new_m = min(100.0, state['moisture'] + boost)
    return state.with_columns(moisture=new_m)

def apply_crop_logic(state, crop_event, crop_name):
    """
    Simulates nutrient removal during Harvest.
    """
    event = crop_event.lower()
    crop = crop_name.lower()
    
    updates = {}
    
    if event == "harvest":
        # Nutrient removal (kg/ha) estimates for typical yield
        # Wheat: ~100kg N, ~20kg P, ~80kg K per harvest (Simulated)
        if "wheat" in crop:
            updates['nitrogen'] = max(0.0, state['nitrogen'] - 80.0)
            updates['phosphorus'] = max(0.0, state['phosphorus'] - 15.0)
            updates['potassium'] = max(0.0, state['potassium'] - 60.0)
        elif "rice" in crop:
            updates['nitrogen'] = max(0.0, state['nitrogen'] - 90.0)
            updates['phosphorus'] = max(0.0, state['phosphorus'] - 20.0)
            updates['potassium'] = max(0.0, state['potassium'] - 70.0)
        else:
            # Generic
            updates['nitrogen'] = max(0.0, state['nitrogen'] - 50.0)
            updates['phosphorus'] = max(0.0, state['phosphorus'] - 10.0)
            updates['potassium'] = max(0.0, state['potassium'] - 40.0)
            
    return state.with_columns(**updates)

def apply_amendment_logic(state, amendment_type, amount_kg):
    """
    Simulates Lime (pH+) / Gypsum (pH-) / Manure (OC+, Nutrients+).
    """
    atype = amendment_type.lower()
    updates = {}
    
    # pH Modification
    if "lime" in atype:
        # Lime increases pH. Rate: 100kg ~ +0.1 pH (Approx demo rule)
        pH_change = (amount_kg / 1000.0) * 1.0 # 1 ton = +1 pH
        updates['ph'] = min(14.0, state['ph'] + pH_change)
        
    elif "gypsum" in atype:
        # Gypsum reduces pH (for alkaline soil). 
        pH_change = (amount_kg / 1000.0) * 0.5 
        updates['ph'] = max(0.0, state['ph'] - pH_change)
        
    elif "manure" in atype or "compost" in atype:
        # Organic Carbon boost + some nutrients
        # 1 ton (1000kg) ~ +0.05% OC
        oc_change = (amount_kg / 1000.0) * 0.05
        updates['organic_carbon'] = state['organic_carbon'] + oc_change
        
        # Manure also adds NPK (roughly 0.5-0.2-0.5 NPK %)
        updates['nitrogen'] = state['nitrogen'] + (amount_kg * 0.005)
        updates['phosphorus'] = state['phosphorus'] + (amount_kg * 0.002)
        updates['potassium'] = state['potassium'] + (amount_kg * 0.005)
        
    return state.with_columns(**updates)
