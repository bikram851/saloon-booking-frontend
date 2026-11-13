import React, { useState } from "react";
import { Scissors, Plus, Search, Tag, Check, Edit2, Trash2 } from "lucide-react";
import { defaultMockServices } from "../../api";

export default function AdminServicesPage() {
  const [services, setServices] = useState(defaultMockServices);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    price: 950,
    durationMinutes: 45,
    category: "Hair",
    description: "",
  });

  const categories = ["ALL", "Hair", "Skin", "Beard", "Spa", "Massage", "Nails"];

  const filtered = services.filter((s) => {
    if (categoryFilter !== "ALL" && s.category !== categoryFilter) return false;
    return true;
  });

  function handleAddService(e) {
    e.preventDefault();
    if (!newService.name.trim()) return;

    const created = {
      id: services.length + 1,
      name: newService.name,
      price: Number(newService.price),
      durationMinutes: Number(newService.durationMinutes),
      category: newService.category,
      description: newService.description,
    };

    setServices([created, ...services]);
    setShowAddModal(false);
    setNewService({ name: "", price: 950, durationMinutes: 45, category: "Hair", description: "" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">CATALOG & PRICING REGISTRY</span>
          <h1 className="admin-page-title">Services & Treatment Menu</h1>
          <p className="admin-page-subtitle">
            Global catalog of haircuts, beauty therapies, and standardized pricing tiers.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="admin-btn primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> + Add New Service
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`admin-btn sm ${categoryFilter === c ? "primary" : "outline"}`}
            onClick={() => setCategoryFilter(c)}
            style={{ borderRadius: "999px", padding: "6px 16px" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {filtered.map((item) => (
          <div key={item.id} className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="admin-badge blue">{item.category}</span>
                <strong style={{ fontSize: "18px", color: "var(--admin-navy)" }}>₹{item.price}</strong>
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--admin-navy)" }}>{item.name}</h4>
              <p style={{ margin: 0, fontSize: "12.5px", color: "var(--admin-text-muted)", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>⏱️ {item.durationMinutes} minutes</span>
              <span className="admin-badge success">Active Listing</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className="admin-modal-header">
              <h3>Create Service Catalog Entry</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleAddService}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keratin Hair Spa & Scalp Detox"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Duration (Minutes) *</label>
                    <input
                      type="number"
                      required
                      value={newService.durationMinutes}
                      onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="admin-select"
                    style={{ width: "100%" }}
                  >
                    {categories.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Detailed steps included in this ritual..."
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "13px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn primary">Save & Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
