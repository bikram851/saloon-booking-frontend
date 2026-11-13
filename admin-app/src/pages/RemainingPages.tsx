import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Scissors,
  Users,
  Radio,
  Tag,
  CalendarCheck,
  DollarSign,
  BarChart3,
  Activity,
  HardDrive,
  Bell,
  Settings,
  FileText,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  RefreshCw,
  Plus
} from 'lucide-react';

/* 4. Verification Page */
export const VerificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');

  const requests = [
    {
      id: 'req_001',
      salonName: 'Aura Luxe Salon & Spa',
      owner: 'Vikram Sengupta',
      phone: '+919876543210',
      email: 'vikram@auraluxe.in',
      date: 'Nov 13, 2026',
      status: 'UNDER_REVIEW',
      docs: ['GST Certificate', 'Trade License', 'Fire Safety NOC'],
      photos: 8
    },
    {
      id: 'req_002',
      salonName: 'The Royal Mane Studio',
      owner: 'Ananya Iyer',
      phone: '+919812345678',
      email: 'ananya@royalmane.in',
      date: 'Nov 12, 2026',
      status: 'INFO_REQUIRED',
      docs: ['Trade License', 'Electricity Bill'],
      photos: 5
    }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Salon Verification Center</h1>
          <p className="sa-page-subtitle">Review onboarding documents, trade licenses, and premises photography before marketplace activation.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sa-btn ${activeTab === tab ? 'sa-btn-primary' : 'sa-btn-outline'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'pending' ? 'Audit Queues (2)' : tab === 'approved' ? 'Verified Partners (12)' : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Salon Name</th>
              <th>Applicant & Owner</th>
              <th>Verification Status</th>
              <th>Documents Submitted</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{r.salonName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--sa-secondary)' }}>Photos uploaded: {r.photos}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.owner}</div>
                  <a href={`tel:${r.phone}`} style={{ fontSize: '0.82rem', color: 'var(--sa-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> {r.phone}
                  </a>
                </td>
                <td>
                  <span className={`sa-badge ${r.status === 'UNDER_REVIEW' ? 'sa-badge-warning' : 'sa-badge-info'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {r.docs.map((d, i) => (
                      <span key={i} style={{ background: '#EEF2F6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{r.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="sa-btn sa-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      Approve & Onboard
                    </button>
                    <button className="sa-btn sa-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444', borderColor: '#FCA5A5' }}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 5. Professionals Page */
export const ProfessionalsPage: React.FC = () => {
  const pros = [
    { id: 'pro_1', name: 'Alex Rivera', email: 'pro@glowgrace.com', salon: 'Glow & Grace Signature Lounge', status: 'ACTIVE', barbers: 4, phone: '+919876500001' },
    { id: 'pro_2', name: 'Vikram Sengupta', email: 'vikram@auraluxe.in', salon: 'Aura Luxe Salon & Spa', status: 'ACTIVE', barbers: 6, phone: '+919876500002' },
    { id: 'pro_3', name: 'Ananya Iyer', email: 'ananya@royalmane.in', salon: 'The Royal Mane Studio', status: 'INVITED', barbers: 3, phone: '+919876500003' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Professional Accounts Roster</h1>
          <p className="sa-page-subtitle">Manage salon manager/owner credentials, status, and associated venue privileges.</p>
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Professional</th>
              <th>Associated Venue</th>
              <th>Contact Phone</th>
              <th>Staff Under Management</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pros.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--sa-secondary)' }}>{p.email}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.salon}</td>
                <td>
                  <a href={`tel:${p.phone}`} style={{ color: 'var(--sa-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} /> {p.phone}
                  </a>
                </td>
                <td>{p.barbers} Barbers / Stylists</td>
                <td>
                  <span className={`sa-badge ${p.status === 'ACTIVE' ? 'sa-badge-success' : 'sa-badge-warning'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="sa-btn sa-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 6. Barbers Page */
export const BarbersPage: React.FC = () => {
  const barbers = [
    { id: 'barber_1', name: 'Alex Rivera', salon: 'Glow & Grace Signature Lounge', chair: 'Station 1', exp: '8 Years', rating: 4.9, status: 'ON_DUTY', phone: '+919876500010' },
    { id: 'barber_2', name: 'Elena Rostova', salon: 'Glow & Grace Signature Lounge', chair: 'Station 2', exp: '6 Years', rating: 4.95, status: 'ON_DUTY', phone: '+919876500011' },
    { id: 'barber_3', name: 'Marcus Chen', salon: 'Glow & Grace Signature Lounge', chair: 'Station 3', exp: '10 Years', rating: 4.88, status: 'BREAK', phone: '+919876500012' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Barber & Stylist Roster</h1>
          <p className="sa-page-subtitle">Global directory of verified beauty stylists across all partnered venues.</p>
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Stylist Name</th>
              <th>Salon Location</th>
              <th>Station / Chair</th>
              <th>Experience & Rating</th>
              <th>Phone</th>
              <th>Shift Status</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{b.name}</td>
                <td>{b.salon}</td>
                <td><span className="sa-badge sa-badge-info">{b.chair}</span></td>
                <td>{b.exp} • ⭐ {b.rating}</td>
                <td>
                  <a href={`tel:${b.phone}`} style={{ color: 'var(--sa-blue)', fontWeight: 600 }}>
                    {b.phone}
                  </a>
                </td>
                <td>
                  <span className={`sa-badge ${b.status === 'ON_DUTY' ? 'sa-badge-success' : 'sa-badge-warning'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 7. Customers Base Page */
export const CustomersPage: React.FC = () => {
  const customers = [
    { id: 'c_1', name: 'Rohit Malhotra', email: 'rohit@example.com', phone: '+919876543210', visits: 14, spent: '₹18,400', status: 'ACTIVE' },
    { id: 'c_2', name: 'Ananya Iyer', email: 'ananya@example.com', phone: '+919812345678', visits: 9, spent: '₹12,650', status: 'ACTIVE' },
    { id: 'c_3', name: 'Vikram Sengupta', email: 'vikram@example.com', phone: '+919823456789', visits: 6, spent: '₹7,800', status: 'ACTIVE' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Registered Customers Database</h1>
          <p className="sa-page-subtitle">Track patron activity, retention, lifetime value, and support inquiries.</p>
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Phone</th>
              <th>Total Appointments</th>
              <th>Lifetime Spend</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--sa-secondary)' }}>{c.email}</div>
                </td>
                <td>
                  <a href={`tel:${c.phone}`} style={{ color: 'var(--sa-blue)', fontWeight: 600 }}>
                    {c.phone}
                  </a>
                </td>
                <td>{c.visits} Bookings</td>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{c.spent}</td>
                <td>
                  <span className="sa-badge sa-badge-success">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 8. Live Users Page */
export const LiveUsersPage: React.FC = () => {
  const sessions = [
    { id: 's_1', user: 'Rohit Malhotra', role: 'CUSTOMER', device: 'iPhone 15 Pro (Safari)', page: '/book/1', ip: '106.51.24.12', active: '1m ago' },
    { id: 's_2', user: 'Alex Rivera', role: 'PROFESSIONAL', device: 'MacBook Air (Chrome)', page: '/pro/dashboard', ip: '49.37.112.44', active: 'Live' },
    { id: 's_3', user: 'Super Admin', role: 'SUPER_ADMIN', device: 'Windows Desktop (Edge)', page: '/dashboard', ip: '115.96.88.201', active: 'Live' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Real-Time Active Sessions</h1>
          <p className="sa-page-subtitle">Monitor live concurrent users, active route locations, and network telemetry.</p>
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Device & Browser</th>
              <th>Current Page</th>
              <th>IP Address</th>
              <th>Heartbeat</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{s.user}</td>
                <td>
                  <span className={`sa-badge ${s.role === 'SUPER_ADMIN' ? 'sa-badge-danger' : s.role === 'PROFESSIONAL' ? 'sa-badge-info' : 'sa-badge-success'}`}>
                    {s.role}
                  </span>
                </td>
                <td>{s.device}</td>
                <td><code>{s.page}</code></td>
                <td>{s.ip}</td>
                <td>
                  <span style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Radio size={14} className="spin-loader" /> {s.active}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 9. Offers & Promos Page */
export const OffersPage: React.FC = () => {
  const offers = [
    { code: 'GLOWFIRST', discount: '20% OFF', max: '₹300', uses: '842 / 1000', expiry: 'Nov 30, 2026', status: 'ACTIVE' },
    { code: 'WEEKENDSPA', discount: '₹500 Flat', max: '₹500', uses: '310 / 500', expiry: 'Nov 17, 2026', status: 'ACTIVE' },
    { code: 'FESTIVE30', discount: '30% OFF', max: '₹750', uses: '1000 / 1000', expiry: 'Nov 10, 2026', status: 'EXPIRED' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Marketing & Discount Engine</h1>
          <p className="sa-page-subtitle">Configure coupon codes, platform-wide campaigns, and minimum booking rules.</p>
        </div>
        <button className="sa-btn sa-btn-primary">
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount Value</th>
              <th>Max Cap</th>
              <th>Usage Quota</th>
              <th>Expiration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.code}>
                <td style={{ fontWeight: 800, color: 'var(--sa-blue)', letterSpacing: '1px' }}>{o.code}</td>
                <td style={{ fontWeight: 700 }}>{o.discount}</td>
                <td>{o.max}</td>
                <td>{o.uses}</td>
                <td>{o.expiry}</td>
                <td>
                  <span className={`sa-badge ${o.status === 'ACTIVE' ? 'sa-badge-success' : 'sa-badge-neutral'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 10. Master Appointments Page */
export const AppointmentsPage: React.FC = () => {
  const appts = [
    { id: 'APT-1082', customer: 'Rohit Malhotra', salon: 'Glow & Grace Signature Lounge', stylist: 'Alex Rivera', service: 'Precision Fade & Beard Sculpt', date: 'Today, 2:30 PM', price: '₹1,250', status: 'CONFIRMED' },
    { id: 'APT-1083', customer: 'Ananya Iyer', salon: 'Glow & Grace Signature Lounge', stylist: 'Elena Rostova', service: 'Custom Balayage & Spa', date: 'Today, 4:00 PM', price: '₹4,800', status: 'PENDING' },
    { id: 'APT-1081', customer: 'Vikram Sengupta', salon: 'Aura Luxe Salon & Spa', stylist: 'Marcus Chen', service: 'Deep Tissue Scalp Massage', date: 'Today, 11:00 AM', price: '₹1,600', status: 'COMPLETED' }
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Master Appointments Dispatch</h1>
          <p className="sa-page-subtitle">Real-time centralized bookings ledger across all platform venues.</p>
        </div>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Salon Location</th>
              <th>Stylist</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appts.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 700, color: 'var(--sa-blue)' }}>{a.id}</td>
                <td style={{ fontWeight: 600 }}>{a.customer}</td>
                <td>{a.salon}</td>
                <td>{a.stylist}</td>
                <td>{a.service}</td>
                <td>{a.date}</td>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{a.price}</td>
                <td>
                  <span className={`sa-badge ${a.status === 'CONFIRMED' ? 'sa-badge-success' : a.status === 'PENDING' ? 'sa-badge-warning' : 'sa-badge-neutral'}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 11. Revenue & GMV Page */
export const RevenuePage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Revenue & Financial Ledger</h1>
          <p className="sa-page-subtitle">Gross Merchandise Value (GMV), 15% platform commissions, and salon payouts.</p>
        </div>
      </div>

      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Gross Merchandise Value (GMV)</span></div>
          <div className="sa-kpi-value">₹32,48,500</div>
          <div className="sa-kpi-sub">Total booking transactions processed</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Platform Take Rate (15%)</span></div>
          <div className="sa-kpi-value" style={{ color: 'var(--sa-blue)' }}>₹4,87,275</div>
          <div className="sa-kpi-sub">Net revenue after gateway charges</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Salon Net Payouts (85%)</span></div>
          <div className="sa-kpi-value" style={{ color: '#10B981' }}>₹27,61,225</div>
          <div className="sa-kpi-sub">Scheduled bi-weekly direct disbursements</div>
        </div>
      </div>
    </div>
  );
};

/* 12. Analytics Page */
export const AnalyticsPage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Analytics & Growth Trends</h1>
          <p className="sa-page-subtitle">Cohort retention, peak booking hours, and category demand distribution.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--sa-navy)', marginBottom: '0.5rem' }}>Weekly Booking Volume & Repeat Customer Cohorts</h3>
        <p style={{ color: 'var(--sa-secondary)', marginBottom: '1.5rem' }}>74% of customers book repeat appointments within 21 days.</p>
        <div style={{ height: '220px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #CBD5E1' }}>
          <BarChart3 size={48} color="var(--sa-blue)" />
          <span style={{ marginLeft: '12px', fontWeight: 600, color: 'var(--sa-navy)' }}>Analytics Visualizer Ready • Aggregating 1,248 completed transactions</span>
        </div>
      </div>
    </div>
  );
};

/* 13. Application Performance Page */
export const PerformancePage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Application Performance Monitoring (APM)</h1>
          <p className="sa-page-subtitle">Infrastructure health, Cloud Function latencies, Firestore telemetry, and uptime.</p>
        </div>
      </div>

      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Average Response Time</span></div>
          <div className="sa-kpi-value" style={{ color: '#10B981' }}>182 ms</div>
          <div className="sa-kpi-sub">P95: 340ms • P99: 520ms</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Platform Uptime</span></div>
          <div className="sa-kpi-value">99.98%</div>
          <div className="sa-kpi-sub">Past 90 days across 3 regions</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Firestore Read/Write IO</span></div>
          <div className="sa-kpi-value" style={{ color: 'var(--sa-blue)' }}>4.2k / min</div>
          <div className="sa-kpi-sub">Within optimal free quota tier</div>
        </div>
      </div>
    </div>
  );
};

/* 14. Memory & Storage Page */
export const StoragePage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Memory & Firebase Storage Usage</h1>
          <p className="sa-page-subtitle">Bucket consumption for salon photography, verification documents, and offer assets.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--sa-navy)', marginBottom: '1rem' }}>Storage Bucket: <code>gs://glow-grace-saloon.appspot.com</code></h3>
        <p style={{ color: 'var(--sa-secondary)' }}>Total used: <strong>4.8 GB</strong> of 1 TB bucket capacity.</p>
      </div>
    </div>
  );
};

/* 15. System Notifications Page */
export const NotificationsPage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Administrative System Alerts</h1>
          <p className="sa-page-subtitle">Platform audit notices, verification queue requests, and critical events.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem' }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={20} color="var(--sa-blue)" />
          <div>
            <strong>New Salon Onboarding Request</strong>: Aura Luxe Salon & Spa submitted trade license and 8 photos for review.
            <div style={{ fontSize: '0.8rem', color: 'var(--sa-secondary)' }}>10 minutes ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 16. Admin Settings Page */
export const SettingsPage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Global Governance & Settings</h1>
          <p className="sa-page-subtitle">Configure commission rates, taxation rules, and administrative role RBAC.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label className="sa-label">Platform Take Rate Commission</label>
            <input className="sa-input" type="text" defaultValue="15%" readOnly />
          </div>
          <div>
            <label className="sa-label">Goods & Services Tax (GST)</label>
            <input className="sa-input" type="text" defaultValue="18%" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

/* 17. Audit Logs Page */
export const AuditLogsPage: React.FC = () => {
  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Immutable Administrative Audit Trail</h1>
          <p className="sa-page-subtitle">Cryptographic record of all administrative actions, onboarding approvals, and logins.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--sa-secondary)' }}>
          <code>[2026-11-13 14:30:12 UTC] superadmin@glowgrace.com logged in successfully from 115.96.88.201</code>
        </div>
      </div>
    </div>
  );
};
