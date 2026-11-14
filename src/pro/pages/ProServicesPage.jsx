import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Scissors,
  Plus,
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Search,
  Tag,
  Percent,
  Sparkles,
  Layers,
  ArrowUpDown,
  Check,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import {
  getSalonServices,
  addSalonService,
  updateSalonService,
  toggleSalonServiceStatus,
  deleteSalonService,
  SERVICE_CATEGORIES
} from '../../services/centralSalonService';

const PRESET_IMAGES = [
  { label: 'Haircut', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Beard', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80' },
  { label: 'Facial', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80' },
  { label: 'Detan', url: 'https://images.unsplash.com/photo-1512290900672-1f486d3d968b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Face Scrub', url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hair Spa', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80' },
  { label: 'Massage', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hair Colour', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Grooming', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80' }
];

export default function ProServicesPage() {
  const context = useOutletContext() || {};
  const salon = context.salon || { id: 1, name: 'Glow & Grace Lounge' };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and search
  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'name' | 'duration'

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Quick Inline Price Editing
  const [inlinePriceEditId, setInlinePriceEditId] = useState(null);
  const [inlinePriceVal, setInlinePriceVal] = useState('');
  const [inlineOfferVal, setInlineOfferVal] = useState('');

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Haircut',
    defaultPrice: 800,
    price: 800,
    offerPrice: '',
    durationMinutes: 45,
    description: '',
    image: PRESET_IMAGES[0].url,
    active: true
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadServices = () => {
    try {
      const data = getSalonServices(salon.id);
      setServices(data);
    } catch (err) {
      console.error('Failed to load salon services:', err);
      showToast('Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();

    const handleSync = () => {
      loadServices();
    };

    window.addEventListener('gg_central_salons_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('gg_central_salons_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [salon.id]);

  // Handle open Add Modal
  const handleOpenAdd = () => {
    setEditingService(null);
    setFormErrors({});
    setForm({
      name: '',
      category: 'Haircut',
      defaultPrice: 800,
      price: 800,
      offerPrice: '',
      durationMinutes: 45,
      description: '',
      image: PRESET_IMAGES[0].url,
      active: true
    });
    setModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormErrors({});
    setForm({
      name: svc.name,
      category: svc.category || 'Haircut',
      defaultPrice: svc.defaultPrice || svc.price,
      price: svc.price,
      offerPrice: svc.offerPrice || '',
      durationMinutes: svc.durationMinutes || 45,
      description: svc.description || '',
      image: svc.image || PRESET_IMAGES[0].url,
      active: svc.active !== false
    });
    setModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = 'Service name is required';
    }
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Selling price must be a valid positive amount';
    }
    if (form.offerPrice !== '' && form.offerPrice !== null && form.offerPrice !== undefined) {
      const offerNum = Number(form.offerPrice);
      if (isNaN(offerNum) || offerNum < 0) {
        errors.offerPrice = 'Offer price cannot be negative';
      } else if (offerNum >= priceNum) {
        errors.offerPrice = 'Offer price must be less than regular selling price';
      }
    }
    const durationNum = Number(form.durationMinutes);
    if (isNaN(durationNum) || durationNum < 5) {
      errors.durationMinutes = 'Duration must be at least 5 minutes';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        offerPrice: form.offerPrice !== '' ? Number(form.offerPrice) : null,
        durationMinutes: Number(form.durationMinutes),
        description: form.description.trim(),
        image: form.image,
        active: form.active
      };

      if (editingService) {
        updateSalonService(salon.id, editingService.id, payload, false);
        showToast(`Updated "${payload.name}" pricing & details successfully`);
      } else {
        addSalonService(salon.id, payload);
        showToast(`Added "${payload.name}" to salon services`);
      }

      setModalOpen(false);
      loadServices();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  // Quick status toggle
  const handleToggleStatus = (service) => {
    try {
      const updated = toggleSalonServiceStatus(salon.id, service.id);
      loadServices();
      if (updated.active) {
        showToast(`"${service.name}" is now ENABLED for customer bookings`);
      } else {
        showToast(`"${service.name}" is now DISABLED and hidden from customers`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not update service status', 'error');
    }
  };

  // Inline quick price save
  const handleSaveInlinePrice = (svc) => {
    const newPrice = Number(inlinePriceVal);
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Please enter a valid positive selling price', 'error');
      return;
    }
    let newOffer = null;
    if (inlineOfferVal !== '') {
      newOffer = Number(inlineOfferVal);
      if (isNaN(newOffer) || newOffer < 0) {
        showToast('Offer price cannot be negative', 'error');
        return;
      }
      if (newOffer >= newPrice) {
        showToast('Offer price must be less than regular selling price', 'error');
        return;
      }
    }

    try {
      updateSalonService(salon.id, svc.id, {
        price: newPrice,
        offerPrice: newOffer
      }, false);
      setInlinePriceEditId(null);
      loadServices();
      showToast(`Updated price for "${svc.name}" to ₹${newOffer || newPrice}`);
    } catch (err) {
      showToast(err.message || 'Failed to update price', 'error');
    }
  };

  // Delete service
  const handleDeleteService = (serviceId) => {
    try {
      deleteSalonService(salon.id, serviceId);
      setDeleteConfirmId(null);
      loadServices();
      showToast('Service removed successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete service', 'error');
    }
  };

  // Computed counts
  const totalCount = services.length;
  const activeCount = useMemo(() => services.filter(s => s.active !== false).length, [services]);
  const inactiveCount = totalCount - activeCount;

  const lowestPrice = useMemo(() => {
    const active = services.filter(s => s.active !== false);
    if (!active.length) return 0;
    return Math.min(...active.map(s => (s.offerPrice && s.offerPrice > 0 ? s.offerPrice : s.price)));
  }, [services]);

  // Filtered & sorted services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Status filter
      if (statusTab === 'ACTIVE' && s.active === false) return false;
      if (statusTab === 'INACTIVE' && s.active !== false) return false;

      // Category filter
      if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name?.toLowerCase().includes(q);
        const matchCat = s.category?.toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.offerPrice && a.offerPrice > 0 ? a.offerPrice : a.price;
      const priceB = b.offerPrice && b.offerPrice > 0 ? b.offerPrice : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [services, statusTab, selectedCategory, searchQuery, sortBy]);

  // Preview live discount in modal form
  const modalDiscount = useMemo(() => {
    const p = Number(form.price);
    const o = Number(form.offerPrice);
    if (p > 0 && o > 0 && o < p) {
      return Math.round(((p - o) / p) * 100);
    }
    return 0;
  }, [form.price, form.offerPrice]);

  return (
    <div className="pro-services-page-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`pro-toast-notification ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={18} className="toast-icon" />}
          {toast.type === 'error' && <AlertCircle size={18} className="toast-icon" />}
          {toast.type === 'info' && <Info size={18} className="toast-icon" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="toast-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Service & Pricing Management</h1>
          <p className="pro-page-subtitle">
            Configure services, adjust your selling prices, offer special discounts, and manage availability for {salon.name}.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="pro-btn pro-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="pro-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="pro-card pro-kpi-card">
          <div className="pro-kpi-icon" style={{ background: 'rgba(8, 121, 232, 0.1)', color: 'var(--pro-blue)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="pro-kpi-value">{totalCount}</div>
            <div className="pro-kpi-label">Assigned Services</div>
          </div>
        </div>

        <div className="pro-card pro-kpi-card">
          <div className="pro-kpi-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="pro-kpi-value" style={{ color: '#059669' }}>{activeCount}</div>
            <div className="pro-kpi-label">Active & Bookable</div>
          </div>
        </div>

        <div className="pro-card pro-kpi-card">
          <div className="pro-kpi-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <EyeOff size={22} />
          </div>
          <div>
            <div className="pro-kpi-value" style={{ color: '#DC2626' }}>{inactiveCount}</div>
            <div className="pro-kpi-label">Inactive (Hidden)</div>
          </div>
        </div>

        <div className="pro-card pro-kpi-card">
          <div className="pro-kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div className="pro-kpi-value" style={{ color: '#D97706' }}>₹{lowestPrice}</div>
            <div className="pro-kpi-label">Starting From</div>
          </div>
        </div>
      </div>

      {/* Controls: Status Tabs, Search, Category Pills, and Sort */}
      <div className="pro-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Status Tabs */}
        <div className="pro-services-tabs-row">
          <div className="pro-services-status-tabs">
            <button
              className={`pro-services-tab-btn ${statusTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusTab('ALL')}
            >
              All Services <span className="tab-badge">{totalCount}</span>
            </button>
            <button
              className={`pro-services-tab-btn ${statusTab === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusTab('ACTIVE')}
            >
              Active for Customers <span className="tab-badge active">{activeCount}</span>
            </button>
            <button
              className={`pro-services-tab-btn ${statusTab === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusTab('INACTIVE')}
            >
              Inactive <span className="tab-badge inactive">{inactiveCount}</span>
            </button>
          </div>

          <div className="pro-services-sort-box">
            <ArrowUpDown size={15} color="var(--pro-text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pro-form-select pro-sort-select"
            >
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Duration: Shortest First</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="pro-search-box" style={{ maxWidth: '100%' }}>
            <Search size={16} color="var(--pro-text-muted)" className="pro-search-icon" />
            <input
              type="text"
              placeholder="Search by service name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pro-form-input pro-search-input"
            />
          </div>

          {/* Category Filter Pills (Touch Scrollable on Mobile) */}
          <div className="pro-category-pills-bar">
            {['All', ...SERVICE_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pro-category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="pro-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--pro-text-muted)' }}>
          Loading salon services catalogue...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="pro-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Scissors size={40} color="var(--pro-text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--pro-navy)', marginBottom: '0.4rem' }}>
            No services found
          </h3>
          <p style={{ color: 'var(--pro-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {searchQuery || selectedCategory !== 'All' || statusTab !== 'ALL'
              ? 'Try changing your search query or filters to find services.'
              : 'Start building your salon catalog by adding your first service.'}
          </p>
          <button onClick={handleOpenAdd} className="pro-btn pro-btn-primary">
            <Plus size={16} /> Add New Service
          </button>
        </div>
      ) : (
        <div className="pro-services-grid">
          {filteredServices.map(svc => {
            const isEditingPrice = inlinePriceEditId === svc.id;
            const finalCustomerPrice = svc.offerPrice && svc.offerPrice > 0 ? svc.offerPrice : svc.price;
            const hasDiscount = svc.offerPrice && svc.offerPrice > 0 && svc.offerPrice < svc.price;

            return (
              <div
                key={svc.id}
                className={`pro-service-card ${svc.active === false ? 'inactive-card' : ''}`}
              >
                {/* Service Image Banner with Badges */}
                <div className="pro-service-img-wrap">
                  <img
                    src={svc.image}
                    alt={svc.name}
                    className="pro-service-img"
                    onError={(e) => {
                      e.target.src = PRESET_IMAGES[0].url;
                    }}
                  />
                  <div className="pro-service-img-overlay">
                    <span className="pro-service-cat-badge">{svc.category}</span>
                    <span className={`pro-service-status-pill ${svc.active !== false ? 'active' : 'inactive'}`}>
                      {svc.active !== false ? (
                        <>
                          <Check size={11} /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={11} /> Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pro-service-content">
                  <div className="pro-service-top-row">
                    <h3 className="pro-service-title">{svc.name}</h3>
                    <div className="pro-service-duration-badge" title="Estimated service duration">
                      <Clock size={13} />
                      <span>{svc.durationMinutes} mins</span>
                    </div>
                  </div>

                  <p className="pro-service-desc">
                    {svc.description || 'Premium grooming and personal care service tailored for the distinguished guest.'}
                  </p>

                  {/* Pricing Comparison Box */}
                  <div className="pro-pricing-box">
                    {/* Admin Suggested Baseline */}
                    <div className="pro-price-row suggested">
                      <span className="price-label">
                        <Tag size={12} /> Admin Suggested:
                      </span>
                      <span className="price-value suggested">₹{svc.defaultPrice || svc.price}</span>
                    </div>

                    {/* Salon Selling Price & Optional Offer */}
                    {isEditingPrice ? (
                      <div className="pro-inline-price-editor">
                        <div className="inline-input-group">
                          <label>Selling Price (₹)</label>
                          <input
                            type="number"
                            min="1"
                            value={inlinePriceVal}
                            onChange={(e) => setInlinePriceVal(e.target.value)}
                            className="pro-form-input sm"
                          />
                        </div>
                        <div className="inline-input-group">
                          <label>Offer Price (Optional ₹)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Optional"
                            value={inlineOfferVal}
                            onChange={(e) => setInlineOfferVal(e.target.value)}
                            className="pro-form-input sm"
                          />
                        </div>
                        <div className="inline-action-btns">
                          <button
                            onClick={() => handleSaveInlinePrice(svc)}
                            className="pro-btn pro-btn-primary pro-btn-sm"
                          >
                            Save Price
                          </button>
                          <button
                            onClick={() => setInlinePriceEditId(null)}
                            className="pro-btn pro-btn-secondary pro-btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="pro-price-row selling">
                          <span className="price-label">Salon Selling Price:</span>
                          <span className={`price-value regular ${hasDiscount ? 'strikethrough' : ''}`}>
                            ₹{svc.price}
                          </span>
                        </div>

                        {hasDiscount && (
                          <div className="pro-price-row offer">
                            <span className="price-label">
                              <Sparkles size={13} color="#D97706" /> Special Offer:
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="price-value offer">₹{svc.offerPrice}</span>
                              <span className="pro-discount-pill">
                                {svc.discountPercent || Math.round(((svc.price - svc.offerPrice) / svc.price) * 100)}% OFF
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Customer Pays Highlight */}
                        <div className="pro-customer-pays-banner">
                          <span>Customer Pays:</span>
                          <strong>₹{finalCustomerPrice}</strong>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pro-service-card-actions">
                    {/* Toggle Active Switch */}
                    <button
                      onClick={() => handleToggleStatus(svc)}
                      className={`pro-action-toggle-btn ${svc.active !== false ? 'active' : 'inactive'}`}
                      title={svc.active !== false ? 'Click to disable service (hide from customers)' : 'Click to enable service (make bookable)'}
                    >
                      {svc.active !== false ? (
                        <>
                          <Eye size={14} /> <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> <span>Disabled</span>
                        </>
                      )}
                    </button>

                    {/* Quick Price Edit Button */}
                    {!isEditingPrice && (
                      <button
                        onClick={() => {
                          setInlinePriceEditId(svc.id);
                          setInlinePriceVal(String(svc.price));
                          setInlineOfferVal(svc.offerPrice ? String(svc.offerPrice) : '');
                        }}
                        className="pro-action-btn price-edit"
                        title="Quick edit selling and offer prices"
                      >
                        <DollarSign size={14} />
                        <span>Edit Price</span>
                      </button>
                    )}

                    {/* Full Edit Modal */}
                    <button
                      onClick={() => handleOpenEdit(svc)}
                      className="pro-action-btn edit"
                      title="Edit all service details"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    {/* Delete Action */}
                    {deleteConfirmId === svc.id ? (
                      <div className="pro-delete-confirm-group">
                        <button
                          onClick={() => handleDeleteService(svc.id)}
                          className="pro-btn pro-btn-sm danger-confirm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="pro-btn pro-btn-sm secondary-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(svc.id)}
                        className="pro-action-btn delete"
                        title="Delete service from catalogue"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="pro-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="pro-modal-dialog pro-service-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            <div className="pro-modal-header">
              <h2 className="pro-modal-title">
                {editingService ? `Edit Service: ${editingService.name}` : 'Add New Salon Service'}
              </h2>
              <button
                className="pro-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pro-service-modal-form">
              {/* Service Name */}
              <div className="pro-form-group">
                <label className="pro-form-label">
                  Service Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Beard Sculpt & Steam"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`pro-form-input ${formErrors.name ? 'error' : ''}`}
                />
                {formErrors.name && <span className="pro-field-error">{formErrors.name}</span>}
              </div>

              {/* Category and Duration */}
              <div className="pro-form-row">
                <div className="pro-form-group">
                  <label className="pro-form-label">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="pro-form-select"
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pro-form-group">
                  <label className="pro-form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                    className={`pro-form-input ${formErrors.durationMinutes ? 'error' : ''}`}
                  />
                  {formErrors.durationMinutes && (
                    <span className="pro-field-error">{formErrors.durationMinutes}</span>
                  )}
                </div>
              </div>

              {/* Pricing Section in Modal */}
              <div className="pro-modal-pricing-card">
                <h4 className="pricing-card-title">
                  <DollarSign size={16} /> Pricing Configuration
                </h4>

                <div className="pro-form-row">
                  {/* Read-Only Admin Baseline */}
                  <div className="pro-form-group">
                    <label className="pro-form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Admin Suggested Price (₹)
                      <span className="pro-hint-tag">Super Admin</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`₹${form.defaultPrice}`}
                      className="pro-form-input disabled-input"
                    />
                    <small className="pro-field-hint">
                      Base recommendation set by platform administrators.
                    </small>
                  </div>

                  {/* Salon Selling Price */}
                  <div className="pro-form-group">
                    <label className="pro-form-label">
                      Salon Selling Price (₹) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="10"
                      placeholder="e.g. 850"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={`pro-form-input ${formErrors.price ? 'error' : ''}`}
                    />
                    {formErrors.price && <span className="pro-field-error">{formErrors.price}</span>}
                  </div>
                </div>

                <div className="pro-form-row" style={{ marginTop: '0.75rem' }}>
                  {/* Optional Offer Price */}
                  <div className="pro-form-group">
                    <label className="pro-form-label">
                      Offer Price (₹) <span className="opt">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      placeholder="Leave blank for regular price"
                      value={form.offerPrice}
                      onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                      className={`pro-form-input ${formErrors.offerPrice ? 'error' : ''}`}
                    />
                    {formErrors.offerPrice && (
                      <span className="pro-field-error">{formErrors.offerPrice}</span>
                    )}
                  </div>

                  {/* Live Final Price Calculation */}
                  <div className="pro-form-group">
                    <label className="pro-form-label">Customer-Facing Preview</label>
                    <div className="pro-price-preview-box">
                      <div className="preview-val">
                        ₹{form.offerPrice && Number(form.offerPrice) > 0 ? form.offerPrice : (form.price || 0)}
                      </div>
                      {modalDiscount > 0 && (
                        <span className="pro-discount-pill">{modalDiscount}% OFF</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="pro-form-group">
                <label className="pro-form-label">Service Description</label>
                <textarea
                  rows="3"
                  placeholder="Detail what is included in this service..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="pro-form-textarea"
                />
              </div>

              {/* Image URL & Preset Pickers */}
              <div className="pro-form-group">
                <label className="pro-form-label">Service Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="pro-form-input"
                />

                <div style={{ marginTop: '0.5rem' }}>
                  <small style={{ color: 'var(--pro-text-muted)', display: 'block', marginBottom: '6px' }}>
                    Quick presets:
                  </small>
                  <div className="pro-preset-imgs-bar">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setForm({ ...form, image: preset.url })}
                        className={`pro-preset-btn ${form.image === preset.url ? 'active' : ''}`}
                      >
                        <img src={preset.url} alt={preset.label} />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enable / Disable Checkbox */}
              <div className="pro-form-check-group">
                <label className="pro-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="pro-checkbox"
                  />
                  <span>
                    <strong>Make Active & Available for Customer Discovery</strong>
                    <small style={{ display: 'block', color: 'var(--pro-text-muted)' }}>
                      When checked, this service appears in the customer app, salon page, and booking screen.
                    </small>
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pro-modal-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="pro-btn pro-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="pro-btn pro-btn-primary">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
