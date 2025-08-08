use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize)]
struct SystemInfo {
    os: String,
    os_version: String,
    arch: String,
    hostname: String,
    total_memory: f64,
    available_memory: f64,
}

#[derive(Serialize, Deserialize)]
struct WebViewInfo {
    version: String,
    runtime: String,
    available: bool,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_system_info() -> Result<SystemInfo, String> {
    use sysinfo::System;
    
    let mut sys = System::new_all();
    sys.refresh_all();
    
    Ok(SystemInfo {
        os: format!("{} {}", System::name().unwrap_or_default(), System::kernel_version().unwrap_or_default()),
        os_version: System::os_version().unwrap_or_default(),
        arch: std::env::consts::ARCH.to_string(),
        hostname: System::host_name().unwrap_or_default(),
        total_memory: sys.total_memory() as f64 / 1_073_741_824.0, // Convert to GB
        available_memory: sys.available_memory() as f64 / 1_073_741_824.0, // Convert to GB
    })
}

#[tauri::command]
fn get_webview_info() -> Result<WebViewInfo, String> {
    // This is a simplified version - in a real scenario you'd check WebView2 runtime
    #[cfg(target_os = "windows")]
    {
        // Check if WebView2 runtime is available
        let webview_available = check_webview2_runtime();
        Ok(WebViewInfo {
            version: get_webview2_version(),
            runtime: "WebView2".to_string(),
            available: webview_available,
        })
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Ok(WebViewInfo {
            version: "System WebView".to_string(),
            runtime: "System Default".to_string(),
            available: true,
        })
    }
}

#[cfg(target_os = "windows")]
fn read_webview2_version_from_registry() -> Option<String> {
    use std::process::Command;

    // Candidate registry keys for WebView2 runtime version
    const PATHS: [&str; 2] = [
        r"HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}",
        r"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}",
    ];

    for path in PATHS.iter() {
        if let Ok(output) = Command::new("reg").args(["query", path, "/v", "pv"]).output() {
            if output.status.success() {
                let output_str = String::from_utf8_lossy(&output.stdout);
                if let Some(line) = output_str.lines().find(|line| line.contains("pv")) {
                    if let Some(version) = line.split_whitespace().last() {
                        return Some(version.to_string());
                    }
                }
            }
        }
    }
    None
}

#[cfg(target_os = "windows")]
fn check_webview2_runtime() -> bool {
    read_webview2_version_from_registry().is_some()
}

#[cfg(target_os = "windows")]
fn get_webview2_version() -> String {
    read_webview2_version_from_registry().unwrap_or_else(|| "Unknown".to_string())
}

#[tauri::command]
fn test_basic_function() -> Result<String, String> {
    Ok("Basic Tauri function working correctly".to_string())
}

#[tauri::command]
fn test_file_system() -> Result<String, String> {
    use std::env;

    let temp_dir = env::temp_dir();
    let test_file = temp_dir.join("tauri_test.txt");

    fs::write(&test_file, "Tauri file system test")
        .map_err(|e| format!("Failed to write test file: {}", e))?;

    let content = fs::read_to_string(&test_file)
        .map_err(|e| format!("Failed to read test file: {}", e))?;

    let _ = fs::remove_file(&test_file);
    Ok(format!("File system access working. Read: {}", content))
}

#[tauri::command]
fn test_window_operations() -> Result<String, String> {
    // This is a basic test - in a full implementation you'd test window operations
    Ok("Window operations available".to_string())
}

#[tauri::command]
fn save_compatibility_report(report_data: String) -> Result<String, String> {
    use std::env;
    use chrono::Utc;
    
    let timestamp = Utc::now().format("%Y%m%d_%H%M%S");
    let filename = format!("tauri_compatibility_report_{}.json", timestamp);
    
    // Save to desktop or documents folder
    let report_path = if let Some(home_dir) = dirs::home_dir() {
        home_dir.join("Desktop").join(&filename)
    } else {
        env::current_dir().unwrap_or_default().join(&filename)
    };
    
    match fs::write(&report_path, report_data) {
        Ok(_) => Ok(format!("Report saved to: {}", report_path.display())),
        Err(e) => Err(format!("Failed to save report: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            get_webview_info,
            test_basic_function,
            test_file_system,
            test_window_operations,
            save_compatibility_report
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

