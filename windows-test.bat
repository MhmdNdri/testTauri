@echo off
REM Tauri Windows Compatibility Test Script
REM Run this script on Windows 7 machines to test compatibility

echo ============================================
echo Tauri Windows Compatibility Test
echo ============================================
echo.

echo [1/8] Checking Windows version...
ver
echo.

echo [2/8] Checking system architecture...
echo Processor Architecture: %PROCESSOR_ARCHITECTURE%
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    echo System Type: 64-bit
) else (
    echo System Type: 32-bit
)
echo.

echo [3/8] Checking for WebView2 runtime...
set "webview_found=false"
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" /v pv >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ WebView2 runtime found! (64-bit location)
    set "webview_found=true"
    for /f "tokens=3" %%a in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" /v pv ^| find "pv"') do echo    Version: %%a
) else (
    reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" /v pv >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ WebView2 runtime found! (32-bit location)
        set "webview_found=true"
        for /f "tokens=3" %%a in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" /v pv ^| find "pv"') do echo    Version: %%a
    ) else (
        echo ❌ WebView2 runtime NOT found!
        echo    Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
        echo    CRITICAL: Tauri apps will NOT work without WebView2!
    )
)
echo.

echo [4/8] Checking for Visual C++ Redistributables...
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Installer\Dependencies\Microsoft.VS.VC_RuntimeMinimumVSU_amd64,v14" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Visual C++ Redistributable (2015-2022) found!
) else (
    echo ⚠️  Visual C++ Redistributable may be missing
    echo    Download from: https://aka.ms/vs/17/release/vc_redist.x64.exe
)
echo.

echo Checking available memory...
wmic OS get TotalVisibleMemorySize /value | find "TotalVisibleMemorySize"
echo.

echo Checking disk space...
wmic logicaldisk get size,freespace,caption
echo.

echo ============================================
echo Test completed! 
echo.
echo Next steps:
echo 1. Install the Tauri application
echo 2. Run the compatibility tests within the app
echo 3. Generate and review the compatibility report
echo ============================================

pause
