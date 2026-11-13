import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Store,
  ExternalLink,
  X,
  ChevronRight,
} from "lucide-react";
import {
  getStoredAdminSalons,
  saveStoredAdminSalons,
} from "../adminData";

export default function AdminVerificationPage() {
  const [salons, setSalons] = useState(getStoredAdminSalons);
  const [activeCategory, setActiveCategory] = useState("ALL"); // ALL | UNDER_REVIEW | INFO_REQUIRED | VERIFIED | REJECTED
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditNotes, setAuditNotes] = useState("");

  const newRequests = salons.filter((s) => s.verificationStatus === "UNDER_REVIEW");
  const infoRequired = salons.filter((s) => s.verificationStatus === "INFO_REQUIRED");
  const approvedList = salons.filter((s) => s.verificationStatus === "VERIFIED");
  const rejectedList = salons.filter((s) => s.verificationStatus === "REJECTED");

  const filteredItems = salons.filter((s) => {
    if (activeCategory === "ALL") return true;
    return s.verificationStatus === activeCategory;
  });

  function handleUpdateAudit(action, salonId) {
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
          notes: auditNotes || s.notes,
        };
      }
      return s;
    });

    setSalons(updated);
    saveStoredAdminSalons(updated);
    setSelectedAudit(null);
    setAuditNotes("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">COMPLIANCE & PREMISES AUDITING</span>
          <h1 className="admin-page-title">Verification Request Center</h1>
          <p className="admin-page-subtitle">
            Auditing salon legal licenses, sanitation certificates, and premises compliance before live listing.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {[
          { key: "ALL", label: "All Requests", count: salons.length },
          { key: "UNDER_REVIEW", label: "Under Review", count: newRequests.length, badge: "warning" },
          { key: "INFO_REQUIRED", label: "Info Required", count: infoRequired.length, badge: "info_required" },
          { key: "VERIFIED", label: "Approved & Verified", count: approvedList.length, badge: "success" },
          { key: "REJECTED", label: "Rejected", count: rejectedList.length, badge: "danger" },
        ].map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`admin-btn ${activeCategory === cat.key ? "primary" : "outline"}`}
            onClick={() => setActiveCategory(cat.key)}
            style={{ borderRadius: "999px", padding: "6px 16px", minHeight: "36px", fontSize: "13px" }}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Verification Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {filteredItems.map((s) => (
          <div
            key={s.id}
            className="admin-card"
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className="admin-badge neutral">REQ #{s.id}2026</span>
                <span className={`admin-badge ${s.verificationStatus.toLowerCase()}`}>
                  {s.verificationStatus}
                </span>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <img
                  src={s.coverImage}
                  alt={s.name}
                  style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ margin: "0 0 2px", fontSize: "15px", color: "var(--admin-navy)" }}>{s.name}</h4>
                  <small style={{ color: "var(--admin-text-muted)" }}>Owner: {s.ownerName}</small>
                </div>
              </div>

              <div style={{ marginTop: "12px", background: "#f8fafc", padding: "10px", borderRadius: "8px", fontSize: "12px", color: "#475569" }}>
                <p style={{ margin: "0 0 4px" }}>📍 {s.address}, {s.city}</p>
                <p style={{ margin: 0 }}>📞 {s.phone} · ✉️ {s.email}</p>
              </div>

              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <small style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>
                  Submitted Documents ({s.documents?.length || 1}):
                </small>
                {(s.documents || []).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                    <FileText size={13} style={{ color: "var(--admin-blue)" }} />
                    <span style={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{d.name}</span>
                    <span style={{ color: d.verified ? "#10b981" : "#f59e0b", fontSize: "11px", fontWeight: "700" }}>
                      {d.verified ? "✓ Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>
                Auditor: Compliance Desk #1
              </span>
              <button
                type="button"
                className="admin-btn primary sm"
                onClick={() => {
                  setSelectedAudit(s);
                  setAuditNotes(s.notes || "");
                }}
              >
                Inspect Audit <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="admin-modal-overlay" onClick={() => setSelectedAudit(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "660px" }}>
            <div className="admin-modal-header">
              <h3>Premises & Compliance Audit: {selectedAudit.name}</h3>
              <button type="button" onClick={() => setSelectedAudit(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "14px", color: "var(--admin-navy)" }}>{selectedAudit.name}</strong>
                  <small style={{ display: "block", color: "var(--admin-text-muted)" }}>Owner: {selectedAudit.ownerName} ({selectedAudit.phone})</small>
                </div>
                <span className={`admin-badge ${selectedAudit.verificationStatus.toLowerCase()}`}>
                  {selectedAudit.verificationStatus}
                </span>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--admin-navy)", marginBottom: "8px" }}>
                  Submitted Legal & Regulatory Records:
                </strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(selectedAudit.documents || []).map((doc, idx) => (
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
                        {doc.verified ? "Verified" : "Pending Check"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Auditor Review Findings</label>
                <textarea
                  rows="3"
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Record verification checklist results..."
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

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn outline" onClick={() => setSelectedAudit(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn outline"
                style={{ color: "#d97706", borderColor: "#fde68a" }}
                onClick={() => handleUpdateAudit("INFO", selectedAudit.id)}
              >
                Request Info
              </button>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => handleUpdateAudit("REJECT", selectedAudit.id)}
              >
                Reject
              </button>
              <button
                type="button"
                className="admin-btn success"
                onClick={() => handleUpdateAudit("APPROVE", selectedAudit.id)}
              >
                ✓ Pass Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
