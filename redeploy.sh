#!/bin/bash
# Redeploy script for SoilTwin - pulls latest code and restarts Docker containers

set -e  # Exit immediately if any command fails

echo "🚀 Starting redeploy process..."

# Navigate to project folder
cd ~/soiltwin || { echo "❌ Project folder not found!"; exit 1; }

# Pull latest changes from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Stop and remove old containers (optional – you can use down instead)
echo "🛑 Stopping containers..."
sudo docker-compose down

# Rebuild and start containers in detached mode
echo "🏗️ Rebuilding and starting containers..."
sudo docker-compose up --build -d

# Check status
echo "✅ Redeploy complete! Current container status:"
sudo docker ps

echo "🌐 Site should be live at: https://d2bebk7g4ys5zv.cloudfront.net"
