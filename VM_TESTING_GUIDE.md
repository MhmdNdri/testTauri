# Windows VM Testing Guide

## Setting Up Windows VMs for Testing

### Option 1: VirtualBox (Free)

1. **Download VirtualBox**: https://www.virtualbox.org/
2. **Get Windows 7 ISO**: 
   - Microsoft Windows 7 Professional (if you have a license)
   - Or use Windows 10/11 evaluation VMs from Microsoft

3. **Create VMs**:
   ```bash
   # Create Windows 7 VM
   - Name: Windows-7-Test
   - Type: Microsoft Windows
   - Version: Windows 7 (64-bit)
   - Memory: 4GB RAM minimum
   - Storage: 40GB VDI
   
   # Create Windows 10 VM
   - Name: Windows-10-Test  
   - Type: Microsoft Windows
   - Version: Windows 10 (64-bit)
   - Memory: 4GB RAM minimum
   - Storage: 60GB VDI
   ```

### Option 2: Parallels Desktop (macOS - Paid)

1. **Install Parallels Desktop**
2. **Download Windows from Microsoft**:
   - Windows 10: https://www.microsoft.com/software-download/windows10
   - Windows 11: https://www.microsoft.com/software-download/windows11

### Option 3: Microsoft Developer VMs (Free - Time Limited)

Microsoft provides free VMs for testing:
- Visit: https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/
- Download Windows 10/11 VMs (90-day trial)
- Import into VirtualBox, VMware, or Parallels

## Testing Process on Windows VMs

### Step 1: Prepare Windows 7 VM
```powershell
# On Windows 7 VM:
# 1. Install Windows 7 SP1 + updates
# 2. Install .NET Framework 4.8
# 3. DO NOT install WebView2 initially (to test detection)
```

### Step 2: Build Tauri App for Windows
```bash
# On macOS (your development machine):
cd tauri-compatibility-test

# Add Windows target (if not already added)
rustup target add x86_64-pc-windows-msvc

# Build for Windows
npm run tauri build -- --target x86_64-pc-windows-msvc
```

### Step 3: Transfer Files to Windows VM
1. **Copy installer** from `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/`
2. **Copy test script**: `windows-test.bat`
3. **Copy documentation** for reference

### Step 4: Run Tests on Windows VM

1. **Run the batch script first**:
   ```cmd
   # Double-click windows-test.bat or run in Command Prompt
   windows-test.bat
   ```

2. **Install the Tauri application**
3. **Run compatibility tests within the app**
4. **Generate and save reports**

## Expected Test Results

### Windows 7 (Without WebView2)
```
Windows version: Microsoft Windows [Version 6.1.7601]
WebView2 runtime: NOT found!
Tauri app: Will fail to start
```

### Windows 7 (With WebView2)
```
Windows version: Microsoft Windows [Version 6.1.7601]  
WebView2 runtime: Found!
Tauri app: Should start successfully
```

### Windows 10/11
```
Windows version: Microsoft Windows [Version 10.0.xxxxx]
WebView2 runtime: Built-in (version xxx)
Tauri app: Should work perfectly
```
