import React, { useMemo, useState, useEffect } from "react";
import { request } from "../api";

const navItems = [
  { key: "home", label: "Home" },
  { key: "appointments", label: "Appointments" },
  { key: "confirm", label: "Confirm Appointments" },
  { key: "earnings", label: "Today Earnings" },
  { key: "bookings", label: "Today Bookings" },
  { key: "timings", label: "Salon Timings" },
  { key: "barbers", label: "Available Barbers" },
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

  function confirmBooking(id) {
    const selected = confirmQueue.find((entry) => entry.id === id);
    if (!selected) return;

    setBookings((current) => [
      { ...selected, status: "Confirmed", time: selected.time },
      ...current,
    ]);
    setConfirmQueue((current) => current.filter((entry) => entry.id !== id));
  }

  function toggleBarber(id) {
    setBarbers((current) =>
      current.map((barber) =>
        barber.id === id ? { ...barber, available: !barber.available } : barber
      )
    );
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
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={activeTab === item.key ? "barber-tab active" : "barber-tab"}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="barber-content">
          <header className="barber-header">
            <div>
              <span className="eyebrow">BARBER DASHBOARD</span>
              <h1>Welcome back, {user?.name || "Barber"}</h1>
            </div>
            <button type="button" className="primary small">
              Salon is open
            </button>
          </header>

          {activeTab === "home" && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <small>Today bookings</small>
                  <strong>{bookings.length}</strong>
                  <span>Booked services</span>
                </div>
                <div className="stat-card">
                  <small>Confirmed</small>
                  <strong>{confirmedCount}</strong>
                  <span>Ready to serve</span>
                </div>
                <div className="stat-card">
                  <small>Pending</small>
                  <strong>{pendingCount}</strong>
                  <span>Awaiting action</span>
                </div>
                <div className="stat-card accent">
                  <small>Today earnings</small>
                  <strong>₹{todayRevenue}</strong>
                  <span>Gross revenue</span>
                </div>
              </div>

              <div className="panel-grid">
                <div className="info-panel">
                  <h3>Upcoming schedule</h3>
                  <ul className="list-stack">
                    {bookings.slice(0, 4).map((entry) => (
                      <li key={entry.id}>
                        <div>
                          <strong>{entry.customer}</strong>
                          <span>{entry.service}</span>
                        </div>
                        <em>{entry.time}</em>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="info-panel">
                  <h3>Salon status</h3>
                  <div className="status-box">
                    <span className="status-pill open">Open</span>
                    <p>Working hours: {openTime} - {closeTime}</p>
                  </div>
                  <div className="mini-row">
                    <span>Available barbers</span>
                    <strong>{availableNow}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "appointments" && (
            <div className="info-panel full-width">
              <h3>Appointment overview</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Time</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.customer}</td>
                        <td>{entry.service}</td>
                        <td>{entry.time}</td>
                        <td>₹{entry.price}</td>
                        <td>
                          <span className={entry.status === "Confirmed" ? "status-pill confirmed" : "status-pill pending"}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "confirm" && (
            <div className="info-panel full-width">
              <h3>Confirm appointments</h3>
              <div className="confirm-list">
                {confirmQueue.map((entry) => (
                  <div className="confirm-card" key={entry.id}>
                    <div>
                      <strong>{entry.customer}</strong>
                      <p>{entry.service}</p>
                    </div>
                    <div className="confirm-meta">
                      <span>{entry.time}</span>
                      <strong>₹{entry.price}</strong>
                    </div>
                    <button type="button" className="primary small" onClick={() => confirmBooking(entry.id)}>
                      Confirm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="info-panel full-width">
              <h3>Today earnings</h3>
              <div className="earnings-box">
                <div>
                  <small>Total revenue</small>
                  <strong>₹{todayRevenue}</strong>
                </div>
                <div>
                  <small>Confirmed appointments</small>
                  <strong>{confirmedCount}</strong>
                </div>
                <div>
                  <small>Pending bookings</small>
                  <strong>{pendingCount}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="info-panel full-width">
              <h3>Today bookings</h3>
              <div className="booking-list">
                {bookings.map((entry) => (
                  <div key={entry.id} className="booking-row">
                    <span>{entry.time}</span>
                    <strong>{entry.customer}</strong>
                    <em>{entry.service}</em>
                    <b>₹{entry.price}</b>
                    <small>{entry.status}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "timings" && (
            <div className="info-panel full-width">
              <h3>Saloon open and close time</h3>
              <div className="time-form">
                <label>
                  Open time
                  <input type="time" value={openTime} onChange={(event) => setOpenTime(event.target.value)} />
                </label>
                <label>
                  Close time
                  <input type="time" value={closeTime} onChange={(event) => setCloseTime(event.target.value)} />
                </label>
                <button type="button" className="primary">
                  Save timings
                </button>
              </div>
            </div>
          )}

          {activeTab === "barbers" && (
            <div className="info-panel full-width">
              <h3>Available barbers for today</h3>
              <div className="barber-list">
                {barbers.map((barber) => (
                  <label key={barber.id} className={barber.available ? "barber-option" : "barber-option disabled"}>
                    <input
                      type="checkbox"
                      checked={barber.available}
                      onChange={() => toggleBarber(barber.id)}
                    />
                    <div>
                      <strong>{barber.name}</strong>
                      <span>{barber.role}</span>
                    </div>
                    <em>{barber.available ? "Available" : "Off duty"}</em>
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
