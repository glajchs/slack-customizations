@setlocal enableextensions enabledelayedexpansion
@echo off
ECHO      ..::''''::..
ECHO    .;''        ``;.
ECHO   ::    ::  ::    ::
ECHO  ::     ::  ::     ::
ECHO  :: .:' ::  :: `:. ::
ECHO  ::  :          :  ::
ECHO   :: `:.      .:' ::
ECHO    `;..``::::''..;'
ECHO      ``::,,,,::''

@ECHO OFF
echo Running slack-customizations.
PowerShell.exe -NoProfile -Command "& {Start-Process PowerShell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File ""%~dpn0.ps1""' -Verb RunAs}"
echo Waiting 5 seconds for script to run
timeout /t 5 /nobreak
exit