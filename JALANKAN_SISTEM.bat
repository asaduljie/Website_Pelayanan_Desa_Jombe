@echo off
title PELAYANAN DESA JOMBE - OPERATOR RUNNER
color 02

echo ================================================================
echo    MENJALANKAN SISTEM PELAYANAN DESA JOMBE DALAM GENGGAMAN
echo ================================================================
echo.
echo Sedang mengaktifkan Server Backend API & Bot WhatsApp...
start /b cmd /c "cd /d %~dp0backend && npm run dev"

echo Sedang mengaktifkan Layar Antarmuka Operator...
start /b cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo Menunggu sistem siap (5 detik)...
timeout /t 5 /nobreak >nul

echo Membuka Layar Kerja Operator di Browser...
start http://localhost:3000/operator

echo.
echo ================================================================
echo    SISTEM AKTIF & BERJALAN DENGAN SUKSES!
echo    Jendela ini dapat diminimalkan (minimize).
echo ================================================================
pause
