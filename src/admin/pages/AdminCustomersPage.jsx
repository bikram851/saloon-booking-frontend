import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  ShieldCheck,
} from "lucide-react";
import {
  getStoredAdminCustomers,
  saveStoredAdminCustomers,
} from "../adminData";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(getStoredAdminCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Customer profile drawer
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Bangalore",
  });

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (c.name || "").toLowerCase().includes(q);
      const matchEmail = (c.email || "").toLowerCase().includes(q);
      const matchPhone = (c.phone || "").includes(q);
      const matchId = (c.id || "").toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchId) return false;
    }
    return true;
  });

  function handleToggleStatus(customerId, currentStatus) {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const updated = customers.map((c) =>
      c.id === customerId ? { ...c, status: nextStatus } : c
    );
    setCustomers(updated);
    saveStoredAdminCustomers(updated);
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({ ...selectedCustomer, status: nextStatus });
    }
  }

  function handleAddCustomer(e) {
    e.preventDefault();
    if (!newCustomerForm.name.trim() || !newCustomerForm.email.trim()) return;

    const newCust = {
      id: "cust_" + (customers.length + 101),
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone || "+91 98765 00000",
      city: newCustomerForm.city || "Bangalore",
      registeredDate: new Date().toISOString().split("T")[0],
      totalBookings: 0,
      totalSpend: 0,
      status: "ACTIVE",
      lastBookingDate: "Never",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      notes: "Newly created customer via Admin Management Portal.",
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    saveStoredAdminCustomers(updated);
    setShowAddModal(false);
    setNewCustomerForm({ name: "", email: "", phone: "", city: "Bangalore" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Title */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">PATRON ROSTER & PROFILES</span>
          <h1 className="admin-page-title">Customer Management</h1>
          <p className="admin-page-subtitle">
            Search, inspect booking histories, and manage registered patron accounts across the platform.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Register New Customer
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="filter-left-group">
          <div className="admin-table-search">
            <Search size={16} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Patrons</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
          Showing <strong>{filteredCustomers.length}</strong> of {customers.length} patrons
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Contact Details</th>
              <th>City</th>
              <th>Registration Date</th>
              <th>Total Bookings</th>
              <th>Total Spend</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <strong style={{ fontSize: "12.5px", color: "var(--admin-blue)" }}>{cust.id}</strong>
                </td>
                <td>
                  <div className="user-cell-wrap">
                    <img src={cust.avatar} alt={cust.name} className="user-mini-avatar" />
                    <div className="user-name-col">
                      <strong>{cust.name}</strong>
                      <small>{cust.notes?.slice(0, 30)}...</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "12.5px" }}>{cust.email}</span>
                    <small style={{ color: "var(--admin-text-muted)" }}>{cust.phone}</small>
                  </div>
                </td>
                <td>{cust.city}</td>
                <td>{cust.registeredDate}</td>
                <td>
                  <strong>{cust.totalBookings} cuts</strong>
                </td>
                <td>
                  <strong style={{ color: "var(--admin-navy)" }}>₹{(cust.totalSpend || 0).toLocaleString()}</strong>
                </td>
                <td>
                  <span className={`admin-badge ${cust.status.toLowerCase()}`}>
                    {cust.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      type="button"
                      className="admin-btn outline sm"
                      onClick={() => setSelectedCustomer(cust)}
                      title="View Customer Profile"
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      type="button"
                      className={`admin-btn sm ${cust.status === "ACTIVE" ? "danger" : "success"}`}
                      onClick={() => handleToggleStatus(cust.id, cust.status)}
                      title={cust.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                    >
                      {cust.status === "ACTIVE" ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                  <Users size={32} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0 }}>No customers found matching your filter criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="admin-pagination-bar">
          <span>Page 1 of 1 · Showing all active entries</span>
          <div className="pagination-controls">
            <button type="button" className="admin-btn outline sm" disabled>
              Previous
            </button>
            <button type="button" className="admin-btn primary sm">
              1
            </button>
            <button type="button" className="admin-btn outline sm" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Slide-Out Drawer */}
      {selectedCustomer && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Patron Detailed Dossier</h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ overflowY: "auto" }}>
              {/* Profile Card Header */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--admin-border)" }}>
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--admin-blue)" }}
                />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "17px", color: "var(--admin-navy)" }}>{selectedCustomer.name}</h4>
                  <span className={`admin-badge ${selectedCustomer.status.toLowerCase()}`}>
                    {selectedCustomer.status}
                  </span>
                  <small style={{ display: "block", color: "var(--admin-text-muted)", marginTop: "4px" }}>
                    ID: {selectedCustomer.id} · Member since {selectedCustomer.registeredDate}
                  </small>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <strong style={{ fontSize: "13px", color: "var(--admin-navy)" }}>Contact Coordinates:</strong>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Mail size={14} style={{ color: "var(--admin-blue)" }} /> {selectedCustomer.email}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Phone size={14} style={{ color: "var(--admin-blue)" }} /> {selectedCustomer.phone}
                  </span>
                  <span>📍 City: {selectedCustomer.city}</span>
                </div>
              </div>

              {/* Lifetime Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#eff6ff", padding: "12px", borderRadius: "10px" }}>
                  <small style={{ color: "var(--admin-blue)", fontWeight: "600" }}>Total Completed Cuts</small>
                  <strong style={{ display: "block", fontSize: "20px", color: "var(--admin-navy)" }}>{selectedCustomer.totalBookings}</strong>
                </div>
                <div style={{ background: "#ecfdf5", padding: "12px", borderRadius: "10px" }}>
                  <small style={{ color: "#059669", fontWeight: "600" }}>Lifetime Platform Spend</small>
                  <strong style={{ display: "block", fontSize: "20px", color: "var(--admin-navy)" }}>₹{selectedCustomer.totalSpend.toLocaleString()}</strong>
                </div>
              </div>

              {/* Notes */}
              <div>
                <strong style={{ fontSize: "13px", color: "var(--admin-navy)" }}>Patron Preferences & Internal Notes:</strong>
                <p style={{ background: "#fbfcfd", border: "1px solid var(--admin-border)", padding: "12px", borderRadius: "10px", fontSize: "13px", color: "#475569", margin: "6px 0 0" }}>
                  {selectedCustomer.notes || "No special preferences logged."}
                </p>
              </div>

              {/* Actions */}
              <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--admin-border)", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className={`admin-btn ${selectedCustomer.status === "ACTIVE" ? "danger" : "success"}`}
                  style={{ flex: 1 }}
                  onClick={() => handleToggleStatus(selectedCustomer.id, selectedCustomer.status)}
                >
                  {selectedCustomer.status === "ACTIVE" ? "Suspend Account Access" : "Re-activate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Register New Customer Account</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Full Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Verma"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alok@example.com"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Bangalore"
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  Save & Onboard Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
