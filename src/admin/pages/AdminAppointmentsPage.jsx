import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Scissors,
  User,
  Store,
  Eye,
  ArrowLeftRight,
  X,
  AlertCircle,
  Coins,
  Check,
} from "lucide-react";
import {
  getStoredAppointments,
  saveStoredAppointments,
  getStoredBarbers,
} from "../../api";
import { getStoredAdminSalons } from "../adminData";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState(getStoredAppointments);
  const [salons] = useState(getStoredAdminSalons);
  const [barbers] = useState(getStoredBarbers);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [salonFilter, setSalonFilter] = useState("ALL");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);
  const [viewMode, setViewMode] = useState("TABLE"); // TABLE | TIMELINE

  // Filter logic
  const filtered = appointments.filter((a) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (salonFilter !== "ALL" && String(a.salonId) !== salonFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust = (a.customerName || a.customer || "").toLowerCase().includes(q);
      const matchService = (a.service || "").toLowerCase().includes(q);
      const matchId = String(a.id).toLowerCase().includes(q);
      if (!matchCust && !matchService && !matchId) return false;
    }
    return true;
  });

  function handleStatusUpdate(id, newStatus) {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
    saveStoredAppointments(updated);
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: newStatus });
    }
  }

  function handleReassign(e) {
    e.preventDefault();
    if (!reassignModal) return;
    const targetBarber = barbers.find((b) => Number(b.id) === Number(reassignModal.newBarberId));
    const updated = appointments.map((a) => {
      if (a.id === reassignModal.appt.id) {
        return {
          ...a,
          barberId: targetBarber.id,
          barber: { id: targetBarber.id, name: targetBarber.name, chair: targetBarber.chair },
        };
      }
      return a;
    });

    setAppointments(updated);
    saveStoredAppointments(updated);
    setReassignModal(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">RESERVATIONS & CHAIR QUEUE</span>
          <h1 className="admin-page-title">Appointment Management</h1>
          <p className="admin-page-subtitle">
            Universal reservation dispatch across all partner salons, styling chairs, and booking channels.
          </p>
        </div>

        <div className="admin-header-actions">
          <div style={{ display: "flex", background: "#ffffff", border: "1px solid var(--admin-border)", borderRadius: "8px", padding: "2px" }}>
            <button
              type="button"
              className={`admin-btn sm ${viewMode === "TABLE" ? "primary" : "outline"}`}
              onClick={() => setViewMode("TABLE")}
              style={{ border: "none" }}
            >
              Table View
            </button>
            <button
              type="button"
              className={`admin-btn sm ${viewMode === "TIMELINE" ? "primary" : "outline"}`}
              onClick={() => setViewMode("TIMELINE")}
              style={{ border: "none" }}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="filter-left-group">
          <div className="admin-table-search">
            <Search size={16} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search patron, booking ID, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending Approval</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="admin-select"
            value={salonFilter}
            onChange={(e) => setSalonFilter(e.target.value)}
          >
            <option value="ALL">All Venues</option>
            {salons.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
          Showing <strong>{filtered.length}</strong> reservations
        </div>
      </div>

      {/* View Mode: TABLE */}
      {viewMode === "TABLE" && (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patron Name</th>
                <th>Salon Venue</th>
                <th>Stylist & Chair</th>
                <th>Service Booked</th>
                <th>Slot Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => {
                const bName = appt.barber?.name || (barbers.find((b) => b.id === appt.barberId)?.name) || "Alex Rivera";
                const bChair = appt.barber?.chair || "Chair #1";

                return (
                  <tr key={appt.id}>
                    <td>
                      <strong style={{ fontSize: "12.5px", color: "var(--admin-blue)" }}>
                        #{String(appt.id).replace("apt_seed_", "GG-")}
                      </strong>
                    </td>
                    <td>
                      <strong>{appt.customerName || appt.customer}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: "12.5px" }}>{appt.salonName || "Quick Groom Saloon"}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>{bName}</span>
                        <small style={{ color: "var(--admin-text-muted)" }}>{bChair}</small>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                        <Scissors size={13} style={{ color: "var(--admin-orange)" }} /> {appt.service}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12.5px", color: "#475569" }}>
                        {appt.appointmentDate || "Today"} · {appt.appointmentTime || appt.time}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "var(--admin-navy)" }}>₹{appt.price}</strong>
                    </td>
                    <td>
                      <span className={`admin-badge ${appt.status.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="admin-btn outline sm"
                          onClick={() => setSelectedAppt(appt)}
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>

                        {appt.status === "PENDING" && (
                          <button
                            type="button"
                            className="admin-btn success sm"
                            onClick={() => handleStatusUpdate(appt.id, "CONFIRMED")}
                            title="Confirm Booking"
                          >
                            <Check size={13} />
                          </button>
                        )}

                        {appt.status !== "COMPLETED" && (
                          <button
                            type="button"
                            className="admin-btn outline sm"
                            onClick={() => setReassignModal({ appt, newBarberId: appt.barberId || 1 })}
                            title="Reassign Stylist"
                          >
                            <ArrowLeftRight size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                    <Calendar size={32} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                    <p style={{ margin: 0 }}>No reservations found matching the selected filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode: TIMELINE */}
      {viewMode === "TIMELINE" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"].map((slot, idx) => (
            <div key={idx} className="admin-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--admin-border-subtle)", paddingBottom: "8px" }}>
                <strong style={{ fontSize: "13.5px", color: "var(--admin-navy)" }}>⏰ {slot} Window</strong>
                <span className="admin-badge neutral">Active</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                {filtered.slice(idx * 2, idx * 2 + 2).map((a) => (
                  <div key={a.id} style={{ background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid var(--admin-border)" }}>
                    <strong style={{ display: "block", fontSize: "13px" }}>{a.customerName || a.customer}</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{a.service} (₹{a.price})</span>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                      <small style={{ color: "var(--admin-blue)" }}>{a.barber?.name || "Alex Rivera"}</small>
                      <span className={`admin-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Drawer */}
      {selectedAppt && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="admin-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Reservation Details</h3>
              <button type="button" onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "15px", color: "var(--admin-navy)" }}>{selectedAppt.customerName || selectedAppt.customer}</strong>
                  <small style={{ display: "block", color: "var(--admin-text-muted)" }}>ID: #{selectedAppt.id}</small>
                </div>
                <span className={`admin-badge ${selectedAppt.status.toLowerCase()}`}>{selectedAppt.status}</span>
              </div>

              <div>
                <strong style={{ fontSize: "13px", color: "var(--admin-navy)" }}>Service & Salon Details:</strong>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#475569" }}>
                  💈 Service: <strong>{selectedAppt.service}</strong> <br />
                  🏪 Salon: <strong>{selectedAppt.salonName || "Quick Groom Saloon"}</strong> <br />
                  👤 Stylist: <strong>{selectedAppt.barber?.name || "Alex Rivera"} ({selectedAppt.barber?.chair || "Chair #1"})</strong> <br />
                  ⏰ Timing: <strong>{selectedAppt.appointmentDate || "Today"} · {selectedAppt.appointmentTime || selectedAppt.time}</strong> <br />
                  💰 Amount: <strong>₹{selectedAppt.price}</strong> (Prepaid / Card Verified)
                </p>
              </div>

              <div style={{ marginTop: "auto", borderTop: "1px solid var(--admin-border)", paddingTop: "14px", display: "flex", gap: "10px" }}>
                {selectedAppt.status === "CONFIRMED" && (
                  <button
                    type="button"
                    className="admin-btn success"
                    style={{ flex: 1 }}
                    onClick={() => handleStatusUpdate(selectedAppt.id, "COMPLETED")}
                  >
                    Mark Done (₹{selectedAppt.price})
                  </button>
                )}
                {selectedAppt.status !== "CANCELLED" && (
                  <button
                    type="button"
                    className="admin-btn danger"
                    style={{ flex: 1 }}
                    onClick={() => handleStatusUpdate(selectedAppt.id, "CANCELLED")}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Stylist Modal */}
      {reassignModal && (
        <div className="admin-modal-overlay" onClick={() => setReassignModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div className="admin-modal-header">
              <h3>Transfer Reservation Stylist</h3>
              <button type="button" onClick={() => setReassignModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleReassign}>
              <div className="admin-modal-body">
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  Select the target stylist station to take over this haircut:
                </p>
                <select
                  value={reassignModal.newBarberId}
                  onChange={(e) => setReassignModal({ ...reassignModal, newBarberId: e.target.value })}
                  className="admin-select"
                  style={{ width: "100%" }}
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.chair}) — {b.status === "active" ? "🟢 On Duty" : "○ Break/Offline"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn outline" onClick={() => setReassignModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
