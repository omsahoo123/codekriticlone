#!/bin/bash

# HackathonHub - Start Both Frontend and Backend

echo "🚀 Starting HackathonHub Platform..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB connection...${NC}"
python backend/test_mongo.py > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Windows: mongod"
    echo "   On Mac: brew services start mongodb-community"
    echo "   On Linux: sudo systemctl start mongod"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"

# Start Backend
echo -e "\n${BLUE}Starting Backend Server...${NC}"
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo -e "\n${BLUE}Starting Frontend Server...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
cd ..

echo -e "\n${GREEN}=================================="
echo "✓ Both servers are running!"
echo "=================================="
echo -e "Backend:  http://localhost:8000${NC}"
echo -e "Frontend: http://localhost:3000${NC}"
echo -e "\n${BLUE}Press Ctrl+C to stop both servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
