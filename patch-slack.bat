@echo off

setlocal

REM TODO: Figure out a way to find the slack version # in "app-3.3.7" folder.  File parsing is rough in batch files.
IF "%SLACK_INSTALLATION_PATH%"=="" (
	SET SLACK_INSTALLATION_PATH=%LOCALAPPDATA%\slack\app-3.3.7\resources
)

SET SLACK_SSB_FILE=%SLACK_INSTALLATION_PATH%\app.asar.unpacked\src\static\ssb-interop.js
SET SLACK_INDEX_FILE=%SLACK_INSTALLATION_PATH%\app.asar.unpacked\src\static\index.js

SET SHOULD_PATCH_SSB=true

findstr /m loadSlackPlugins %SLACK_SSB_FILE% 2>nul >nul
if %errorlevel%==0 (
	SET SHOULD_PATCH_SSB=false
	REM TODO: repatch is not supported on windows yet.  Batch is not the best language.
)

if %SHOULD_PATCH_SSB%==true (
	echo Patching Slack's ssb-interop.js file at %SLACK_SSB_FILE%
	type patch-files\ssb-interop-snippet-append.js >> %SLACK_SSB_FILE%
) else (
	echo Slack's ssb-interop.js already patched, doing nothing.
)

SET SHOULD_PATCH_INDEX=true

findstr /m loadSlackPlugins %SLACK_INDEX_FILE% 2>nul >nul
if %errorlevel%==0 (
	SET SHOULD_PATCH_INDEX=false
	REM TODO: repatch is not supported on windows yet.  Batch is not the best language.
)

if %SHOULD_PATCH_INDEX%==true (
	echo Patching Slack's index.js file at %SLACK_INDEX_FILE%
	type patch-files\index-snippet-append.js >> %SLACK_INDEX_FILE%
) else (
	echo Slack's index.js already patched, doing nothing.
)

endlocal

if NOT EXIST %LOCALAPPDATA%\.slack mklink /D %LOCALAPPDATA%\.slack %cd%\.slack
