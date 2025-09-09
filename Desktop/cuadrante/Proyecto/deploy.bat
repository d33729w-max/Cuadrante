@echo off
set /p commit_message="Introduce un mensaje para el commit (ej: 'feat: Added new feature'): "
git add .
git commit -m "%commit_message%"
git push
echo.
echo ¡Despliegue completado! Revisa GitHub para ver el progreso.
pause