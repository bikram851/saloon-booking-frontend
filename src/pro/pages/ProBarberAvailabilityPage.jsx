import React, { useState } from 'react';
import {
  UserCheck,
  Clock,
  Calendar,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
  UserX
} from 'lucide-react';
import { getProBarbers, saveProBarbers } from '../proData';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ProBarberAvailabilityPage() {
  const [barbers, setBarbers] = useState(getProBarbers());
  const [selectedBarberId, setSelectedBarberId] = useState(barbers[0]?.id || 1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentBarber = barbers.find(b => b.id === selectedBarberId) || barbers[0];

  const handleUpdateStatus = (status) => {
    const updated = barbers.map(b => b.id === selectedBarberId ? { ...b, status } : b);
    setBarbers(updated);
    saveProBarbers(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleUpdateField = (field, value) => {
    const updated = barbers.map(b => b.id === selectedBarberId ? { ...b, [field]: value } : b);
    setBarbers(updated);
    saveProBarbers(updated);
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Stylist Availability & Shift Schedules</h1>
          <p className="pro-page-subtitle">
            Configure individual stylist working hours, designated weekly offs, break periods, and real-time station shifts.
          </p>
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
          Shift schedule updated for {currentBarber.name}. Customer slot availability has updated in real-time.
        </div>
      )}

      {/* Stylist Selector Pills */}
      <div className="pro-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--pro-text-muted)', display: 'block', marginBottom: '0.75rem' }}>
          Select Stylist to Configure:
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {barbers.map(barber => {
            const isSelected = barber.id === selectedBarberId;
            return (
              <button
                key={barber.id}
                onClick={() => setSelectedBarberId(barber.id)}
                className="pro-btn"
                style={{
                  background: isSelected ? 'var(--pro-navy)' : 'var(--pro-bg)',
                  color: isSelected ? '#FFFFFF' : 'var(--pro-text)',
                  border: '1px solid ' + (isSelected ? 'var(--pro-navy)' : 'var(--pro-border)'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.5rem 1rem'
                }}
              >
                <img
                  src={barber.image}
                  alt={barber.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span>{barber.name}</span>
                <span className={`pro-badge ${barber.status === 'ON_DUTY' ? 'onduty' : barber.status === 'BREAK' ? 'break' : 'offduty'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  {barber.status === 'ON_DUTY' ? 'On Duty' : barber.status === 'BREAK' ? 'Break' : 'Off'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Real-Time Shift Status Card */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="var(--pro-blue)" />
              Real-Time Shift Status ({currentBarber.name})
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)', marginBottom: '1.25rem' }}>
            Toggle live chair status. Stylists on break or off-duty are automatically filtered out from customer booking slot generation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '1rem',
              borderRadius: '8px',
              border: currentBarber.status === 'ON_DUTY' ? '2px solid #10B981' : '1px solid var(--pro-border)',
              background: currentBarber.status === 'ON_DUTY' ? '#ECFDF5' : '#FFFFFF',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="barberStatus"
                checked={currentBarber.status === 'ON_DUTY'}
                onChange={() => handleUpdateStatus('ON_DUTY')}
                style={{ accentColor: '#10B981' }}
              />
              <div>
                <strong style={{ color: '#065F46', display: 'block', fontSize: '0.92rem' }}>
                  🟢 On Duty & Active
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>
                  Chair ready to accept online bookings and walk-ins.
                </span>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '1rem',
              borderRadius: '8px',
              border: currentBarber.status === 'BREAK' ? '2px solid #F59E0B' : '1px solid var(--pro-border)',
              background: currentBarber.status === 'BREAK' ? '#FFFBEB' : '#FFFFFF',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="barberStatus"
                checked={currentBarber.status === 'BREAK'}
                onChange={() => handleUpdateStatus('BREAK')}
                style={{ accentColor: '#F59E0B' }}
              />
              <div>
                <strong style={{ color: '#92400E', display: 'block', fontSize: '0.92rem' }}>
                  ☕ Quick Break
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>
                  Temporarily paused. Customers cannot book immediate slots.
                </span>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '1rem',
              borderRadius: '8px',
              border: currentBarber.status === 'OFF_DUTY' ? '2px solid #EF4444' : '1px solid var(--pro-border)',
              background: currentBarber.status === 'OFF_DUTY' ? '#FEF2F2' : '#FFFFFF',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="barberStatus"
                checked={currentBarber.status === 'OFF_DUTY'}
                onChange={() => handleUpdateStatus('OFF_DUTY')}
                style={{ accentColor: '#EF4444' }}
              />
              <div>
                <strong style={{ color: '#991B1B', display: 'block', fontSize: '0.92rem' }}>
                  🔴 Off Duty
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>
                  Station closed for the rest of today.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Regular Shift Configuration */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--pro-orange)" />
              Daily Shift Hours & Weekly Off
            </h3>
          </div>

          <div className="pro-form-group">
            <label className="pro-form-label">Weekly Off Day:</label>
            <select
              className="pro-form-select"
              value={currentBarber.weeklyOff || 'Monday'}
              onChange={(e) => handleUpdateField('weeklyOff', e.target.value)}
            >
              {DAYS.map(day => (
                <option key={day} value={day}>{day} (Station Closed)</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="pro-form-group">
              <label className="pro-form-label">Shift Start Time:</label>
              <input
                type="time"
                className="pro-form-input"
                value={currentBarber.shiftStart || '09:00'}
                onChange={(e) => handleUpdateField('shiftStart', e.target.value)}
              />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Shift End Time:</label>
              <input
                type="time"
                className="pro-form-input"
                value={currentBarber.shiftEnd || '18:00'}
                onChange={(e) => handleUpdateField('shiftEnd', e.target.value)}
              />
            </div>
          </div>

          <div style={{ background: 'var(--pro-bg)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pro-navy)', display: 'block' }}>
              "Any Available Stylist" Assignment Logic:
            </span>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--pro-text-muted)', lineHeight: 1.5 }}>
              When customers select "Any Barber" during booking, the algorithm automatically dispatches the appointment to on-duty stylists with the lowest load at that time slot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
