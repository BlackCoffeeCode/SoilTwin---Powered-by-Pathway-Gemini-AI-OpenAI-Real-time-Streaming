# SoilTwin Research Sources

## Soil Health Card Data (India Standards)
- **Source**: TNAU Agritech Portal / IISS
- **Data Extracted**:
  - **Nitrogen (N)**: Low (<280), Medium (280-560), High (>560) kg/ha
  - **Phosphorus (P)**: Low (<11), Medium (11-22), High (>22) kg/ha
  - **Potassium (K)**: Low (<120), Medium (120-280), High (>280) kg/ha
  - **Organic Carbon (OC)**: Low (<0.5), Medium (0.5-0.75), High (>0.75) %
- **Notes**: Used for `soil_twin_state.py` thresholds.

## Fertilizer Composition (FCO Standards)
- **Source**: Fertilizer Control Order (FCO) 1985, India
- **Data Extracted**:
  - **Urea**: 46% Nitrogen
  - **DAP**: 18% Nitrogen, 46% Phosphorus (P2O5)
  - **MOP (Potash)**: 60% Potassium (K2O)
- **Notes**: Used in `streaming_logic.py` for event transformation.

## Crop Nutrient Requirements (ICAR Recommendations)
- **Source**: ICAR / IIWBR / TNAU
- **Data Extracted (N:P:K kg/ha)**:
  - **Wheat**: 150:60:40
  - **Rice**: 120:60:60
  - **Cotton**: 100:50:50
  - **Soybean**: 25:60:40
- **Notes**: Documented in `docs/crop_nutrient_rules.txt` for RAG.

## Fertilizer Prices (2024-25 Market Rates)
- **Source**: Department of Fertilizers, Govt of India / Market Reports
- **Data Extracted (Approx per 50kg bag)**:
  - **Urea**: ₹266
  - **DAP**: ₹1350
  - **MOP**: ₹1650
- **Notes**: Used in `data/cost_data/fertilizer_prices.json` for cost saving calculation.

## Nitrogen Leaching & Rainfall
- **Source**: Research papers (NIH, ResearchGate) on Indian agricultural soils
- **Data Extracted**:
  - Significant leaching during monsoon (68-94% of annual flux).
  - Estimated loss: ~0.5-0.8 kg N per 10mm rainfall (derived from annual leaching rates of 50-75kg/ha).
- **Notes**: Used 0.8 coefficient in `apply_rain_event` for demo visibility.
