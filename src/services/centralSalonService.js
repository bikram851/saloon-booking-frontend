/**
 * Glow & Grace Central Salon Database & Synchronization Service
 * 
 * Central source of truth for both Super Admin Portal, Admin Portal,
 * and Customer Application.
 * 
 * Supports the complete salon lifecycle:
 * DRAFT → PENDING_APPROVAL → APPROVED → PUBLISHED
 * Other statuses: REJECTED, SUSPENDED, INACTIVE
 * 
 * Only salons with PUBLISHED status (or APPROVED with isPublished: true)
 * are accessible for Customer Discovery & Booking.
 */

export const CENTRAL_SALONS_STORAGE_KEY = "gg_central_salons";
export const SYNC_EVENT_NAME = "gg_salons_published_sync";

export const INITIAL_CENTRAL_SALONS = [
  {
    id: 1,
    salonId: "salon_01",
    name: "Glow & Grace Luxury Lounge Whitefield",
    brand: "Glow & Grace Signature",
    description: "Premier luxury salon offering bespoke haircutting, signature skin fades, balayage, and revitalizing head spa.",
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
    area: "Whitefield, Bengaluru",
    address: "123, ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066",
    landmark: "Near ITPL Metro",
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
    latitude: 12.9698,
    longitude: 77.75,
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
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=85"
    ],
    openingHours: "9:00 AM – 9:00 PM",
    workingHours: [
      { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Friday", openTime: "09:00", closeTime: "21:30", isClosed: false },
      { day: "Saturday", openTime: "08:30", closeTime: "22:00", isClosed: false },
      { day: "Sunday", openTime: "08:30", closeTime: "22:00", isClosed: false }
    ],
    services: [
      { id: 1, name: "Haircut & Style", price: 1200, durationMinutes: 45, category: "Hair", description: "Precision scissor cut, styling consultation and signature finish", active: true },
      { id: 2, name: "Hair Colour & Balayage", price: 3500, durationMinutes: 90, category: "Hair", description: "Custom shade blending, gloss treatment and colour lock therapy", active: true },
      { id: 3, name: "Glow Radiance Facial", price: 2200, durationMinutes: 60, category: "Skin", description: "Cleansing exfoliation, antioxidant serum and revitalizing gold mask", active: true },
      { id: 4, name: "Beard Trim & Sculpt", price: 650, durationMinutes: 30, category: "Beard", description: "Hot towel prep, precision razor edge and nourishing beard oil massage", active: true },
      { id: 5, name: "Deep Conditioning Hair Spa", price: 1800, durationMinutes: 50, category: "Spa", description: "Keratin scalp nourish, warm steam infusion and relaxing head therapy", active: true }
    ],
    servicesSample: ["Haircut & Style", "Balayage", "Glow Facial", "Beard Sculpt"],
    startingPrice: 650,
    barbers: [
      { id: 1, name: "Alex Rivera", experienceYears: 8, specialization: "Skin Fades & Scissor Finish", phone: "+91 98765 00001", availability: "ON_DUTY", rating: 4.9 },
      { id: 2, name: "Elena Rostova", experienceYears: 6, specialization: "Creative Color & Balayage", phone: "+91 98765 00002", availability: "ON_DUTY", rating: 4.85 },
      { id: 3, name: "Marcus Chen", experienceYears: 7, specialization: "Beard Architecture", phone: "+91 98765 00003", availability: "ON_DUTY", rating: 4.95 }
    ],
    status: "PUBLISHED",
    publicationStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    isPublished: true,
    rating: 4.9,
    reviewsCount: 142,
    chairsCount: 6,
    staffCount: 5,
    totalAppointmentsCount: 420,
    totalRevenue: 524000,
    registrationDate: "2024-02-10",
    submittedAt: "2024-02-10T10:00:00.000Z",
    approvedAt: "2024-02-12T14:30:00.000Z"
  },
  {
    id: 2,
    salonId: "salon_02",
    name: "Hair Care Studio Indiranagar",
    brand: "Hair Care Studio",
    description: "Contemporary styling studio specializing in modern texture cuts, keratin treatments and luxury hair color.",
    businessRegNumber: "GSTIN29AABCS5544K2Z1",
    category: "Hair Studio",
    yearEstablished: 2021,
    contactEmail: "indiranagar@haircare.com",
    phone: "+91 98765 43211",
    ownerName: "Sunita Kapoor",
    professionalName: "Sunita Kapoor",
    professionalEmail: "sunita@haircare.com",
    professionalPhone: "+91 98765 11111",
    area: "Indiranagar, Bengaluru",
    address: "204, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    landmark: "Near Indiranagar Metro",
    location: {
      fullAddress: "204, 100 Feet Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560038",
      latitude: 12.9784,
      longitude: 77.6408,
      googleMapsUrl: "https://maps.google.com/?q=12.9784,77.6408"
    },
    latitude: 12.9784,
    longitude: 77.6408,
    coverImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    exteriorImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    interiorImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
    ],
    images: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85"
    ],
    openingHours: "9:00 AM – 9:00 PM",
    workingHours: [
      { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Friday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Saturday", openTime: "09:00", closeTime: "21:30", isClosed: false },
      { day: "Sunday", openTime: "09:00", closeTime: "21:30", isClosed: false }
    ],
    services: [
      { id: 1, name: "Haircut & Blowdry", price: 950, durationMinutes: 45, category: "Hair", description: "Classic cut and modern styling", active: true },
      { id: 2, name: "Keratin Smooth Treatment", price: 4200, durationMinutes: 120, category: "Hair", description: "Frizz-free silk finish", active: true },
      { id: 3, name: "Aroma Head Massage", price: 850, durationMinutes: 30, category: "Massage", description: "Therapeutic warm oil therapy", active: true }
    ],
    servicesSample: ["Haircut & Blowdry", "Keratin Treatment", "Head Massage"],
    startingPrice: 850,
    barbers: [
      { id: 11, name: "Devendra Patil", experienceYears: 5, specialization: "Texture Cuts & Keratin", phone: "+91 98765 22222", availability: "ON_DUTY", rating: 4.8 }
    ],
    status: "PUBLISHED",
    publicationStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    isPublished: true,
    rating: 4.75,
    reviewsCount: 98,
    chairsCount: 4,
    staffCount: 3,
    totalAppointmentsCount: 310,
    totalRevenue: 345000,
    registrationDate: "2024-03-01",
    submittedAt: "2024-03-01T11:20:00.000Z",
    approvedAt: "2024-03-02T16:00:00.000Z"
  },
  {
    id: 3,
    salonId: "salon_03",
    name: "The Beauty Lounge Koramangala",
    brand: "The Beauty Lounge",
    description: "Hair styling, bespoke nails, relaxing facials and head massages curated for a calm, luxurious self-care experience.",
    businessRegNumber: "GSTIN29AACTB7766M1Z2",
    category: "Full Service Spa & Salon",
    yearEstablished: 2020,
    contactEmail: "koramangala@beautylounge.in",
    phone: "+91 98765 43212",
    ownerName: "Farhan Qureshi",
    professionalName: "Farhan Qureshi",
    professionalEmail: "farhan@beautylounge.in",
    professionalPhone: "+91 98765 43212",
    area: "Koramangala, Bengaluru",
    address: "55, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
    landmark: "Near Forum area",
    location: {
      fullAddress: "55, 5th Block, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560095",
      latitude: 12.9345,
      longitude: 77.6113,
      googleMapsUrl: "https://maps.google.com/?q=12.9345,77.6113"
    },
    latitude: 12.9345,
    longitude: 77.6113,
    coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=80",
    exteriorImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    interiorImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
    ],
    images: [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85"
    ],
    openingHours: "9:00 AM – 9:00 PM",
    workingHours: [
      { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Friday", openTime: "09:00", closeTime: "21:00", isClosed: false },
      { day: "Saturday", openTime: "09:00", closeTime: "21:30", isClosed: false },
      { day: "Sunday", openTime: "09:00", closeTime: "21:30", isClosed: false }
    ],
    services: [
      { id: 1, name: "Haircut & Blowdry", price: 1100, durationMinutes: 45, category: "Hair", description: "Artisanal cut", active: true },
      { id: 2, name: "Glow Radiance Facial", price: 2100, durationMinutes: 60, category: "Skin", description: "Hydrating therapy", active: true },
      { id: 3, name: "Deluxe Pedicure", price: 1200, durationMinutes: 50, category: "Nails", description: "Soothing foot spa", active: true }
    ],
    servicesSample: ["Haircut", "Radiance Facial", "Deluxe Pedicure"],
    startingPrice: 1100,
    barbers: [
      { id: 21, name: "Rohit Verma", experienceYears: 6, specialization: "Styling & Color", phone: "+91 98765 33333", availability: "ON_DUTY", rating: 4.7 }
    ],
    status: "PUBLISHED",
    publicationStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    isPublished: true,
    rating: 4.65,
    reviewsCount: 115,
    chairsCount: 5,
    staffCount: 4,
    totalAppointmentsCount: 220,
    totalRevenue: 245000,
    registrationDate: "2024-04-10",
    submittedAt: "2024-04-10T10:00:00.000Z",
    approvedAt: "2024-04-12T14:30:00.000Z"
  },
  {
    id: 4,
    salonId: "salon_04",
    name: "The Velvet Lounge Koramangala",
    brand: "The Velvet Lounge",
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
    area: "Koramangala, Bengaluru",
    address: "88, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
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
    barbers: [],
    status: "PENDING_APPROVAL",
    publicationStatus: "PENDING_APPROVAL",
    verificationStatus: "UNDER_REVIEW",
    isPublished: false,
    rating: 0,
    reviewsCount: 0,
    chairsCount: 8,
    staffCount: 6,
    submittedAt: "2026-11-12T09:15:00.000Z"
  }
];

/**
 * Returns all salons in the central database (including DRAFT, PENDING, APPROVED, PUBLISHED, SUSPENDED).
 */
export function getAllCentralSalons() {
  try {
    const raw = localStorage.getItem(CENTRAL_SALONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read central salons:", err);
  }

  // Fallback / Initial seed
  try {
    localStorage.setItem(CENTRAL_SALONS_STORAGE_KEY, JSON.stringify(INITIAL_CENTRAL_SALONS));
  } catch {}
  return INITIAL_CENTRAL_SALONS;
}

/**
 * Returns ONLY published, active salons for customer discovery.
 * Strictly excludes DRAFT, PENDING, PENDING_APPROVAL, REJECTED, SUSPENDED, and INACTIVE salons.
 */
export function getPublishedCentralSalons() {
  const allSalons = getAllCentralSalons();
  return allSalons.filter(s => {
    // Only published and active salons
    const isApprovedOrPublished = s.status === "PUBLISHED" || s.publicationStatus === "PUBLISHED" || (s.status === "APPROVED" && s.isPublished === true);
    const isBlocked = s.status === "SUSPENDED" || s.status === "REJECTED" || s.status === "DRAFT" || s.status === "PENDING" || s.status === "PENDING_APPROVAL" || s.status === "INACTIVE" || s.publicationStatus === "UNPUBLISHED";
    return isApprovedOrPublished && !isBlocked;
  });
}

/**
 * Get a specific salon by ID or slug.
 */
export function getCentralSalonById(id) {
  const allSalons = getAllCentralSalons();
  const searchId = String(id).toLowerCase();
  return allSalons.find(s => String(s.id).toLowerCase() === searchId || String(s.salonId).toLowerCase() === searchId);
}

/**
 * Checks if a salon is currently available for customer booking.
 */
export function isSalonAvailableForBooking(id) {
  const salon = getCentralSalonById(id);
  if (!salon) return false;
  const isApprovedOrPublished = salon.status === "PUBLISHED" || salon.publicationStatus === "PUBLISHED" || (salon.status === "APPROVED" && salon.isPublished === true);
  const isBlocked = salon.status === "SUSPENDED" || salon.status === "REJECTED" || salon.status === "DRAFT" || salon.status === "PENDING" || salon.status === "PENDING_APPROVAL" || salon.status === "INACTIVE" || salon.publicationStatus === "UNPUBLISHED";
  return isApprovedOrPublished && !isBlocked;
}

/**
 * Saves or updates a salon in the central database.
 * Preserves the salon ID and prevents duplicates.
 * Automatically synchronizes secondary admin keys and notifies subscribers.
 */
export function saveCentralSalon(salon) {
  const salons = getAllCentralSalons();
  const index = salons.findIndex(s => String(s.id) === String(salon.id) || (salon.salonId && String(s.salonId) === String(salon.salonId)));

  let updated;
  if (index >= 0) {
    // Update existing record
    updated = [...salons];
    updated[index] = {
      ...salons[index],
      ...salon,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Insert new record
    updated = [
      {
        ...salon,
        id: salon.id || Date.now(),
        createdAt: salon.createdAt || new Date().toISOString()
      },
      ...salons
    ];
  }

  // 1. Save to central store
  try {
    localStorage.setItem(CENTRAL_SALONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // 2. Synchronize legacy admin keys for cross-compatibility
  try {
    localStorage.setItem("sa_salons", JSON.stringify(updated));
    localStorage.setItem("gg_admin_salons", JSON.stringify(updated));
  } catch {}

  // 3. Dispatch broadcast sync event for reactive listener in Customer App
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { salon, all: updated } }));
    window.dispatchEvent(new CustomEvent("gg_admin_salons_updated", { detail: updated }));
  }

  return updated;
}

/**
 * Approves and publishes a salon in one unified atomic step.
 * Updates publication status to PUBLISHED, sets isPublished: true,
 * and makes it immediately visible to the customer discovery API.
 */
export function approveAndPublishSalon(salonId, notes = "") {
  const salons = getAllCentralSalons();
  const target = salons.find(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (!target) return null;

  const published = {
    ...target,
    status: "PUBLISHED",
    publicationStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    isPublished: true,
    approvedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    auditorNotes: notes || target.auditorNotes || ""
  };

  saveCentralSalon(published);
  return published;
}

/**
 * Suspends or unpublishes a salon, immediately removing it from
 * customer discovery and preventing new appointment bookings.
 */
export function suspendOrUnpublishSalon(salonId, reason = "") {
  const salons = getAllCentralSalons();
  const target = salons.find(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (!target) return null;

  const suspended = {
    ...target,
    status: "SUSPENDED",
    publicationStatus: "UNPUBLISHED",
    isPublished: false,
    suspendedAt: new Date().toISOString(),
    suspensionReason: reason || "Administrative suspension by Super Admin"
  };

  saveCentralSalon(suspended);
  return suspended;
}
