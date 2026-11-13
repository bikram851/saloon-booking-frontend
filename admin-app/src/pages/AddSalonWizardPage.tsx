import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  User,
  MapPin,
  Image,
  Scissors,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  Save
} from 'lucide-react';
import { saveSalon, logAdminAction } from '../services/firestoreService';
import { createProfessionalAccount } from '../services/cloudFunctionsService';
import { uploadSalonPhoto } from '../services/storageService';
import { SalonDocument, SalonService, SalonBarber, SalonWorkingHoursDay } from '../types';

const INITIAL_SERVICES: SalonService[] = [
  { id: 1, name: "Precision Haircut & Style", category: "Hair", durationMinutes: 45, price: 1200, description: "Scissor finish and consultation", active: true },
  { id: 2, name: "Beard Sculpt & Razor Edge", category: "Beard grooming", durationMinutes: 30, price: 650, description: "Hot towel prep and shaping", active: true },
  { id: 3, name: "Tan Clear & Skin Brightening", category: "Detan", durationMinutes: 35, price: 1100, description: "Herbal detan mask", active: true },
  { id: 4, name: "Deep Exfoliating Face Scrub", category: "Face scrub", durationMinutes: 30, price: 900, description: "Walnut & aloe scrub", active: true },
  { id: 5, name: "Glow Radiance Luxury Facial", category: "Facial", durationMinutes: 60, price: 2200, description: "Antioxidant serum with gold mask", active: true },
  { id: 6, name: "Aromatherapy Head Massage", category: "Massage", durationMinutes: 40, price: 950, description: "Warm therapeutic oils", active: true },
  { id: 7, name: "Keratin Infusion Hair Spa", category: "Hair spa", durationMinutes: 50, price: 1800, description: "Deep conditioning steam", active: true },
  { id: 8, name: "Executive Royal Grooming Combo", category: "Premium packages", durationMinutes: 90, price: 2800, description: "Haircut + Beard + Facial", active: true }
];

const INITIAL_HOURS: SalonWorkingHoursDay[] = [
  { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Friday", openTime: "09:00", closeTime: "21:30", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Saturday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" },
  { day: "Sunday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" }
];

const INITIAL_BARBERS: SalonBarber[] = [
  { id: 1, name: "Alex Rivera", experienceYears: 8, specialization: "Signature Skin Fade & Scissor Cut", phone: "+91 98765 00001", email: "alex@glowgrace.com", availability: "ON_DUTY", rating: 4.9 },
  { id: 2, name: "Elena Rostova", experienceYears: 6, specialization: "Creative Color & Balayage", phone: "+91 98765 00002", email: "elena@glowgrace.com", availability: "ON_DUTY", rating: 4.85 }
];

export const AddSalonWizardPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [provisionSuccessModal, setProvisionSuccessModal] = useState<any>(null);

  // Form State
  const [salonData, setSalonData] = useState({
    name: 'Aura Luxury Spa & Salon',
    description: 'Premier urban retreat offering precision hairdressing, relaxing scalp therapies and luxury bridal packages.',
    businessRegNumber: 'GSTIN29AABCS8899K1Z5',
    category: 'Luxury Unisex Lounge',
    yearEstablished: 2023,
    contactEmail: 'contact@aurasalon.in',
    phone: '+91 98765 55667',
    website: 'https://aurasalon.in',

    ownerName: 'Priya Sen Sharma',
    professionalName: 'Priya Sen Sharma',
    professionalEmail: 'priya.sharma@aurasalon.in',
    professionalPhone: '+91 98765 55667',
    designation: 'Managing Director & Lead Stylist',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',

    fullAddress: '74, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    latitude: 12.9716,
    longitude: 77.6412,
    googleMapsUrl: 'https://maps.google.com/?q=12.9716,77.6412',
    googlePlaceId: 'ChIJ49Qh37KrrjsRCjQ5TfqZJbA',

    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    exteriorImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    interiorImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    receptionImage: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80'
    ],

    services: INITIAL_SERVICES,
    workingHours: INITIAL_HOURS,
    barbers: INITIAL_BARBERS,
    status: 'APPROVED' as const
  });

  const stepsList = [
    { num: 1, title: 'Salon Details', icon: Store },
    { num: 2, title: 'Owner & Pro', icon: User },
    { num: 3, title: 'Location & Maps', icon: MapPin },
    { num: 4, title: 'Photography', icon: Image },
    { num: 5, title: 'Services Menu', icon: Scissors },
    { num: 6, title: 'Working Hours', icon: Clock },
    { num: 7, title: 'Barber Roster', icon: Users },
    { num: 8, title: 'Review & Submit', icon: CheckCircle2 }
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 8));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinalSubmit = async (statusChoice: 'APPROVED' | 'PENDING' | 'DRAFT' | 'PUBLISHED') => {
    setSubmitting(true);
    const newId = `salon_${Date.now()}`;

    const newDoc: SalonDocument = {
      id: newId,
      name: salonData.name,
      description: salonData.description,
      businessRegNumber: salonData.businessRegNumber,
      category: salonData.category,
      yearEstablished: Number(salonData.yearEstablished),
      contactEmail: salonData.contactEmail,
      phone: salonData.phone,
      website: salonData.website,
      ownerName: salonData.ownerName,
      professionalName: salonData.professionalName,
      professionalEmail: salonData.professionalEmail,
      professionalPhone: salonData.professionalPhone,
      location: {
        fullAddress: salonData.fullAddress,
        city: salonData.city,
        state: salonData.state,
        pinCode: salonData.pinCode,
        latitude: salonData.latitude,
        longitude: salonData.longitude,
        googleMapsUrl: salonData.googleMapsUrl,
        googlePlaceId: salonData.googlePlaceId
      },
      coverImage: salonData.coverImage,
      exteriorImage: salonData.exteriorImage,
      interiorImage: salonData.interiorImage,
      receptionImage: salonData.receptionImage,
      galleryImages: salonData.galleryImages,
      services: salonData.services,
      workingHours: salonData.workingHours,
      barbers: salonData.barbers,
      status: (statusChoice === 'PUBLISHED' || statusChoice === 'APPROVED') ? 'PUBLISHED' : statusChoice,
      publicationStatus: (statusChoice === 'PUBLISHED' || statusChoice === 'APPROVED') ? 'PUBLISHED' : 'PENDING_APPROVAL',
      isPublished: statusChoice === 'PUBLISHED' || statusChoice === 'APPROVED',
      rating: 4.9,
      reviewsCount: 1,
      chairsCount: 6,
      staffCount: salonData.barbers.length || 4,
      totalAppointmentsCount: 0,
      totalRevenue: 0,
      submittedAt: new Date().toISOString(),
      approvedAt: (statusChoice === 'PUBLISHED' || statusChoice === 'APPROVED') ? new Date().toISOString() : undefined
    };

    try {
      await saveSalon(newDoc);
      await logAdminAction(
        'ONBOARD_SALON',
        'salons',
        newId,
        `Onboarded salon "${newDoc.name}" with status ${statusChoice}.`
      );

      // Create Professional Account via Cloud Function
      if (statusChoice === 'APPROVED' || statusChoice === 'PUBLISHED') {
        const proRes = await createProfessionalAccount({
          salonId: newId,
          salonName: newDoc.name,
          ownerName: newDoc.ownerName,
          email: newDoc.professionalEmail,
          phone: newDoc.professionalPhone
        });
        setProvisionSuccessModal(proRes);
      } else {
        navigate('/salons');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="sa-page-header">
        <div>
          <h1 className="sa-page-title">Onboard Enterprise Salon Venue</h1>
          <p className="sa-page-subtitle">
            8-Step comprehensive onboarding wizard: verify business credentials, set geolocation, configure treatments & provision professional credentials.
          </p>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="wizard-steps-track">
        {stepsList.map(s => {
          const Icon = s.icon as any;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`wizard-step-node ${isActive ? 'active' : isDone ? 'completed' : ''}`}
            >
              <div className="wizard-step-number">{s.num}</div>
              <Icon size={14} />
              <span>{s.title}</span>
            </div>
          );
        })}
      </div>

      <div className="sa-card" style={{ padding: '2rem' }}>
        {/* Step 1: Salon Details */}
        {step === 1 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={20} color="var(--admin-blue)" /> Step 1: Salon Brand Coordinates & Business Registration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="sa-form-group">
                <label className="sa-form-label">Salon Legal Trading Name *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.name}
                  onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Salon Category / Venue Type *</label>
                <select
                  className="sa-form-select"
                  value={salonData.category}
                  onChange={(e) => setSalonData({ ...salonData, category: e.target.value })}
                >
                  <option value="Luxury Unisex Lounge">Luxury Unisex Lounge</option>
                  <option value="Artisanal Hair Studio">Artisanal Hair Studio</option>
                  <option value="Gentlemen's Barbershop">Gentlemen's Barbershop</option>
                  <option value="Ayurvedic Spa & Wellness">Ayurvedic Spa & Wellness</option>
                  <option value="Bridal & Beauty Bar">Bridal & Beauty Bar</option>
                </select>
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">GST / Business Registration Number *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.businessRegNumber}
                  onChange={(e) => setSalonData({ ...salonData, businessRegNumber: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Year Established</label>
                <input
                  type="number"
                  className="sa-form-input"
                  value={salonData.yearEstablished}
                  onChange={(e) => setSalonData({ ...salonData, yearEstablished: Number(e.target.value) })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Customer Support Phone *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.phone}
                  onChange={(e) => setSalonData({ ...salonData, phone: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Official Public Email *</label>
                <input
                  type="email"
                  required
                  className="sa-form-input"
                  value={salonData.contactEmail}
                  onChange={(e) => setSalonData({ ...salonData, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="sa-form-group" style={{ marginTop: '1rem' }}>
              <label className="sa-form-label">Editorial Description & Specialty Bio</label>
              <textarea
                rows={3}
                className="sa-form-textarea"
                value={salonData.description}
                onChange={(e) => setSalonData({ ...salonData, description: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Owner & Professional */}
        {step === 2 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--admin-blue)" /> Step 2: Owner & Professional Account Provisioning Target
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="sa-form-group">
                <label className="sa-form-label">Owner Full Legal Name *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.ownerName}
                  onChange={(e) => setSalonData({ ...salonData, ownerName: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Designated Professional Name *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.professionalName}
                  onChange={(e) => setSalonData({ ...salonData, professionalName: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Professional Login Email (Used for Portal Auth) *</label>
                <input
                  type="email"
                  required
                  className="sa-form-input"
                  value={salonData.professionalEmail}
                  onChange={(e) => setSalonData({ ...salonData, professionalEmail: e.target.value })}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>
                  A Firebase Auth account with role PROFESSIONAL will be generated for this email.
                </span>
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Direct Mobile Number *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.professionalPhone}
                  onChange={(e) => setSalonData({ ...salonData, professionalPhone: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Professional Designation</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.designation}
                  onChange={(e) => setSalonData({ ...salonData, designation: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Profile Photo URL</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.profilePhoto}
                  onChange={(e) => setSalonData({ ...salonData, profilePhoto: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location & Geocoding */}
        {step === 3 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--admin-orange)" /> Step 3: Geographical Coordinates & Google Maps Verification
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="sa-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="sa-form-label">Full Street Address *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.fullAddress}
                  onChange={(e) => setSalonData({ ...salonData, fullAddress: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">City *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.city}
                  onChange={(e) => setSalonData({ ...salonData, city: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">State *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.state}
                  onChange={(e) => setSalonData({ ...salonData, state: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">PIN Code *</label>
                <input
                  type="text"
                  required
                  className="sa-form-input"
                  value={salonData.pinCode}
                  onChange={(e) => setSalonData({ ...salonData, pinCode: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Google Maps URL / Share Link</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.googleMapsUrl}
                  onChange={(e) => setSalonData({ ...salonData, googleMapsUrl: e.target.value })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="sa-form-input"
                  value={salonData.latitude}
                  onChange={(e) => setSalonData({ ...salonData, latitude: parseFloat(e.target.value) })}
                />
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="sa-form-input"
                  value={salonData.longitude}
                  onChange={(e) => setSalonData({ ...salonData, longitude: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Interactive Map Coordinates Preview */}
            <div style={{ marginTop: '1.25rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={22} color="var(--admin-blue)" />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--admin-navy)' }}>
                    Geocoded Coordinates: {salonData.latitude.toFixed(4)}° N, {salonData.longitude.toFixed(4)}° E
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-secondary)', display: 'block' }}>
                    {salonData.fullAddress}, {salonData.city}
                  </span>
                </div>
              </div>

              {salonData.googleMapsUrl && (
                <a href={salonData.googleMapsUrl} target="_blank" rel="noreferrer" className="sa-btn sa-btn-secondary sa-btn-sm">
                  <span>Verify on Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Photography (Firebase Storage) */}
        {step === 4 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={20} color="var(--admin-blue)" /> Step 4: Salon Photography Showcase (Firebase Storage)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="sa-form-group">
                <label className="sa-form-label">Cover Showcase Photo URL *</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.coverImage}
                  onChange={(e) => setSalonData({ ...salonData, coverImage: e.target.value })}
                />
                <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', marginTop: '6px', border: '1px solid var(--admin-border)' }}>
                  <img src={salonData.coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Salon Exterior Photo URL</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.exteriorImage}
                  onChange={(e) => setSalonData({ ...salonData, exteriorImage: e.target.value })}
                />
                <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', marginTop: '6px', border: '1px solid var(--admin-border)' }}>
                  <img src={salonData.exteriorImage} alt="Exterior preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Salon Interior & Styling Stations</label>
                <input
                  type="text"
                  className="sa-form-input"
                  value={salonData.interiorImage}
                  onChange={(e) => setSalonData({ ...salonData, interiorImage: e.target.value })}
                />
                <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', marginTop: '6px', border: '1px solid var(--admin-border)' }}>
                  <img src={salonData.interiorImage} alt="Interior preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ border: '2px dashed var(--admin-border)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: 'var(--admin-bg)' }}>
              <Upload size={32} color="var(--admin-blue)" style={{ margin: '0 auto 8px' }} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--admin-navy)', display: 'block' }}>
                Firebase Storage Multi-file Upload Zone
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-secondary)', margin: '4px 0 1rem' }}>
                Supported formats: JPG, PNG, WEBP up to 10MB per image.
              </p>
              <label className="sa-btn sa-btn-secondary sa-btn-sm" style={{ cursor: 'pointer' }}>
                <span>Select Pictures to Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      const url = await uploadSalonPhoto('new_onboarding', 'gallery', file);
                      setSalonData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
                    }
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Services */}
        {step === 5 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scissors size={20} color="var(--admin-blue)" /> Step 5: Treatments & Menu Pricing ({salonData.services.length})
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Treatment Name</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Price (₹ INR)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salonData.services.map((svc, i) => (
                    <tr key={svc.id}>
                      <td style={{ fontWeight: 600, color: 'var(--admin-navy)' }}>{svc.name}</td>
                      <td><span className="sa-badge sa-badge-info">{svc.category}</span></td>
                      <td>{svc.durationMinutes} mins</td>
                      <td style={{ fontWeight: 700 }}>₹{svc.price}</td>
                      <td><span className="sa-badge sa-badge-active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 6: Working Hours */}
        {step === 6 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--admin-blue)" /> Step 6: 7-Day Operational Hours & Breaks
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Open Time</th>
                    <th>Close Time</th>
                    <th>Break Interval</th>
                  </tr>
                </thead>
                <tbody>
                  {salonData.workingHours.map((row, idx) => (
                    <tr key={row.day}>
                      <td style={{ fontWeight: 700, color: 'var(--admin-navy)' }}>{row.day}</td>
                      <td>
                        <span className="sa-badge sa-badge-active">Open</span>
                      </td>
                      <td>{row.openTime}</td>
                      <td>{row.closeTime}</td>
                      <td>{row.breakStart} to {row.breakEnd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 7: Barber Roster */}
        {step === 7 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--admin-blue)" /> Step 7: Resident Barbers & Stylist Stations ({salonData.barbers.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {salonData.barbers.map(b => (
                <div key={b.id} style={{ border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--admin-navy)' }}>{b.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-secondary)' }}>{b.specialization}</div>
                    </div>
                    <span className="sa-badge sa-badge-active">On Duty</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-secondary)', marginTop: '8px' }}>
                    <div>Experience: {b.experienceYears} Years</div>
                    <div>Phone: {b.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Review & Submit */}
        {step === 8 && (
          <div>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="#10B981" /> Step 8: Comprehensive Verification & Audit Submission
            </h3>

            <div style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>Salon Name:</span>
                  <strong style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>GST / Reg Number:</span>
                  <strong style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.businessRegNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>Owner:</span>
                  <strong style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.ownerName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>Pro Auth Email:</span>
                  <strong style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.professionalEmail}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>Location:</span>
                  <span style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.fullAddress}, {salonData.city}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--admin-secondary)' }}>Menu Treatments:</span>
                  <strong style={{ color: 'var(--admin-navy)', display: 'block' }}>{salonData.services.length} services configured</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit('DRAFT')}
                className="sa-btn sa-btn-secondary"
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit('PENDING')}
                className="sa-btn sa-btn-orange"
              >
                Submit for Audit (Pending)
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit('PUBLISHED')}
                className="sa-btn sa-btn-primary"
              >
                {submitting ? 'Publishing & Provisioning...' : 'Approve & Publish to Customer App'}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--admin-border-subtle)', paddingTop: '1.25rem' }}>
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrev}
            className="sa-btn sa-btn-secondary"
          >
            <ArrowLeft size={16} /> Previous Step
          </button>

          {step < 8 && (
            <button
              type="button"
              onClick={handleNext}
              className="sa-btn sa-btn-primary"
            >
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Account Provisioned Success Modal */}
      {provisionSuccessModal && (
        <div className="sa-modal-overlay">
          <div className="sa-modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--admin-navy)' }}>
                Professional Account Provisioned!
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--admin-secondary)' }}>
                Firebase Auth user and Firestore profile were securely created by Cloud Function.
              </p>
            </div>

            <div style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-secondary)' }}>Login Email:</span>
                <strong>{provisionSuccessModal.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-secondary)' }}>Temporary Password:</span>
                <code style={{ background: '#FFF', padding: '2px 6px', borderRadius: '4px', color: 'var(--admin-orange)', fontWeight: 700 }}>
                  {provisionSuccessModal.tempPassword}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-secondary)' }}>Assigned Role:</span>
                <span className="sa-badge sa-badge-info">PROFESSIONAL</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `Glow & Grace Professional Credentials:\nEmail: ${provisionSuccessModal.email}\nTemp Password: ${provisionSuccessModal.tempPassword}`
                  );
                  alert("Credentials copied to clipboard!");
                }}
                className="sa-btn sa-btn-secondary"
              >
                Copy Credentials
              </button>
              <button
                type="button"
                onClick={() => navigate('/salons')}
                className="sa-btn sa-btn-primary"
              >
                View in Salons Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
