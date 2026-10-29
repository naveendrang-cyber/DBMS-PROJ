@echo off
rem ============================================================================
rem  OmniMarket DA3 - CockroachDB CLI wrapper
rem
rem  Usage: crdb-cli.cmd <command> [args]
rem    start    Start a local single-node cluster (SQL :26257, DB Console :8090)
rem    stop     Drain and shut down the local node
rem    init     Create the 'omnimarket' database, apply schema.sql and seed.sql
rem    reset    DROP the 'omnimarket' database and run init again
rem    sql      Open an interactive SQL shell (extra args pass through, e.g. -e "SELECT 1")
rem    status   Show node status
rem
rem  Environment overrides:
rem    COCKROACH_BIN  Path to cockroach.exe (default: PATH, then %USERPROFILE%\.tools\cockroach)
rem    CRDB_URL       Full connection URL, e.g. a CockroachDB Cloud cluster:
rem                   postgresql://user:pass@host:26257/defaultdb?sslmode=verify-full
rem                   When set, init/reset/sql/status target that cluster instead of localhost.
rem    CRDB_HOST      Local host:port (default: localhost:26257)
rem ============================================================================
setlocal

set "ROOT=%~dp0"
set "DB_NAME=omnimarket"
if not defined CRDB_HOST set "CRDB_HOST=localhost:26257"
set "STORE=%ROOT%database\crdb-data"

if defined COCKROACH_BIN goto :have_bin
for %%X in (cockroach.exe) do set "COCKROACH_BIN=%%~$PATH:X"
if not defined COCKROACH_BIN set "COCKROACH_BIN=%USERPROFILE%\.tools\cockroach\cockroach.exe"
:have_bin
if not exist "%COCKROACH_BIN%" (
    echo [crdb-cli] cockroach.exe not found. Install it from https://www.cockroachlabs.com/docs/releases/
    echo            and add it to PATH, or set COCKROACH_BIN to its full path.
    exit /b 1
)

if defined CRDB_URL (
    set CONN=--url "%CRDB_URL%"
) else (
    set CONN=--insecure --host=%CRDB_HOST%
)

set "CMD=%~1"
if "%CMD%"=="" goto :usage
if /i "%CMD%"=="start"  goto :start
if /i "%CMD%"=="stop"   goto :stop
if /i "%CMD%"=="init"   goto :init
if /i "%CMD%"=="reset"  goto :reset
if /i "%CMD%"=="sql"    goto :sql
if /i "%CMD%"=="status" goto :status
goto :usage

:start
echo [crdb-cli] Starting local CockroachDB node (store: %STORE%)
start "CockroachDB (OmniMarket)" /min "%COCKROACH_BIN%" start-single-node --insecure --listen-addr=%CRDB_HOST% --http-addr=localhost:8090 --store="%STORE%"
echo [crdb-cli] SQL:        postgresql://root@%CRDB_HOST%/%DB_NAME%?sslmode=disable
echo [crdb-cli] DB Console: http://localhost:8090
echo [crdb-cli] Run "crdb-cli.cmd init" once the node is up.
exit /b 0

:stop
"%COCKROACH_BIN%" node drain --self --shutdown %CONN%
exit /b %ERRORLEVEL%

:reset
echo [crdb-cli] Dropping database %DB_NAME% ...
"%COCKROACH_BIN%" sql %CONN% -e "DROP DATABASE IF EXISTS %DB_NAME% CASCADE;" || exit /b 1
rem fall through to init

:init
echo [crdb-cli] Creating database %DB_NAME% ...
"%COCKROACH_BIN%" sql %CONN% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" || exit /b 1
echo [crdb-cli] Applying database\schema.sql ...
"%COCKROACH_BIN%" sql %CONN% --database=%DB_NAME% --file "%ROOT%database\schema.sql" || exit /b 1
echo [crdb-cli] Applying database\seed.sql ...
"%COCKROACH_BIN%" sql %CONN% --database=%DB_NAME% --file "%ROOT%database\seed.sql" --format=table > nul || exit /b 1
"%COCKROACH_BIN%" sql %CONN% --database=%DB_NAME% -e "SELECT (SELECT count(*) FROM products) AS products, (SELECT count(*) FROM stores) AS stores, (SELECT count(*) FROM users) AS users, (SELECT count(*) FROM orders) AS orders;"
echo [crdb-cli] Done.
exit /b 0

:sql
shift
"%COCKROACH_BIN%" sql %CONN% --database=%DB_NAME% %1 %2 %3 %4 %5 %6 %7 %8 %9
exit /b %ERRORLEVEL%

:status
"%COCKROACH_BIN%" node status %CONN%
exit /b %ERRORLEVEL%

:usage
echo Usage: crdb-cli.cmd ^<start^|stop^|init^|reset^|sql^|status^> [args]
echo   start    Start a local single-node cluster (SQL :26257, DB Console :8090)
echo   stop     Drain and shut down the local node
echo   init     Create database '%DB_NAME%', apply database\schema.sql and database\seed.sql
echo   reset    Drop database '%DB_NAME%' and run init again
echo   sql      Interactive SQL shell; extra args pass through (e.g. sql -e "SHOW TABLES")
echo   status   Show node status
exit /b 1
