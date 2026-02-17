#!/bin/bash
echo "Starting SoilTwin Platform..."

# Check Python deps
python3 -c "import pathway" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing Python dependencies..."
    python3 -m pip install -r backend/requirements.txt
fi

# Clean up any existing processes (optional, risky)
# pkill -f uvicorn
# pkill -f run_pathway.py

# Start Pathway Engine in background
echo "Starting Pathway Engine..."
python3 run_pathway.py &
PATHWAY_PID=$!

# Start Backend
echo "Starting FastAPI Backend..."
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting React Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "SoilTwin is running!"
echo "Pathway PID: $PATHWAY_PID"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services."

trap "kill $PATHWAY_PID $BACKEND_PID $FRONTEND_PID; exit" INT

wait
