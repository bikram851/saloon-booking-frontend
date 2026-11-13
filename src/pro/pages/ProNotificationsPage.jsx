import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Scissors,
  Star,
  Clock,
  Trash2,
  Check,
  Filter
} from 'lucide-react';

const initialProNotifications = [
  {
    id: 'pnotif-1',
    category: 'bookings',
    title: 'New Online Appointment Booking',
    message: 'Karan Mehta booked Beard Trim & Sculpt for Today at 02:00 PM with Marcus Chen.',
    timestamp: '15 minutes ago',
    type: 'booking',
    read: false,
    actionUrl: '/pro/appointments',
    actionLabel: 'Review Request'
  },
  {
    id: 'pnotif-2',
    category: 'reviews',
    title: 'New 5-Star Client Review',
    message: 'Rohit Malhotra left a 5-star review for Haircut & Style: "Cleanest precision fade in Bangalore!"',
    timestamp: '2 hours ago',
    type: 'review',
    read: false,
    actionUrl: '/pro/reviews',
    actionLabel: 'Reply to Review'
  },
  {
    id: 'pnotif-3',
    category: 'shifts',
    title: 'Stylist Shift Reminder',
    message: 'Elena Rostova scheduled shift begins at 11:00 AM at Chair #2.',
    timestamp: '3 hours ago',
    type: 'shift',
    read: true,
    actionUrl: '/pro/barber-availability',
    actionLabel: 'View Schedule'
  },
  {
    id: 'pnotif-4',
    category: 'bookings',
    title: 'Appointment Confirmed & Paid Online',
    message: 'Deepika Padukone completed online payment of ₹3,500 for Hair Colour & Balayage today.',
    timestamp: 'Yesterday',
    type: 'booking',
    read: true,
    actionUrl: '/pro/appointments',
    actionLabel: 'View Appointment'
  }
];

export default function ProNotificationsPage() {
  const [notifications, setNotifications] = useState(initialProNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.category === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Scissors size={18} color="var(--pro-blue)" />;
      case 'review':
        return <Star size={18} color="#D97706" />;
      default:
        return <Clock size={18} color="#10B981" />;
    }
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Salon Notifications & Alerts</h1>
          <p className="pro-page-subtitle">
            Stay updated with real-time appointment arrivals, client feedback, cancellations and staff shift alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="pro-btn pro-btn-secondary">
            <Check size={16} /> Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="pro-card" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Alerts (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'bookings', label: 'Appointments & Payments' },
            { id: 'reviews', label: 'Customer Reviews' },
            { id: 'shifts', label: 'Staff Shifts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="pro-btn pro-btn-sm"
              style={{
                background: filter === tab.id ? 'var(--pro-navy)' : 'var(--pro-bg)',
                color: filter === tab.id ? '#FFFFFF' : 'var(--pro-text)',
                border: '1px solid ' + (filter === tab.id ? 'var(--pro-navy)' : 'var(--pro-border)')
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.length === 0 ? (
          <div className="pro-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bell size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--pro-navy)' }}>No notifications in this category</h3>
            <p style={{ color: 'var(--pro-text-muted)', fontSize: '0.9rem' }}>You are all caught up!</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className="pro-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                borderLeft: notif.read ? '1px solid var(--pro-border)' : '4px solid var(--pro-blue)',
                background: notif.read ? '#FFFFFF' : '#F0F7FF'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: notif.type === 'review' ? '#FEF3C7' : notif.type === 'booking' ? '#E0F2FE' : '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: notif.read ? 600 : 700, color: 'var(--pro-navy)' }}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--pro-blue)', display: 'inline-block' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>{notif.timestamp}</span>
                </div>

                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: 'var(--pro-text-muted)', lineHeight: 1.5 }}>
                  {notif.message}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {notif.actionUrl && (
                    <a
                      href={notif.actionUrl}
                      className="pro-btn pro-btn-secondary pro-btn-sm"
                    >
                      {notif.actionLabel} &rarr;
                    </a>
                  )}
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="pro-btn pro-btn-sm"
                      style={{ background: 'transparent', color: 'var(--pro-text-muted)', border: '1px solid var(--pro-border)' }}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}
                    title="Dismiss alert"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
