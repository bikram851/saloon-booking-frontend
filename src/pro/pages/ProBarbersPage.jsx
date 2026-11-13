import React, { useState } from 'react';
import {
  Users,
  Plus,
  Star,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Upload,
  UserCheck,
  Scissors
} from 'lucide-react';
import { getProBarbers, saveProBarbers } from '../proData';

export default function ProBarbersPage() {
  const [barbers, setBarbers] = useState(getProBarbers());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  const [form, setForm] = useState({
    name: '',
    role: '',
    specialization: '',
    chair: 'Chair #1',
    experience: 4,
    phone: '+91 98765 00000',
    email: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    active: true,
    status: 'ON_DUTY'
  });

  const handleOpenAdd = () => {
    setEditingBarber(null);
    setForm({
      name: '',
      role: 'Stylist',
      specialization: 'Haircuts & Styling',
      chair: `Chair #${barbers.length + 1}`,
      experience: 3,
      phone: '+91 98765 00000',
      email: '',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      active: true,
      status: 'ON_DUTY'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (barber) => {
    setEditingBarber(barber);
    setForm({
      name: barber.name,
      role: barber.role,
      specialization: barber.specialization,
      chair: barber.chair,
      experience: barber.experience,
      phone: barber.phone,
      email: barber.email,
      image: barber.image,
      active: barber.active,
      status: barber.status
    });
    setModalOpen(true);
  };

  const handleToggleActive = (id) => {
    const updated = barbers.map(b => b.id === id ? { ...b, active: !b.active } : b);
    setBarbers(updated);
    saveProBarbers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingBarber) {
      const updated = barbers.map(b => b.id === editingBarber.id ? { ...b, ...form } : b);
      setBarbers(updated);
      saveProBarbers(updated);
    } else {
      const newBarber = {
        id: Date.now(),
        ...form,
        rating: 4.9,
        reviewsCount: 0,
        weeklyOff: 'Monday',
        shiftStart: '09:00',
        shiftEnd: '19:00'
      };
      const updated = [...barbers, newBarber];
      setBarbers(updated);
      saveProBarbers(updated);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Barber & Stylist Team</h1>
          <p className="pro-page-subtitle">
            Manage your resident stylists, assign barber chairs, update specializations and control online booking status.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="pro-btn pro-btn-primary">
          <Plus size={16} /> Add New Barber
        </button>
      </div>

      {/* Barbers Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {barbers.map(barber => (
          <div key={barber.id} className="pro-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={barber.image}
                  alt={barber.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '2px solid var(--pro-border)'
                  }}
                />
                <div>
                  <h3 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', color: 'var(--pro-navy)' }}>
                    {barber.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--pro-text-muted)', fontWeight: 500 }}>
                    {barber.role}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#D97706', marginTop: '4px' }}>
                    <Star size={13} fill="#D97706" />
                    <strong>{barber.rating}</strong>
                    <span style={{ color: 'var(--pro-text-muted)' }}>({barber.reviewsCount || 45} reviews)</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--pro-bg)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--pro-text-muted)' }}>Specialization:</span>
                  <strong style={{ color: 'var(--pro-navy)' }}>{barber.specialization}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--pro-text-muted)' }}>Experience:</span>
                  <span>{barber.experience} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--pro-text-muted)' }}>Assigned Chair:</span>
                  <span>{barber.chair}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} /> {barber.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} /> {barber.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pro-border-subtle)', paddingTop: '0.85rem' }}>
              <button
                type="button"
                onClick={() => handleToggleActive(barber.id)}
                className={`pro-btn pro-btn-sm ${barber.active ? '' : 'pro-btn-danger'}`}
                style={{
                  background: barber.active ? '#D1FAE5' : '#FEE2E2',
                  color: barber.active ? '#065F46' : '#991B1B',
                  border: 'none'
                }}
              >
                {barber.active ? 'Accepting Bookings' : 'Deactivated'}
              </button>

              <button
                onClick={() => handleOpenEdit(barber)}
                className="pro-btn pro-btn-secondary pro-btn-sm"
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Barber Modal */}
      {modalOpen && (
        <div className="pro-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="pro-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pro-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--pro-navy)' }}>
                {editingBarber ? 'Edit Stylist Profile' : 'Add New Barber to Salon Team'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pro-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="pro-form-group">
                <label className="pro-form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="pro-form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pro-form-group">
                  <label className="pro-form-label">Title / Role</label>
                  <input
                    type="text"
                    required
                    className="pro-form-input"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Master Stylist"
                  />
                </div>
                <div className="pro-form-group">
                  <label className="pro-form-label">Assigned Chair / Station</label>
                  <input
                    type="text"
                    className="pro-form-input"
                    value={form.chair}
                    onChange={(e) => setForm({ ...form, chair: e.target.value })}
                    placeholder="e.g. Chair #1"
                  />
                </div>
              </div>

              <div className="pro-form-group">
                <label className="pro-form-label">Specialization</label>
                <input
                  type="text"
                  className="pro-form-input"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="e.g. Creative Balayage, Precision Fades"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pro-form-group">
                  <label className="pro-form-label">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    className="pro-form-input"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                  />
                </div>
                <div className="pro-form-group">
                  <label className="pro-form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="pro-form-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="pro-form-group">
                <label className="pro-form-label">Profile Image URL</label>
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
                  {editingBarber ? 'Update Barber' : 'Create Barber Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
