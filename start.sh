#!/bin/bash
cd backend
python agent_loop.py &
uvicorn main:app --host 0.0.0.0 --port $PORT
