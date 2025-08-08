import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type SystemInfo = {
  os: string;
  os_version: string;
  arch: string;
  hostname: string;
  total_memory: number;
  available_memory: number;
};

type WebViewInfo = {
  version: string;
  runtime: string;
  available: boolean;
};

function App() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [webviewInfo, setWebviewInfo] = useState<WebViewInfo | null>(null);
  const [results, setResults] = useState<
    Array<{ name: string; status: string; details: string }>
  >([]);
  const [running, setRunning] = useState(false);
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const sys = await invoke<SystemInfo>("get_system_info");
        setSystemInfo(sys);
      } catch (e) {}
      try {
        const wv = await invoke<WebViewInfo>("get_webview_info");
        setWebviewInfo(wv);
      } catch (e) {}
    })();
  }, []);

  const runTests = async () => {
    setReportMsg(null);
    setRunning(true);
    const run = async (name: string, fn: () => Promise<any>) => {
      try {
        const details = await fn();
        return { name, status: "✅ PASS", details: String(details ?? "") };
      } catch (error: any) {
        return { name, status: "❌ FAIL", details: String(error) };
      }
    };
    const tests = await Promise.all([
      run("Basic Tauri Invoke", () => invoke("test_basic_function")),
      run("File System Access", () => invoke("test_file_system")),
      run("Window Operations", () => invoke("test_window_operations")),
    ]);
    setResults(tests);
    setRunning(false);
  };

  const generateReport = async () => {
    const reportData: any = {
      timestamp: new Date().toISOString(),
      system: systemInfo ?? { error: "Unavailable" },
      webview: webviewInfo ?? { error: "Unavailable" },
      tests: [] as Array<{ name: string; passed: boolean; error?: string }>,
    };

    const items = [
      { name: "Basic Tauri Invoke", fn: () => invoke("test_basic_function") },
      { name: "File System Access", fn: () => invoke("test_file_system") },
      { name: "Window Operations", fn: () => invoke("test_window_operations") },
    ];
    for (const it of items) {
      try {
        await it.fn();
        reportData.tests.push({ name: it.name, passed: true });
      } catch (e: any) {
        reportData.tests.push({
          name: it.name,
          passed: false,
          error: String(e),
        });
      }
    }

    try {
      const msg = await invoke<string>("save_compatibility_report", {
        reportData: JSON.stringify(reportData, null, 2),
      });
      setReportMsg(msg);
    } catch (e: any) {
      setReportMsg("Error saving report: " + String(e));
    }
  };

  const greet = async () => {
    const msg = await invoke<string>("greet", { name });
    setGreeting(msg);
  };

  return (
    <main className="container">
      <h1>Tauri Windows Compatibility Test</h1>
      <p className="subtitle">
        Testing Tauri compatibility across Windows versions
      </p>

      <div className="test-section">
        <div id="system-info" className="info-panel">
          <h3>System Information</h3>
          {systemInfo ? (
            <div className="info-grid">
              <div>
                <strong>OS:</strong> {systemInfo.os}
              </div>
              <div>
                <strong>OS Version:</strong> {systemInfo.os_version}
              </div>
              <div>
                <strong>Architecture:</strong> {systemInfo.arch}
              </div>
              <div>
                <strong>Hostname:</strong> {systemInfo.hostname}
              </div>
              <div>
                <strong>Total Memory:</strong> {systemInfo.total_memory} GB
              </div>
              <div>
                <strong>Available Memory:</strong> {systemInfo.available_memory}{" "}
                GB
              </div>
            </div>
          ) : (
            <p>Loading system information...</p>
          )}
        </div>

        <div id="webview-info" className="info-panel">
          <h3>WebView Information</h3>
          {webviewInfo ? (
            <div className="info-grid">
              <div>
                <strong>WebView Version:</strong> {webviewInfo.version}
              </div>
              <div>
                <strong>WebView Runtime:</strong> {webviewInfo.runtime}
              </div>
              <div>
                <strong>WebView Available:</strong>{" "}
                {webviewInfo.available ? "Yes" : "No"}
              </div>
            </div>
          ) : (
            <p>Loading WebView information...</p>
          )}
        </div>
      </div>

      <div className="test-controls">
        <button
          id="test-compatibility"
          className="test-button"
          onClick={runTests}
          disabled={running}
        >
          {running ? (
            <>
              <span className="spinner" /> Running Tests...
            </>
          ) : (
            "Run Compatibility Tests"
          )}
        </button>
        <button
          id="generate-report"
          className="report-button"
          onClick={generateReport}
          disabled={running}
        >
          Generate Report
        </button>
      </div>

      <div id="test-results" className="results-section">
        <h3>Compatibility Test Results</h3>
        <div className="results-summary">
          <span className="muted">Summary:</span>
          <span className="badge badge-pass">
            PASS {results.filter((r) => r.status.includes("PASS")).length}
          </span>
          <span className="badge badge-fail">
            FAIL {results.filter((r) => r.status.includes("FAIL")).length}
          </span>
          {running && <span className="badge badge-running">Running...</span>}
        </div>
        {results.map((test, idx) => (
          <div className="test-result" key={idx}>
            <div>
              <strong>{test.name}:</strong> {test.status}
            </div>
            <div style={{ marginLeft: 20, color: "#666" }}>{test.details}</div>
          </div>
        ))}
        {reportMsg && (
          <div
            className={`banner ${
              reportMsg.startsWith("Error") ? "banner-error" : "banner-success"
            }`}
          >
            {reportMsg}
          </div>
        )}
      </div>

      <div className="original-demo">
        <h3>Original Demo</h3>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
        <p id="greet-msg">{greeting}</p>
      </div>
    </main>
  );
}

export default App;
