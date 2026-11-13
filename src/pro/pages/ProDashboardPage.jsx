import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Scissors,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Check,
  X,
  Phone,
  Store
} from 'lucide-react';
import {
  getProAppointments,
  saveProAppointments,
  getProBarbers,
  getProWorkingHours
} from '../proData';

export default function ProDashboardPage() {
  const { salon } = useOutletContext();
  const [appointments, setAppointments] = useState(getProAppointments());
  const barbers = getProBarbers();
  const workingHours = getProWorkingHours();

  // Metrics calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const pendingRequests = appointments.filter(a => a.status === 'PENDING');
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED');
  const cancelledAppts = appointments.filter(a => a.status === 'CANCELLED' || a.status === 'REJECTED');
  const upcomingAppts = appointments.filter(a => a.status === 'CONFIRMED');

  const activeBarbers = barbers.filter(b => b.status === 'ON_DUTY').length;

  // Actions
  const handleUpdateStatus = (id, newStatus) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setAppointments(updated);
    saveProAppointments(updated);
  };

  const todayRevenue = todayAppts
    .filter(a => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Operations Dashboard</h1>
          <p className="pro-page-subtitle">
            Welcome back, Alex. Here is your salon activity and appointment overview for today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/pro/appointments" className="pro-btn pro-btn-primary">
            <span>View All Bookings</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Salon Operating Status Notice */}
      {salon.status !== 'OPEN' && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#991B1B'
        }}>
          <AlertCircle size={20} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <strong>Salon is currently marked as CLOSED.</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem' }}>
              Customers will see your salon marked as temporarily unavailable for new bookings. You can reopen anytime in the header.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="pro-kpi-grid">
        <div className="pro-kpi-card">
          <div className="pro-kpi-top">
            <span className="pro-kpi-label">Today's Appointments</span>
            <div className="pro-kpi-icon blue"><Calendar size={18} /></div>
          </div>
          <div className="pro-kpi-value">{todayAppts.length}</div>
          <span className="pro-kpi-subtext">Est. Revenue: ₹{todayRevenue.toLocaleString()}</span>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-top">
            <span className="pro-kpi-label">Pending Requests</span>
            <div className="pro-kpi-icon orange"><AlertCircle size={18} /></div>
          </div>
          <div className="pro-kpi-value" style={{ color: pendingRequests.length > 0 ? 'var(--pro-orange)' : 'inherit' }}>
            {pendingRequests.length}
          </div>
          <span className="pro-kpi-subtext">Requires immediate salon approval</span>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-top">
            <span className="pro-kpi-label">Upcoming Confirmed</span>
            <div className="pro-kpi-icon green"><CheckCircle2 size={18} /></div>
          </div>
          <div className="pro-kpi-value">{upcomingAppts.length}</div>
          <span className="pro-kpi-subtext">Next 7 days schedule</span>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-top">
            <span className="pro-kpi-label">Active Stylists</span>
            <div className="pro-kpi-icon purple"><UserCheck size={18} /></div>
          </div>
          <div className="pro-kpi-value">{activeBarbers} / {barbers.length}</div>
          <span className="pro-kpi-subtext">On duty stations ready</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Pending Requests Card */}
        {pendingRequests.length > 0 && (
          <div className="pro-card" style={{ borderLeft: '4px solid var(--pro-orange)' }}>
            <div className="pro-card-header">
              <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="var(--pro-orange)" />
                Action Required: Pending Booking Requests ({pendingRequests.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingRequests.map(req => (
                <div key={req.id} style={{
                  padding: '1rem',
                  background: 'var(--pro-bg)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--pro-navy)' }}>{req.customerName}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--pro-text-muted)' }}>
                      {req.serviceName} • {req.time} • Stylist: {req.barberName}
                    </div>
                    {req.notes && (
                      <div style={{ fontSize: '0.78rem', color: '#B45309', marginTop: '2px' }}>
                        Note: {req.notes}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'CONFIRMED')}
                      className="pro-btn pro-btn-primary pro-btn-sm"
                      title="Accept and Confirm appointment"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      className="pro-btn pro-btn-danger pro-btn-sm"
                      title="Reject appointment"
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Salon Operating Snapshot */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={18} color="var(--pro-blue)" />
              Salon Operating Hours & Shift Status
            </h3>
            <Link to="/pro/hours" style={{ fontSize: '0.82rem', color: 'var(--pro-blue)', fontWeight: 600 }}>
              Edit Hours &rarr;
            </Link>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--pro-text)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--pro-border-subtle)' }}>
              <span style={{ color: 'var(--pro-text-muted)' }}>Today's Schedule:</span>
              <strong>09:00 AM – 09:00 PM</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--pro-border-subtle)' }}>
              <span style={{ color: 'var(--pro-text-muted)' }}>Mid-Day Shift Break:</span>
              <span>01:30 PM – 02:30 PM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--pro-border-subtle)' }}>
              <span style={{ color: 'var(--pro-text-muted)' }}>Location:</span>
              <span>{salon.address}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--pro-text-muted)' }}>Customer Support Line:</span>
              <span>{salon.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div>
            <h3 className="pro-card-title">Today's Appointment Schedule ({todayAppts.length})</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--pro-text-muted)' }}>
              Real-time bookings scheduled for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <Link to="/pro/calendar" className="pro-btn pro-btn-secondary pro-btn-sm">
            <Calendar size={14} /> Full Calendar
          </Link>
        </div>

        {todayAppts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--pro-text-muted)' }}>
            No appointments booked for today yet.
          </div>
        ) : (
          <div className="pro-table-wrapper">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Time & Slot</th>
                  <th>Client Name</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Stylist</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--pro-navy)' }}>{apt.time}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{apt.duration}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pro-text-muted)' }}>{apt.id}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div>{apt.customerPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{apt.serviceName}</div>
                    </td>
                    <td>
                      <span className="pro-badge onduty">{apt.barberName}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{apt.price}
                    </td>
                    <td>
                      <span className={`pro-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                            className="pro-btn pro-btn-sm"
                            style={{ background: '#D1FAE5', color: '#065F46', border: 'none' }}
                            title="Mark appointment as completed"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            className="pro-btn pro-btn-primary pro-btn-sm"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
