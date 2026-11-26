@echo off
title Trivia Royale
echo ========================================================
echo               STARTING TRIVIA ROYALE
echo ========================================================
echo.

set "PATH=C:\laragon\bin\nodejs\node-v22;%PATH%"
cd /d "%~dp0trivia-royale"

echo Launching local development server on http://localhost:3000 ...
start http://localhost:3000
call npm.cmd run dev
pause
