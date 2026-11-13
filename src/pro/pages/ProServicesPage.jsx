import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Filter,
  Sparkles
} from 'lucide-react';
import { getProServices, saveProServices } from '../proData';

const CATEGORIES = [
  "All",
  "Hair",
  "Beard and Grooming",
  "Skin Care",
  "Facial and Beauty",
  "Massage and Spa",
  "Premium Packages"
];

export default function ProServicesPage() {
  const [services, setServices] = useState(getProServices());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Hair',
    price: 1200,
    durationMinutes: 45,
    description: '',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    active: true
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      name: '',
      category: 'Hair',
      price: 1200,
      durationMinutes: 45,
      description: '',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setForm({
      name: svc.name,
      category: svc.category,
      price: svc.price,
      durationMinutes: svc.durationMinutes,
      description: svc.description,
      image: svc.image,
      active: svc.active
    });
    setModalOpen(true);
  };

  const handleToggleActive = (id) => {
    const updated = services.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setServices(updated);
    saveProServices(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingService) {
      const updated = services.map(s => s.id === editingService.id ? { ...s, ...form } : s);
      setServices(updated);
      saveProServices(updated);
    } else {
      const newService = {
        id: Date.now(),
        ...form,
        bookingsCount: 0
      };
      const updated = [...services, newService];
      setServices(updated);
      saveProServices(updated);
    }
    setModalOpen(false);
  };

  const filtered = services.filter(s => {
    if (selectedCategory === "All") return true;
    return s.category === selectedCategory;
  });

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Services & Menu Catalog</h1>
          <p className="pro-page-subtitle">
            Curate your salon treatment menu, set bespoke pricing, durations and category classifications.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="pro-btn pro-btn-primary">
          <Plus size={16} /> Add Salon Service
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="pro-card" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pro-text-muted)', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Category:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="pro-btn pro-btn-sm"
              style={{
                background: selectedCategory === cat ? 'var(--pro-navy)' : 'var(--pro-bg)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--pro-text)',
                border: '1px solid ' + (selectedCategory === cat ? 'var(--pro-navy)' : 'var(--pro-border)')
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(svc => (
          <div key={svc.id} className="pro-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ position: 'relative', height: '160px' }}>
                <img
                  src={svc.image}
                  alt={svc.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(9, 43, 82, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600
                  }}
                >
                  {svc.category}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: '#FFFFFF',
                    color: 'var(--pro-navy)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  ₹{svc.price}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--pro-navy)' }}>
                  {svc.name}
                </h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: 'var(--pro-text-muted)', lineHeight: 1.4 }}>
                  {svc.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--pro-text-muted)', borderTop: '1px solid var(--pro-border-subtle)', paddingTop: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {svc.durationMinutes} mins
                  </span>
                  <span>{svc.bookingsCount || 40}+ bookings</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '0.85rem 1.25rem', background: 'var(--pro-bg)', borderTop: '1px solid var(--pro-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleToggleActive(svc.id)}
                className={`pro-btn pro-btn-sm ${svc.active ? '' : 'pro-btn-danger'}`}
                style={{
                  background: svc.active ? '#D1FAE5' : '#FEE2E2',
                  color: svc.active ? '#065F46' : '#991B1B',
                  border: 'none'
                }}
              >
                {svc.active ? 'Active on Menu' : 'Hidden'}
              </button>

              <button onClick={() => handleOpenEdit(svc)} className="pro-btn pro-btn-secondary pro-btn-sm">
                <Edit2 size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="pro-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="pro-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pro-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--pro-navy)' }}>
                {editingService ? 'Edit Salon Service' : 'Add New Salon Treatment'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pro-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="pro-form-group">
                <label className="pro-form-label">Service Title</label>
                <input
                  type="text"
                  required
                  className="pro-form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Balayage & Gloss Therapy"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pro-form-group">
                  <label className="pro-form-label">Category</label>
                  <select
                    className="pro-form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="pro-form-group">
                  <label className="pro-form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    className="pro-form-input"
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="pro-form-group">
                <label className="pro-form-label">Price (₹ INR)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  className="pro-form-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>

              <div className="pro-form-group">
                <label className="pro-form-label">Description & Highlights</label>
                <textarea
                  rows="3"
                  className="pro-form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe treatment benefits, products used, and customer expectations..."
                />
              </div>

              <div className="pro-form-group">
                <label className="pro-form-label">Cover Photo URL</label>
                <input
                  type="text"
                  className="pro-form-input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--pro-border)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="pro-btn pro-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="pro-btn pro-btn-primary">
                  {editingService ? 'Update Service' : 'Save to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
