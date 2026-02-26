#!/bin/bash
# SoilTwin Server Management Script
# Robust startup with health checks and auto-recovery

set -e

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOGS_DIR="$PROJECT_DIR/logs"
PID_DIR="$PROJECT_DIR/.pids"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create necessary directories
mkdir -p "$LOGS_DIR" "$PID_DIR"

# Function to print colored messages
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to kill process by port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        log_warn "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Function to check if server is responding
check_health() {
    local url=$1
    local max_attempts=$2
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    return 1
}

# Stop all servers
stop_servers() {
    log_info "Stopping all servers..."
    
    # Kill by port
    kill_port 8000
    kill_port 5173
    
    # Kill by process name
    pkill -9 -f "uvicorn main:app" 2>/dev/null || true
    pkill -9 -f "vite" 2>/dev/null || true
    pkill -9 -f "pathway_pipeline/main_pipeline.py" 2>/dev/null || true
    
    # Clean PID files
    rm -f "$PID_DIR"/*.pid
    
    log_info "All servers stopped"
}

# Start backend server
start_backend() {
    log_info "Starting backend server..."
    
    cd "$PROJECT_DIR"
    
    # Start uvicorn in background
    nohup python3 -m uvicorn backend.main:app --reload --port 8000 \
        > "$LOGS_DIR/backend.log" 2>&1 &
    
    local pid=$!
    echo $pid > "$PID_DIR/backend.pid"
    
    # Wait for backend to be ready
    log_info "Waiting for backend to start (PID: $pid)..."
    if check_health "http://localhost:8000/" 30; then
        log_info "✅ Backend started successfully on http://localhost:8000/"
        return 0
    else
        log_error "Backend failed to start within 30 seconds"
        cat "$LOGS_DIR/backend.log" | tail -20
        return 1
    fi
}

# Start frontend server
start_frontend() {
    log_info "Starting frontend server..."
    
    cd "$FRONTEND_DIR"
    
    # Start vite dev server in background
    nohup npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
    
    local pid=$!
    echo $pid > "$PID_DIR/frontend.pid"
    
    # Wait for frontend to be ready (Vite takes longer)
    log_info "Waiting for frontend to start (PID: $pid)..."
    if check_health "http://localhost:5173/" 45; then
        log_info "✅ Frontend started successfully on http://localhost:5173/"
        return 0
        cat "$LOGS_DIR/frontend.log" | tail -20
        return 1
    fi
}

# Start Pathway Pipeline
start_pipeline() {
    log_info "Starting Pathway Data Pipeline..."
    
    cd "$PROJECT_DIR"
    
    # Check if pipeline is already running
    if pgrep -f "pathway_pipeline/main_pipeline.py" > /dev/null; then
        log_warn "Pipeline already running. Restarting..."
        pkill -f "pathway_pipeline/main_pipeline.py"
        sleep 1
    fi

    # Start pipeline in background
    # We need to ensure PYTHONPATH includes current dir so it can import if needed, 
    # though it seems self-contained or relies on relative imports?
    # backend/api_routes imports from pathway_pipeline.
    # main_pipeline might need project root in path.
    export PYTHONPATH=$PYTHONPATH:.
    
    nohup python3 pathway_pipeline/main_pipeline.py \
        > "$LOGS_DIR/pipeline.log" 2>&1 &
        
    local pid=$!
    echo $pid > "$PID_DIR/pipeline.pid"
    
    log_info "Pipeline started with PID: $pid"
    # Pipeline doesn't have a port to check, so we assume it starts.
    # We can check if process is still alive after 2 seconds.
    sleep 2
    if kill -0 $pid 2>/dev/null; then
         log_info "✅ Pathway Pipeline running"
         return 0
    else
         log_error "Pipeline failed to start immediately. Check logs."
         cat "$LOGS_DIR/pipeline.log"
         return 1
    fi
}

# Show server status
status() {
    echo ""
    log_info "=== Server Status ==="
    
    # Check backend
    if check_health "http://localhost:8000/" 2; then
        echo -e "Backend:  ${GREEN}✅ Running${NC} - http://localhost:8000/"
        [ -f "$PID_DIR/backend.pid" ] && echo "  PID: $(cat $PID_DIR/backend.pid)"
    else
        echo -e "Backend:  ${RED}❌ Not Running${NC}"
    fi
    
    # Check frontend
    if check_health "http://localhost:5173/" 2; then
        echo -e "Frontend: ${GREEN}✅ Running${NC} - http://localhost:5173/"
        [ -f "$PID_DIR/frontend.pid" ] && echo "  PID: $(cat $PID_DIR/frontend.pid)"
    else
        echo -e "Frontend: ${RED}❌ Not Running${NC}"
    fi
    
    echo ""
    log_info "Recent logs:"
    echo "Backend:  tail -f $LOGS_DIR/backend.log"
    echo "Frontend: tail -f $LOGS_DIR/frontend.log"
    echo ""
}

# Main startup sequence
start() {
    echo ""
    log_info "🚀 Starting SoilTwin Application..."
    echo ""
    
    # Stop any existing servers
    stop_servers
    
    # Start backend
    if ! start_backend; then
        log_error "Failed to start backend. Check logs at: $LOGS_DIR/backend.log"
        exit 1
    fi
    
    sleep 2
    
    # Start frontend
    if ! start_frontend; then
        log_error "Failed to start frontend. Check logs at: $LOGS_DIR/frontend.log"
        exit 1
    fi

    sleep 2

    # Start Pipeline
    if ! start_pipeline; then
        log_error "Failed to start pipeline. Check logs at: $LOGS_DIR/pipeline.log"
    fi
    
    # Show final status
    status
    
    log_info "🎉 SoilTwin is ready!"
    log_info "   Frontend: http://localhost:5173/"
    log_info "   Backend:  http://localhost:8000/docs"
    echo ""
}

# Handle command line arguments
case "${1:-start}" in
    start)
        start
        ;;
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 2
        start
        ;;
    status)
        status
        ;;
    logs)
        if [ "$2" = "backend" ]; then
            tail -f "$LOGS_DIR/backend.log"
        elif [ "$2" = "frontend" ]; then
            tail -f "$LOGS_DIR/frontend.log"
        else
            log_info "Usage: $0 logs [backend|frontend]"
            log_info "Showing both logs (last 20 lines each):"
            echo ""
            echo "=== Backend Logs ==="
            tail -20 "$LOGS_DIR/backend.log" 2>/dev/null || echo "No backend logs"
            echo ""
            echo "=== Frontend Logs ==="
            tail -20 "$LOGS_DIR/frontend.log" 2>/dev/null || echo "No frontend logs"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs [backend|frontend]}"
        exit 1
        ;;
esac
