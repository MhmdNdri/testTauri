// Windows Compatibility Test Application
const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;
let systemInfoEl;
let webviewInfoEl;

// System Information Display
async function displaySystemInfo() {
  try {
    const systemInfo = await invoke("get_system_info");
    systemInfoEl.innerHTML = `
      <h3>System Information</h3>
      <div class="info-grid">
        <div><strong>OS:</strong> ${systemInfo.os}</div>
        <div><strong>OS Version:</strong> ${systemInfo.os_version}</div>
        <div><strong>Architecture:</strong> ${systemInfo.arch}</div>
        <div><strong>Hostname:</strong> ${systemInfo.hostname}</div>
        <div><strong>Total Memory:</strong> ${systemInfo.total_memory} GB</div>
        <div><strong>Available Memory:</strong> ${systemInfo.available_memory} GB</div>
      </div>
    `;
  } catch (error) {
    systemInfoEl.innerHTML = `<p style="color: red;">Error getting system info: ${error}</p>`;
  }
}

// WebView Information Display
async function displayWebViewInfo() {
  try {
    const webviewInfo = await invoke("get_webview_info");
    webviewInfoEl.innerHTML = `
      <h3>WebView Information</h3>
      <div class="info-grid">
        <div><strong>WebView Version:</strong> ${webviewInfo.version}</div>
        <div><strong>WebView Runtime:</strong> ${webviewInfo.runtime}</div>
        <div><strong>WebView Available:</strong> ${
          webviewInfo.available ? "Yes" : "No"
        }</div>
      </div>
    `;
  } catch (error) {
    webviewInfoEl.innerHTML = `<p style="color: red;">Error getting WebView info: ${error}</p>`;
  }
}

// Test Core Functionality
async function testCoreFunctionality() {
  const testResults = document.getElementById("test-results");
  const run = async (name, fn) => {
    try {
      const details = await fn();
      return { name, status: "✅ PASS", details: details ?? "" };
    } catch (error) {
      return { name, status: "❌ FAIL", details: error.toString() };
    }
  };

  const tests = await Promise.all([
    run("Basic Tauri Invoke", () => invoke("test_basic_function")),
    run("File System Access", () => invoke("test_file_system")),
    run("Window Operations", () => invoke("test_window_operations")),
  ]);

  testResults.innerHTML = `
    <h3>Compatibility Test Results</h3>
    ${tests
      .map(
        (test) => `
      <div class="test-result">
        <div><strong>${test.name}:</strong> ${test.status}</div>
        <div style="margin-left: 20px; color: #666;">${test.details}</div>
      </div>
    `
      )
      .join("")}
  `;
}

// Generate compatibility report
async function generateReport() {
  const reportData = {
    timestamp: new Date().toISOString(),
    system: await invoke("get_system_info").catch(() => ({
      error: "Unable to get system info",
    })),
    webview: await invoke("get_webview_info").catch(() => ({
      error: "Unable to get WebView info",
    })),
    tests: [],
  };

  // Run all tests and collect results
  const reportTests = [
    { name: "Basic Tauri Invoke", fn: () => invoke("test_basic_function") },
    { name: "File System Access", fn: () => invoke("test_file_system") },
    { name: "Window Operations", fn: () => invoke("test_window_operations") },
  ];
  for (const t of reportTests) {
    try {
      await t.fn();
      reportData.tests.push({ name: t.name, passed: true });
    } catch (error) {
      reportData.tests.push({
        name: t.name,
        passed: false,
        error: error.toString(),
      });
    }
  }

  // Save report
  try {
    await invoke("save_compatibility_report", {
      reportData: JSON.stringify(reportData, null, 2),
    });
    alert("Compatibility report saved successfully!");
  } catch (error) {
    alert("Error saving report: " + error);
  }
}

async function greet() {
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  systemInfoEl = document.querySelector("#system-info");
  webviewInfoEl = document.querySelector("#webview-info");

  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });

  document
    .querySelector("#test-compatibility")
    .addEventListener("click", testCoreFunctionality);
  document
    .querySelector("#generate-report")
    .addEventListener("click", generateReport);

  // Load system information on startup
  displaySystemInfo();
  displayWebViewInfo();
});
