import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Coffee,
  Sun,
  ShieldCheck
} from 'lucide-react';
import {
  getProWorkingHours,
  saveProWorkingHours,
  getProSalon,
  saveProSalon
} from '../proData';

export default function ProWorkingHoursPage() {
  const { salon, setSalon } = useOutletContext();
  const [hours, setHours] = useState(getProWorkingHours());
  const [temporaryClosure, setTemporaryClosure] = useState(salon.status === 'CLOSED');
  const [closureReason, setClosureReason] = useState(salon.temporaryClosureReason || '');
  const [holidayNotice, setHolidayNotice] = useState(salon.exceptionalNotice || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTimeChange = (index, field, value) => {
    const updated = [...hours];
    updated[index][field] = value;
    setHours(updated);
  };

  const handleToggleClosedDay = (index) => {
    const updated = [...hours];
    updated[index].isClosed = !updated[index].isClosed;
    setHours(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // BAR-028: Validate opening time earlier than closing time
    for (const d of hours) {
      if (!d.isClosed) {
        if (!d.open || !d.close) {
          setErrorMessage(`Please provide valid open and close times for ${d.day}.`);
          return;
        }
        if (d.open >= d.close) {
          setErrorMessage(`Opening time must be earlier than closing time for ${d.day}.`);
          return;
        }
      }
    }

    saveProWorkingHours(hours);

    const updatedSalon = {
      ...salon,
      status: temporaryClosure ? 'CLOSED' : 'OPEN',
      temporaryClosureReason: temporaryClosure ? closureReason : '',
      exceptionalNotice: holidayNotice
    };
    setSalon(updatedSalon);
    saveProSalon(updatedSalon);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Working Hours & Availability</h1>
          <p className="pro-page-subtitle">
            Configure weekly operating schedules, break windows, holiday timings and temporary salon closures.
          </p>
        </div>
        <button onClick={handleSave} className="pro-btn pro-btn-primary">
          <Save size={16} /> Save Hours
        </button>
      </div>

      {errorMessage && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #EF4444',
          color: '#B91C1C',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <AlertTriangle size={20} color="#DC2626" />
          {errorMessage}
        </div>
      )}

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
          Salon working hours updated successfully! Changes are immediately reflected in customer booking slots.
        </div>
      )}

      {/* Temporary Closure Emergency Control */}
      <div className="pro-card" style={{
        borderLeft: temporaryClosure ? '4px solid #EF4444' : '4px solid #10B981',
        background: temporaryClosure ? '#FEF2F2' : '#FFFFFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--pro-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color={temporaryClosure ? '#DC2626' : '#10B981'} />
              Temporary Salon Closure Toggle
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--pro-text-muted)' }}>
              Pause all incoming online appointments immediately (for renovations, power outage, or private events).
            </p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={temporaryClosure}
              onChange={(e) => setTemporaryClosure(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#EF4444' }}
            />
            {temporaryClosure ? 'Salon Temporarily Closed' : 'Salon is Open & Operating'}
          </label>
        </div>

        {temporaryClosure && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #FECACA', paddingTop: '1rem' }}>
            <label className="pro-form-label">Closure Notice Displayed to Customers:</label>
            <input
              type="text"
              className="pro-form-input"
              placeholder="e.g. Closed for scheduled electrical maintenance until 3 PM today."
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        )}
      </div>

      {/* Weekly Schedule Configuration */}
      <div className="pro-card">
        <div className="pro-card-header">
          <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--pro-blue)" />
            Standard Weekly Operating Hours
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>
            All times in IST (Indian Standard Time)
          </span>
        </div>

        <div className="pro-table-wrapper" style={{ border: 'none' }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th style={{ width: '140px' }}>Day</th>
                <th>Status</th>
                <th>Opening Time</th>
                <th>Closing Time</th>
                <th>Daily Break Window</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((row, idx) => (
                <tr key={row.day} style={{ background: row.isClosed ? 'var(--pro-bg)' : '#FFFFFF' }}>
                  <td style={{ fontWeight: 700, color: 'var(--pro-navy)' }}>
                    {row.day}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleClosedDay(idx)}
                      className={`pro-btn pro-btn-sm ${row.isClosed ? 'pro-btn-danger' : ''}`}
                      style={{
                        background: row.isClosed ? '#FEE2E2' : '#D1FAE5',
                        color: row.isClosed ? '#991B1B' : '#065F46',
                        border: 'none'
                      }}
                    >
                      {row.isClosed ? 'Closed Today' : 'Open'}
                    </button>
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.openTime}
                      disabled={row.isClosed}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className="pro-form-input"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={row.closeTime}
                      disabled={row.isClosed}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className="pro-form-input"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="time"
                        value={row.breakStart}
                        disabled={row.isClosed}
                        onChange={(e) => handleTimeChange(idx, 'breakStart', e.target.value)}
                        className="pro-form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: '110px' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>to</span>
                      <input
                        type="time"
                        value={row.breakEnd}
                        disabled={row.isClosed}
                        onChange={(e) => handleTimeChange(idx, 'breakEnd', e.target.value)}
                        className="pro-form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: '110px' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holiday / Special Occasion Hours Notice */}
      <div className="pro-card">
        <div className="pro-card-header">
          <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--pro-orange)" />
            Special Holiday or Festival Schedule Notice
          </h3>
        </div>
        <div className="pro-form-group">
          <label className="pro-form-label">Customer Notice Banner (Optional):</label>
          <input
            type="text"
            className="pro-form-input"
            placeholder="e.g. Diwali special hours: Open from 08:00 AM to 10:00 PM on Nov 1st."
            value={holidayNotice}
            onChange={(e) => setHolidayNotice(e.target.value)}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>
            This message will appear prominently on your salon listing and booking slot selector.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button onClick={handleSave} className="pro-btn pro-btn-primary">
            <Save size={16} /> Save Working Hours
          </button>
        </div>
      </div>
    </div>
  );
}
