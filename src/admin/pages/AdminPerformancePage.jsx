import React, { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Database,
  Cpu,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  TrendingDown,
  TrendingUp,
  HardDrive,
  Globe,
  Radio,
  FileCode2,
} from "lucide-react";

export default function AdminPerformancePage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [refreshTick, setRefreshTick] = useState(0);

  // Live telemetry metrics
  const [telemetry, setTelemetry] = useState({
    uptime: "99.98%",
    avgLatency: 42,
    p95Latency: 118,
    p99Latency: 245,
    rps: 84,
    totalRequestsToday: 142850,
    failedRequests: 172,
    errorRate: 0.12,
    http4xx: 148,
    http5xx: 24,
    activeDbConnections: 28,
    maxDbConnections: 100,
    cpuUsage: 24,
    memoryUsage: 42, // %
    memoryGb: "3.4 GB / 8.0 GB",
  });

  // Endpoints Table
  const endpoints = [
    { endpoint: "/api/v1/salons", method: "GET", rps: 34.2, avgMs: 28, p95Ms: 65, errorPct: "0.02%", status: "HEALTHY" },
    { endpoint: "/api/v1/appointments", method: "POST", rps: 18.5, avgMs: 78, p95Ms: 142, errorPct: "0.14%", status: "HEALTHY" },
    { endpoint: "/api/v1/auth/login", method: "POST", rps: 12.8, avgMs: 54, p95Ms: 110, errorPct: "0.38%", status: "HEALTHY" },
    { endpoint: "/api/v1/services", method: "GET", rps: 22.0, avgMs: 18, p95Ms: 42, errorPct: "0.00%", status: "HEALTHY" },
    { endpoint: "/api/v1/payments/verify", method: "POST", rps: 6.4, avgMs: 112, p95Ms: 198, errorPct: "0.18%", status: "HEALTHY" },
    { endpoint: "/api/v1/barbers/status", method: "PUT", rps: 8.1, avgMs: 36, p95Ms: 82, errorPct: "0.04%", status: "HEALTHY" },
  ];

  // Auto-refresh interval (10s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // Fluctuate telemetry slightly to simulate live monitoring
      setTelemetry((prev) => ({
        ...prev,
        avgLatency: Math.floor(40 + Math.random() * 6),
        rps: Math.floor(80 + Math.random() * 12),
        cpuUsage: Math.floor(22 + Math.random() * 6),
        totalRequestsToday: prev.totalRequestsToday + Math.floor(10 + Math.random() * 20),
      }));
      setLastRefreshed(new Date().toLocaleTimeString());
      setRefreshTick((t) => t + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  function handleManualRefresh() {
    setLastRefreshed(new Date().toLocaleTimeString());
    setRefreshTick((t) => t + 1);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Title */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">SRE & INFRASTRUCTURE TELEMETRY</span>
          <h1 className="admin-page-title">Application Performance Monitoring (APM)</h1>
          <p className="admin-page-subtitle">
            Observability, throughput latency percentiles, error budgets, and service mesh health.
          </p>
        </div>

        <div className="admin-header-actions">
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", color: "var(--admin-navy)" }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ accentColor: "var(--admin-blue)" }}
            />
            Auto-refresh (10s)
          </label>

          <button
            type="button"
            className="admin-btn outline sm"
            onClick={handleManualRefresh}
            title="Refresh telemetry"
          >
            <RefreshCw size={14} className={autoRefresh ? "spin-slow" : ""} /> Refreshed: {lastRefreshed}
          </button>
        </div>
      </div>

      {/* Part 9: APM Status Banner */}
      <div className="apm-status-banner">
        <div className="apm-status-left">
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.2)", display: "grid", placeItems: "center" }}>
            <Activity size={24} style={{ color: "#10b981" }} />
          </div>
          <div className="apm-status-text">
            <h2>All Production Systems Operational</h2>
            <p>Cluster: AWS ap-south-1 (Mumbai Flagship Region) · Zero critical incidents in 48 hours</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)", textTransform: "uppercase" }}>Monthly Uptime</span>
            <strong style={{ display: "block", fontSize: "18px", color: "#ffffff" }}>{telemetry.uptime}</strong>
          </div>
          <span className="admin-badge success" style={{ background: "#10b981", color: "#ffffff", borderColor: "#10b981" }}>
            SLA MET
          </span>
        </div>
      </div>

      {/* Part 9: Real-time Telemetry Metrics Grid */}
      <div className="apm-metrics-grid">
        <div className="apm-metric-box">
          <small>Current Throughput</small>
          <strong>{telemetry.rps} req/s</strong>
          <span>Peak: 124 req/s</span>
        </div>

        <div className="apm-metric-box">
          <small>Avg API Latency</small>
          <strong>{telemetry.avgLatency} ms</strong>
          <span>-4ms vs yesterday</span>
        </div>

        <div className="apm-metric-box">
          <small>P95 Latency</small>
          <strong style={{ color: "var(--admin-blue)" }}>{telemetry.p95Latency} ms</strong>
          <span>Within 150ms budget</span>
        </div>

        <div className="apm-metric-box">
          <small>P99 Latency</small>
          <strong>{telemetry.p99Latency} ms</strong>
          <span>Worst-case tail latency</span>
        </div>

        <div className="apm-metric-box">
          <small>Global Error Rate</small>
          <strong style={{ color: "#10b981" }}>{telemetry.errorRate}%</strong>
          <span>4xx: {telemetry.http4xx} · 5xx: {telemetry.http5xx}</span>
        </div>

        <div className="apm-metric-box">
          <small>Active DB Connections</small>
          <strong>{telemetry.activeDbConnections} / {telemetry.maxDbConnections}</strong>
          <span>PostgreSQL Pool: Healthy</span>
        </div>

        <div className="apm-metric-box">
          <small>Server CPU Usage</small>
          <strong>{telemetry.cpuUsage}%</strong>
          <span>8 Cores Dedicated</span>
        </div>

        <div className="apm-metric-box">
          <small>Server RAM Allocation</small>
          <strong>{telemetry.memoryUsage}%</strong>
          <span>{telemetry.memoryGb}</span>
        </div>
      </div>

      {/* Telemetry Visual Graphs */}
      <div className="admin-charts-grid">
        {/* Left: RPS & Latency trends */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Live Request Rate (RPS) & P95 Latency Trend</h3>
              <p>Sampled in real-time across edge proxies</p>
            </div>
          </div>

          <div className="chart-container">
            <svg viewBox="0 0 600 160" className="svg-area-chart" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,120 60,110 120,95 180,105 240,85 300,70 360,80 420,65 480,75 540,60 600,55"
              />
              <circle cx="600" cy="55" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", fontSize: "11px", color: "#94a3b8" }}>
              <span>10m ago</span>
              <span>8m ago</span>
              <span>6m ago</span>
              <span>4m ago</span>
              <span>2m ago</span>
              <span style={{ color: "#10b981", fontWeight: "700" }}>Live (Now)</span>
            </div>
          </div>
        </div>

        {/* Right: Service Infrastructure Health Grid */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Service Infrastructure Health</h3>
              <p>Component availability checks</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="health-node-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Globe size={18} style={{ color: "var(--admin-blue)" }} />
                <div className="health-node-info">
                  <strong>Cloudflare Edge CDN</strong>
                  <small>Status 200 · SSL Verified</small>
                </div>
              </div>
              <span className="admin-badge success">Healthy</span>
            </div>

            <div className="health-node-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Server size={18} style={{ color: "var(--admin-purple)" }} />
                <div className="health-node-info">
                  <strong>Spring Boot API Services</strong>
                  <small>Port 8080 · 0 restarts</small>
                </div>
              </div>
              <span className="admin-badge success">Healthy</span>
            </div>

            <div className="health-node-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Database size={18} style={{ color: "var(--admin-orange)" }} />
                <div className="health-node-info">
                  <strong>PostgreSQL Database</strong>
                  <small>Replica sync latency: 12ms</small>
                </div>
              </div>
              <span className="admin-badge success">Healthy</span>
            </div>

            <div className="health-node-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Zap size={18} style={{ color: "#eab308" }} />
                <div className="health-node-info">
                  <strong>Redis Session & Cache Layer</strong>
                  <small>Hit Ratio: 94.2% · Memory 18%</small>
                </div>
              </div>
              <span className="admin-badge success">Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 9: API Endpoints Monitoring Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <h3>API Route Telemetry & Latency Breakdown</h3>
            <p>Per-endpoint throughput, average response duration, and error frequencies</p>
          </div>
        </div>

        <div className="admin-table-wrapper" style={{ boxShadow: "none" }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>HTTP Route</th>
                <th>Method</th>
                <th>Throughput (RPS)</th>
                <th>Avg Latency</th>
                <th>P95 Latency</th>
                <th>Error Rate</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep, i) => (
                <tr key={i}>
                  <td>
                    <code style={{ fontSize: "13px", fontWeight: "700", color: "var(--admin-navy)" }}>{ep.endpoint}</code>
                  </td>
                  <td>
                    <span className={`admin-badge ${ep.method === "POST" ? "orange" : "blue"}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td>
                    <strong>{ep.rps} req/s</strong>
                  </td>
                  <td>{ep.avgMs} ms</td>
                  <td>
                    <strong style={{ color: "var(--admin-blue)" }}>{ep.p95Ms} ms</strong>
                  </td>
                  <td>
                    <span style={{ color: ep.errorPct === "0.00%" ? "#10b981" : "#d97706", fontWeight: "600" }}>
                      {ep.errorPct}
                    </span>
                  </td>
                  <td>
                    <span className="admin-badge success">✓ {ep.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Integration Contract Documentation Note */}
      <div
        style={{
          background: "#ffffff",
          border: "1px dashed var(--admin-border)",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FileCode2 size={20} style={{ color: "var(--admin-blue)" }} />
          <h4 style={{ margin: 0, fontSize: "15px", color: "var(--admin-navy)" }}>
            Telemetry Integration Contract (Spring Boot / OpenTelemetry)
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
          This APM dashboard consumes metrics from the standard Spring Boot Actuator endpoints. To feed live production metrics into this interface, register your Prometheus / Micrometer collector at <code>/actuator/metrics</code> and <code>/actuator/health</code>. The telemetry payload schema adheres strictly to RFC 7807 problem details.
        </p>
      </div>
    </div>
  );
}
