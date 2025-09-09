@echo off
set /p commit_message="Introduce un mensaje para el commit (ej: 'feat: Added new feature'): "

echo Añadiendo archivos a Git...
git add .
echo Archivos añadidos.

echo Realizando commit...
git commit -m "%commit_message%"

echo Subiendo a GitHub...
git push origin main
echo.
echo Despliegue completado! Revisa GitHub para ver el progreso.

pause