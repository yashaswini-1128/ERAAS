#!/bin/bash
python backend/agent_loop.py &
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
