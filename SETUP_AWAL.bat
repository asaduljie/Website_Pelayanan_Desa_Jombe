@echo off
title JOMBE DIGITAL - Setup Awal Sistem Pelayanan Desa
color 0A

echo ================================================================
echo    INSTALASI & SETUP AWAL SISTEM JOMBE DIGITAL
echo    Pemerintah Desa Jombe, Kec. Jombang, Kab. Jombang
echo ================================================================
echo.
echo [1/3] Memeriksa Instalasi Dependensi Backend...
cd /d "%~dp0backend"
call npm install

echo.
echo [2/3] Memeriksa Instalasi Dependensi Frontend...
cd /d "%~dp0frontend"
call npm install

echo.
echo [3/3] Menyiapkan Basis Data & Fitur Sistem...
cd /d "%~dp0backend"
call npx prisma generate

echo.
echo ================================================================
echo    INSTALASI SELESAI! 
echo    Sistem siap digunakan oleh Operator Kantor Desa Jombe.
echo ================================================================
pause
