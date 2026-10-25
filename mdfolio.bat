@echo off
title mdfolio
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0scripts\start.ps1"
echo.
echo Servidor detenido. Pulsa una tecla para cerrar.
pause >nul
