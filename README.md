# SoilTwin: Real-Time Soil Digital Twin for Indian Agriculture

SoilTwin is a production-grade, real-time Soil Digital Twin platform designed to bridge the data freshness gap in Indian agriculture. It initializes soil conditions from Soil Health Cards (SHC) and continuously updates the soil state based on real-time events like rainfall, irrigation, and fertilizer application. It also provides AI-driven, explainable advisory to farmers in Hinglish.

## Key Features
- **Real-Time Digital Twin**: Continuously updates N, P, K, Moisture, and pH levels based on event streams (Pathway).
- **Event Simulation**: Simulate Rain, Irrigation, and Fertilizer application to see immediate impact (Leaching, Nutrient Boost).
- **RAG-Powered Advisory**: "Ask SoilTwin" chat uses LLMs (Gemini/OpenAI) with grounded knowledge from ICAR and FCO guidelines to provide actionable advice.
- **Farmer-Friendly Dashboard**: Visual gauges with simple Red/Yellow/Green status indicators.
- **Multi-User Support**: Secure login for multiple farmers with complete data isolation (Soil State, Events, History).
- **Cost Savings**: AI suggests optimal fertilizer use to prevent over-application and save money.

## Tech Stack
- **Core Intelligence**: [Pathway](https://pathway.com/) (Python) for streaming data processing and state management.
- **Backend API**: FastAPI (Python) for serving state and handling requests.
- **Frontend**: React (Vite + Tailwind CSS) for the interactive dashboard.
- **Data**: Simulated JSON streams and CSV-based Soil Health Card data.

## Prerequisites
- Python 3.10 or higher
- Node.js & npm
- OpenAI API Key in `.env` file.
- **Windows Users:** Must use WSL2 (Ubuntu). See [SETUP_WSL.md](./SETUP_WSL.md) for a detailed guide.

## Installation

1.  **Clone/Setup Repository**
    ```bash
    git clone <repo-url>
    cd SoilTwin
    # Unix/Mac:
    ./start.sh
    # Windows/WSL:
    ./setup_dev.sh
    ```

2.  **Install Backend Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    # Add your OpenAI API Key
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
    # Database Config
    MONGODB_URL=mongodb://localhost:27017/soiltwin_db
    ```

## Running the Application

### Option 1: Quick Start (Recommended)
Run the all-in-one startup script:
```bash
./start.sh
```
This will launch Pathway, Backend, and Frontend in the background and monitor them.

### Option 2: Manual Start
You need to run three components (recommended in separate terminals):

1.  **Pathway Engine (The Digital Twin)**
    Runs the core logic and updates the state.
    ```bash
    python run_pathway.py
    ```

2.  **Backend API**
    Serves the data to the frontend.
    ```bash
    uvicorn backend.main:app --reload
    ```

3.  **Frontend Dashboard**
    Launches the UI.
    ```bash
    cd frontend
    npm run dev
    ```

## Usage Guide
1.  Open the frontend (usually `http://localhost:5173`).
2.  **Login**: Use one of the demo accounts:
    - **User 1**: `farmer` / `password` (Location: Karnal, Haryana)
    - **User 2**: `farmer2` / `password` (Location: Ludhiana, Punjab)
3.  **View State**: Check the initial NPK and Moisture levels (loaded from `data/soil_health_card/sample_shc.csv`).
4.  **Simulate Rain**: Click "Heavy Rain". Watch Nitrogen levels drop (leaching) and Moisture rise.
5.  **Apply Fertilizer**: Click "Add Urea". Watch Nitrogen levels rise.
6.  **Ask AI**: Type "My nitrogen is low, what should I do?" to get RAG-based advice in Hinglish.

## Directory Structure
- `data/`: Contains SHC CSVs and simulated stream JSONs.
- `docs/`: Knowledge base for RAG (ICAR/FCO guidelines).
- `pathway_pipeline/`: Core Pathway logic (`main_pipeline.py`, `streaming_logic.py`).
- `backend/`: FastAPI application (`main.py`, `api_routes.py`).
- `frontend/`: React application code.

## License
MIT License. Built for Advanced Agentic Coding Assessment.
