import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Image,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Upload
} from 'lucide-react';
import { saveProSalon } from '../proData';

export default function ProSalonProfilePage() {
  const { salon, setSalon } = useOutletContext();
  const [form, setForm] = useState({ ...salon });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSalon(form);
    saveProSalon(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Profile & Public Information</h1>
          <p className="pro-page-subtitle">
            Manage your salon's public brand coordinates, photography gallery, contact details and customer bio.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href={`/salon/${salon.id}`}
            target="_blank"
            rel="noreferrer"
            className="pro-btn pro-btn-secondary"
          >
            <span>View Public Page</span>
            <ExternalLink size={14} />
          </a>
          <button onClick={handleSubmit} className="pro-btn pro-btn-primary">
            <Save size={16} /> Save Profile
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          background: '#D1FAE5',
          border: '1px solid #10B981',
          color: '#065F46',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} color="#10B981" />
          Salon profile successfully saved! Public listing information has been updated.
        </div>
      )}

      {/* Sensitive verification notice */}
      <div style={{
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#1E40AF',
        fontSize: '0.86rem'
      }}>
        <ShieldCheck size={20} color="#0879E8" style={{ flexShrink: 0 }} />
        <div>
          <strong>Verified Salon Partner Status: Active</strong>
          <p style={{ margin: '2px 0 0', color: '#1E3A8A' }}>
            Core legal credentials (GST registration, Trade license and settlement bank coordinates) are managed via Admin Auditing. Any requested bank account or legal entity updates will require lead auditor verification.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Brand Details */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={18} color="var(--pro-blue)" />
              Basic Salon Coordinates & Branding
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="pro-form-group">
              <label className="pro-form-label">Public Salon Name</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Owner / Managing Partner Name</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Customer Contact Phone</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Official Inquiries Email</label>
              <input
                type="email"
                required
                className="pro-form-input"
                value={form.ownerEmail}
                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="pro-form-group">
            <label className="pro-form-label">Salon Public Description</label>
            <textarea
              rows="3"
              className="pro-form-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Location & Address */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--pro-orange)" />
              Address & Geographical Location
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="pro-form-group">
              <label className="pro-form-label">Street Address</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Prominent Landmark</label>
              <input
                type="text"
                className="pro-form-input"
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">City</label>
              <input
                type="text"
                className="pro-form-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">PIN Code</label>
              <input
                type="text"
                className="pro-form-input"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Photography Showcase */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={18} color="var(--pro-blue)" />
              Premises Photography & Gallery
            </h3>
          </div>

          <div className="pro-form-group">
            <label className="pro-form-label">Cover Showcase Photo URL</label>
            <input
              type="text"
              className="pro-form-input"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {(form.gallery || []).map((img, idx) => (
              <div key={idx} style={{ position: 'relative', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--pro-border)' }}>
                <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details & Payout History (BAR-071, BAR-072) */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--pro-blue)" />
              Settlement Bank Account & Payout History
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="pro-form-group">
              <label className="pro-form-label">Settlement Bank Name</label>
              <input type="text" className="pro-form-input" value="HDFC Bank" disabled style={{ background: '#f8fafc' }} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Account Number</label>
              <input type="text" className="pro-form-input" value="•••• •••• 8912" disabled style={{ background: '#f8fafc' }} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">IFSC Code</label>
              <input type="text" className="pro-form-input" value="HDFC0001234" disabled style={{ background: '#f8fafc' }} />
            </div>
          </div>

          <div style={{ background: 'var(--pro-bg)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--pro-navy)' }}>Recent Settlement Payouts</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid var(--pro-border-subtle)' }}>
              <span>Nov 10, 2026 (Weekly Settlement)</span>
              <strong style={{ color: '#059669' }}>₹48,500 Completed</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0' }}>
              <span>Nov 03, 2026 (Weekly Settlement)</span>
              <strong style={{ color: '#059669' }}>₹52,200 Completed</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="pro-btn pro-btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
