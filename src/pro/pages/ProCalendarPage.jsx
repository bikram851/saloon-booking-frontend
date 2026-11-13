import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Scissors
} from 'lucide-react';
import { getProAppointments, getProBarbers } from '../proData';

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProCalendarPage() {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'
  const [currentDate, setCurrentDate] = useState(new Date());
  const appointments = getProAppointments();
  const barbers = getProBarbers();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (viewMode === 'daily' ? 1 : 7));
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (viewMode === 'daily' ? 1 : 7));
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Schedule & Calendar</h1>
          <p className="pro-page-subtitle">
            Visual diary of booked client slots, stylist availability and station commitments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: 'var(--pro-bg)', padding: '3px', borderRadius: '8px', display: 'flex', border: '1px solid var(--pro-border)' }}>
            <button
              onClick={() => setViewMode('daily')}
              className={`pro-btn pro-btn-sm ${viewMode === 'daily' ? 'pro-btn-primary' : ''}`}
              style={{ border: 'none', background: viewMode === 'daily' ? 'var(--pro-blue)' : 'transparent', color: viewMode === 'daily' ? '#FFF' : 'var(--pro-text)' }}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`pro-btn pro-btn-sm ${viewMode === 'weekly' ? 'pro-btn-primary' : ''}`}
              style={{ border: 'none', background: viewMode === 'weekly' ? 'var(--pro-blue)' : 'transparent', color: viewMode === 'weekly' ? '#FFF' : 'var(--pro-text)' }}
            >
              Weekly View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation Bar */}
      <div className="pro-card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrev} className="pro-btn pro-btn-secondary pro-btn-sm" style={{ padding: '6px' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleToday} className="pro-btn pro-btn-secondary pro-btn-sm">
            Today
          </button>
          <button onClick={handleNext} className="pro-btn pro-btn-secondary pro-btn-sm" style={{ padding: '6px' }}>
            <ChevronRight size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--pro-navy)', marginLeft: '8px' }}>
            {formattedDate}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} /> Confirmed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} /> Pending
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0879E8' }} /> Completed
          </span>
        </div>
      </div>

      {/* Daily View */}
      {viewMode === 'daily' && (
        <div className="pro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--pro-border)', background: 'var(--pro-bg)', display: 'grid', gridTemplateColumns: '120px 1fr', fontWeight: 700, color: 'var(--pro-navy)', fontSize: '0.85rem' }}>
            <div>Time Slot</div>
            <div>Stylist Commitments & Bookings</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TIME_SLOTS.map(slot => {
              const matched = appointments.filter(a => a.time.includes(slot.slice(0, 2)));
              return (
                <div
                  key={slot}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    minHeight: '65px',
                    borderBottom: '1px solid var(--pro-border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ padding: '0.85rem 1.25rem', fontSize: '0.84rem', fontWeight: 600, color: 'var(--pro-text-muted)' }}>
                    {slot}
                  </div>
                  <div style={{ padding: '0.5rem 1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {matched.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#A0AEC0', fontStyle: 'italic' }}>
                        Open station slot
                      </span>
                    ) : (
                      matched.map(apt => (
                        <div
                          key={apt.id}
                          style={{
                            background: apt.status === 'CONFIRMED' ? '#ECFDF5' : apt.status === 'PENDING' ? '#FFFBEB' : '#EFF6FF',
                            border: `1px solid ${apt.status === 'CONFIRMED' ? '#A7F3D0' : apt.status === 'PENDING' ? '#FDE68A' : '#BFDBFE'}`,
                            borderRadius: '8px',
                            padding: '0.45rem 0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Scissors size={14} color={apt.status === 'CONFIRMED' ? '#059669' : '#D97706'} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--pro-navy)' }}>
                              {apt.customerName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--pro-text-muted)' }}>
                              {apt.serviceName} • {apt.barberName}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === 'weekly' && (
        <div className="pro-card" style={{ padding: 0, overflowX: 'auto' }}>
          <div style={{ minWidth: '850px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', background: 'var(--pro-bg)', borderBottom: '1px solid var(--pro-border)', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              <div style={{ padding: '0.85rem' }}>Time</div>
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} style={{ padding: '0.85rem', borderLeft: '1px solid var(--pro-border-subtle)' }}>
                  {d}
                </div>
              ))}
            </div>
            {TIME_SLOTS.slice(0, 8).map(slot => (
              <div key={slot} style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', minHeight: '60px', borderBottom: '1px solid var(--pro-border-subtle)', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--pro-text-muted)', fontWeight: 600 }}>
                  {slot.slice(0, 5)}
                </div>
                {DAYS_OF_WEEK.map((d, idx) => (
                  <div key={d} style={{ padding: '4px', borderLeft: '1px solid var(--pro-border-subtle)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx === 2 && slot.includes('10') ? (
                      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '4px 6px', fontSize: '0.72rem', fontWeight: 600, color: '#065F46', textAlign: 'center', width: '90%' }}>
                        Rahul S. (Fade)
                      </div>
                    ) : idx === 4 && slot.includes('11') ? (
                      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '4px 6px', fontSize: '0.72rem', fontWeight: 600, color: '#1E40AF', textAlign: 'center', width: '90%' }}>
                        Deepika P. (Color)
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
