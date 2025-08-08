# Tauri Windows Compatibility Test Suite

A comprehensive testing application designed to validate Tauri desktop applications across different Windows versions, with special focus on Windows 7 compatibility and WebView2 runtime requirements.

## Windows 7 Testing (TL;DR)

1. Build MSI: In GitHub → Actions → run “Build installers” → download the “windows-installers” artifact (MSI).

2. Prepare Win7 machine: Windows 7 SP1 + KB4474419 (SHA‑2) + KB4490628 (servicing stack). Optional: .NET 4.8, VC++ 2015–2022.

3. Install: Copy the MSI to the machine and run it (the MSI embeds the WebView2 bootstrapper; needs internet).

4. Run tests: Open the app → “Run Compatibility Tests” → “Generate Report” (JSON saved to Desktop).

## 🎯 Purpose

This project addresses critical concerns for desktop application deployment:

- **Windows Version Distribution**: Understanding client OS usage patterns
- **WebView2 Runtime Requirements**: Ensuring compatibility across Windows versions
- **Dependency Installation**: Validating client installation capabilities
- **Legacy System Support**: Specifically testing Windows 7 compatibility

## 🚀 Quick Start (React + Tauri)

### Prerequisites

- Rust toolchain (stable)
- Node.js 18+
- npm

### Installation & Dev

```bash
cd tauri-compatibility-test
npm install

# Start Vite + Tauri (Tauri runs Vite automatically)
npm run dev

# If port 5173 is busy, stop other Vite instances or change vite.config.ts
```

### Production Build

```bash
# Build React to dist-web and bundle installers
npm run web:build
npm run build
```

## 📋 Features

### System Analysis

- ✅ OS version detection and reporting
- ✅ Architecture identification (x86/x64)
- ✅ Memory and hardware information
- ✅ WebView2 runtime detection and versioning

### Compatibility Testing

- ✅ Basic Tauri functionality validation
- ✅ File system access testing
- ✅ Window management operations
- ✅ Error handling verification

### Automated Reporting

- ✅ JSON compatibility reports
- ✅ Detailed system information
- ✅ Test result documentation
- ✅ Performance metrics

### Windows 7 Specific Tests

- ✅ WebView2 runtime availability
- ✅ Installation requirement verification
- ✅ Legacy system limitations
- ✅ Performance benchmarking

## 📊 Test Results Interface

The application provides a user-friendly interface showing:

1. **System Information Panel**

   - Operating system details
   - Hardware specifications
   - Memory availability

2. **WebView Information Panel**

   - WebView2 runtime status
   - Version information
   - Installation requirements

3. **Compatibility Test Runner**

   - One-click testing suite
   - Real-time results display
   - Error reporting and logging

4. **Report Generation**
   - Automated JSON report creation
   - Comprehensive system analysis
   - Deployment recommendations

## 📖 Documentation

- **[Windows Compatibility Guide](WINDOWS_COMPATIBILITY_GUIDE.md)** - Comprehensive testing methodology
- **[Windows 7 Testing Checklist](WINDOWS_7_TESTING_CHECKLIST.md)** - Step-by-step testing procedures
- **[Build & Distribution Guide](BUILD_AND_DISTRIBUTION.md)** - Deployment strategies and instructions
- **[Compatibility Report Template](COMPATIBILITY_REPORT_TEMPLATE.md)** - Standardized reporting format

## 🔧 Technical Architecture

### Frontend (React + Vite)

- React UI (Vite dev server on port 5173)
- Output served from `dist-web` in production
- Real-time system/WebView info and test runner

### Backend (Rust / Tauri)

- System information collection using `sysinfo`
- WebView2 runtime detection (Windows-specific)
- File system access testing
- Cross-platform compatibility layer

### Key Dependencies

- `tauri` - Desktop application framework
- `sysinfo` - System information collection
- `chrono` - Date/time handling for reports
- `dirs` - Cross-platform directory access

## 🎯 Testing Strategy

### Windows 7 Focus Areas

1. **WebView2 Runtime**

   - Detection of existing installation
   - Version compatibility verification
   - Installation requirement documentation

2. **System Compatibility**

   - Legacy API support
   - Performance on older hardware
   - Memory usage optimization

3. **Installation Process**
   - WebView2 bootstrapper testing
   - User permission requirements
   - Offline installation scenarios

### Cross-Version Testing

- **Windows 7 SP1** (WebView2 installed via embedded bootstrapper)
- **Windows 8.1** (WebView2 required)
- **Windows 10** (WebView2 typically available)
- **Windows 11** (WebView2 native support)

## 🧱 Building Installers (macOS + Windows)

### macOS (local)

- DMG output: `src-tauri/target/release/bundle/dmg/`
- App bundle: `src-tauri/target/release/bundle/macos/`

### Windows MSI (via GitHub Actions)

1. GitHub → Actions → run "Build installers"
2. Download artifact `windows-installers` → contains `.msi`
3. MSI embeds WebView2 bootstrapper (silent) for Windows 7+

### Windows MSI (local, on Windows)

```bash
# On Windows 10/11 with MSVC toolchain, VS Build Tools, and WiX
npm install
npm run build
# MSI: src-tauri\\target\\release\\bundle\\msi\\*.msi
```

Optional 32-bit build for older Win7:

```bash
rustup target add i686-pc-windows-msvc
npm run build -- --target i686-pc-windows-msvc
```

## 🧩 Troubleshooting

- Dev server port in use (5173): stop other Vite instances or change `server.port` in `vite.config.ts`.
- macOS bundle identifier warning: change `identifier` in `src-tauri/tauri.conf.json` from `com.tauri-compatibility-test.app` to a reversed domain like `com.yourorg.tauri-compatibility-test`.
- WebView2 offline: if the Win7 machine is offline, install the "Evergreen Standalone" WebView2 Runtime manually, then run the MSI.

## 📈 Business Impact Assessment

### Key Metrics Tracked

- Installation success rates by OS version
- WebView2 runtime compatibility
- Performance benchmarks
- User experience indicators
- Support requirement analysis

### Decision Framework

The test suite helps evaluate:

- **Cost**: Development and support overhead
- **Benefit**: Market reach and revenue impact
- **Risk**: Technical and business risk assessment
- **Timeline**: Implementation and maintenance planning

## 🚨 Known Windows 7 Limitations

1. **WebView2 Runtime Required**

   - Must be installed separately or bundled
   - Requires internet connection for download
   - May need administrator privileges

2. **Performance Considerations**

   - Higher memory usage compared to native apps
   - Potential compatibility issues with older hardware
   - Limited modern web API support

3. **Security Considerations**
   - Windows 7 end-of-support status
   - Limited security update availability
   - Corporate environment restrictions

## 🛠️ Development Workflow

### Testing New Features

1. Develop feature with cross-platform compatibility
2. Test on Windows 10/11 for baseline functionality
3. Test on Windows 7 for compatibility issues
4. Document any limitations or workarounds
5. Update compatibility reports

### Release Process

1. Run full compatibility test suite
2. Generate comprehensive reports
3. Update documentation based on findings
4. Create platform-specific build configurations
5. Validate installer packages on all target platforms
