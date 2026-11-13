import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, ShieldAlert, Sparkles, Trash2, Check, Filter } from 'lucide-react';

const initialNotifications = [
  {
    id: 'notif-1',
    category: 'salons',
    title: 'New Salon Onboarding Application',
    message: 'The Velvet Lounge (Whitefield, Bangalore) submitted registration documents and premises photos for verification.',
    timestamp: '12 minutes ago',
    type: 'info',
    read: false,
    actionUrl: '/admin/verification',
    actionLabel: 'Audit Application'
  },
  {
    id: 'notif-2',
    category: 'system',
    title: 'APM Peak Traffic Alert Cleared',
    message: 'API Gateway latency returned to normal (P95: 118ms) after weekend booking surge. No dropped requests.',
    timestamp: '1 hour ago',
    type: 'success',
    read: false,
    actionUrl: '/admin/performance',
    actionLabel: 'View APM Metrics'
  },
  {
    id: 'notif-3',
    category: 'promotions',
    title: 'Campaign Redemption Milestone Reached',
    message: 'Promo code GROOM25 has reached 84% of its 500-booking redemption quota. Consider extending budget cap.',
    timestamp: '3 hours ago',
    type: 'warning',
    read: false,
    actionUrl: '/admin/offers',
    actionLabel: 'Manage Offers'
  },
  {
    id: 'notif-4',
    category: 'security',
    title: 'Admin Session Authenticated',
    message: 'Successful administrative login from IP 106.51.72.19 (Bangalore, India) using 2-Factor Authentication.',
    timestamp: '5 hours ago',
    type: 'security',
    read: true,
    actionUrl: '/admin/settings',
    actionLabel: 'Security Settings'
  },
  {
    id: 'notif-5',
    category: 'salons',
    title: 'Salon Profile Verification Completed',
    message: 'Aura Premium Salon & Spa documents were approved by Lead Auditor Priya Nair. Salon is now live on marketplace.',
    timestamp: 'Yesterday at 5:40 PM',
    type: 'success',
    read: true,
    actionUrl: '/admin/salons',
    actionLabel: 'View Salon'
  },
  {
    id: 'notif-6',
    category: 'system',
    title: 'Scheduled Database Optimization Notice',
    message: 'PostgreSQL RDS automatic vacuum and read-replica index rebalancing scheduled for Sunday 03:00 AM IST.',
    timestamp: '2 days ago',
    type: 'info',
    read: true,
    actionUrl: '/admin/performance',
    actionLabel: 'System Telemetry'
  }
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.category === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} color="#10B981" />;
      case 'warning':
        return <AlertTriangle size={18} color="#F59E0B" />;
      case 'security':
        return <ShieldAlert size={18} color="#EF4444" />;
      default:
        return <Info size={18} color="#0879E8" />;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">System & Administrative Notifications</h1>
          <p className="admin-page-subtitle">Real-time platform activity feeds, operational milestones, security alerts and auditing updates</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button className="admin-btn admin-btn-secondary" onClick={markAllRead}>
              <Check size={16} /> Mark all as read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontWeight: 600, marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter:
          </span>
          {[
            { id: 'all', label: `All Alerts (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'salons', label: 'Salon Partners' },
            { id: 'system', label: 'System & APM' },
            { id: 'promotions', label: 'Campaigns' },
            { id: 'security', label: 'Security & Auth' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="admin-btn"
              style={{
                background: filter === tab.id ? 'var(--admin-blue)' : 'var(--admin-bg)',
                color: filter === tab.id ? '#FFFFFF' : 'var(--admin-text)',
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                border: '1px solid ' + (filter === tab.id ? 'var(--admin-blue)' : 'var(--admin-border)')
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.length === 0 ? (
          <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bell size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text)', marginBottom: '0.25rem' }}>No notifications found</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>You are completely caught up in this category.</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                borderLeft: notif.read ? '1px solid var(--admin-border)' : '4px solid var(--admin-blue)',
                background: notif.read ? '#FFFFFF' : '#F0F7FF'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: notif.type === 'success' ? '#D1FAE5' : notif.type === 'warning' ? '#FEF3C7' : notif.type === 'security' ? '#FEE2E2' : '#E0F2FE',
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
                    <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: notif.read ? 600 : 700, color: 'var(--admin-text)' }}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--admin-blue)', display: 'inline-block' }}></span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{notif.timestamp}</span>
                </div>

                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
                  {notif.message}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {notif.actionUrl && (
                    <a
                      href={notif.actionUrl}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      {notif.actionLabel} &rarr;
                    </a>
                  )}
                  {!notif.read && (
                    <button
                      className="admin-btn"
                      onClick={() => markAsRead(notif.id)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'transparent', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' }}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center' }}
                    title="Dismiss notification"
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
