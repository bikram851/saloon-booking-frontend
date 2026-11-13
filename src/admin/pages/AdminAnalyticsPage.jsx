import React, { useState } from "react";
import { TrendingUp, Users, Calendar, Coins, ArrowUpRight, BarChart3, PieChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [metricTab, setMetricTab] = useState("REVENUE"); // REVENUE | BOOKINGS | CUSTOMERS

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">DEEP PLATFORM ANALYTICS</span>
          <h1 className="admin-page-title">Analytics & Intelligence</h1>
          <p className="admin-page-subtitle">
            Long-term retention cohorts, customer acquisition trends, and booking hour peaks.
          </p>
        </div>

        <div className="admin-header-actions">
          <div style={{ display: "flex", background: "#ffffff", border: "1px solid var(--admin-border)", borderRadius: "8px", padding: "2px" }}>
            {["REVENUE", "BOOKINGS", "CUSTOMERS"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`admin-btn sm ${metricTab === tab ? "primary" : "outline"}`}
                onClick={() => setMetricTab(tab)}
                style={{ border: "none" }}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <h3>Weekly Booking Volume & Peak Hours Distribution</h3>
            <p>Aggregated customer footfall across 7-day windows</p>
          </div>
        </div>

        <div className="chart-bar-columns">
          {[
            { day: "Mon", val: 45, height: "45%" },
            { day: "Tue", val: 52, height: "52%" },
            { day: "Wed", val: 68, height: "68%" },
            { day: "Thu", val: 74, height: "74%" },
            { day: "Fri", val: 92, height: "92%" },
            { day: "Sat", val: 100, height: "100%", orange: true },
            { day: "Sun", val: 95, height: "95%", orange: true },
          ].map((bar, i) => (
            <div key={i} className="chart-bar-item">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--admin-navy)" }}>{bar.val}</span>
              <div
                className={`chart-bar-fill ${bar.orange ? "orange" : ""}`}
                style={{ height: bar.height }}
              />
              <span className="chart-bar-label">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cohorts & Customer Retention */}
      <div className="admin-charts-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Customer Repeat Booking Cohort</h3>
              <p>Percentage of patrons returning within 30 days</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", fontWeight: "600" }}>30-Day Repeat Haircut Rate</span>
              <strong style={{ fontSize: "18px", color: "var(--admin-blue)" }}>68.4%</strong>
            </div>
            <div className="progress-track" style={{ height: "10px" }}>
              <div className="progress-fill" style={{ width: "68.4%" }} />
            </div>
            <small style={{ color: "#64748b" }}>Industry benchmark is ~42%. Glow & Grace exceeds by +26.4%.</small>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Preferred Booking Channels</h3>
              <p>Mobile web vs Desktop browser</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span>📱 Mobile Web Viewport</span>
              <strong>76.5%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill orange" style={{ width: "76.5%" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "6px" }}>
              <span>💻 Desktop Portal</span>
              <strong>23.5%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "23.5%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
