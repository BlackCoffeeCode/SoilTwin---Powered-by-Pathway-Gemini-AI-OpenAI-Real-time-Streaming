# 🛠️ SoilTwin Zero-Error Setup Guide (Windows/WSL)

This guide provides a **fail-safe** method to set up the SoilTwin project on a fresh Windows 11 machine using **WSL2 (Ubuntu)**.

> **Why WSL?**
> The Pathway streaming engine **requires Linux**. It will not run on native Windows. You MUST use WSL.

---

## 📦 Phase 1: Environment Prerequisites (One-Time Setup)

Perform these steps inside your **Ubuntu terminal** in WSL.

### 1. Update & Install System Tools
Clean the system and install compilers required for Pathway and Python extensions.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev python3-venv git curl unzip
```

### 2. Install Node.js (via NVM)
Avoid using `apt install nodejs`. Use NVM (Node Version Manager) to prevent permission issues.
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# ! IMPORTANT: Close and reopen your terminal now !

# Install Node.js LTS (v20+)
nvm install --lts
nvm use --lts
node -v  # Verification: Should verify v20.x.x
npm -v   # Verification: Should verify 10.x.x
```

### 3. Install MongoDB (Native WSL)
We will run MongoDB **inside** WSL to avoid networking complexity.
```bash
# Import public key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Create list file
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Create data directory (required for manual start)
sudo mkdir -p /data/db
sudo chown -R $USER /data/db
```

---

## 🚀 Phase 2: Project Clean Install

### 1. Clone & Shell Setup
```bash
# Clone repository (if you haven't already)
git clone <repository_url> SoilTwin
cd SoilTwin

# Make scripts executable
chmod +x start.sh
```

### 2. Backend Setup (Python)
```bash
# Create Virtual Environment
python3 -m venv venv

# Activate Environment
source venv/bin/activate

# Install Dependencies
# Note: This includes Pathway, FastAPI, OpenAI, etc.
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
cd ..
```

### 4. Configuration Secrets
Create a `.env` file in the root directory.
```bash
cp .env.example .env
nano .env
```
**Required .env format:**
```ini
# OpenAI Config (REQUIRED)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Weather API (Optional - for demo data)
WEATHER_API_KEY=your_openweather_key

# Security
JWT_SECRET=development_secret_key_123

# Database (Use localhost for WSL-native mongo)
MONGODB_URL=mongodb://localhost:27017/soiltwin_db
MONGODB_DB_NAME=soiltwin_db
```

---

## ✅ Phase 3: Verification & Launch

We will run components in **separate terminals** to see logs clearly.

### Terminal 1: Database
Start MongoDB manually (more reliable in WSL than service).
```bash
# Start Mongo daemon
sudo mongod --dbpath /data/db
```
> **Verify:** You should see `Waiting for connections on port 27017`

### Terminal 2: Backend & Pipeline
```bash
cd SoilTwin
source venv/bin/activate

# Start API Server
uvicorn backend.main:app --reload --port 8000
```
> **Verify:** Open browser to `http://localhost:8000/docs`. You should see Swagger UI.

### Terminal 3: Frontend
```bash
cd SoilTwin/frontend

# Start React Dev Server
npm run dev
```
> **Verify:** Open browser to `http://localhost:5173`. You should see the login page.

---

## 🔧 Common WSL Troubleshooting

### ❌ Backend fails with "Address already in use"
Check if a process is stuck occupying port 8000.
```bash
# List process on port 8000
sudo lsof -i :8000
# Kill PID if found
kill -9 <PID>
```

### ❌ MongoDB Connection Error
If using `mongodb://localhost:27017` fails, verify:
1. Is Terminal 1 running `mongod`?
2. Did you create `/data/db` correctly?
3. **Alternative:** If you installed MongoDB on Windows (not WSL), use:
   `MONGODB_URL=mongodb://host.docker.internal:27017`

### ❌ "ImportError: libGL.so.1"
Pathway or some python libs might miss GL dependencies.
```bash
sudo apt install -y libgl1-mesa-glx
```

### ❌ Frontend "vite: command not found"
Ensure you ran `npm install` inside the `frontend` folder, not root.
```bash
cd frontend && npm install
```

### ❌ Pathway "Engine died" or "Crash"
Pathway needs the Vector Store dependencies.
```bash
pip install "pathway[xpack-llm-docs]"
pip install docling
```

---

## 🧹 Maintenance Scripts

### Reset Database
If data gets corrupted or you want a fresh start:
```bash
# Delete local data files (Pathway storage)
rm -rf data/current_state.csv
rm -rf data/simulated_streams/*.jsonl

# Seed fresh data
python3 backend/seed_db.py
```

### Full Clean (Nuclear Option)
If dependency mismatches occur:
```bash
rm -rf venv
rm -rf frontend/node_modules
# Then go back to Phase 2
```
