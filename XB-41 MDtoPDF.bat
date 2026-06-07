@echo off
title XB-41 MDtoPDF
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0scripts\start.ps1"
echo.
echo Servidor detenido. Pulsa una tecla para cerrar.
pause >nul
