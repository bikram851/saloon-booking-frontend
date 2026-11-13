import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import { getProAppointments, saveProAppointments } from '../proData';

export default function ProAppointmentsPage() {
  const [appointments, setAppointments] = useState(getProAppointments());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppt, setSelectedAppt] = useState(null);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setAppointments(updated);
    saveProAppointments(updated);
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: newStatus });
    }
  };

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.customerName?.toLowerCase().includes(q);
      const matchId = a.id?.toLowerCase().includes(q);
      const matchPhone = a.customerPhone?.includes(q);
      const matchService = a.serviceName?.toLowerCase().includes(q);
      const matchBarber = a.barberName?.toLowerCase().includes(q);
      return matchName || matchId || matchPhone || matchService || matchBarber;
    }
    return true;
  });

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Appointment Management</h1>
          <p className="pro-page-subtitle">
            Receive, review, schedule and complete client appointments for your salon.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pro-card pro-filter-card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div className="pro-filter-row">
          <div className="pro-search-box">
            <Search size={16} color="var(--pro-text-muted)" className="pro-search-icon" />
            <input
              type="text"
              placeholder="Search client, ID, stylist or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pro-form-input pro-search-input"
            />
          </div>

          <div className="pro-filter-pills-scroll">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`pro-btn pro-btn-sm ${statusFilter === status ? 'pro-btn-primary' : 'pro-btn-secondary'}`}
                style={{ flexShrink: 0 }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="pro-card pro-desktop-table-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="pro-table-wrapper" style={{ border: 'none' }}>
          <table className="pro-table" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Client Name & Contact</th>
                <th>Service & Category</th>
                <th>Assigned Stylist</th>
                <th>Date & Slot</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--pro-text-muted)' }}>
                    No appointments matching your criteria found.
                  </td>
                </tr>
              ) : (
                filtered.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--pro-blue)', cursor: 'pointer' }} onClick={() => setSelectedAppt(apt)}>
                        {apt.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--pro-navy)' }}>{apt.customerName}</div>
                      <a href={`tel:${apt.customerPhone}`} style={{ fontSize: '0.78rem', color: 'var(--pro-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Phone size={11} /> {apt.customerPhone}
                      </a>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{apt.serviceName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{apt.duration}</div>
                    </td>
                    <td>
                      <span className="pro-badge onduty">{apt.barberName}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>{apt.time}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{apt.price}
                    </td>
                    <td>
                      <span className={`pro-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedAppt(apt)}
                          className="pro-btn pro-btn-secondary pro-btn-sm"
                          title="View appointment details"
                        >
                          Details
                        </button>
                        {apt.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            className="pro-btn pro-btn-primary pro-btn-sm"
                            title="Accept appointment"
                          >
                            Accept
                          </button>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                            className="pro-btn pro-btn-sm"
                            style={{ background: '#D1FAE5', color: '#065F46', border: 'none' }}
                            title="Mark as completed"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Touch-Friendly Card List View (Visible on <= 768px) */}
      <div className="pro-mobile-card-list">
        {filtered.length === 0 ? (
          <div className="pro-card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--pro-text-muted)' }}>
            No appointments matching your criteria found.
          </div>
        ) : (
          filtered.map(apt => (
            <div key={apt.id} className="pro-card pro-mobile-appt-card">
              <div className="pro-mobile-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="pro-mobile-appt-id"
                    onClick={() => setSelectedAppt(apt)}
                  >
                    {apt.id}
                  </span>
                  <span className={`pro-badge ${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </div>
                <strong className="pro-mobile-card-price">₹{apt.price}</strong>
              </div>

              <div className="pro-mobile-card-body">
                <div className="pro-mobile-card-row">
                  <div>
                    <strong className="pro-mobile-client-name">{apt.customerName}</strong>
                    <a href={`tel:${apt.customerPhone}`} className="pro-mobile-phone-link">
                      <Phone size={12} /> {apt.customerPhone}
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pro-navy)' }}>{apt.time}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{apt.date}</div>
                  </div>
                </div>

                <div className="pro-mobile-card-details">
                  <div className="pro-mobile-detail-pill">
                    <Scissors size={12} />
                    <span>{apt.serviceName} ({apt.duration})</span>
                  </div>
                  <div className="pro-mobile-detail-pill">
                    <User size={12} />
                    <span>Stylist: <strong>{apt.barberName}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pro-mobile-card-actions">
                <button
                  onClick={() => setSelectedAppt(apt)}
                  className="pro-btn pro-btn-secondary pro-btn-sm"
                  style={{ flex: 1 }}
                >
                  View Details
                </button>
                {apt.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                    className="pro-btn pro-btn-primary pro-btn-sm"
                    style={{ flex: 1 }}
                  >
                    Accept
                  </button>
                )}
                {apt.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                    className="pro-btn pro-btn-sm"
                    style={{ flex: 1, background: '#D1FAE5', color: '#065F46', border: 'none', fontWeight: 600 }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="pro-modal-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="pro-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pro-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--pro-navy)' }}>
                  Appointment Details: {selectedAppt.id}
                </h3>
                <span className={`pro-badge ${selectedAppt.status.toLowerCase()}`} style={{ marginTop: '4px' }}>
                  {selectedAppt.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--pro-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--pro-bg)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--pro-text-muted)', fontWeight: 700 }}>
                  Client Profile
                </span>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--pro-navy)', marginTop: '4px' }}>
                  {selectedAppt.customerName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} /> {selectedAppt.customerPhone}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {selectedAppt.customerEmail}
                </div>
              </div>

              <div style={{ background: 'var(--pro-bg)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--pro-text-muted)', fontWeight: 700 }}>
                  Reservation Schedule
                </span>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--pro-navy)', marginTop: '4px' }}>
                  {selectedAppt.date} at {selectedAppt.time}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)', marginTop: '4px' }}>
                  Duration: {selectedAppt.duration}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pro-text-muted)', marginTop: '2px' }}>
                  Assigned Stylist: <strong>{selectedAppt.barberName}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pro-navy)', display: 'block', marginBottom: '4px' }}>
                Service Booked & Billing
              </span>
              <div style={{ padding: '0.85rem', border: '1px solid var(--pro-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{selectedAppt.serviceName}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>Payment: {selectedAppt.paymentStatus || 'PAID_ONLINE'}</div>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pro-navy)' }}>
                  ₹{selectedAppt.price}
                </span>
              </div>
            </div>

            {selectedAppt.notes && (
              <div style={{ marginBottom: '1.5rem', background: '#FFFBEB', padding: '0.85rem', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309', display: 'block' }}>
                  Customer Request Notes:
                </span>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#92400E' }}>
                  {selectedAppt.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--pro-border)', paddingTop: '1rem' }}>
              {selectedAppt.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'CONFIRMED')}
                    className="pro-btn pro-btn-primary"
                  >
                    Confirm Appointment
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'REJECTED')}
                    className="pro-btn pro-btn-danger"
                  >
                    Decline Request
                  </button>
                </>
              )}
              {selectedAppt.status === 'CONFIRMED' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'COMPLETED')}
                    className="pro-btn"
                    style={{ background: '#10B981', color: '#FFFFFF' }}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.id, 'CANCELLED')}
                    className="pro-btn pro-btn-danger"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              <button onClick={() => setSelectedAppt(null)} className="pro-btn pro-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
