import React, { useState } from "react";
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Coins,
  X,
  Sparkles,
} from "lucide-react";
import {
  getStoredAdminOffers,
  saveStoredAdminOffers,
} from "../adminData";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(getStoredAdminOffers);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formError, setFormError] = useState("");

  const [newOffer, setNewOffer] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minBookingAmount: 1000,
    maxDiscount: 500,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    applicableSalons: "All Salons",
    usageLimit: 200,
  });

  const activeOffers = offers.filter((o) => o.status === "ACTIVE");
  const totalRedemptions = offers.reduce((acc, o) => acc + (o.usedCount || 0), 0);

  function handleToggleStatus(offerId, currentStatus) {
    const nextStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const updated = offers.map((o) => (o.id === offerId ? { ...o, status: nextStatus } : o));
    setOffers(updated);
    saveStoredAdminOffers(updated);
  }

  function handleDelete(offerId) {
    const updated = offers.filter((o) => o.id !== offerId);
    setOffers(updated);
    saveStoredAdminOffers(updated);
    setDeleteConfirm(null);
  }

  function handleCreateOffer(e) {
    e.preventDefault();
    setFormError("");
    if (!newOffer.code.trim() || !newOffer.title.trim()) return;

    if (newOffer.startDate && newOffer.endDate && newOffer.endDate < newOffer.startDate) {
      setFormError("End date must be on or after start date.");
      return;
    }

    const created = {
      id: "off_" + (offers.length + 1),
      code: newOffer.code.toUpperCase().trim(),
      title: newOffer.title,
      description: newOffer.description,
      discountType: newOffer.discountType,
      discountValue: Number(newOffer.discountValue),
      minBookingAmount: Number(newOffer.minBookingAmount),
      maxDiscount: Number(newOffer.maxDiscount),
      startDate: newOffer.startDate,
      endDate: newOffer.endDate,
      applicableSalons: newOffer.applicableSalons,
      usageLimit: Number(newOffer.usageLimit),
      usedCount: 0,
      status: "ACTIVE",
    };

    const updated = [created, ...offers];
    setOffers(updated);
    saveStoredAdminOffers(updated);
    setShowCreateModal(false);
    setNewOffer({
      code: "",
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minBookingAmount: 1000,
      maxDiscount: 500,
      startDate: "2026-11-01",
      endDate: "2026-12-31",
      applicableSalons: "All Salons",
      usageLimit: 200,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">CAMPAIGNS & COUPON MANAGEMENT</span>
          <h1 className="admin-page-title">Offers & Promotions</h1>
          <p className="admin-page-subtitle">
            Configure member discount campaigns, coupon usage limits, and promotional redemption tracking.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn orange"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} /> + Create New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Active Live Coupons</h4>
            <div className="kpi-icon-wrap orange">
              <Tag size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{activeOffers.length} Campaigns</span>
          </div>
          <p className="kpi-caption">Active promotional codes</p>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Total Redemptions</h4>
            <div className="kpi-icon-wrap green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalRedemptions}</span>
          </div>
          <p className="kpi-caption">Redeemed by verified patrons</p>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Top Redeemed Coupon</h4>
            <div className="kpi-icon-wrap blue">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">WELCOME50</span>
          </div>
          <p className="kpi-caption">420 total redemptions</p>
        </div>
      </div>

      {/* Offers Listing Table */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Campaign Title</th>
              <th>Discount Type & Value</th>
              <th>Min Booking</th>
              <th>Max Cap</th>
              <th>Validity Window</th>
              <th>Redemptions / Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "800",
                      background: "#fff7ed",
                      color: "var(--admin-orange)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px dashed #fdba74",
                      fontSize: "13px",
                    }}
                  >
                    {offer.code}
                  </span>
                </td>
                <td>
                  <strong style={{ fontSize: "13.5px" }}>{offer.title}</strong>
                  <small style={{ display: "block", color: "var(--admin-text-muted)" }}>{offer.description}</small>
                </td>
                <td>
                  <strong>
                    {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} FLAT OFF`}
                  </strong>
                </td>
                <td>₹{offer.minBookingAmount}</td>
                <td>₹{offer.maxDiscount}</td>
                <td>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {offer.startDate} to {offer.endDate}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <strong>{offer.usedCount} / {offer.usageLimit}</strong>
                    <div className="progress-track" style={{ height: "4px", width: "90px" }}>
                      <div
                        className="progress-fill orange"
                        style={{ width: `${Math.min(100, ((offer.usedCount || 0) / offer.usageLimit) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${offer.status.toLowerCase()}`}>
                    {offer.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      className={`admin-btn sm ${offer.status === "ACTIVE" ? "outline" : "success"}`}
                      onClick={() => handleToggleStatus(offer.id, offer.status)}
                    >
                      {offer.status === "ACTIVE" ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      className="admin-btn danger sm"
                      onClick={() => setDeleteConfirm(offer)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: "420px" }}>
            <div className="admin-modal-header">
              <h3>Delete Campaign</h3>
              <button type="button" onClick={() => setDeleteConfirm(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p style={{ margin: 0, fontSize: "14px", color: "var(--admin-navy)" }}>
                Are you sure you want to permanently delete coupon <strong>{deleteConfirm.code}</strong> ({deleteConfirm.title})?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button type="button" className="admin-btn danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete Coupon</button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Offer Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
            <div className="admin-modal-header">
              <h3>Create Promotional Campaign</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleCreateOffer}>
              <div className="admin-modal-body">
                {formError && (
                  <div style={{
                    padding: "10px 14px",
                    background: "#FEF2F2",
                    border: "1px solid #EF4444",
                    color: "#B91C1C",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "12px"
                  }}>
                    {formError}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FESTIVE30"
                      value={newOffer.code}
                      onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                      style={{ textTransform: "uppercase", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Type *</label>
                    <select
                      value={newOffer.discountType}
                      onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value })}
                      className="admin-select"
                      style={{ width: "100%", height: "42px" }}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Flat Fixed (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Campaign Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festive Grooming Special"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Campaign Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat discount on haircut and beard trim combos"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div className="admin-form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={newOffer.discountValue}
                      onChange={(e) => setNewOffer({ ...newOffer, discountValue: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Min Booking (₹)</label>
                    <input
                      type="number"
                      required
                      value={newOffer.minBookingAmount}
                      onChange={(e) => setNewOffer({ ...newOffer, minBookingAmount: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Max Cap (₹)</label>
                    <input
                      type="number"
                      required
                      value={newOffer.maxDiscount}
                      onChange={(e) => setNewOffer({ ...newOffer, maxDiscount: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newOffer.startDate}
                      onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newOffer.endDate}
                      onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn orange">Publish Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
