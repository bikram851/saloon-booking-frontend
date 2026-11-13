import React, { useState } from "react";
import {
  Store,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  MapPin,
  Phone,
  Mail,
  Users,
  Scissors,
  Star,
  Coins,
  X,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  getStoredAdminSalons,
  saveStoredAdminSalons,
} from "../adminData";

export default function AdminSalonsPage() {
  const [salons, setSalons] = useState(getStoredAdminSalons);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSalon, setSelectedSalon] = useState(null); // Verification & Detail modal
  const [reviewNotes, setReviewNotes] = useState("");
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { action: 'APPROVE'|'REJECT'|'INFO', salon: {...} }

  // New salon form
  const [newSalonForm, setNewSalonForm] = useState({
    name: "",
    brand: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Bangalore",
    pinCode: "560038",
    chairsCount: 4,
  });

  // KPI calculations
  const totalSalons = salons.length;
  const pendingCount = salons.filter((s) => s.status === "PENDING").length;
  const approvedCount = salons.filter((s) => s.status === "APPROVED").length;
  const rejectedCount = salons.filter((s) => s.status === "REJECTED").length;

  const filteredSalons = salons.filter((s) => {
    if (activeTab !== "ALL" && s.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (s.name || "").toLowerCase().includes(q);
      const matchOwner = (s.ownerName || "").toLowerCase().includes(q);
      const matchCity = (s.city || "").toLowerCase().includes(q);
      if (!matchName && !matchOwner && !matchCity) return false;
    }
    return true;
  });

  function handleExecuteVerification(action, salonId) {
    let nextStatus = "APPROVED";
    let nextVerification = "VERIFIED";

    if (action === "REJECT") {
      nextStatus = "REJECTED";
      nextVerification = "REJECTED";
    } else if (action === "INFO") {
      nextStatus = "PENDING";
      nextVerification = "INFO_REQUIRED";
    }

    const updated = salons.map((s) => {
      if (s.id === salonId) {
        return {
          ...s,
          status: nextStatus,
          verificationStatus: nextVerification,
          notes: reviewNotes || s.notes,
          approvedAt: action === "APPROVE" ? new Date().toISOString() : s.approvedAt,
        };
      }
      return s;
    });

    setSalons(updated);
    saveStoredAdminSalons(updated);
    setConfirmDialog(null);
    setSelectedSalon(null);
    setReviewNotes("");
  }

  function handleCreateSalon(e) {
    e.preventDefault();
    if (!newSalonForm.name.trim() || !newSalonForm.ownerName.trim()) return;

    const newSalon = {
      id: salons.length + 1,
      name: newSalonForm.name,
      brand: newSalonForm.brand || newSalonForm.name,
      ownerName: newSalonForm.ownerName,
      email: newSalonForm.email,
      phone: newSalonForm.phone,
      address: newSalonForm.address,
      city: newSalonForm.city,
      pinCode: newSalonForm.pinCode,
      status: "APPROVED",
      verificationStatus: "VERIFIED",
      rating: 4.8,
      reviewsCount: 1,
      chairsCount: Number(newSalonForm.chairsCount) || 4,
      staffCount: 4,
      activeAppointmentsToday: 0,
      totalRevenue: 0,
      coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      gallery: [],
      documents: [{ name: "Trade License & Onboarding Agreement", type: "PDF", verified: true }],
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      notes: "Direct enterprise onboarding via admin portal.",
    };

    const updated = [newSalon, ...salons];
    setSalons(updated);
    saveStoredAdminSalons(updated);
    setShowOnboardModal(false);
    setNewSalonForm({
      name: "",
      brand: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      city: "Bangalore",
      pinCode: "560038",
      chairsCount: 4,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Title */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">SALON NETWORK & AUDIT WORKFLOW</span>
          <h1 className="admin-page-title">Salon Onboarding & Management</h1>
          <p className="admin-page-subtitle">
            Review submitted salon applications, verify premises documentation, and manage approved beauty venues.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={() => setShowOnboardModal(true)}
          >
            <Plus size={16} /> + Onboard New Salon
          </button>
        </div>
      </div>

      {/* Part 6: Onboarding Dashboard Metric Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card" onClick={() => setActiveTab("ALL")} style={{ cursor: "pointer" }}>
          <div className="kpi-card-top">
            <h4 className="kpi-title">Total Salon Applications</h4>
            <div className="kpi-icon-wrap blue">
              <Store size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalSalons}</span>
          </div>
          <p className="kpi-caption">All registered venues across network</p>
        </div>

        <div className="admin-kpi-card" onClick={() => setActiveTab("PENDING")} style={{ cursor: "pointer", border: activeTab === "PENDING" ? "2px solid var(--admin-orange)" : "" }}>
          <div className="kpi-card-top">
            <h4 className="kpi-title">Pending Applications</h4>
            <div className="kpi-icon-wrap orange">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{pendingCount}</span>
            <span className="kpi-trend down">Action required</span>
          </div>
          <p className="kpi-caption">Awaiting document verification & audit</p>
        </div>

        <div className="admin-kpi-card" onClick={() => setActiveTab("APPROVED")} style={{ cursor: "pointer", border: activeTab === "APPROVED" ? "2px solid var(--admin-success)" : "" }}>
          <div className="kpi-card-top">
            <h4 className="kpi-title">Approved Live Salons</h4>
            <div className="kpi-icon-wrap green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{approvedCount}</span>
            <span className="kpi-trend up">Operational</span>
          </div>
          <p className="kpi-caption">Accepting real-time customer bookings</p>
        </div>

        <div className="admin-kpi-card" onClick={() => setActiveTab("REJECTED")} style={{ cursor: "pointer", border: activeTab === "REJECTED" ? "2px solid var(--admin-danger)" : "" }}>
          <div className="kpi-card-top">
            <h4 className="kpi-title">Rejected Applications</h4>
            <div className="kpi-icon-wrap purple">
              <XCircle size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{rejectedCount}</span>
          </div>
          <p className="kpi-caption">Non-compliant documentation</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="filter-left-group">
          <div className="admin-table-search">
            <Search size={16} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search salon name, owner, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`admin-btn sm ${activeTab === tab ? "primary" : "outline"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "ALL" ? "All Salons" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
          Showing <strong>{filteredSalons.length}</strong> of {salons.length} salons
        </div>
      </div>

      {/* Salons Table */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Salon Name & Brand</th>
              <th>Owner & Contact</th>
              <th>Location & City</th>
              <th>Chairs</th>
              <th>Rating & Reviews</th>
              <th>Application Date</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Audit Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalons.map((salon) => (
              <tr key={salon.id}>
                <td>
                  <div className="user-cell-wrap">
                    <img
                      src={salon.coverImage}
                      alt={salon.name}
                      style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover" }}
                    />
                    <div className="user-name-col">
                      <strong>{salon.name}</strong>
                      <small>{salon.brand}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <strong style={{ fontSize: "13px" }}>{salon.ownerName}</strong>
                    <small style={{ color: "var(--admin-text-muted)" }}>{salon.phone}</small>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: "12.5px" }}>{salon.address}</span>
                  <small style={{ display: "block", color: "var(--admin-text-muted)" }}>{salon.city} · {salon.pinCode}</small>
                </td>
                <td>
                  <strong>{salon.chairsCount} Stations</strong>
                </td>
                <td>
                  {salon.status === "APPROVED" ? (
                    <div>
                      <strong>⭐ {salon.rating}</strong>
                      <small style={{ display: "block", color: "var(--admin-text-muted)" }}>{salon.reviewsCount} reviews</small>
                    </div>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not yet rated</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: "12.5px" }}>
                    {salon.submittedAt ? new Date(salon.submittedAt).toLocaleDateString() : "Prior"}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${salon.status.toLowerCase()}`}>
                    {salon.status}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${salon.verificationStatus.toLowerCase()}`}>
                    {salon.verificationStatus}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn outline sm"
                    onClick={() => {
                      setSelectedSalon(salon);
                      setReviewNotes(salon.notes || "");
                    }}
                  >
                    <Eye size={13} /> {salon.status === "PENDING" ? "Verify Docs" : "Manage"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part 6 Salon Verification Workflow Modal */}
      {selectedSalon && (
        <div className="admin-modal-overlay" onClick={() => setSelectedSalon(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "720px" }}>
            <div className="admin-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Store size={20} style={{ color: "var(--admin-blue)" }} />
                <div>
                  <h3 style={{ margin: 0 }}>Salon Application & Premises Audit</h3>
                  <small style={{ color: "var(--admin-text-muted)" }}>ID: #{selectedSalon.id} · {selectedSalon.name}</small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Top Banner */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                <img
                  src={selectedSalon.coverImage}
                  alt={selectedSalon.name}
                  style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "18px", color: "var(--admin-navy)" }}>{selectedSalon.name}</h4>
                    <span className={`admin-badge ${selectedSalon.status.toLowerCase()}`}>
                      {selectedSalon.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    📍 {selectedSalon.address}, {selectedSalon.city} (PIN: {selectedSalon.pinCode})
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--admin-navy)" }}>
                    Owner: <strong>{selectedSalon.ownerName}</strong> · Phone: {selectedSalon.phone} · Email: {selectedSalon.email}
                  </p>
                </div>
              </div>

              {/* Gallery Preview */}
              <div>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--admin-navy)", marginBottom: "8px" }}>
                  Submitted Premises Photographs ({selectedSalon.gallery?.length || 1} images)
                </strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  <img
                    src={selectedSalon.coverImage}
                    alt="Main Interior"
                    style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--admin-border)" }}
                  />
                  {(selectedSalon.gallery || []).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Gallery ${i}`}
                      style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--admin-border)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Compliance Documents */}
              <div>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--admin-navy)", marginBottom: "8px" }}>
                  Verification & Compliance Documentation:
                </strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(selectedSalon.documents || []).map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "#ffffff",
                        border: "1px solid var(--admin-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={16} style={{ color: "var(--admin-blue)" }} />
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>{doc.name}</span>
                      </div>
                      <span className={`admin-badge ${doc.verified ? "verified" : "warning"}`}>
                        {doc.verified ? "Verified Authenticity" : "Needs Review"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Auditor Notes */}
              <div className="admin-form-group">
                <label>Internal Review & Audit Notes</label>
                <textarea
                  rows="3"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record premises condition, hygiene verification check, or reason for additional information request..."
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--admin-border)",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn outline"
                onClick={() => setSelectedSalon(null)}
              >
                Close
              </button>

              {selectedSalon.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    className="admin-btn outline"
                    style={{ color: "#d97706", borderColor: "#fde68a" }}
                    onClick={() => setConfirmDialog({ action: "INFO", salon: selectedSalon })}
                  >
                    Request More Info
                  </button>

                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => setConfirmDialog({ action: "REJECT", salon: selectedSalon })}
                  >
                    Reject Application
                  </button>

                  <button
                    type="button"
                    className="admin-btn success"
                    onClick={() => setConfirmDialog({ action: "APPROVE", salon: selectedSalon })}
                  >
                    ✓ Approve & Onboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-card" style={{ maxWidth: "440px" }}>
            <div className="admin-modal-header">
              <h3>Confirm Audit Decision</h3>
              <button type="button" onClick={() => setConfirmDialog(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ margin: 0, fontSize: "14px", color: "var(--admin-navy)", lineHeight: 1.5 }}>
                Are you sure you want to{" "}
                <strong>{confirmDialog.action === "APPROVE" ? "APPROVE" : confirmDialog.action === "REJECT" ? "REJECT" : "REQUEST INFO FOR"}</strong>{" "}
                <strong>{confirmDialog.salon.name}</strong>?
              </p>
              {confirmDialog.action === "APPROVE" && (
                <small style={{ color: "#059669", display: "block" }}>
                  This will grant the salon full live listing rights on Glow & Grace, enabling patrons to book chairs immediately.
                </small>
              )}
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn outline" onClick={() => setConfirmDialog(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={`admin-btn ${confirmDialog.action === "APPROVE" ? "success" : confirmDialog.action === "REJECT" ? "danger" : "primary"}`}
                onClick={() => handleExecuteVerification(confirmDialog.action, confirmDialog.salon.id)}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New Salon Modal */}
      {showOnboardModal && (
        <div className="admin-modal-overlay" onClick={() => setShowOnboardModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className="admin-modal-header">
              <h3>Onboard Enterprise Salon Venue</h3>
              <button type="button" onClick={() => setShowOnboardModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSalon}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Salon Trading Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Groom Studio"
                    value={newSalonForm.name}
                    onChange={(e) => setNewSalonForm({ ...newSalonForm, name: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Owner Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Nambiar"
                      value={newSalonForm.ownerName}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, ownerName: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Styling Chairs Count *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      value={newSalonForm.chairsCount}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, chairsCount: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="owner@salon.com"
                      value={newSalonForm.email}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, email: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={newSalonForm.phone}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, phone: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Full Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 54, 100 Feet Road, Indiranagar"
                    value={newSalonForm.address}
                    onChange={(e) => setNewSalonForm({ ...newSalonForm, address: e.target.value })}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={newSalonForm.city}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, city: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>PIN Code</label>
                    <input
                      type="text"
                      value={newSalonForm.pinCode}
                      onChange={(e) => setNewSalonForm({ ...newSalonForm, pinCode: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn outline" onClick={() => setShowOnboardModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  Save & Approve Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
