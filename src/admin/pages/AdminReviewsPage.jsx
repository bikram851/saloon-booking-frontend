import React, { useState } from "react";
import { Star, ShieldCheck, Trash2, CheckCircle2, MessageSquare, Flag } from "lucide-react";
import { defaultMockReviews } from "../../api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(defaultMockReviews);
  const [filterRating, setFilterRating] = useState("ALL");

  const filtered = reviews.filter((r) => {
    if (filterRating !== "ALL" && Math.floor(r.rating) !== Number(filterRating)) return false;
    return true;
  });

  function handleDelete(id) {
    setReviews(reviews.filter((r) => r.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">PATRON FEEDBACK & MODERATION</span>
          <h1 className="admin-page-title">Reviews & Ratings Moderation</h1>
          <p className="admin-page-subtitle">
            Auditing customer testimonials, service ratings, and moderation flags across all partner salons.
          </p>
        </div>

        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Star Reviews</option>
            <option value="4">4 Star Reviews</option>
            <option value="3">3 Star & Below</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {filtered.map((rev) => (
          <div key={rev.id} className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", color: "var(--admin-blue)", display: "grid", placeItems: "center", fontWeight: "700", fontSize: "12px" }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "var(--admin-navy)" }}>{rev.name}</strong>
                    <small style={{ display: "block", color: "var(--admin-text-muted)" }}>{rev.date}</small>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#f59e0b", fontSize: "13px", fontWeight: "700" }}>
                  <Star size={14} fill="#f59e0b" /> {rev.rating}
                </div>
              </div>

              <p style={{ margin: "10px 0", fontSize: "13px", color: "#334155", fontStyle: "italic", lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              <span className="admin-badge blue">
                ✂️ {rev.service}
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: "700" }}>
                ✓ Verified Patron Booking
              </span>
              <button
                type="button"
                className="admin-btn danger sm"
                onClick={() => handleDelete(rev.id)}
                title="Remove inappropriate review"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
