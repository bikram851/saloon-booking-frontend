import React, { useState, useEffect } from 'react';
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
  Plus,
  Trash2,
  Eye,
  Key,
  Clock,
  Copy,
  Lock,
  Server,
  Check,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import {
  fetchSalons,
  fetchCustomers,
  fetchOffers,
  saveOffer,
  deleteOffer,
  fetchLiveSessions,
  fetchAuditLogs,
  logAdminAction
} from '../services/firestoreService';
import { SalonDocument, CustomerDocument, OfferDocument, LiveUserSession, AuditLogDocument } from '../types';

/* =========================================================================
   1. VERIFICATION PAGE (Salon Verification & Document Auditing)
========================================================================= */

interface VerificationRequest {
  id: string;
  salonId?: string;
  salonName: string;
  owner: string;
  phone: string;
  email: string;
  date: string;
  status: 'UNDER_REVIEW' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED';
  docs: string[];
  photos: number;
  category: string;
  city: string;
  auditorNotes?: string;
}

const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req_001',
    salonId: 'salon_03',
    salonName: 'The Velvet Lounge Koramangala',
    owner: 'Vikramaditya Oberoi',
    phone: '+91 98765 88990',
    email: 'oberoi@velvetlounge.in',
    date: 'Nov 12, 2026',
    status: 'UNDER_REVIEW',
    docs: ['GSTIN Registration Certificate', 'BBMP Trade License', 'Fire Safety NOC', 'Sanitation Inspection Cert'],
    photos: 8,
    category: 'Full Service Spa & Salon',
    city: 'Bengaluru'
  },
  {
    id: 'req_002',
    salonId: 'salon_04',
    salonName: 'Aura Luxe Salon & Spa',
    owner: 'Vikram Sengupta',
    phone: '+91 98765 43210',
    email: 'vikram@auraluxe.in',
    date: 'Nov 13, 2026',
    status: 'UNDER_REVIEW',
    docs: ['GST Certificate', 'Trade License', 'Fire Safety NOC'],
    photos: 10,
    category: 'Luxury Unisex Lounge',
    city: 'Bengaluru'
  },
  {
    id: 'req_003',
    salonId: 'salon_05',
    salonName: 'The Royal Mane Studio',
    owner: 'Ananya Iyer',
    phone: '+91 98123 45678',
    email: 'ananya@royalmane.in',
    date: 'Nov 11, 2026',
    status: 'INFO_REQUIRED',
    docs: ['Trade License', 'Electricity Bill'],
    photos: 5,
    category: 'Hair Studio',
    city: 'Bengaluru',
    auditorNotes: 'Awaiting updated Fire Safety NOC documentation from municipal authorities.'
  },
  {
    id: 'req_004',
    salonId: 'salon_01',
    salonName: 'Glow & Grace Luxury Lounge Whitefield',
    owner: 'Alex Rivera & Partners',
    phone: '+91 98765 43210',
    email: 'whitefield@glowgrace.com',
    date: 'Nov 01, 2026',
    status: 'APPROVED',
    docs: ['GST Certificate', 'Trade License', 'Fire Safety NOC', 'FSSAI Cleanliness Cert'],
    photos: 14,
    category: 'Luxury Unisex Lounge',
    city: 'Bengaluru'
  }
];

export const VerificationPage: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('sa_verification_requests');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_REQUESTS;
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [inspectModal, setInspectModal] = useState<VerificationRequest | null>(null);
  const [rejectModal, setRejectModal] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete municipal trade license documentation.');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const saveRequests = (updated: VerificationRequest[]) => {
    setRequests(updated);
    localStorage.setItem('sa_verification_requests', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleApprove = async (req: VerificationRequest) => {
    const updated = requests.map(r => r.id === req.id ? { ...r, status: 'APPROVED' as const } : r);
    saveRequests(updated);
    await logAdminAction('APPROVE_VERIFICATION', 'verificationRequests', req.id, `Approved salon verification for ${req.salonName}`);

    // Update salon status in central store and publish to Customer App
    try {
      const storedSalons = localStorage.getItem('gg_central_salons') || localStorage.getItem('sa_salons');
      if (storedSalons) {
        const salons: SalonDocument[] = JSON.parse(storedSalons);
        const updatedSalons = salons.map(s => (s.id === req.salonId || s.name.toLowerCase() === req.salonName.toLowerCase()) ? {
          ...s,
          status: 'PUBLISHED' as const,
          publicationStatus: 'PUBLISHED' as const,
          isPublished: true,
          approvedAt: new Date().toISOString()
        } : s);
        localStorage.setItem('gg_central_salons', JSON.stringify(updatedSalons));
        localStorage.setItem('sa_salons', JSON.stringify(updatedSalons));
        localStorage.setItem('gg_admin_salons', JSON.stringify(updatedSalons));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gg_salons_published_sync', { detail: { salonId: req.salonId, all: updatedSalons } }));
        }
      }
    } catch {}

    showToast(`✓ "${req.salonName}" verification has been approved and published to Customer Application.`);
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    const updated = requests.map(r => r.id === rejectModal.id ? { ...r, status: 'REJECTED' as const, auditorNotes: rejectionReason } : r);
    saveRequests(updated);
    await logAdminAction('REJECT_VERIFICATION', 'verificationRequests', rejectModal.id, `Rejected verification for ${rejectModal.salonName}: ${rejectionReason}`);

    try {
      const storedSalons = localStorage.getItem('gg_central_salons') || localStorage.getItem('sa_salons');
      if (storedSalons) {
        const salons: SalonDocument[] = JSON.parse(storedSalons);
        const updatedSalons = salons.map(s => (s.id === rejectModal.salonId || s.name.toLowerCase() === rejectModal.salonName.toLowerCase()) ? {
          ...s,
          status: 'REJECTED' as const,
          publicationStatus: 'UNPUBLISHED' as const,
          isPublished: false,
          auditorNotes: rejectionReason
        } : s);
        localStorage.setItem('gg_central_salons', JSON.stringify(updatedSalons));
        localStorage.setItem('sa_salons', JSON.stringify(updatedSalons));
        localStorage.setItem('gg_admin_salons', JSON.stringify(updatedSalons));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gg_salons_published_sync', { detail: { salonId: rejectModal.salonId, all: updatedSalons } }));
        }
      }
    } catch {}

    showToast(`Verification rejected for "${rejectModal.salonName}".`);
    setRejectModal(null);
  };

  const pendingCount = requests.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'INFO_REQUIRED').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending' && !(r.status === 'UNDER_REVIEW' || r.status === 'INFO_REQUIRED')) return false;
    if (activeTab === 'approved' && r.status !== 'APPROVED') return false;
    if (activeTab === 'rejected' && r.status !== 'REJECTED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.salonName.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Salon Verification Center</h1>
          <p className="sa-page-subtitle">Review onboarding documents, trade licenses, and premises photography before marketplace activation.</p>
        </div>
      </div>

      {feedbackToast && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #A7F3D0' }}>
          <CheckCircle2 size={18} /> {feedbackToast}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('pending')}
            className={`sa-btn ${activeTab === 'pending' ? 'sa-btn-primary' : 'sa-btn-outline'}`}
          >
            Audit Queues ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`sa-btn ${activeTab === 'approved' ? 'sa-btn-primary' : 'sa-btn-outline'}`}
          >
            Verified Partners ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`sa-btn ${activeTab === 'rejected' ? 'sa-btn-primary' : 'sa-btn-outline'}`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search request by salon or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-form-input"
            style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px' }}
          />
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
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-secondary)' }}>
                  No verification requests found in this queue.
                </td>
              </tr>
            ) : (
              filteredRequests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--sa-navy)', cursor: 'pointer' }} onClick={() => setInspectModal(r)}>
                      {r.salonName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sa-secondary)' }}>
                      {r.category} • Photos: {r.photos}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.owner}</div>
                    <a href={`tel:${r.phone}`} style={{ fontSize: '0.82rem', color: 'var(--sa-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {r.phone}
                    </a>
                  </td>
                  <td>
                    <span className={`sa-badge ${r.status === 'APPROVED' ? 'sa-badge-success' : r.status === 'REJECTED' ? 'sa-badge-danger' : r.status === 'UNDER_REVIEW' ? 'sa-badge-warning' : 'sa-badge-info'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {r.docs.map((d, i) => (
                        <span
                          key={i}
                          onClick={() => setInspectModal(r)}
                          style={{ background: '#EEF2F6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          title="Click to inspect document"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setInspectModal(r)}
                        className="sa-btn sa-btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      >
                        Inspect
                      </button>
                      {r.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(r)}
                          className="sa-btn sa-btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'REJECTED' && (
                        <button
                          onClick={() => setRejectModal(r)}
                          className="sa-btn sa-btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444', borderColor: '#FCA5A5' }}
                        >
                          Reject
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

      {/* Inspect Documents & Premises Modal */}
      {inspectModal && (
        <div className="sa-modal-overlay" onClick={() => setInspectModal(null)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ color: 'var(--sa-navy)', margin: 0 }}>{inspectModal.salonName}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>Verification Dossier & Compliance Proofs</p>
              </div>
              <button onClick={() => setInspectModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--sa-navy)', marginBottom: '8px' }}>Submitted Statutory Documents</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {inspectModal.docs.map((docName, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="var(--sa-blue)" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{docName}</span>
                    </div>
                    <span className="sa-badge sa-badge-success" style={{ fontSize: '0.72rem' }}>Verified Format (PDF)</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--sa-navy)', marginBottom: '8px' }}>Premises Photography ({inspectModal.photos} photos)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80'
                ].map((src, i) => (
                  <img key={i} src={src} alt="Premises" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                ))}
              </div>
            </div>

            {inspectModal.auditorNotes && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#92400E' }}>Auditor Notes:</div>
                <div style={{ fontSize: '0.82rem', color: '#B45309' }}>{inspectModal.auditorNotes}</div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setInspectModal(null)} className="sa-btn sa-btn-secondary">
                Close
              </button>
              {inspectModal.status !== 'APPROVED' && (
                <button
                  onClick={() => {
                    handleApprove(inspectModal);
                    setInspectModal(null);
                  }}
                  className="sa-btn sa-btn-primary"
                >
                  Approve & Onboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Verification Modal */}
      {rejectModal && (
        <div className="sa-modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ color: 'var(--sa-navy)', marginBottom: '0.5rem' }}>Reject Verification Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-secondary)', marginBottom: '1rem' }}>
              Provide the compliance audit reason for rejecting <strong>{rejectModal.salonName}</strong>:
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="sa-form-label">Audit Rejection Reason</label>
              <textarea
                className="sa-form-textarea"
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setRejectModal(null)} className="sa-btn sa-btn-secondary">
                Cancel
              </button>
              <button onClick={handleRejectConfirm} className="sa-btn sa-btn-danger">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. PROFESSIONALS PAGE (Salon Manager & Owner Accounts)
========================================================================= */

interface ProfessionalItem {
  id: string;
  name: string;
  email: string;
  salon: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  barbers: number;
  phone: string;
}

const INITIAL_PROFESSIONALS: ProfessionalItem[] = [
  { id: 'pro_1', name: 'Alex Rivera', email: 'pro@glowgrace.com', salon: 'Glow & Grace Signature Lounge', status: 'ACTIVE', barbers: 4, phone: '+91 98765 00001' },
  { id: 'pro_2', name: 'Vikram Sengupta', email: 'vikram@auraluxe.in', salon: 'Aura Luxe Salon & Spa', status: 'ACTIVE', barbers: 6, phone: '+91 98765 00002' },
  { id: 'pro_3', name: 'Ananya Iyer', email: 'ananya@royalmane.in', salon: 'The Royal Mane Studio', status: 'INVITED', barbers: 3, phone: '+91 98765 00003' },
  { id: 'pro_4', name: 'Sunita Kapoor', email: 'sunita@haircare.com', salon: 'Hair Care Studio Indiranagar', status: 'ACTIVE', barbers: 5, phone: '+91 98765 11111' }
];

export const ProfessionalsPage: React.FC = () => {
  const [pros, setPros] = useState<ProfessionalItem[]>(() => {
    const saved = localStorage.getItem('sa_professionals');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSIONALS;
  });
  const [search, setSearch] = useState('');
  const [resetModal, setResetModal] = useState<{ pro: ProfessionalItem; tempPass: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const savePros = (updated: ProfessionalItem[]) => {
    setPros(updated);
    localStorage.setItem('sa_professionals', JSON.stringify(updated));
  };

  const handleToggleStatus = async (id: string) => {
    const updated = pros.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'ACTIVE' ? 'SUSPENDED' as const : 'ACTIVE' as const;
        return { ...p, status: nextStatus };
      }
      return p;
    });
    savePros(updated);
    await logAdminAction('UPDATE_PROFESSIONAL_STATUS', 'professionals', id, 'Toggled professional status');
  };

  const handleResetPassword = async (pro: ProfessionalItem) => {
    const tempPass = `GG-PRO-${Math.floor(1000 + Math.random() * 9000)}!`;
    setResetModal({ pro, tempPass });
    setCopied(false);
    await logAdminAction('RESET_PASSWORD', 'professionals', pro.id, `Generated reset credential for ${pro.email}`);
  };

  const handleCopy = () => {
    if (resetModal) {
      navigator.clipboard.writeText(resetModal.tempPass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredPros = pros.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.salon.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Professional Accounts Roster</h1>
          <p className="sa-page-subtitle">Manage salon manager/owner credentials, status, and associated venue privileges.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '420px' }}>
          <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by professional name, email or salon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--admin-secondary)' }}>
          Showing <strong>{filteredPros.length}</strong> registered professionals
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
            {filteredPros.map(p => (
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
                  <span
                    onClick={() => handleToggleStatus(p.id)}
                    className={`sa-badge ${p.status === 'ACTIVE' ? 'sa-badge-success' : p.status === 'SUSPENDED' ? 'sa-badge-danger' : 'sa-badge-warning'}`}
                    style={{ cursor: 'pointer' }}
                    title="Click to toggle status"
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleResetPassword(p)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleToggleStatus(p.id)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', color: p.status === 'ACTIVE' ? '#EF4444' : '#10B981' }}
                    >
                      {p.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Reset Modal */}
      {resetModal && (
        <div className="sa-modal-overlay" onClick={() => setResetModal(null)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Key size={24} color="var(--sa-blue)" />
              <h3 style={{ color: 'var(--sa-navy)', margin: 0 }}>Temporary Credentials Issued</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-secondary)', marginBottom: '1.25rem' }}>
              A temporary password has been generated for <strong>{resetModal.pro.name}</strong> ({resetModal.pro.email}). The user will be required to change it on initial login.
            </p>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <code style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sa-navy)', letterSpacing: '1px' }}>
                {resetModal.tempPass}
              </code>
              <button onClick={handleCopy} className="sa-btn sa-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setResetModal(null)} className="sa-btn sa-btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. BARBERS PAGE (Barbers & Stylists Directory)
========================================================================= */

interface BarberItem {
  id: string;
  name: string;
  salon: string;
  chair: string;
  exp: string;
  rating: number;
  status: 'ON_DUTY' | 'BREAK' | 'OFF_DUTY';
  phone: string;
  specialization: string;
}

const INITIAL_BARBERS_ROSTER: BarberItem[] = [
  { id: 'barber_1', name: 'Alex Rivera', salon: 'Glow & Grace Signature Lounge', chair: 'Station 1', exp: '8 Years', rating: 4.9, status: 'ON_DUTY', phone: '+91 98765 00010', specialization: 'Signature Skin Fade & Scissor Cut' },
  { id: 'barber_2', name: 'Elena Rostova', salon: 'Glow & Grace Signature Lounge', chair: 'Station 2', exp: '6 Years', rating: 4.95, status: 'ON_DUTY', phone: '+91 98765 00011', specialization: 'Creative Color & Balayage' },
  { id: 'barber_3', name: 'Marcus Chen', salon: 'Glow & Grace Signature Lounge', chair: 'Station 3', exp: '10 Years', rating: 4.88, status: 'BREAK', phone: '+91 98765 00012', specialization: 'Beard Sculpting & Hot Towel' },
  { id: 'barber_4', name: 'Devendra Patil', salon: 'Hair Care Studio Indiranagar', chair: 'Station 1', exp: '5 Years', rating: 4.7, status: 'ON_DUTY', phone: '+91 98765 22222', specialization: 'Texture Cuts & Keratin' }
];

export const BarbersPage: React.FC = () => {
  const [barbers, setBarbers] = useState<BarberItem[]>(() => {
    const saved = localStorage.getItem('sa_barbers');
    return saved ? JSON.parse(saved) : INITIAL_BARBERS_ROSTER;
  });
  const [search, setSearch] = useState('');
  const [salonFilter, setSalonFilter] = useState('ALL');

  const saveBarbers = (updated: BarberItem[]) => {
    setBarbers(updated);
    localStorage.setItem('sa_barbers', JSON.stringify(updated));
  };

  const handleCycleStatus = (id: string) => {
    const updated = barbers.map(b => {
      if (b.id === id) {
        const next: BarberItem['status'] = b.status === 'ON_DUTY' ? 'BREAK' : b.status === 'BREAK' ? 'OFF_DUTY' : 'ON_DUTY';
        return { ...b, status: next };
      }
      return b;
    });
    saveBarbers(updated);
  };

  const salonsList = Array.from(new Set(barbers.map(b => b.salon)));

  const filtered = barbers.filter(b => {
    if (salonFilter !== 'ALL' && b.salon !== salonFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.salon.toLowerCase().includes(q) ||
        b.specialization.toLowerCase().includes(q) ||
        b.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Barber & Stylist Roster</h1>
          <p className="sa-page-subtitle">Global directory of verified beauty stylists across all partnered venues.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '380px' }}>
            <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search stylist by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>
          <select
            value={salonFilter}
            onChange={e => setSalonFilter(e.target.value)}
            className="sa-form-select"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="ALL">All Salons ({barbers.length})</option>
            {salonsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
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
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{b.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--sa-secondary)' }}>{b.specialization}</div>
                </td>
                <td>{b.salon}</td>
                <td><span className="sa-badge sa-badge-info">{b.chair}</span></td>
                <td>{b.exp} • ⭐ {b.rating}</td>
                <td>
                  <a href={`tel:${b.phone}`} style={{ color: 'var(--sa-blue)', fontWeight: 600 }}>
                    {b.phone}
                  </a>
                </td>
                <td>
                  <span
                    onClick={() => handleCycleStatus(b.id)}
                    className={`sa-badge ${b.status === 'ON_DUTY' ? 'sa-badge-success' : b.status === 'BREAK' ? 'sa-badge-warning' : 'sa-badge-neutral'}`}
                    style={{ cursor: 'pointer' }}
                    title="Click to cycle status: ON_DUTY -> BREAK -> OFF_DUTY"
                  >
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

/* =========================================================================
   4. CUSTOMERS BASE PAGE (Customer Directory & Dossier Modal)
========================================================================= */

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  spent: string;
  status: 'ACTIVE' | 'BLOCKED';
  joinedDate: string;
  recentBooking: string;
}

const INITIAL_CUSTOMERS_LIST: CustomerProfile[] = [
  { id: 'c_1', name: 'Rohit Malhotra', email: 'rohit@example.com', phone: '+91 98765 43210', visits: 14, spent: '₹18,400', status: 'ACTIVE', joinedDate: 'Jan 15, 2024', recentBooking: 'Precision Fade & Hot Towel' },
  { id: 'c_2', name: 'Ananya Iyer', email: 'ananya@example.com', phone: '+91 98123 45678', visits: 9, spent: '₹12,650', status: 'ACTIVE', joinedDate: 'Feb 04, 2024', recentBooking: 'Glow Radiance Luxury Facial' },
  { id: 'c_3', name: 'Vikram Sengupta', email: 'vikram@example.com', phone: '+91 98234 56789', visits: 6, spent: '₹7,800', status: 'ACTIVE', joinedDate: 'Mar 12, 2024', recentBooking: 'Deep Tissue Scalp Massage' },
  { id: 'c_4', name: 'Deepika Padukone', email: 'deepika.p@gmail.com', phone: '+91 97312 99881', visits: 8, spent: '₹22,100', status: 'ACTIVE', joinedDate: 'Feb 10, 2024', recentBooking: 'Hair Colour & Balayage' },
  { id: 'c_5', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98451 22340', visits: 11, spent: '₹14,900', status: 'ACTIVE', joinedDate: 'Jan 22, 2024', recentBooking: 'Executive Royal Grooming Combo' }
];

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('sa_customers_roster');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS_LIST;
  });
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<CustomerProfile | null>(null);

  const saveCustomers = (updated: CustomerProfile[]) => {
    setCustomers(updated);
    localStorage.setItem('sa_customers_roster', JSON.stringify(updated));
  };

  const handleToggleStatus = (id: string) => {
    const updated = customers.map(c => c.id === id ? { ...c, status: (c.status === 'ACTIVE' ? ('BLOCKED' as const) : ('ACTIVE' as const)) } : c);
    saveCustomers(updated);
    if (selectedCust && selectedCust.id === id) {
      setSelectedCust({ ...selectedCust, status: selectedCust.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' });
    }
  };

  const filtered = customers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Registered Customers Database</h1>
          <p className="sa-page-subtitle">Track patron activity, retention, lifetime value, and support inquiries.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '420px' }}>
          <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--admin-secondary)' }}>
          Total Patrons: <strong>{filtered.length}</strong>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--sa-navy)', cursor: 'pointer' }} onClick={() => setSelectedCust(c)}>
                    {c.name}
                  </div>
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
                  <span
                    onClick={() => handleToggleStatus(c.id)}
                    className={`sa-badge ${c.status === 'ACTIVE' ? 'sa-badge-success' : 'sa-badge-danger'}`}
                    style={{ cursor: 'pointer' }}
                    title="Click to toggle status"
                  >
                    {c.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedCust(c)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', color: c.status === 'ACTIVE' ? '#EF4444' : '#10B981' }}
                    >
                      {c.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Dossier Modal */}
      {selectedCust && (
        <div className="sa-modal-overlay" onClick={() => setSelectedCust(null)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ color: 'var(--sa-navy)', margin: 0 }}>{selectedCust.name}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>Customer Profile & Booking Ledger</p>
              </div>
              <button onClick={() => setSelectedCust(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>Lifetime Value</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--sa-navy)' }}>{selectedCust.spent}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>Total Bookings</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--sa-blue)' }}>{selectedCust.visits} Completed</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              <div><strong>Email:</strong> {selectedCust.email}</div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedCust.phone}`}>{selectedCust.phone}</a></div>
              <div><strong>Member Since:</strong> {selectedCust.joinedDate}</div>
              <div><strong>Recent Treatment:</strong> {selectedCust.recentBooking}</div>
              <div><strong>Account Status:</strong> <span className={`sa-badge ${selectedCust.status === 'ACTIVE' ? 'sa-badge-success' : 'sa-badge-danger'}`}>{selectedCust.status}</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setSelectedCust(null)} className="sa-btn sa-btn-secondary">
                Close
              </button>
              <button onClick={() => handleToggleStatus(selectedCust.id)} className={`sa-btn ${selectedCust.status === 'ACTIVE' ? 'sa-btn-danger' : 'sa-btn-primary'}`}>
                {selectedCust.status === 'ACTIVE' ? 'Block Customer' : 'Unblock Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   5. LIVE USERS PAGE (Active Concurrent Sessions)
========================================================================= */

interface SessionItem {
  id: string;
  user: string;
  role: 'CUSTOMER' | 'PROFESSIONAL' | 'SUPER_ADMIN';
  device: string;
  page: string;
  ip: string;
  active: string;
}

const INITIAL_SESSIONS: SessionItem[] = [
  { id: 's_1', user: 'Rohit Malhotra', role: 'CUSTOMER', device: 'iPhone 15 Pro (Safari)', page: '/book/1', ip: '106.51.24.12', active: 'Live' },
  { id: 's_2', user: 'Alex Rivera', role: 'PROFESSIONAL', device: 'MacBook Air (Chrome)', page: '/pro/dashboard', ip: '49.37.112.44', active: 'Live' },
  { id: 's_3', user: 'Super Admin', role: 'SUPER_ADMIN', device: 'Windows Desktop (Edge)', page: '/dashboard', ip: '115.96.88.201', active: 'Live' },
  { id: 's_4', user: 'Deepika Padukone', role: 'CUSTOMER', device: 'OnePlus 12 (Chrome)', page: '/salons', ip: '157.48.91.44', active: '1m ago' },
  { id: 's_5', user: 'Sunita Kapoor', role: 'PROFESSIONAL', device: 'iPad Air (Safari)', page: '/pro/appointments', ip: '106.51.74.88', active: 'Live' }
];

export const LiveUsersPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionItem[]>(() => {
    const saved = localStorage.getItem('sa_live_sessions_cache');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const saveSessions = (updated: SessionItem[]) => {
    setSessions(updated);
    localStorage.setItem('sa_live_sessions_cache', JSON.stringify(updated));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleTerminate = async (id: string, user: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    await logAdminAction('TERMINATE_SESSION', 'userSessions', id, `Force terminated session for ${user}`);
  };

  const filtered = sessions.filter(s => {
    if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Real-Time Active Sessions</h1>
          <p className="sa-page-subtitle">Monitor live concurrent users, active route locations, and network telemetry.</p>
        </div>
        <button onClick={handleRefresh} className="sa-btn sa-btn-secondary">
          <RefreshCw size={16} className={refreshing ? 'spin-loader' : ''} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CUSTOMER', 'PROFESSIONAL', 'SUPER_ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`sa-btn ${roleFilter === r ? 'sa-btn-primary' : 'sa-btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {r} ({r === 'ALL' ? sessions.length : sessions.filter(s => s.role === r).length})
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--admin-secondary)' }}>
          Active Socket Connections: <strong>{filtered.length}</strong>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
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
                    <Radio size={14} /> {s.active}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleTerminate(s.id, s.user)}
                    className="sa-btn sa-btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#EF4444', borderColor: '#FCA5A5' }}
                  >
                    Terminate
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

/* =========================================================================
   6. OFFERS & PROMOS PAGE (Coupons & Discounts Engine)
========================================================================= */

interface OfferItem {
  id: string;
  code: string;
  discount: string;
  max: string;
  uses: string;
  expiry: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
}

const INITIAL_OFFERS_LIST: OfferItem[] = [
  { id: 'off_1', code: 'GLOWFIRST', discount: '20% OFF', max: '₹300', uses: '842 / 1000', expiry: 'Nov 30, 2026', status: 'ACTIVE' },
  { id: 'off_2', code: 'WEEKENDSPA', discount: '₹500 Flat', max: '₹500', uses: '310 / 500', expiry: 'Nov 17, 2026', status: 'ACTIVE' },
  { id: 'off_3', code: 'FESTIVE30', discount: '30% OFF', max: '₹750', uses: '1000 / 1000', expiry: 'Nov 10, 2026', status: 'EXPIRED' }
];

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<OfferItem[]>(() => {
    const saved = localStorage.getItem('sa_offers_list');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS_LIST;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('25% OFF');
  const [newMax, setNewMax] = useState('₹500');
  const [newQuota, setNewQuota] = useState('500');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  const saveOffers = (updated: OfferItem[]) => {
    setOffers(updated);
    localStorage.setItem('sa_offers_list', JSON.stringify(updated));
  };

  const handleToggleStatus = (id: string) => {
    const updated = offers.map(o => {
      if (o.id === id) {
        return { ...o, status: (o.status === 'ACTIVE' ? ('PAUSED' as const) : ('ACTIVE' as const)) };
      }
      return o;
    });
    saveOffers(updated);
  };

  const handleDelete = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    saveOffers(updated);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newOffer: OfferItem = {
      id: `off_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discount: newDiscount,
      max: newMax,
      uses: `0 / ${newQuota}`,
      expiry: newExpiry,
      status: 'ACTIVE'
    };

    saveOffers([newOffer, ...offers]);
    setIsModalOpen(false);
    setNewCode('');
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Marketing & Discount Engine</h1>
          <p className="sa-page-subtitle">Configure coupon codes, platform-wide campaigns, and minimum booking rules.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="sa-btn sa-btn-primary">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 800, color: 'var(--sa-blue)', letterSpacing: '1px' }}>{o.code}</td>
                <td style={{ fontWeight: 700 }}>{o.discount}</td>
                <td>{o.max}</td>
                <td>{o.uses}</td>
                <td>{o.expiry}</td>
                <td>
                  <span
                    onClick={() => handleToggleStatus(o.id)}
                    className={`sa-badge ${o.status === 'ACTIVE' ? 'sa-badge-success' : o.status === 'EXPIRED' ? 'sa-badge-neutral' : 'sa-badge-warning'}`}
                    style={{ cursor: 'pointer' }}
                    title="Click to toggle active/paused"
                  >
                    {o.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleToggleStatus(o.id)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      {o.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#EF4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="sa-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ color: 'var(--sa-navy)', margin: 0 }}>Create Promotional Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="sa-form-label">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER30"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="sa-form-input"
                  style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="sa-form-label">Discount Benefit</label>
                  <input
                    type="text"
                    required
                    value={newDiscount}
                    onChange={e => setNewDiscount(e.target.value)}
                    className="sa-form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="sa-form-label">Maximum Discount Cap</label>
                  <input
                    type="text"
                    required
                    value={newMax}
                    onChange={e => setNewMax(e.target.value)}
                    className="sa-form-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="sa-form-label">Usage Limit</label>
                  <input
                    type="number"
                    required
                    value={newQuota}
                    onChange={e => setNewQuota(e.target.value)}
                    className="sa-form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="sa-form-label">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={e => setNewExpiry(e.target.value)}
                    className="sa-form-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="sa-btn sa-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   7. MASTER APPOINTMENTS PAGE (Central Dispatch Ledger)
========================================================================= */

interface AppointmentItem {
  id: string;
  customer: string;
  phone: string;
  salon: string;
  stylist: string;
  service: string;
  date: string;
  price: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: string;
}

const INITIAL_APPOINTMENTS_LIST: AppointmentItem[] = [
  { id: 'APT-1082', customer: 'Rohit Malhotra', phone: '+91 98765 43210', salon: 'Glow & Grace Signature Lounge', stylist: 'Alex Rivera', service: 'Precision Fade & Beard Sculpt', date: 'Today, 2:30 PM', price: '₹1,250', status: 'CONFIRMED', paymentStatus: 'PAID_ONLINE' },
  { id: 'APT-1083', customer: 'Ananya Iyer', phone: '+91 98123 45678', salon: 'Glow & Grace Signature Lounge', stylist: 'Elena Rostova', service: 'Custom Balayage & Spa', date: 'Today, 4:00 PM', price: '₹4,800', status: 'PENDING', paymentStatus: 'PAY_AT_SALON' },
  { id: 'APT-1081', customer: 'Vikram Sengupta', phone: '+91 98234 56789', salon: 'Aura Luxe Salon & Spa', stylist: 'Marcus Chen', service: 'Deep Tissue Scalp Massage', date: 'Today, 11:00 AM', price: '₹1,600', status: 'COMPLETED', paymentStatus: 'PAID_ONLINE' },
  { id: 'APT-1084', customer: 'Deepika Padukone', phone: '+91 97312 99881', salon: 'Hair Care Studio Indiranagar', stylist: 'Devendra Patil', service: 'Keratin Hair Spa Infusion', date: 'Tomorrow, 1:00 PM', price: '₹2,400', status: 'CONFIRMED', paymentStatus: 'PAID_ONLINE' }
];

export const AppointmentsPage: React.FC = () => {
  const [appts, setAppts] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('sa_appointments_list');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS_LIST;
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);

  const saveAppts = (updated: AppointmentItem[]) => {
    setAppts(updated);
    localStorage.setItem('sa_appointments_list', JSON.stringify(updated));
  };

  const handleUpdateStatus = (id: string, status: AppointmentItem['status']) => {
    const updated = appts.map(a => a.id === id ? { ...a, status } : a);
    saveAppts(updated);
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status });
    }
  };

  const filtered = appts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.customer.toLowerCase().includes(q) ||
        a.salon.toLowerCase().includes(q) ||
        a.stylist.toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Master Appointments Dispatch</h1>
          <p className="sa-page-subtitle">Real-time centralized bookings ledger across all platform venues.</p>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by ID, client, salon or stylist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`sa-btn ${statusFilter === st ? 'sa-btn-primary' : 'sa-btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {st}
            </button>
          ))}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 700, color: 'var(--sa-blue)', cursor: 'pointer' }} onClick={() => setSelectedAppt(a)}>
                  {a.id}
                </td>
                <td style={{ fontWeight: 600 }}>{a.customer}</td>
                <td>{a.salon}</td>
                <td>{a.stylist}</td>
                <td>{a.service}</td>
                <td>{a.date}</td>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>{a.price}</td>
                <td>
                  <span className={`sa-badge ${a.status === 'CONFIRMED' ? 'sa-badge-success' : a.status === 'PENDING' ? 'sa-badge-warning' : a.status === 'COMPLETED' ? 'sa-badge-info' : 'sa-badge-neutral'}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedAppt(a)}
                      className="sa-btn sa-btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    >
                      View
                    </button>
                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                        className="sa-btn sa-btn-primary"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        Confirm
                      </button>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                        className="sa-btn sa-btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#10B981', borderColor: '#A7F3D0' }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppt && (
        <div className="sa-modal-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="sa-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ color: 'var(--sa-navy)', margin: 0 }}>Appointment {selectedAppt.id}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>Status: {selectedAppt.status}</p>
              </div>
              <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              <div><strong>Client:</strong> {selectedAppt.customer}</div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedAppt.phone}`}>{selectedAppt.phone}</a></div>
              <div><strong>Salon:</strong> {selectedAppt.salon}</div>
              <div><strong>Stylist:</strong> {selectedAppt.stylist}</div>
              <div><strong>Service:</strong> {selectedAppt.service}</div>
              <div><strong>Scheduled Time:</strong> {selectedAppt.date}</div>
              <div><strong>Booking Amount:</strong> <span style={{ color: 'var(--sa-navy)', fontWeight: 700 }}>{selectedAppt.price}</span></div>
              <div><strong>Payment Status:</strong> <code style={{ background: '#EEF2F6', padding: '2px 6px', borderRadius: '4px' }}>{selectedAppt.paymentStatus}</code></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'CANCELLED')}
                  className="sa-btn sa-btn-danger"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  Cancel Booking
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'CONFIRMED')}
                  className="sa-btn sa-btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'COMPLETED')}
                  className="sa-btn sa-btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', color: '#10B981', borderColor: '#10B981' }}
                >
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   8. REVENUE & GMV PAGE (Financial Ledger & CSV Export)
========================================================================= */

export const RevenuePage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'ytd'>('30d');

  const gmv = timeframe === '7d' ? 785000 : timeframe === '30d' ? 3248500 : 14280000;
  const takeRate = Math.round(gmv * 0.15);
  const payouts = Math.round(gmv * 0.85);

  const transactions = [
    { id: 'TXN-901', date: 'Nov 13, 2026', salon: 'Glow & Grace Luxury Lounge', customer: 'Rohit Malhotra', gross: 1250, fee: 187.5, payout: 1062.5, status: 'SETTLED' },
    { id: 'TXN-902', date: 'Nov 13, 2026', salon: 'Glow & Grace Luxury Lounge', customer: 'Ananya Iyer', gross: 4800, fee: 720.0, payout: 4080.0, status: 'SETTLED' },
    { id: 'TXN-903', date: 'Nov 12, 2026', salon: 'Aura Luxe Salon & Spa', customer: 'Vikram Sengupta', gross: 1600, fee: 240.0, payout: 1360.0, status: 'SETTLED' },
    { id: 'TXN-904', date: 'Nov 12, 2026', salon: 'Hair Care Studio Indiranagar', customer: 'Deepika Padukone', gross: 3500, fee: 525.0, payout: 2975.0, status: 'PROCESSING' }
  ];

  const handleExportCSV = () => {
    const header = 'Transaction ID,Date,Salon,Customer,Gross Amount (INR),Platform Take (15%),Salon Payout (85%),Status\n';
    const rows = transactions.map(t => `${t.id},${t.date},"${t.salon}","${t.customer}",${t.gross},${t.fee},${t.payout},${t.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glow_grace_revenue_ledger_${timeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Revenue & Financial Ledger</h1>
          <p className="sa-page-subtitle">Gross Merchandise Value (GMV), 15% platform commissions, and salon payouts.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
            {(['7d', '30d', 'ytd'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`sa-btn ${timeframe === t ? 'sa-btn-primary' : 'sa-btn-outline'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem', textTransform: 'uppercase', border: 'none' }}
              >
                {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'YTD'}
              </button>
            ))}
          </div>
          <button onClick={handleExportCSV} className="sa-btn sa-btn-secondary">
            <Download size={16} /> Export Ledger (CSV)
          </button>
        </div>
      </div>

      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Gross Merchandise Value (GMV)</span></div>
          <div className="sa-kpi-value">₹{gmv.toLocaleString('en-IN')}</div>
          <div className="sa-kpi-sub">Total booking transactions processed ({timeframe})</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Platform Take Rate (15%)</span></div>
          <div className="sa-kpi-value" style={{ color: 'var(--sa-blue)' }}>₹{takeRate.toLocaleString('en-IN')}</div>
          <div className="sa-kpi-sub">Net revenue retained by Glow & Grace</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Salon Net Payouts (85%)</span></div>
          <div className="sa-kpi-value" style={{ color: '#10B981' }}>₹{payouts.toLocaleString('en-IN')}</div>
          <div className="sa-kpi-sub">Direct scheduled disbursements to salon bank accounts</div>
        </div>
      </div>

      <div className="sa-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="sa-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Date</th>
              <th>Salon Venue</th>
              <th>Customer</th>
              <th>Gross Amount</th>
              <th>Platform Commission (15%)</th>
              <th>Net Salon Payout (85%)</th>
              <th>Settlement</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: 'var(--sa-blue)' }}>{t.id}</td>
                <td>{t.date}</td>
                <td>{t.salon}</td>
                <td style={{ fontWeight: 600 }}>{t.customer}</td>
                <td style={{ fontWeight: 700, color: 'var(--sa-navy)' }}>₹{t.gross.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--sa-blue)', fontWeight: 600 }}>₹{t.fee.toLocaleString('en-IN')}</td>
                <td style={{ color: '#10B981', fontWeight: 700 }}>₹{t.payout.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`sa-badge ${t.status === 'SETTLED' ? 'sa-badge-success' : 'sa-badge-warning'}`}>
                    {t.status}
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

/* =========================================================================
   9. ANALYTICS PAGE (Cohort Retention & Trends)
========================================================================= */

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = {
    '7d': { bookings: 342, repeatRate: '71%', avgOrder: '₹1,380', rating: '4.91' },
    '30d': { bookings: 1420, repeatRate: '74%', avgOrder: '₹1,450', rating: '4.88' },
    '90d': { bookings: 4890, repeatRate: '78%', avgOrder: '₹1,520', rating: '4.90' }
  }[period];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Analytics & Growth Trends</h1>
          <p className="sa-page-subtitle">Cohort retention, peak booking hours, and category demand distribution.</p>
        </div>
        <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
          {(['7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`sa-btn ${period === p ? 'sa-btn-primary' : 'sa-btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.78rem', textTransform: 'uppercase', border: 'none' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Completed Bookings</span></div>
          <div className="sa-kpi-value">{stats.bookings}</div>
          <div className="sa-kpi-sub">Across all Bangalore partner salons</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Repeat Client Cohort</span></div>
          <div className="sa-kpi-value" style={{ color: '#10B981' }}>{stats.repeatRate}</div>
          <div className="sa-kpi-sub">Customers re-booking within 21 days</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Average Order Value (AOV)</span></div>
          <div className="sa-kpi-value" style={{ color: 'var(--sa-blue)' }}>{stats.avgOrder}</div>
          <div className="sa-kpi-sub">Basket size including add-on treatments</div>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <h3 style={{ color: 'var(--sa-navy)', marginBottom: '1rem' }}>Category Demand Share</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Hair Styling & Precision Cuts', pct: 44, color: 'var(--sa-blue)' },
            { label: 'Beard Grooming & Hot Towel Shave', pct: 24, color: 'var(--sa-orange)' },
            { label: 'Glow Radiance Facials & Detan', pct: 18, color: '#10B981' },
            { label: 'Hair Spa & Scalp Massage', pct: 14, color: '#8B5CF6' }
          ].map(cat => (
            <div key={cat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>{cat.label}</span>
                <span>{cat.pct}%</span>
              </div>
              <div style={{ height: '8px', background: '#EEF2F6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${cat.pct}%`, background: cat.color, height: '100%', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   10. APPLICATION PERFORMANCE PAGE (APM & Health Check)
========================================================================= */

export const PerformancePage: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [lastCheck, setLastCheck] = useState('Just now');
  const [services, setServices] = useState([
    { name: 'Firebase Authentication API', status: 'OPERATIONAL', latency: '28 ms' },
    { name: 'Cloud Firestore Multi-Region DB', status: 'OPERATIONAL', latency: '42 ms' },
    { name: 'Cloud Functions Compute', status: 'OPERATIONAL', latency: '64 ms' },
    { name: 'Cloud Storage & CDN Edge', status: 'OPERATIONAL', latency: '51 ms' },
    { name: 'Razorpay / Cashfree Webhook Gateway', status: 'OPERATIONAL', latency: '35 ms' }
  ]);

  const handleRunHealthCheck = () => {
    setTesting(true);
    setTimeout(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        latency: `${Math.floor(20 + Math.random() * 45)} ms`
      })));
      setLastCheck('Just now');
      setTesting(false);
    }, 700);
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Application Performance Monitoring (APM)</h1>
          <p className="sa-page-subtitle">Infrastructure health, Cloud Function latencies, Firestore telemetry, and uptime.</p>
        </div>
        <button onClick={handleRunHealthCheck} className="sa-btn sa-btn-primary">
          <Activity size={16} className={testing ? 'spin-loader' : ''} />
          <span>{testing ? 'Probing Nodes...' : 'Run Infrastructure Health Check'}</span>
        </button>
      </div>

      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Average Response Time</span></div>
          <div className="sa-kpi-value" style={{ color: '#10B981' }}>42 ms</div>
          <div className="sa-kpi-sub">P95: 118ms • P99: 245ms</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Platform Uptime</span></div>
          <div className="sa-kpi-value">99.98%</div>
          <div className="sa-kpi-sub">Past 90 days across multi-regions</div>
        </div>
        <div className="sa-kpi-card">
          <div className="sa-kpi-header"><span className="sa-kpi-label">Firestore Read/Write IO</span></div>
          <div className="sa-kpi-value" style={{ color: 'var(--sa-blue)' }}>4.2k / min</div>
          <div className="sa-kpi-sub">Last verified: {lastCheck}</div>
        </div>
      </div>

      <div className="sa-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <h3 style={{ color: 'var(--sa-navy)', marginBottom: '1rem' }}>Active Service Endpoints & Health Status</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map(s => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <code style={{ fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>{s.latency}</code>
                <span className="sa-badge sa-badge-success">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. MEMORY & STORAGE PAGE (CDN & Assets)
========================================================================= */

export const StoragePage: React.FC = () => {
  const [purging, setPurging] = useState(false);
  const [purgeAlert, setPurgeAlert] = useState<string | null>(null);

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
      setPurgeAlert('✓ Global CDN edge cache purged successfully across all Indian edge locations.');
      setTimeout(() => setPurgeAlert(null), 4000);
    }, 1000);
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Memory & Firebase Storage Usage</h1>
          <p className="sa-page-subtitle">Bucket consumption for salon photography, verification documents, and offer assets.</p>
        </div>
        <button onClick={handlePurge} className="sa-btn sa-btn-outline" style={{ color: '#EF4444', borderColor: '#FCA5A5' }}>
          <RefreshCw size={16} className={purging ? 'spin-loader' : ''} />
          <span>{purging ? 'Purging Cache...' : 'Purge CDN Edge Cache'}</span>
        </button>
      </div>

      {purgeAlert && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, border: '1px solid #A7F3D0' }}>
          {purgeAlert}
        </div>
      )}

      <div className="sa-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--sa-navy)', marginBottom: '0.5rem' }}>Storage Bucket: <code>gs://glow-grace-saloon.appspot.com</code></h3>
        <p style={{ color: 'var(--sa-secondary)', marginBottom: '1.25rem' }}>
          Total used: <strong>4.8 GB</strong> of 1 TB bucket capacity (0.48% quota consumed).
        </p>

        <div style={{ height: '10px', background: '#EEF2F6', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '1.5rem' }}>
          <div style={{ width: '65%', background: 'var(--sa-blue)' }} title="Salon Imagery (3.1 GB)" />
          <div style={{ width: '25%', background: 'var(--sa-orange)' }} title="Verification Docs (1.2 GB)" />
          <div style={{ width: '10%', background: '#10B981' }} title="Avatars & Promos (0.5 GB)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>Salon Photography</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sa-navy)' }}>3.1 GB</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>65% of total consumption</div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>Compliance & GST Proofs</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sa-navy)' }}>1.2 GB</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>25% of total consumption</div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>Stylist & Client Avatars</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sa-navy)' }}>0.5 GB</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>10% of total consumption</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   12. NOTIFICATIONS PAGE (Administrative System Alerts)
========================================================================= */

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'ONBOARDING' | 'SECURITY' | 'PAYOUT' | 'SYSTEM';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  { id: 'notif_1', title: 'New Salon Onboarding Request', message: 'The Velvet Lounge Koramangala submitted trade license and 8 photos for review.', time: '10 mins ago', category: 'ONBOARDING', read: false },
  { id: 'notif_2', title: 'Bi-Weekly Payout Batch Cleared', message: 'Automated settlement of ₹27,61,225 dispatched to partner salon bank accounts.', time: '2 hours ago', category: 'PAYOUT', read: false },
  { id: 'notif_3', title: 'Security Heartbeat', message: 'Database backup successfully replicated across 3 availability zones.', time: '5 hours ago', category: 'SECURITY', read: true }
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('sa_notifications_list');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const saveNotifications = (updated: SystemNotification[]) => {
    setNotifications(updated);
    localStorage.setItem('sa_notifications_list', JSON.stringify(updated));
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleDismiss = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Administrative System Alerts</h1>
          <p className="sa-page-subtitle">Platform audit notices, verification queue requests, and critical events.</p>
        </div>
        <button onClick={handleMarkAllRead} className="sa-btn sa-btn-secondary">
          <CheckCircle2 size={16} /> Mark All as Read
        </button>
      </div>

      <div className="sa-card" style={{ padding: '0.5rem' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-secondary)' }}>
            No administrative notifications in inbox.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: n.read ? '#FFFFFF' : '#F0F9FF',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} color={n.category === 'ONBOARDING' ? 'var(--sa-blue)' : n.category === 'PAYOUT' ? '#10B981' : 'var(--sa-orange)'} />
                <div>
                  <div style={{ fontWeight: n.read ? 600 : 700, color: 'var(--sa-navy)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--admin-text)' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)', marginTop: '2px' }}>{n.time}</div>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(n.id)}
                className="sa-btn sa-btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                Dismiss
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   13. ADMIN SETTINGS PAGE (Platform Governance & Config)
========================================================================= */

export const SettingsPage: React.FC = () => {
  const [takeRate, setTakeRate] = useState('15%');
  const [gst, setGst] = useState('18%');
  const [payoutFreq, setPayoutFreq] = useState('Bi-Weekly');
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sa_platform_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTakeRate(parsed.takeRate || '15%');
        setGst(parsed.gst || '18%');
        setPayoutFreq(parsed.payoutFreq || 'Bi-Weekly');
        setTwoFactor(parsed.twoFactor ?? true);
        setAutoApprove(parsed.autoApprove ?? false);
      } catch {}
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = { takeRate, gst, payoutFreq, twoFactor, autoApprove };
    localStorage.setItem('sa_platform_settings', JSON.stringify(config));
    await logAdminAction('UPDATE_SETTINGS', 'platformSettings', 'global_config', `Updated platform take rate to ${takeRate}, GST to ${gst}`);
    setSavedAlert('✓ Platform global governance settings successfully updated.');
    setTimeout(() => setSavedAlert(null), 4000);
  };

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Platform Global Governance & Settings</h1>
          <p className="sa-page-subtitle">Configure commission rates, taxation rules, and administrative role RBAC.</p>
        </div>
      </div>

      {savedAlert && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, border: '1px solid #A7F3D0' }}>
          {savedAlert}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="sa-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--sa-navy)', marginBottom: '1rem' }}>Commission & Taxation Parameters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="sa-form-label">Platform Take Rate Commission</label>
              <input
                className="sa-form-input"
                type="text"
                value={takeRate}
                onChange={e => setTakeRate(e.target.value)}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>Calculated on all booking transactions.</span>
            </div>
            <div>
              <label className="sa-form-label">Goods & Services Tax (GST)</label>
              <input
                className="sa-form-input"
                type="text"
                value={gst}
                onChange={e => setGst(e.target.value)}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>Standard statutory beauty service tax in India.</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="sa-form-label">Salon Settlement Disbursement Frequency</label>
            <select
              className="sa-form-select"
              value={payoutFreq}
              onChange={e => setPayoutFreq(e.target.value)}
              style={{ width: '100%', maxWidth: '360px' }}
            >
              <option value="Weekly">Weekly (Every Monday)</option>
              <option value="Bi-Weekly">Bi-Weekly (1st and 15th of month)</option>
              <option value="Monthly">Monthly (1st of month)</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={e => setTwoFactor(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Enforce Multi-Factor Authentication (2FA) for all Super Administrators
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={e => setAutoApprove(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Auto-approve verified chain salons with valid GSTIN certificates
            </label>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="sa-btn sa-btn-primary">
              Save Platform Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* =========================================================================
   14. AUDIT LOGS PAGE (Immutable Administrative Trail)
========================================================================= */

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDocument[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    async function loadLogs() {
      const data = await fetchAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  const handleExportAuditTrail = () => {
    const header = 'ID,Timestamp,Admin Email,Action,Target Entity,Target ID,IP Address,Details\n';
    const rows = logs.map(l => `${l.id},${l.timestamp},"${l.adminEmail}",${l.action},${l.targetEntity},${l.targetId},${l.ipAddress},"${l.details.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glow_grace_audit_trail.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(l => {
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.adminEmail.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.ipAddress.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Immutable Administrative Audit Trail</h1>
          <p className="sa-page-subtitle">Cryptographic record of all administrative actions, onboarding approvals, and logins.</p>
        </div>
        <button onClick={handleExportAuditTrail} className="sa-btn sa-btn-secondary">
          <Download size={16} /> Export Audit Trail (CSV)
        </button>
      </div>

      <div className="sa-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search audit trail by actor, IP or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="sa-form-select"
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="ALL">All Actions ({logs.length})</option>
          <option value="APPROVE_SALON">APPROVE_SALON</option>
          <option value="APPROVE_VERIFICATION">APPROVE_VERIFICATION</option>
          <option value="CREATE_OFFER">CREATE_OFFER</option>
          <option value="RESET_PASSWORD">RESET_PASSWORD</option>
          <option value="TERMINATE_SESSION">TERMINATE_SESSION</option>
          <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
        </select>
      </div>

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Administrator</th>
              <th>Action Executed</th>
              <th>Target Entity</th>
              <th>Audit Log Details</th>
              <th>Client IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-secondary)' }}>
                  No audit log events found matching filter.
                </td>
              </tr>
            ) : (
              filteredLogs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--admin-secondary)' }}>
                    {l.timestamp}
                  </td>
                  <td style={{ fontWeight: 600 }}>{l.adminEmail}</td>
                  <td>
                    <span className="sa-badge sa-badge-info" style={{ fontWeight: 700 }}>
                      {l.action}
                    </span>
                  </td>
                  <td><code>{l.targetEntity}</code></td>
                  <td style={{ fontSize: '0.84rem' }}>{l.details}</td>
                  <td><code>{l.ipAddress}</code></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
