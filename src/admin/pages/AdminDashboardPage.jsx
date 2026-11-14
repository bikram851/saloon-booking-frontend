import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  Calendar,
  Coins,
  Tag,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  getStoredAdminSalons,
  getStoredAdminCustomers,
  getStoredAdminOffers,
} from "../adminData";
import { getStoredAppointments } from "../../api";

export default function AdminDashboardPage() {
  const [salons] = useState(getStoredAdminSalons);
  const [customers] = useState(getStoredAdminCustomers);
  const [offers] = useState(getStoredAdminOffers);
  const [appointments] = useState(getStoredAppointments);
  const [timeRange, setTimeRange] = useState("30d");

  const nav = useNavigate();

  // Metrics computation
  const totalCustomers = customers.length;
  const totalSalons = salons.length;
  const approvedSalons = salons.filter((s) => s.status === "APPROVED").length;
  const pendingSalons = salons.filter((s) => s.status === "PENDING").length;
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter((a) => {
    const today = new Date().toISOString().split("T")[0];
    return a.appointmentDate === today || a.date === today;
  }).length || appointments.length;
  const totalRevenue = salons.reduce((acc, s) => acc + (s.totalRevenue || 0), 0);
  const activeOffersCount = offers.filter((o) => o.status === "ACTIVE").length;
  const pendingVerifications = salons.filter((s) => s.verificationStatus === "UNDER_REVIEW" || s.verificationStatus === "INFO_REQUIRED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Bar */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">EXECUTIVE OPERATIONS & ANALYTICS</span>
          <h1 className="admin-page-title">Command Center Overview</h1>
          <p className="admin-page-subtitle">
            Real-time platform metrics across all verified salons, registered patrons, and active chairs.
          </p>
        </div>

        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Year to Date</option>
          </select>

          <Link to="/admin/salons" className="admin-btn primary">
            <Plus size={15} /> Onboard New Salon
          </Link>
        </div>
      </div>

      {/* Part 4: 9 Executive KPI Cards */}
      <div className="admin-kpi-grid">
        {/* 1. Total Customers */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Total Registered Patrons</h4>
            <div className="kpi-icon-wrap blue">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalCustomers.toLocaleString()}</span>
            <span className="kpi-trend up">
              <TrendingUp size={12} /> +14.8%
            </span>
          </div>
          <p className="kpi-caption">Verified guest profiles across Bangalore</p>
        </div>

        {/* 2. Total Salons */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Total Onboarded Salons</h4>
            <div className="kpi-icon-wrap purple">
              <Store size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalSalons}</span>
            <span className="kpi-trend up">
              <TrendingUp size={12} /> +2 this mo
            </span>
          </div>
          <p className="kpi-caption">{approvedSalons} approved & active venues</p>
        </div>

        {/* 3. Active Salons */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Active Operating Salons</h4>
            <div className="kpi-icon-wrap green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{approvedSalons}</span>
            <span className="kpi-trend up">100% active</span>
          </div>
          <p className="kpi-caption">Serving real-time walk-ins & bookings</p>
        </div>

        {/* 4. Pending Approvals */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Pending Salon Approvals</h4>
            <div className="kpi-icon-wrap orange">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{pendingSalons}</span>
            <span className="kpi-trend down">Action required</span>
          </div>
          <p className="kpi-caption">
            <Link to="/admin/salons" style={{ color: "var(--admin-orange)", fontWeight: "700", textDecoration: "none" }}>
              Review pending applications →
            </Link>
          </p>
        </div>

        {/* 5. Total Appointments */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Total Appointments Booked</h4>
            <div className="kpi-icon-wrap blue">
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalAppointments.toLocaleString()}</span>
            <span className="kpi-trend up">
              <TrendingUp size={12} /> +24.2%
            </span>
          </div>
          <p className="kpi-caption">Lifetime confirmed reservations</p>
        </div>

        {/* 6. Today's Appointments */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Today's Appointment Queue</h4>
            <div className="kpi-icon-wrap green">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{todayAppointments} Bookings</span>
            <span className="kpi-trend up">Live Queue</span>
          </div>
          <p className="kpi-caption">Across 4 styling chairs at flagship</p>
        </div>

        {/* 7. Total Platform Revenue */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Gross Platform Revenue</h4>
            <div className="kpi-icon-wrap green">
              <Coins size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">₹{(totalRevenue / 100000).toFixed(2)}L</span>
            <span className="kpi-trend up">
              <TrendingUp size={12} /> +18.5%
            </span>
          </div>
          <p className="kpi-caption">Platform commission accrued: ₹{Math.round(totalRevenue * 0.15).toLocaleString()}</p>
        </div>

        {/* 8. Active Offers & Promos */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Active Promotional Campaigns</h4>
            <div className="kpi-icon-wrap orange">
              <Tag size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{activeOffersCount} Campaigns</span>
            <span className="kpi-trend up">660 redeemed</span>
          </div>
          <p className="kpi-caption">Driving member acquisition & combos</p>
        </div>

        {/* 9. Pending Verifications */}
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Verification Center Queue</h4>
            <div className="kpi-icon-wrap purple">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{pendingVerifications} Requests</span>
            <span className="kpi-trend down">Docs Pending</span>
          </div>
          <p className="kpi-caption">
            <Link to="/admin/verification" style={{ color: "var(--admin-blue)", fontWeight: "700", textDecoration: "none" }}>
              Open Verification Center →
            </Link>
          </p>
        </div>
      </div>

      {/* Part 4 Analytics & Visual Charts Grid */}
      <div className="admin-charts-grid">
        {/* Left: Monthly Revenue & Booking Trends (Area Chart SVG) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Revenue & Booking Growth Trajectory</h3>
              <p>Monthly aggregate platform GMV and volume trend</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="admin-badge success">● GMV (₹)</span>
              <span className="admin-badge info_required">● Bookings</span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="chart-container">
            <svg viewBox="0 0 600 180" className="svg-area-chart" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0879E8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0879E8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area Fill */}
              <polygon
                points="0,170 50,140 120,130 190,110 260,120 330,80 400,90 480,50 550,45 600,30 600,180 0,180"
                fill="url(#revGrad)"
              />

              {/* Trend Line */}
              <polyline
                fill="none"
                stroke="#0879E8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,170 50,140 120,130 190,110 260,120 330,80 400,90 480,50 550,45 600,30"
              />

              {/* Accent Circles */}
              <circle cx="330" cy="80" r="4.5" fill="#ffffff" stroke="#0879E8" strokeWidth="2.5" />
              <circle cx="480" cy="50" r="4.5" fill="#ffffff" stroke="#0879E8" strokeWidth="2.5" />
              <circle cx="600" cy="30" r="5" fill="#FF8A35" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Month Axis Labels */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov (Peak)</span>
            </div>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Popular Service Categories</h3>
              <p>Booking share across all salons</p>
            </div>
          </div>

          <div className="service-progress-list">
            <div className="service-progress-item">
              <div className="service-progress-info">
                <span className="service-name-label">Haircut & Fade Sculpting</span>
                <span className="service-percentage">44%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "44%" }} />
              </div>
            </div>

            <div className="service-progress-item">
              <div className="service-progress-info">
                <span className="service-name-label">Hair Spa & Scalp Therapy</span>
                <span className="service-percentage">26%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill cyan" style={{ width: "26%" }} />
              </div>
            </div>

            <div className="service-progress-item">
              <div className="service-progress-info">
                <span className="service-name-label">Royal Shave & Beard Styling</span>
                <span className="service-percentage">18%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill orange" style={{ width: "18%" }} />
              </div>
            </div>

            <div className="service-progress-item">
              <div className="service-progress-info">
                <span className="service-name-label">Glow Facials & Skin Radiance</span>
                <span className="service-percentage">12%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill purple" style={{ width: "12%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Top Performing Salons & Pending Onboarding Requests */}
      <div className="admin-charts-grid">
        {/* Left: Top Performing Salons */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>Top Performing Salons Leaderboard</h3>
              <p>Ranked by verified patron volume and guest satisfaction rating</p>
            </div>
            <Link to="/admin/salons" className="admin-btn outline sm">
              View All Salons <ArrowRight size={13} />
            </Link>
          </div>

          <div className="top-salons-list">
            {salons
              .filter((s) => s.status === "APPROVED")
              .slice(0, 3)
              .map((s, idx) => (
                <div className="leaderboard-row" key={s.id}>
                  <div className="leaderboard-salon-info">
                    <span className={`salon-mini-rank ${idx === 0 ? "gold" : ""}`}>#{idx + 1}</span>
                    <img
                      src={s.coverImage}
                      alt={s.name}
                      style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div>
                      <strong>{s.name}</strong>
                      <small>⭐ {s.rating} · {s.city} ({s.chairsCount} chairs)</small>
                    </div>
                  </div>
                  <div className="leaderboard-metric">
                    <strong>₹{(s.totalRevenue).toLocaleString()}</strong>
                    <small>{s.reviewsCount} reviews</small>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Pending Salon Onboarding Queue */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <h3>New Onboarding Applications</h3>
              <p>Awaiting audit and verification review</p>
            </div>
            <span className="admin-badge warning">{pendingSalons} Pending</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {salons
              .filter((s) => s.status === "PENDING")
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#fbfcfd",
                    border: "1px solid var(--admin-border)",
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "var(--admin-navy)" }}>{p.name}</strong>
                      <small style={{ display: "block", color: "var(--admin-text-muted)" }}>Owner: {p.ownerName} ({p.phone})</small>
                    </div>
                    <span className="admin-badge warning">
                      {p.verificationStatus === "INFO_REQUIRED" ? "Info Required" : "Audit Docs"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    {p.address}, {p.city}
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <Link to="/admin/salons" className="admin-btn primary sm" style={{ flex: 1 }}>
                      Inspect Application
                    </Link>
                  </div>
                </div>
              ))}

            {pendingSalons === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#64748b" }}>
                <CheckCircle2 size={32} style={{ color: "#10b981", margin: "0 auto 8px" }} />
                <p>All salon applications verified and up to date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
