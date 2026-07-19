@echo off
echo Starting ERAAS system...

cd /d "%~dp0"

start "ERAAS - Mock Feed" cmd /k "cd backend && ..\venv\Scripts\activate && python mock_feed.py"
timeout /t 2 /nobreak >nul

start "ERAAS - Agent Loop" cmd /k "cd backend && ..\venv\Scripts\activate && python agent_loop.py"
timeout /t 2 /nobreak >nul

start "ERAAS - Web Server" cmd /k "cd backend && ..\venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul

echo All three services started in separate windows.
echo Opening dashboard...
start http://127.0.0.1:8000/