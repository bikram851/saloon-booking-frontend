import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  ExternalLink,
  Clock,
  Scissors,
  X
} from 'lucide-react';
import { fetchSalons, updateSalonStatus, saveSalon, approveAndPublishSalon, suspendOrUnpublishSalon } from '../services/firestoreService';
import { SalonDocument } from '../types';

export const SalonsPage: React.FC = () => {
  const [salons, setSalons] = useState<SalonDocument[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSalon, setSelectedSalon] = useState<SalonDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchSalons();
      setSalons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: SalonDocument['status']) => {
    await updateSalonStatus(id, newStatus);
    await loadData();
    if (selectedSalon && selectedSalon.id === id) {
      setSelectedSalon({ ...selectedSalon, status: newStatus });
    }
  };

  const filtered = salons.filter(s => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.businessRegNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Salon Management & Partner Venues</h1>
          <p className="sa-page-subtitle">
            Manage all registered salon listings, verify premises credentials, audit service menus, and inspect staff.
          </p>
        </div>

        <Link to="/salons/new" className="sa-btn sa-btn-primary">
          <PlusCircle size={16} />
          <span>Add New Salon (Wizard)</span>
        </Link>
      </div>

      {/* Filter and Search Card */}
      <div className="sa-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '420px' }}>
            <Search size={16} color="var(--admin-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by salon, owner, city or GST number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'PUBLISHED', 'APPROVED', 'PENDING', 'DRAFT', 'SUSPENDED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`sa-btn sa-btn-sm ${statusFilter === st ? 'sa-btn-primary' : 'sa-btn-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Salons Table */}
      <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sa-table-wrapper" style={{ border: 'none' }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Salon Name & Category</th>
                <th>Owner & Contact</th>
                <th>Location & City</th>
                <th>Registration No.</th>
                <th>Rating</th>
                <th>Status & Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-secondary)' }}>
                    No salons found matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div
                        style={{ fontWeight: 700, color: 'var(--admin-navy)', cursor: 'pointer' }}
                        onClick={() => setSelectedSalon(s)}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{s.category}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.ownerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>{s.phone}</div>
                    </td>
                    <td>
                      <div>{s.location.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{s.location.pinCode}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.78rem', background: 'var(--admin-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                        {s.businessRegNumber || 'N/A'}
                      </code>
                    </td>
                    <td>
                      <strong>{s.rating || 4.8}★</strong> ({s.reviewsCount || 40})
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className={`sa-badge sa-badge-${s.status === 'PUBLISHED' || s.status === 'APPROVED' ? 'active' : s.status === 'PENDING' || s.status === 'PENDING_APPROVAL' ? 'pending' : 'rejected'}`}>
                          {s.status}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: s.status === 'PUBLISHED' || (s.status === 'APPROVED' && s.isPublished) ? '#059669' : '#DC2626' }}>
                          {s.status === 'PUBLISHED' || (s.status === 'APPROVED' && s.isPublished) ? '● Live on Customer App' : '○ Hidden from Customers'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedSalon(s)}
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                        >
                          Details
                        </button>
                        {(s.status !== 'PUBLISHED' && s.status !== 'APPROVED') ? (
                          <button
                            onClick={async () => {
                              await approveAndPublishSalon(s.id);
                              await loadData();
                            }}
                            className="sa-btn sa-btn-primary sa-btn-sm"
                            title="Approve and publish to Customer App"
                          >
                            Approve & Publish
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await suspendOrUnpublishSalon(s.id, 'Administrative hold');
                              await loadData();
                            }}
                            className="sa-btn sa-btn-sm"
                            style={{ background: '#FEE2E2', color: '#991B1B', border: 'none' }}
                            title="Suspend from Customer App & block bookings"
                          >
                            Suspend
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

      {/* Salon Details Inspection Modal */}
      {selectedSalon && (
        <div className="sa-modal-overlay" onClick={() => setSelectedSalon(null)}>
          <div className="sa-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--admin-navy)', fontFamily: 'var(--admin-font-heading)' }}>
                  {selectedSalon.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className={`sa-badge sa-badge-${selectedSalon.status === 'APPROVED' ? 'active' : 'pending'}`}>
                    {selectedSalon.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-secondary)' }}>ID: {selectedSalon.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedSalon(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-secondary)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Photo Showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '1.25rem' }}>
              {(selectedSalon.galleryImages?.length > 0 ? selectedSalon.galleryImages : [selectedSalon.coverImage]).map((img, i) => (
                <div key={i} style={{ height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                  <img src={img} alt="Premise" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            {/* Coordinates & Owner */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: 'var(--admin-bg)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-secondary)', textTransform: 'uppercase' }}>
                  Owner & Professional
                </span>
                <div style={{ fontWeight: 700, color: 'var(--admin-navy)', marginTop: '2px' }}>{selectedSalon.ownerName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>{selectedSalon.contactEmail}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>{selectedSalon.phone}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-secondary)', textTransform: 'uppercase' }}>
                  Physical Location
                </span>
                <div style={{ fontSize: '0.84rem', color: 'var(--admin-navy)', marginTop: '2px' }}>{selectedSalon.location?.fullAddress}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--admin-secondary)' }}>
                  {selectedSalon.location?.city}, {selectedSalon.location?.state} - {selectedSalon.location?.pinCode}
                </div>
                {selectedSalon.location?.googleMapsUrl && (
                  <a href={selectedSalon.location.googleMapsUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--admin-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Barbers & Services Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ border: '1px solid var(--admin-border)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-navy)', marginBottom: '6px' }}>
                  <Scissors size={15} /> Stylist Roster ({selectedSalon.barbers?.length || 0})
                </strong>
                {(selectedSalon.barbers || []).map(b => (
                  <div key={b.id} style={{ fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{b.name}</span>
                    <span style={{ color: 'var(--admin-secondary)' }}>{b.specialization}</span>
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid var(--admin-border)', padding: '0.85rem', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-navy)', marginBottom: '6px' }}>
                  <Store size={15} /> Services ({selectedSalon.services?.length || 0})
                </strong>
                {(selectedSalon.services || []).map(s => (
                  <div key={s.id} style={{ fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{s.name}</span>
                    <strong>₹{s.price}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(selectedSalon.status !== 'PUBLISHED' && selectedSalon.status !== 'APPROVED') ? (
                  <>
                    <button
                      onClick={async () => {
                        await approveAndPublishSalon(selectedSalon.id);
                        await loadData();
                        setSelectedSalon({ ...selectedSalon, status: 'PUBLISHED', isPublished: true, publicationStatus: 'PUBLISHED' });
                      }}
                      className="sa-btn sa-btn-primary"
                    >
                      Approve & Publish to Customer App
                    </button>
                    <button
                      onClick={async () => {
                        await updateSalonStatus(selectedSalon.id, 'REJECTED');
                        await loadData();
                        setSelectedSalon({ ...selectedSalon, status: 'REJECTED', isPublished: false, publicationStatus: 'UNPUBLISHED' });
                      }}
                      className="sa-btn sa-btn-danger"
                    >
                      Reject Application
                    </button>
                  </>
                ) : (
                  <button
                    onClick={async () => {
                      await suspendOrUnpublishSalon(selectedSalon.id, 'Administrative hold');
                      await loadData();
                      setSelectedSalon({ ...selectedSalon, status: 'SUSPENDED', isPublished: false, publicationStatus: 'UNPUBLISHED' });
                    }}
                    className="sa-btn sa-btn-danger"
                  >
                    Suspend & Remove from Customer App
                  </button>
                )}
                {selectedSalon.status === 'SUSPENDED' && (
                  <button
                    onClick={async () => {
                      await approveAndPublishSalon(selectedSalon.id);
                      await loadData();
                      setSelectedSalon({ ...selectedSalon, status: 'PUBLISHED', isPublished: true, publicationStatus: 'PUBLISHED' });
                    }}
                    className="sa-btn sa-btn-primary"
                  >
                    Re-activate & Publish
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedSalon(null)} className="sa-btn sa-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
