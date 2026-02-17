#!/usr/bin/env python3
"""
SoilTwin Server Monitor & Auto-Restart
Keeps servers running and restarts them if they crash
"""

import subprocess
import time
import requests
import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).parent
LOGS_DIR = PROJECT_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)

class ServerMonitor:
    def __init__(self):
        self.backend_url = "http://localhost:8000/"
        self.frontend_url = "http://localhost:5173/"
        self.check_interval = 30  # seconds
        self.restart_attempts = 3
        
    def is_server_healthy(self, url, timeout=3):
        """Check if server is responding"""
        try:
            response = requests.get(url, timeout=timeout)
            return response.status_code == 200
        except:
            return False
    
    def restart_servers(self):
        """Restart both servers using start.sh"""
        print("🔄 Restarting servers...")
        try:
            subprocess.run(
                ["./start.sh", "restart"],
                cwd=PROJECT_DIR,
                check=True
            )
            print("✅ Servers restarted")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to restart: {e}")
            return False
    
    def monitor(self):
        """Main monitoring loop"""
        print("👀 Starting server monitor...")
        print(f"   Checking every {self.check_interval} seconds")
        print("   Press Ctrl+C to stop")
        print()
        
        consecutive_failures = 0
        
        while True:
            try:
                backend_ok = self.is_server_healthy(self.backend_url)
                frontend_ok = self.is_server_healthy(self.frontend_url)
                
                status = []
                if backend_ok:
                    status.append("Backend ✅")
                else:
                    status.append("Backend ❌")
                    
                if frontend_ok:
                    status.append("Frontend ✅")
                else:
                    status.append("Frontend ❌")
                
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
                print(f"[{timestamp}] {' | '.join(status)}")
                
                # If either server is down
                if not (backend_ok and frontend_ok):
                    consecutive_failures += 1
                    print(f"⚠️  Server issue detected (attempt {consecutive_failures}/{self.restart_attempts})")
                    
                    if consecutive_failures >= self.restart_attempts:
                        print("🚨 Multiple failures detected, attempting restart...")
                        if self.restart_servers():
                            consecutive_failures = 0
                            time.sleep(15)  # Give servers time to start
                        else:
                            print("❌ Restart failed, will retry in next cycle")
                else:
                    consecutive_failures = 0
                
                time.sleep(self.check_interval)
                
            except KeyboardInterrupt:
                print("\n👋 Monitor stopped")
                sys.exit(0)
            except Exception as e:
                print(f"❌ Monitor error: {e}")
                time.sleep(self.check_interval)

if __name__ == "__main__":
    monitor = ServerMonitor()
    monitor.monitor()
