import React, { useMemo, useState, useEffect } from "react";
import {
  Scissors,
  Clock,
  User,
  Plus,
  Coffee,
  Flame,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Coins,
  X,
  Bell,
  Calendar,
} from "lucide-react";
import { request } from "../api";
import quickGroomLogo from "../assets/quick_groom.jpg";

const navItems = [
  { key: "home", label: "Station Home", icon: Scissors },
  { key: "appointments", label: "Appointments", icon: Calendar },
  { key: "confirm", label: "Confirm", badgeKey: "confirm", icon: Bell },
  { key: "earnings", label: "Today Earnings", icon: Coins },
  { key: "bookings", label: "Schedule", icon: Clock },
  { key: "timings", label: "Salon Timings", icon: Sparkles },
  { key: "barbers", label: "Available Barbers", icon: User },
];

const initialBookings = [
  { id: 1, customer: "Ananya K.", service: "Classic Beard Trim", time: "09:30 AM", price: 450, status: "Confirmed" },
  { id: 2, customer: "Mehul R.", service: "Hair Cut + Wash", time: "10:15 AM", price: 720, status: "Pending" },
  { id: 3, customer: "Riya S.", service: "Skin Fade", time: "11:00 AM", price: 680, status: "Confirmed" },
  { id: 4, customer: "Vikram T.", service: "Beard Styling", time: "01:00 PM", price: 420, status: "Pending" },
];

const initialConfirmQueue = [
  { id: 101, customer: "Pranav M.", service: "Royal Beard Care", time: "08:45 AM", price: 560 },
  { id: 102, customer: "Danial F.", service: "Signature Cut", time: "12:30 PM", price: 800 },
  { id: 103, customer: "Karan N.", service: "Hair Spa", time: "03:15 PM", price: 940 },
];

const initialBarbers = [
  { id: 1, name: "Aman", role: "Senior Stylist", available: true },
  { id: 2, name: "Rohit", role: "Beard Expert", available: true },
  { id: 3, name: "Sahil", role: "Hair Specialist", available: false },
  { id: 4, name: "Naveen", role: "Cut & Finish", available: true },
];

export default function DashboardPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "null");
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("home");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [bookings, setBookings] = useState(initialBookings);
  const [confirmQueue, setConfirmQueue] = useState(initialConfirmQueue);
  const [barbers, setBarbers] = useState(initialBarbers);

  const todayRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0),
    [bookings]
  );

  const confirmedCount = bookings.filter((entry) => entry.status === "Confirmed").length;
  const pendingCount = bookings.filter((entry) => entry.status === "Pending").length;
  const availableNow = barbers.filter((barber) => barber.available).length;
  const [apptFilter, setApptFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    if (apptFilter === "confirmed") return bookings.filter((b) => b.status === "Confirmed");
    if (apptFilter === "pending") return bookings.filter((b) => b.status === "Pending");
    return bookings;
  }, [bookings, apptFilter]);

  function confirmBooking(id) {
    const selected = confirmQueue.find((entry) => entry.id === id);
    if (!selected) return;

    setBookings((current) => [
      { ...selected, status: "Confirmed", time: selected.time },
      ...current,
    ]);
    setConfirmQueue((current) => current.filter((entry) => entry.id !== id));
    showToast(`✅ Confirmed appointment for ${selected.customer}!`);
  }

  function confirmAllBookings() {
    if (confirmQueue.length === 0) return;
    const count = confirmQueue.length;
    setBookings((current) => [
      ...confirmQueue.map((entry) => ({ ...entry, status: "Confirmed" })),
      ...current,
    ]);
    setConfirmQueue([]);
    showToast(`✅ All ${count} appointments confirmed!`);
  }

  const [stationActive, setStationActive] = useState(true);
  const [inChair, setInChair] = useState({
    id: 999,
    customer: "Arjun Verma",
    service: "Skin Fade + Royal Beard Sculpt",
    time: "In Chair (20 mins)",
    price: 750,
    startedAt: "10:15 AM",
  });
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    customer: "",
    service: "Signature Skin Fade",
    price: 550,
  });
  const [stationChecklist, setStationChecklist] = useState({
    bladeDisinfected: true,
    towelSteamer: true,
    freshCapes: true,
    clippersOiled: true,
  });
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  function finishInChairCut() {
    if (!inChair) return;
    const completed = {
      ...inChair,
      status: "Confirmed",
      time: "Completed just now",
    };
    setBookings((current) => [completed, ...current]);
    showToast(`✅ Cut completed for ${inChair.customer}! ₹${inChair.price} added to daily earnings.`);
    setInChair(null);
  }

  function seatInChair(booking) {
    if (inChair) {
      // finish current first
      setBookings((current) => [{ ...inChair, status: "Confirmed", time: "Completed" }, ...current]);
    }
    setInChair({
      ...booking,
      startedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setBookings((current) => current.filter((b) => b.id !== booking.id));
    showToast(`💈 ${booking.customer} is now seated in Chair #1!`);
  }

  function handleWalkInSubmit(e) {
    e.preventDefault();
    if (!walkInForm.customer.trim()) return;

    const newClient = {
      id: Date.now(),
      customer: walkInForm.customer,
      service: walkInForm.service,
      price: Number(walkInForm.price) || 500,
      time: "Walk-in (Now)",
      status: "Confirmed",
    };

    if (!inChair) {
      setInChair({
        ...newClient,
        startedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      showToast(`💈 Walk-in ${newClient.customer} seated directly in Chair #1!`);
    } else {
      setBookings((current) => [newClient, ...current]);
      showToast(`💈 Walk-in ${newClient.customer} added to the queue!`);
    }

    setWalkInForm({ customer: "", service: "Signature Skin Fade", price: 550 });
    setShowWalkIn(false);
  }

  function toggleChecklist(key) {
    setStationChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  useEffect(() => {
    if (user) {
      request("/appointments/mine")
        .then(setBookings)
        .catch(() => {});
    }
  }, [user]);

  return (
    <main className="barber-dashboard">
      <div className="barber-shell">
        <aside className="barber-sidebar">
          <div className="barber-profile">
            <div className="barber-avatar">{(user?.name || "B").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "Barber"}</strong>
              <small>Salon team</small>
            </div>
          </div>

          <nav className="barber-nav" aria-label="Barber dashboard navigation">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const badgeCount = item.badgeKey === "confirm" ? confirmQueue.length : 0;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={activeTab === item.key ? "barber-tab active" : "barber-tab"}
                  onClick={() => {
                    setActiveTab(item.key);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {IconComp && <IconComp size={15} className="barber-tab-icon" />}
                  <span>{item.label}</span>
                  {badgeCount > 0 && <span className="barber-tab-badge">{badgeCount}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="barber-content">
          {toastMessage && (
            <div className="appt-toast-banner" style={{ top: "18px" }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Barber Home Salon Hero Banner */}
          {activeTab === "home" ? (
            <div className="barber-home-hero-banner">
              <div
                className="barber-banner-bg"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=85')",
                }}
              >
                <div className="barber-banner-overlay" />
              </div>

              <div className="barber-banner-content">
                <div className="barber-banner-top">
                  <div className="barber-banner-badge-group">
                    <div className="barber-salon-avatar">
                      <img src={quickGroomLogo} alt="Quick Groom Saloon" />
                    </div>
                    <div>
                      <span className="barber-banner-eyebrow">
                        <Scissors size={13} /> QUICK GROOM BARBER SALOON • STATION #1
                      </span>
                      <h1 className="barber-banner-title">Barber Dashboard</h1>
                      <p className="barber-banner-subtitle">
                        Master Stylist Station · Managing live haircuts, appointments & daily earnings
                      </p>
                    </div>
                  </div>

                  <div className="barber-banner-actions">
                    <button
                      type="button"
                      className={stationActive ? "station-active-badge active" : "station-active-badge break"}
                      onClick={() => {
                        setStationActive(!stationActive);
                        showToast(
                          stationActive
                            ? "☕ Chair #1 set to break mode."
                            : "🟢 Chair #1 is now active & ready!"
                        );
                      }}
                    >
                      <span className="station-dot" />
                      {stationActive ? "Chair #1 Active" : "Station on Break"}
                    </button>
                    <button
                      type="button"
                      className="primary small banner-walkin-btn"
                      onClick={() => setShowWalkIn(true)}
                    >
                      <Plus size={15} /> Quick Walk-in
                    </button>
                  </div>
                </div>

                <div className="barber-banner-footer-pills">
                  <div className="banner-pill">
                    <Clock size={13} />
                    <span>Hours: {openTime} – {closeTime}</span>
                  </div>
                  <div className="banner-pill">
                    <User size={13} />
                    <span>Stylist: {user?.name || "Alex Rivera"}</span>
                  </div>
                  <div className="banner-pill highlight">
                    <Sparkles size={13} />
                    <span>{bookings.length + (inChair ? 1 : 0)} Cuts Groomed Today</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <header className="barber-header">
              <div>
                <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Scissors size={13} /> BARBER SALOON
                </span>
                <h1>{navItems.find((n) => n.key === activeTab)?.label || "Barber Dashboard"}</h1>
              </div>
            </header>
          )}

          {activeTab === "home" && (
            <>
              {/* Active Barber Chair Card */}
              {inChair ? (
                <div className="barber-chair-card">
                  <div className="barber-chair-header">
                    <div className="chair-header-left">
                      <span className="chair-pulse-badge">
                        <Scissors size={14} className="spin-slow" /> LIVE IN CHAIR
                      </span>
                      <span className="chair-timer">
                        <Clock size={13} /> Started at {inChair.startedAt || "10:15 AM"} · ~15m left
                      </span>
                    </div>
                    <span className="chair-price-tag">₹{inChair.price}</span>
                  </div>

                  {/* Visual Cut Progress Bar */}
                  <div className="chair-progress-wrap">
                    <div className="chair-progress-bar">
                      <div className="chair-progress-fill" style={{ width: "65%" }} />
                    </div>
                    <div className="chair-progress-labels">
                      <small>Fade & Beard Sculpt in progress</small>
                      <small>65% completed</small>
                    </div>
                  </div>

                  <div className="barber-chair-body">
                    <div className="chair-client-info">
                      <h2 className="chair-client-name">{inChair.customer}</h2>
                      <p className="chair-service-name">
                        <Sparkles size={14} style={{ color: "var(--gold)" }} /> {inChair.service}
                      </p>
                    </div>
                    <div className="barber-chair-actions">
                      <div className="chair-addons-row">
                        <button
                          type="button"
                          className="outline small chair-addon-btn"
                          onClick={() => {
                            setInChair({ ...inChair, price: inChair.price + 150, service: inChair.service + " + Hot Towel" });
                            showToast("♨️ Added Hot Towel Steamer (+₹150)!");
                          }}
                        >
                          <Flame size={13} /> + Hot Towel (+₹150)
                        </button>
                        <button
                          type="button"
                          className="outline small chair-addon-btn"
                          onClick={() => {
                            setInChair({ ...inChair, price: inChair.price + 100, service: inChair.service + " + Beard Balm" });
                            showToast("🧴 Added Organic Beard Balm (+₹100)!");
                          }}
                        >
                          <Sparkles size={13} /> + Beard Balm (+₹100)
                        </button>
                      </div>
                      <button type="button" className="primary chair-finish-btn" onClick={finishInChairCut}>
                        <CheckCircle2 size={16} /> Finish Cut & Collect ₹{inChair.price}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="barber-chair-empty-card">
                  <div className="empty-chair-text">
                    <h3>💺 Barber Chair #1 is Free</h3>
                    <p>No client is currently in the chair. Seat the next appointment or log a walk-in.</p>
                  </div>
                  <div className="empty-chair-actions">
                    <button
                      type="button"
                      className="primary small"
                      onClick={() => {
                        const next = bookings.find((b) => b.status === "Confirmed");
                        if (next) seatInChair(next);
                        else showToast("No waiting appointments in queue. Add a walk-in!");
                      }}
                    >
                      <Scissors size={14} /> Seat Next from Queue
                    </button>
                    <button type="button" className="outline small" onClick={() => setShowWalkIn(true)}>
                      <Plus size={14} /> + Walk-in Client
                    </button>
                  </div>
                </div>
              )}

              {/* Barbershop Live Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <small>Today Cuts & Clients</small>
                  <strong>{bookings.length + (inChair ? 1 : 0)}</strong>
                  <span>Groomed at Chair #1</span>
                </div>
                <div className="stat-card accent">
                  <small>Chair Revenue</small>
                  <strong>₹{todayRevenue + (inChair ? inChair.price : 0)}</strong>
                  <span>Today's gross earnings</span>
                </div>
                <div className="stat-card">
                  <small>Avg Cut Duration</small>
                  <strong>28 min</strong>
                  <span>Optimal salon pace</span>
                </div>
                <div className="stat-card">
                  <small>Waiting in Lounge</small>
                  <strong>{bookings.filter((b) => b.status === "Confirmed").length}</strong>
                  <span>Next up in queue</span>
                </div>
              </div>

              {/* Barbershop 2-Panel Grid: Queue & Station Operations */}
              <div className="panel-grid">
                {/* Left Panel: Today's Barber Schedule & Queue */}
                <div className="info-panel">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0 }}>Today's Haircut Queue</h3>
                    <span className="eyebrow" style={{ margin: 0 }}>{bookings.length} Scheduled</span>
                  </div>

                  <ul className="list-stack">
                    {bookings.slice(0, 5).map((entry) => (
                      <li key={entry.id} className="barber-queue-item">
                        <div className="queue-item-info">
                          <div className="queue-item-top">
                            <strong className="queue-customer-name">{entry.customer}</strong>
                            <span className="queue-service-badge">{entry.service}</span>
                          </div>
                          <span className="queue-item-meta">
                            ⏰ {entry.time} • <b>₹{entry.price}</b>
                          </span>
                        </div>
                        <button
                          type="button"
                          className="outline small barber-seat-btn"
                          onClick={() => seatInChair(entry)}
                          title="Seat client in chair"
                        >
                          <Scissors size={13} /> Seat in Chair
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Panel: Station Readiness Checklist & Popular Cuts */}
                <div className="info-panel">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0 }}>Station Ops & Hygiene</h3>
                    <span className="status-pill open">
                      <ShieldCheck size={12} style={{ marginRight: "4px" }} /> Inspected
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="station-checklist">
                    <label className="station-check-item">
                      <input
                        type="checkbox"
                        checked={stationChecklist.bladeDisinfected}
                        onChange={() => toggleChecklist("bladeDisinfected")}
                      />
                      <span>Straight Razors & Blades Sterilized</span>
                    </label>
                    <label className="station-check-item">
                      <input
                        type="checkbox"
                        checked={stationChecklist.towelSteamer}
                        onChange={() => toggleChecklist("towelSteamer")}
                      />
                      <span>Hot Towel Steamer Ready (65°C)</span>
                    </label>
                    <label className="station-check-item">
                      <input
                        type="checkbox"
                        checked={stationChecklist.freshCapes}
                        onChange={() => toggleChecklist("freshCapes")}
                      />
                      <span>Fresh Neck Strips & Barber Capes</span>
                    </label>
                    <label className="station-check-item">
                      <input
                        type="checkbox"
                        checked={stationChecklist.clippersOiled}
                        onChange={() => toggleChecklist("clippersOiled")}
                      />
                      <span>Clippers & Trimmers Oiled</span>
                    </label>
                  </div>

                  {/* Popular Barber Cuts & Quick Rate Card */}
                  <div className="barber-rate-box">
                    <span className="barber-rate-title">Popular Barber Services</span>
                    <div className="barber-rate-tags">
                      <span className="rate-pill">Skin Fade: ₹680</span>
                      <span className="rate-pill">Royal Shave: ₹560</span>
                      <span className="rate-pill">Beard Sculpt: ₹420</span>
                      <span className="rate-pill">Hair Spa: ₹940</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Walk-In Dialog / Modal */}
              {showWalkIn && (
                <div className="walkin-overlay" onClick={() => setShowWalkIn(false)}>
                  <div className="walkin-modal" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                        <Scissors size={18} style={{ color: "var(--gold)" }} /> Add Walk-in Client
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowWalkIn(false)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleWalkInSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                        Client Name
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={walkInForm.customer}
                          onChange={(e) => setWalkInForm({ ...walkInForm, customer: e.target.value })}
                          autoFocus
                          style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                        />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                        Haircut / Grooming Service
                        <select
                          value={walkInForm.service}
                          onChange={(e) => {
                            const val = e.target.value;
                            let p = 550;
                            if (val.includes("Fade")) p = 680;
                            else if (val.includes("Royal")) p = 560;
                            else if (val.includes("Beard")) p = 420;
                            else if (val.includes("Spa")) p = 940;
                            setWalkInForm({ ...walkInForm, service: val, price: p });
                          }}
                          style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)", background: "#fff" }}
                        >
                          <option value="Signature Skin Fade">Signature Skin Fade (₹680)</option>
                          <option value="Classic Beard Trim & Styling">Classic Beard Trim & Styling (₹420)</option>
                          <option value="Royal Hot Towel Shave">Royal Hot Towel Shave (₹560)</option>
                          <option value="Hair Cut + Head Wash">Hair Cut + Head Wash (₹550)</option>
                          <option value="Complete Grooming & Hair Spa">Complete Grooming & Hair Spa (₹940)</option>
                        </select>
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                        Price (₹)
                        <input
                          type="number"
                          required
                          value={walkInForm.price}
                          onChange={(e) => setWalkInForm({ ...walkInForm, price: e.target.value })}
                          style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                        />
                      </label>

                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button type="button" className="outline" onClick={() => setShowWalkIn(false)} style={{ flex: 1 }}>
                          Cancel
                        </button>
                        <button type="submit" className="primary" style={{ flex: 1 }}>
                          💈 Add to Chair / Queue
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "appointments" && (
            <div className="info-panel full-width barber-appt-panel">
              <div className="panel-title-bar">
                <div className="title-bar-left">
                  <h3>Appointment Overview</h3>
                  <span className="eyebrow">{bookings.length} Total</span>
                </div>
                <div className="barber-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${apptFilter === "all" ? "active" : ""}`}
                    onClick={() => setApptFilter("all")}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${apptFilter === "confirmed" ? "active" : ""}`}
                    onClick={() => setApptFilter("confirmed")}
                  >
                    Confirmed ({confirmedCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${apptFilter === "pending" ? "active" : ""}`}
                    onClick={() => setApptFilter("pending")}
                  >
                    Pending ({pendingCount})
                  </button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="desktop-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Time</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((entry) => (
                      <tr key={entry.id}>
                        <td><strong>{entry.customer}</strong></td>
                        <td>{entry.service}</td>
                        <td>⏰ {entry.time}</td>
                        <td><strong>₹{entry.price}</strong></td>
                        <td>
                          <span className={entry.status === "Confirmed" ? "status-pill confirmed" : "status-pill pending"}>
                            {entry.status}
                          </span>
                        </td>
                        <td>
                          {entry.status === "Confirmed" ? (
                            <button
                              type="button"
                              className="outline small table-action-btn"
                              onClick={() => seatInChair(entry)}
                            >
                              <Scissors size={12} /> Seat
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="primary small table-action-btn"
                              onClick={() => {
                                setBookings((prev) =>
                                  prev.map((b) => (b.id === entry.id ? { ...b, status: "Confirmed" } : b))
                                );
                                showToast(`✅ Confirmed appointment for ${entry.customer}`);
                              }}
                            >
                              <CheckCircle2 size={12} /> Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-appt-list">
                {filteredBookings.map((entry) => (
                  <div className="mobile-appt-card" key={entry.id}>
                    <div className="mobile-appt-header">
                      <div className="mobile-appt-header-main">
                        <strong className="mobile-appt-customer">{entry.customer}</strong>
                        <span className="mobile-appt-time">⏰ {entry.time}</span>
                      </div>
                      <span className={entry.status === "Confirmed" ? "status-pill confirmed" : "status-pill pending"}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="mobile-appt-service">
                      <Scissors size={13} style={{ color: "var(--gold)" }} />
                      <span>{entry.service}</span>
                    </div>

                    <div className="mobile-appt-footer">
                      <div className="mobile-appt-price-wrap">
                        <small>Total</small>
                        <strong className="mobile-appt-price">₹{entry.price}</strong>
                      </div>
                      <div className="mobile-appt-actions">
                        {entry.status === "Confirmed" ? (
                          <button
                            type="button"
                            className="primary small mobile-card-action-btn"
                            onClick={() => seatInChair(entry)}
                          >
                            <Scissors size={13} /> Seat in Chair
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="primary small mobile-card-action-btn"
                            onClick={() => {
                              setBookings((prev) =>
                                prev.map((b) => (b.id === entry.id ? { ...b, status: "Confirmed" } : b))
                              );
                              showToast(`✅ Confirmed appointment for ${entry.customer}`);
                            }}
                          >
                            <CheckCircle2 size={13} /> Confirm Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="queue-empty-box">
                  <Calendar size={32} style={{ color: "var(--gold)", margin: "0 auto 8px" }} />
                  <p>No {apptFilter === "all" ? "" : apptFilter} appointments found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "confirm" && (
            <div className="info-panel full-width barber-confirm-panel">
              <div className="panel-title-bar">
                <div className="title-bar-left">
                  <h3>Confirm Appointments</h3>
                  <span className="eyebrow">{confirmQueue.length} Pending Approval</span>
                </div>
                {confirmQueue.length > 1 && (
                  <button
                    type="button"
                    className="outline small confirm-all-btn"
                    onClick={confirmAllBookings}
                  >
                    <CheckCircle2 size={13} /> Confirm All ({confirmQueue.length})
                  </button>
                )}
              </div>
              <div className="confirm-list">
                {confirmQueue.map((entry) => (
                  <div className="confirm-card" key={entry.id}>
                    <div className="confirm-info">
                      <strong className="confirm-customer-name">{entry.customer}</strong>
                      <p className="confirm-service-desc">{entry.service}</p>
                    </div>
                    <div className="confirm-meta">
                      <span className="confirm-time-badge">⏰ {entry.time}</span>
                      <strong className="confirm-price">₹{entry.price}</strong>
                    </div>
                    <div className="confirm-actions-row">
                      <button
                        type="button"
                        className="outline small confirm-seat-direct-btn"
                        onClick={() => {
                          seatInChair({ ...entry, status: "Confirmed" });
                          setConfirmQueue((cur) => cur.filter((i) => i.id !== entry.id));
                        }}
                      >
                        <Scissors size={13} /> Direct Seat
                      </button>
                      <button
                        type="button"
                        className="primary small confirm-action-btn"
                        onClick={() => confirmBooking(entry.id)}
                      >
                        <CheckCircle2 size={14} /> Confirm
                      </button>
                    </div>
                  </div>
                ))}
                {confirmQueue.length === 0 && (
                  <div className="queue-empty-box">
                    <CheckCircle2 size={36} style={{ color: "#22c55e", margin: "0 auto 10px" }} />
                    <h4 style={{ margin: "0 0 6px", color: "#25221d" }}>All Caught Up!</h4>
                    <p style={{ margin: "0 0 14px" }}>All customer appointment requests have been confirmed.</p>
                    <button
                      type="button"
                      className="primary small"
                      onClick={() => setShowWalkIn(true)}
                    >
                      <Plus size={14} /> Add Walk-in Client
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="info-panel full-width">
              <div className="panel-title-bar">
                <h3>Today's Earnings & Performance</h3>
                <span className="eyebrow">Chair #1 Takings</span>
              </div>
              <div className="earnings-box">
                <div className="earnings-stat-card highlight">
                  <small>Total Revenue</small>
                  <strong>₹{todayRevenue}</strong>
                  <span>Gross daily takings</span>
                </div>
                <div className="earnings-stat-card">
                  <small>Confirmed Services</small>
                  <strong>{confirmedCount}</strong>
                  <span>Completed or ready</span>
                </div>
                <div className="earnings-stat-card">
                  <small>Pending Bookings</small>
                  <strong>{pendingCount}</strong>
                  <span>Awaiting action</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="info-panel full-width">
              <div className="panel-title-bar">
                <h3>Today's Bookings Schedule</h3>
                <span className="eyebrow">{bookings.length} Booked</span>
              </div>
              <div className="booking-list">
                {bookings.map((entry) => (
                  <div key={entry.id} className="booking-row">
                    <div className="booking-row-main">
                      <strong>{entry.customer}</strong>
                      <em>{entry.service}</em>
                    </div>
                    <div className="booking-row-meta">
                      <span>⏰ {entry.time}</span>
                      <b>₹{entry.price}</b>
                    </div>
                    <span className={entry.status === "Confirmed" ? "status-pill confirmed" : "status-pill pending"}>
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "timings" && (
            <div className="info-panel full-width">
              <div className="panel-title-bar">
                <h3>Saloon Operating Timings</h3>
                <span className="eyebrow">Opening & Closing</span>
              </div>
              <div className="time-form">
                <div className="time-inputs-group">
                  <label>
                    Opening Time
                    <input type="time" value={openTime} onChange={(event) => setOpenTime(event.target.value)} />
                  </label>
                  <label>
                    Closing Time
                    <input type="time" value={closeTime} onChange={(event) => setCloseTime(event.target.value)} />
                  </label>
                </div>
                <button
                  type="button"
                  className="primary full-mobile-btn"
                  onClick={() => showToast("Salon timings updated successfully!")}
                >
                  Save Timings
                </button>
              </div>
            </div>
          )}

          {activeTab === "barbers" && (
            <div className="info-panel full-width">
              <div className="panel-title-bar">
                <h3>Available Barbers Today</h3>
                <span className="eyebrow">{availableNow} Active</span>
              </div>
              <div className="barber-list">
                {barbers.map((barber) => (
                  <label key={barber.id} className={barber.available ? "barber-option" : "barber-option disabled"}>
                    <div className="barber-option-left">
                      <input
                        type="checkbox"
                        checked={barber.available}
                        onChange={() => toggleBarber(barber.id)}
                      />
                      <div>
                        <strong>{barber.name}</strong>
                        <span>{barber.role}</span>
                      </div>
                    </div>
                    <em className={barber.available ? "barber-status-badge on" : "barber-status-badge off"}>
                      {barber.available ? "● Available" : "○ Off Duty"}
                    </em>
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Floating Action Button (FAB) for Instant Walk-In */}
      <button
        type="button"
        className="barber-mobile-fab"
        onClick={() => setShowWalkIn(true)}
        aria-label="Add Walk-in Cut"
      >
        <Scissors size={18} />
        <span>+ Walk-in</span>
      </button>
    </main>
  );
}
