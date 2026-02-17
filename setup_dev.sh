#!/bin/bash
# SoilTwin Development Setup Script
# For Linux / WSL Environments

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🌱 Setting up SoilTwin Development Environment...${NC}"

# 1. Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed.${NC}"
    exit 1
fi
echo -e "✅ Python 3 detected: $(python3 --version)"

# 2. Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install using nvm.${NC}"
    exit 1
fi
echo -e "✅ Node.js detected: $(node -v)"

# 3. Setup Backend
echo -e "\n${YELLOW}📦 Setting up Backend...${NC}"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

# 4. Setup Frontend
echo -e "\n${YELLOW}🎨 Setting up Frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing Node modules..."
    npm install
else
    echo "Node modules already installed."
fi
cd ..

# 5. Check Environment
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}⚠️  No .env file found.${NC}"
    cp .env.example .env
    echo -e "Created .env from example. ${RED}Please edit .env and add your OpenAI Key!${NC}"
else
    echo -e "\n✅ .env file exists."
fi

# 6. Check Database Directory (WSL specific)
if [ ! -d "/data/db" ] && [ "$(uname -r | grep -i microsoft)" ]; then
    echo -e "\n${YELLOW}⚠️  WSL Detected: Checking MongoDB data directory...${NC}"
    echo "Note: Ensure /data/db exists for manual 'mongod' start."
    echo "Run: sudo mkdir -p /data/db && sudo chown -R \$USER /data/db"
fi

echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "To start the project:"
echo -e "1. Terminal 1: sudo mongod --dbpath /data/db"
echo -e "2. Terminal 2: ./start.sh start"
