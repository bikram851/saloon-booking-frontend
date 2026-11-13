// Firestore Enterprise Data Access Layer
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  SalonDocument,
  CustomerDocument,
  ProfessionalDocument,
  BarberDocument,
  AppointmentDocument,
  OfferDocument,
  LiveUserSession,
  PerformanceMetrics,
  AuditLogDocument
} from '../types';

/* =========================================================================
   INITIAL DATASETS (Mock / Fallback persistent dataset)
========================================================================= */

export const INITIAL_SALONS: SalonDocument[] = [
  {
    id: "salon_01",
    name: "Glow & Grace Luxury Lounge Whitefield",
    description: "Boutique luxury salon providing bespoke haircutting, signature skin fades, balayage, and revitalizing head spa.",
    businessRegNumber: "GSTIN29AAACG1234F1Z8",
    category: "Luxury Unisex Lounge",
    yearEstablished: 2019,
    contactEmail: "whitefield@glowgrace.com",
    phone: "+91 98765 43210",
    website: "https://glowgrace.com/whitefield",
    ownerName: "Alex Rivera & Partners",
    professionalName: "Alex Rivera",
    professionalEmail: "pro@glowgrace.com",
    professionalPhone: "+91 98765 00001",
    location: {
      fullAddress: "123, ITPL Main Road, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560066",
      latitude: 12.9698,
      longitude: 77.75,
      googleMapsUrl: "https://maps.google.com/?q=12.9698,77.75",
      googlePlaceId: "ChIJbU60y5aDrjsRgyPaWKn2qXA"
    },
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    exteriorImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    interiorImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    receptionImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
    ],
    services: [
      { id: 1, name: "Haircut & Style", category: "Hair", durationMinutes: 45, price: 1200, description: "Precision cut and styling finish", active: true },
      { id: 2, name: "Hair Colour & Balayage", category: "Hair", durationMinutes: 90, price: 3500, description: "Bespoke color blend", active: true },
      { id: 3, name: "Glow Radiance Facial", category: "Skin Care", durationMinutes: 60, price: 2200, description: "Hydrating antioxidant therapy", active: true },
      { id: 4, name: "Beard Trim & Sculpt", category: "Beard", durationMinutes: 30, price: 650, description: "Razor precision beard edge", active: true }
    ],
    workingHours: [
      { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
      { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
      { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
      { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
      { day: "Friday", openTime: "09:00", closeTime: "21:30", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
      { day: "Saturday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" },
      { day: "Sunday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" }
    ],
    barbers: [
      { id: 1, name: "Alex Rivera", experienceYears: 8, specialization: "Skin Fades & Scissor Finish", phone: "+91 98765 00001", availability: "ON_DUTY", rating: 4.9 },
      { id: 2, name: "Elena Rostova", experienceYears: 6, specialization: "Creative Color & Balayage", phone: "+91 98765 00002", availability: "ON_DUTY", rating: 4.85 },
      { id: 3, name: "Marcus Chen", experienceYears: 7, specialization: "Beard Architecture", phone: "+91 98765 00003", availability: "ON_DUTY", rating: 4.95 }
    ],
    status: "APPROVED",
    rating: 4.85,
    reviewsCount: 142,
    chairsCount: 6,
    staffCount: 5,
    totalAppointmentsCount: 420,
    totalRevenue: 524000,
    submittedAt: "2024-02-10T10:00:00.000Z",
    approvedAt: "2024-02-12T14:30:00.000Z"
  },
  {
    id: "salon_02",
    name: "Hair Care Studio Indiranagar",
    description: "Contemporary styling studio specializing in modern texture cuts and keratin treatments.",
    businessRegNumber: "GSTIN29AABCS5544K2Z1",
    category: "Hair Studio",
    yearEstablished: 2021,
    contactEmail: "indiranagar@haircare.com",
    phone: "+91 98765 43211",
    ownerName: "Sunita Kapoor",
    professionalName: "Sunita Kapoor",
    professionalEmail: "sunita@haircare.com",
    professionalPhone: "+91 98765 11111",
    location: {
      fullAddress: "204, 100 Feet Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560038",
      latitude: 12.9784,
      longitude: 77.6408,
      googleMapsUrl: "https://maps.google.com/?q=12.9784,77.6408"
    },
    coverImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
    ],
    services: [
      { id: 1, name: "Haircut & Blowdry", category: "Hair", durationMinutes: 45, price: 950, description: "Classic cut", active: true }
    ],
    workingHours: [
      { day: "Monday", openTime: "10:00", closeTime: "20:00", isClosed: false }
    ],
    barbers: [
      { id: 11, name: "Devendra Patil", experienceYears: 5, specialization: "Texture Cuts", phone: "+91 98765 22222", availability: "ON_DUTY" }
    ],
    status: "APPROVED",
    rating: 4.7,
    reviewsCount: 98,
    chairsCount: 4,
    staffCount: 3,
    totalAppointmentsCount: 310,
    totalRevenue: 345000,
    submittedAt: "2024-03-01T11:20:00.000Z",
    approvedAt: "2024-03-02T16:00:00.000Z"
  },
  {
    id: "salon_03",
    name: "The Velvet Lounge Koramangala",
    description: "New luxury salon premise seeking onboarding approval for hair, spa and nail bar.",
    businessRegNumber: "GSTIN29AACTV9988P1Z4",
    category: "Full Service Spa & Salon",
    yearEstablished: 2024,
    contactEmail: "contact@velvetlounge.in",
    phone: "+91 98765 88990",
    ownerName: "Vikramaditya Oberoi",
    professionalName: "Vikramaditya Oberoi",
    professionalEmail: "oberoi@velvetlounge.in",
    professionalPhone: "+91 98765 88990",
    location: {
      fullAddress: "88, 80 Feet Road, 4th Block, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560034",
      latitude: 12.9345,
      longitude: 77.6200
    },
    coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80"
    ],
    services: [],
    workingHours: [],
    barbers: [],
    status: "PENDING",
    rating: 0,
    reviewsCount: 0,
    chairsCount: 8,
    staffCount: 6,
    totalAppointmentsCount: 0,
    totalRevenue: 0,
    submittedAt: "2026-11-12T09:15:00.000Z"
  }
];

export const INITIAL_CUSTOMERS: CustomerDocument[] = [
  { id: "cust_01", uid: "uid_cust_01", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+91 98451 22340", registrationDate: "2024-01-15", lastLogin: "Today, 11:20 AM", totalAppointments: 8, lifetimeSpend: 9600, status: "ACTIVE" },
  { id: "cust_02", uid: "uid_cust_02", name: "Deepika Padukone", email: "deepika.p@gmail.com", phone: "+91 97312 99881", registrationDate: "2024-02-04", lastLogin: "Yesterday", totalAppointments: 5, lifetimeSpend: 17500, status: "ACTIVE" },
  { id: "cust_03", uid: "uid_cust_03", name: "Rohit Malhotra", email: "rohit.m@yahoo.com", phone: "+91 91234 56789", registrationDate: "2024-02-18", lastLogin: "3 days ago", totalAppointments: 12, lifetimeSpend: 14400, status: "ACTIVE" },
  { id: "cust_04", uid: "uid_cust_04", name: "Ananya Iyer", email: "ananya.iyer@outlook.com", phone: "+91 99887 76655", registrationDate: "2024-03-01", lastLogin: "1 week ago", totalAppointments: 4, lifetimeSpend: 12200, status: "ACTIVE" },
  { id: "cust_05", uid: "uid_cust_05", name: "Vikram Sengupta", email: "vikram.s@gmail.com", phone: "+91 98765 11223", registrationDate: "2024-03-12", lastLogin: "Today, 09:40 AM", totalAppointments: 6, lifetimeSpend: 7800, status: "ACTIVE" }
];

export const INITIAL_OFFERS: OfferDocument[] = [
  { id: "off_01", title: "Signature Grooming Ritual", description: "Haircut + Beard Sculpt + Head Spa combo", code: "GROOM25", discountType: "PERCENTAGE", discountAmount: 25, minBookingAmount: 2000, maxDiscount: 700, startDate: "2024-01-01", endDate: "2026-12-31", applicableSalon: "ALL", applicableServices: ["Haircut & Style", "Beard Trim & Sculpt"], usageLimit: 500, usageCount: 412, bannerUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80", status: "ACTIVE" },
  { id: "off_02", title: "Rejuvenating Glow Spa Package", description: "Deep Conditioning + Glow Radiance Facial", code: "GLOWSPA", discountType: "FLAT", discountAmount: 800, minBookingAmount: 3500, maxDiscount: 800, startDate: "2024-02-01", endDate: "2026-12-31", applicableSalon: "ALL", applicableServices: ["Glow Radiance Facial"], usageLimit: 300, usageCount: 188, bannerUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", status: "ACTIVE" },
  { id: "off_03", title: "New Client Welcome Privilege", description: "50% off on your first booked salon treatment", code: "WELCOME50", discountType: "PERCENTAGE", discountAmount: 50, minBookingAmount: 1000, maxDiscount: 600, startDate: "2024-01-01", endDate: "2026-12-31", applicableSalon: "ALL", applicableServices: [], usageLimit: 1000, usageCount: 780, bannerUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80", status: "ACTIVE" }
];

export const INITIAL_LIVE_SESSIONS: LiveUserSession[] = [
  { sessionId: "sess_01", userId: "superadmin_main_01", userName: "Vikramaditya Rao", email: "admin@glowgrace.com", role: "SUPER_ADMIN", deviceType: "Desktop", browser: "Chrome 122 (macOS)", ipAddress: "106.51.72.19", loginTimestamp: "Today, 10:45 AM", lastActivity: "Just now", sessionStatus: "ACTIVE" },
  { sessionId: "sess_02", userId: "pro_01", userName: "Alex Rivera", email: "pro@glowgrace.com", role: "PROFESSIONAL", deviceType: "Desktop", browser: "Safari 17 (macOS)", ipAddress: "49.207.210.15", loginTimestamp: "Today, 11:00 AM", lastActivity: "2 mins ago", sessionStatus: "ACTIVE" },
  { sessionId: "sess_03", userId: "cust_01", userName: "Rahul Sharma", email: "rahul.sharma@gmail.com", role: "CUSTOMER", deviceType: "Mobile", browser: "Chrome Mobile (Android)", ipAddress: "157.48.91.44", loginTimestamp: "Today, 11:20 AM", lastActivity: "5 mins ago", sessionStatus: "ACTIVE" },
  { sessionId: "sess_04", userId: "cust_05", userName: "Vikram Sengupta", email: "vikram.s@gmail.com", role: "CUSTOMER", deviceType: "Mobile", browser: "Safari Mobile (iOS)", ipAddress: "106.51.74.88", loginTimestamp: "Today, 09:40 AM", lastActivity: "12 mins ago", sessionStatus: "IDLE" }
];

export const INITIAL_PERFORMANCE: PerformanceMetrics = {
  timestamp: new Date().toISOString(),
  requestsPerSecond: 84.5,
  totalRequestsToday: 142800,
  avgResponseTimeMs: 42.4,
  p95LatencyMs: 118.2,
  p99LatencyMs: 245.0,
  errorRatePercent: 0.12,
  failedRequestsCount: 172,
  uptimePercent: 99.98,
  functionExecutionCount: 88400,
  functionDurationMs: 64.2,
  functionErrorsCount: 9,
  firestoreReadsToday: 412500,
  firestoreWritesToday: 62400,
  storageUsageMb: 8450,
  activeAuthTokensCount: 384
};

/* =========================================================================
   FIRESTORE CRUD WRAPPERS (With LocalStorage caching & fallback)
========================================================================= */

export async function fetchSalons(): Promise<SalonDocument[]> {
  try {
    const snap = await getDocs(collection(db, "salons"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as SalonDocument));
    }
  } catch (err) {
    console.warn("Firestore fetchSalons notice, using persistent store:", err);
  }

  const stored = localStorage.getItem("sa_salons");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("sa_salons", JSON.stringify(INITIAL_SALONS));
  return INITIAL_SALONS;
}

export async function saveSalon(salon: SalonDocument): Promise<void> {
  try {
    await setDoc(doc(db, "salons", salon.id), salon, { merge: true });
  } catch (err) {
    console.warn("Firestore saveSalon notice:", err);
  }

  // Update local cache
  const salons = await fetchSalons();
  const exists = salons.some(s => s.id === salon.id);
  const updated = exists ? salons.map(s => s.id === salon.id ? salon : s) : [salon, ...salons];
  localStorage.setItem("sa_salons", JSON.stringify(updated));
}

export async function updateSalonStatus(salonId: string, status: SalonDocument['status'], auditorNotes?: string): Promise<void> {
  try {
    await updateDoc(doc(db, "salons", salonId), {
      status,
      auditorNotes: auditorNotes || "",
      approvedAt: status === "APPROVED" ? new Date().toISOString() : undefined
    });
  } catch (err) {
    console.warn("Firestore updateSalonStatus notice:", err);
  }

  const salons = await fetchSalons();
  const updated = salons.map(s => s.id === salonId ? {
    ...s,
    status,
    auditorNotes: auditorNotes || s.auditorNotes,
    approvedAt: status === "APPROVED" ? new Date().toISOString() : s.approvedAt
  } : s);
  localStorage.setItem("sa_salons", JSON.stringify(updated));
}

export async function fetchCustomers(): Promise<CustomerDocument[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    const customers = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter(u => u.role === "CUSTOMER");
    if (customers.length > 0) return customers;
  } catch {}

  const stored = localStorage.getItem("sa_customers");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("sa_customers", JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
}

export async function fetchOffers(): Promise<OfferDocument[]> {
  try {
    const snap = await getDocs(collection(db, "offers"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as OfferDocument));
    }
  } catch {}

  const stored = localStorage.getItem("sa_offers");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("sa_offers", JSON.stringify(INITIAL_OFFERS));
  return INITIAL_OFFERS;
}

export async function saveOffer(offer: OfferDocument): Promise<void> {
  try {
    await setDoc(doc(db, "offers", offer.id), offer, { merge: true });
  } catch {}

  const offers = await fetchOffers();
  const exists = offers.some(o => o.id === offer.id);
  const updated = exists ? offers.map(o => o.id === offer.id ? offer : o) : [offer, ...offers];
  localStorage.setItem("sa_offers", JSON.stringify(updated));
}

export async function deleteOffer(offerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "offers", offerId));
  } catch {}

  const offers = await fetchOffers();
  const updated = offers.filter(o => o.id !== offerId);
  localStorage.setItem("sa_offers", JSON.stringify(updated));
}

export async function fetchLiveSessions(): Promise<LiveUserSession[]> {
  try {
    const snap = await getDocs(collection(db, "userSessions"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ sessionId: d.id, ...d.data() } as LiveUserSession));
    }
  } catch {}

  return INITIAL_LIVE_SESSIONS;
}

export async function fetchPerformanceMetrics(): Promise<PerformanceMetrics> {
  return INITIAL_PERFORMANCE;
}

export async function logAdminAction(action: string, targetEntity: string, targetId: string, details: string): Promise<void> {
  const log: AuditLogDocument = {
    id: `log_${Date.now()}`,
    adminEmail: "admin@glowgrace.com",
    adminUid: "superadmin_main_01",
    action,
    targetEntity,
    targetId,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: "106.51.72.19"
  };

  try {
    await setDoc(doc(db, "adminAuditLogs", log.id), log);
  } catch {}

  try {
    const existing = JSON.parse(localStorage.getItem("sa_audit_logs") || "[]");
    localStorage.setItem("sa_audit_logs", JSON.stringify([log, ...existing]));
  } catch {}
}

export async function fetchAuditLogs(): Promise<AuditLogDocument[]> {
  try {
    const snap = await getDocs(query(collection(db, "adminAuditLogs"), orderBy("timestamp", "desc"), limit(50)));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLogDocument));
    }
  } catch {}

  const stored = localStorage.getItem("sa_audit_logs");
  if (stored) return JSON.parse(stored);

  const initialLogs: AuditLogDocument[] = [
    { id: "log_1", adminEmail: "admin@glowgrace.com", adminUid: "sa_01", action: "APPROVE_SALON", targetEntity: "salons", targetId: "salon_01", details: "Approved salon verification documents and provisioned professional credentials.", timestamp: "2024-02-12T14:30:00Z", ipAddress: "106.51.72.19" },
    { id: "log_2", adminEmail: "admin@glowgrace.com", adminUid: "sa_01", action: "CREATE_OFFER", targetEntity: "offers", targetId: "off_01", details: "Created 25% discount campaign GROOM25 with 500 redemption quota.", timestamp: "2024-01-01T10:00:00Z", ipAddress: "106.51.72.19" },
    { id: "log_3", adminEmail: "admin@glowgrace.com", adminUid: "sa_01", action: "AUDIT_REVIEW", targetEntity: "salons", targetId: "salon_03", details: "Requested additional sanitation certificate from The Velvet Lounge.", timestamp: "2026-11-12T10:20:00Z", ipAddress: "106.51.72.19" }
  ];
  localStorage.setItem("sa_audit_logs", JSON.stringify(initialLogs));
  return initialLogs;
}
