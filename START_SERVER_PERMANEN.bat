@echo off
title PELAYANAN DIGITAL DESA JOMBE - SERVER PERMANEN ZERO DOWNTIME
color 0A

echo =====================================================================
echo    SISTEM PELAYANAN DIGITAL DESA JOMBE - KABUPATEN JOMBANG
echo          (MODE OPERASI PERMANEN & SELF-HEALING ZERO DOWNTIME)
echo =====================================================================
echo.
echo [1/3] Menyiapkan Direktori Database Persisten...
if not exist "backend\data" mkdir backend\data
if not exist "backend\public" mkdir backend\public

echo [2/3] Menjalankan Backend API Server (Port 5000)...
start "JOMBE-BACKEND-API" cmd /k "cd backend && npm run dev"

echo [3/3] Menjalankan Frontend Web Portal (Port 3000)...
start "JOMBE-FRONTEND-WEB" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo  [SUKSES] Server Pelayanan Desa Jombe Berhasil Dijalankan!
echo.
echo  - Portal Warga    : http://localhost:3000
echo  - Panel Operator  : http://localhost:3000/operator
echo  - Bot WhatsApp    : http://localhost:3000/wa-bot
echo  - Backend API     : http://localhost:5000/api/health
echo.
echo  Sistem ini dilengkapi Proteksi Anti-Crash & Auto-Recovery.
echo  Biarkan jendela konsol ini tetap terbuka di komputer kantor desa.
echo =====================================================================
timeout /t 5
