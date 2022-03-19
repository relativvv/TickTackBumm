@echo off
color 0a
chcp 65001
cls

:Decision
cls
color 0a
echo.
echo [1] - Setup starten
echo [2] - Setup beenden
echo [3] - SSH ins Backend
echo [4] - Error-Logs des Backends einsehen
echo [5] - Access-Logs des Backend Webservers
echo [6] - Frontend-Logs einsehen
echo [7] - Datenbankverwaltung öffnen
echo.
set /p ACTION=Hey, wähle bitte aus, was Du machen möchtest:
echo.

IF "%ACTION%"=="1" (
    cd dev-ops
    echo Setup wird gestartet...
    powershell -Command "((Get-Content frontend/node.sh) -join \"`n\") + \"`n\" | Set-Content -NoNewline frontend/node.sh"
    docker-compose up -d
    docker exec -ti ticktackbumm_backend service php8.0-fpm start
    cd backend
    IF NOT EXIST "vendor/" (
      docker exec -ti -w /usr/share/nginx/html/proj ticktackbumm_backend composer install
    )
    echo.
    echo ------------------------------------
    echo Das Backend erreichst Du unter http://localhost:8000.
    echo Das Frontend erreichst Du unter http://localhost:4200, Hier musst Du aber ein paar Sekunden warten bis es erreichbar ist.
    echo ------------------------------------
    echo.
    PAUSE
)

IF "%ACTION%"=="2" (
    cd dev-ops
    echo Setup wird herunterfahren...
    docker-compose down
PAUSE
)

IF "%ACTION%"=="3" (
    color 0f
    echo SSH Session wird geladen...
    docker exec -ti -w /usr/share/nginx/html/proj ticktackbumm_backend /bin/bash
    PAUSE
    CALL :Decision
)

IF "%ACTION%"=="4" (
    color 0f
    echo Error-Logs werden geladen...
    docker exec -ti ticktackbumm_backend tail -f /var/log/nginx/project_error.log
    PAUSE
    CALL :Decision
)

IF "%ACTION%"=="5" (
    color 0f
    echo Access-Logs werden geladen...
    docker exec -ti ticktackbumm_backend tail -f /var/log/nginx/project_access.log
    PAUSE
    CALL :Decision
)

IF "%ACTION%"=="6" (
    color 0f
    echo Frontend-Logs werden geladen...
    docker logs -f ticktackbumm_frontend
    PAUSE
    CALL :Decision
)

IF "%ACTION%"=="7" (
    echo Datenbank wird geöffnet...
    start http://localhost:9898/
    PAUSE
    CALL :Decision
)


