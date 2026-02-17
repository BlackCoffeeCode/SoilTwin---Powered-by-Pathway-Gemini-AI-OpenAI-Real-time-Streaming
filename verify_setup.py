import subprocess
import time
import os
import signal
import sys
import threading
from urllib.request import urlopen
from urllib.error import URLError

# Configuration
BACKEND_PORT = 8000
FRONTEND_PORT = 5173
CHECK_INTERVAL_SEC = 2
MAX_RETRIES = 60 # Slower start on some systems

def get_pids_on_port(port):
    """Finds PIDs using lsof on Mac/Linux. Returns a list of ints."""
    try:
        # lsof -t -i:PORT returns only the PIDs, one per line
        output = subprocess.check_output(["lsof", "-t", f"-i:{port}"], stderr=subprocess.DEVNULL)
        pids = []
        for line in output.strip().splitlines():
            try:
                pids.append(int(line))
            except ValueError:
                pass
        return pids
    except subprocess.CalledProcessError:
        return []

def kill_process_on_port(port):
    pids = get_pids_on_port(port)
    for pid in pids:
        print(f"⚠️  Killing conflicting process on port {port} (PID: {pid})")
        try:
            os.kill(pid, signal.SIGKILL)
        except ProcessLookupError:
            pass

def check_health(url):
    try:
        with urlopen(url, timeout=1) as response:
            return response.status == 200
    except (URLError, ConnectionResetError):
        return False

def start_process(command, cwd, log_file):
    print(f"🚀 Starting: {' '.join(command)}")
    f = open(log_file, "w")
    # setsid to create a new session group so we can clean up easily
    process = subprocess.Popen(
        command,
        cwd=cwd,
        stdout=f,
        stderr=subprocess.STDOUT,
        preexec_fn=os.setsid
    )
    return process, f

def main():
    print("="*60)
    print("      🌱 SoilTwin Practical Verification Startup      ")
    print("="*60)

    # 1. Cleanup
    print("\n🧹 Cleaning up ports...")
    kill_process_on_port(BACKEND_PORT)
    kill_process_on_port(FRONTEND_PORT)
    
    # Kill any lingering python pathway processes (rough match)
    try:
        subprocess.run(["pkill", "-f", "run_pathway.py"], stderr=subprocess.DEVNULL)
    except: pass

    os.makedirs("logs", exist_ok=True)

    # 2. Start Pathway Engine
    print("\n⚙️  Starting Pathway Engine...")
    pathway_proc, pathway_log = start_process(
        [sys.executable, "run_pathway.py"],
        cwd=os.getcwd(),
        log_file="logs/pathway.log"
    )
    time.sleep(2) 

    # 3. Start Backend
    print("\n🔙 Starting FastAPI Backend...")
    backend_proc, backend_log = start_process(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", str(BACKEND_PORT)],
        cwd=os.getcwd(),
        log_file="logs/backend.log"
    )

    # 4. Start Frontend
    print("\n🖥️  Starting React Frontend...")
    frontend_proc, frontend_log = start_process(
        ["npm", "run", "dev"],
        cwd=os.path.join(os.getcwd(), "frontend"),
        log_file="logs/frontend.log"
    )

    # 5. Wait for Readiness
    print("\n⏳ Waiting for services to be ready...")
    
    backend_ready = False
    frontend_ready = False
    
    try:
        for i in range(MAX_RETRIES):
            if not backend_ready:
                if check_health(f"http://localhost:{BACKEND_PORT}/docs"):
                    print("✅ Backend is Ready!")
                    backend_ready = True
                else:
                    # Debug output if waiting too long
                    if i > 5 and i % 5 == 0:
                        print("   (Backend still starting...)")

            if not frontend_ready:
                if check_health(f"http://localhost:{FRONTEND_PORT}"):
                    print("✅ Frontend is Ready!")
                    frontend_ready = True
                else:
                    if i > 5 and i % 5 == 0:
                         print("   (Frontend still starting...)")
            
            if backend_ready and frontend_ready:
                break
                
            time.sleep(CHECK_INTERVAL_SEC)
    except KeyboardInterrupt:
        print("\n🛑 Interrupted during startup.")
        cleanup(pathway_proc, backend_proc, frontend_proc)
        return

    if backend_ready and frontend_ready:
        print("\n🎉 All Systems Operational!")
        print(f"👉 Frontend: http://localhost:{FRONTEND_PORT}")
        print(f"👉 Backend:  http://localhost:{BACKEND_PORT}/docs")
        print("\nlogs are in ./logs/")
        # Keep running until Ctrl+C
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping services...")
            cleanup(pathway_proc, backend_proc, frontend_proc)
            print("Done.")
    else:
        print("\n❌ Startup Failed.")
        cleanup(pathway_proc, backend_proc, frontend_proc)

def cleanup(p1, p2, p3):
    try:
        if p1: os.killpg(os.getpgid(p1.pid), signal.SIGTERM)
    except: pass
    try:
        if p2: os.killpg(os.getpgid(p2.pid), signal.SIGTERM)
    except: pass
    try:
        if p3: os.killpg(os.getpgid(p3.pid), signal.SIGTERM)
    except: pass

if __name__ == "__main__":
    main()
