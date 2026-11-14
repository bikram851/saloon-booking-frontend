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
      { id: 1, name: "Signature Haircut & Styling", defaultPrice: 1000, price: 1200, offerPrice: 1050, discountPercent: 12, durationMinutes: 45, category: "Haircut", description: "Precision scissor cut, styling consultation and signature hot towel finish.", active: true, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" },
      { id: 2, name: "Beard Trim & Sculpt", defaultPrice: 550, price: 650, offerPrice: null, discountPercent: null, durationMinutes: 30, category: "Beard Styling", description: "Hot towel prep, precision razor edge and nourishing beard oil massage.", active: true, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80" },
      { id: 3, name: "Glow Radiance Facial", defaultPrice: 2000, price: 2200, offerPrice: 1999, discountPercent: 9, durationMinutes: 60, category: "Facial", description: "Cleansing exfoliation, antioxidant serum and revitalizing gold mask.", active: true, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" },
      { id: 4, name: "Detan Instant Glow Therapy", defaultPrice: 950, price: 1100, offerPrice: 950, discountPercent: 14, durationMinutes: 35, category: "Detan", description: "Herbal tan removal pack, cooling mist and gentle skin polish.", active: true, image: "https://images.unsplash.com/photo-1512290900672-1f486a4ff596?auto=format&fit=crop&w=600&q=80" },
      { id: 5, name: "Deep Exfoliating Face Scrub", defaultPrice: 750, price: 900, offerPrice: null, discountPercent: null, durationMinutes: 30, category: "Face Scrub", description: "Apricot & walnut micro-granule scrub removing deep impurities.", active: true, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80" },
      { id: 6, name: "Deep Conditioning Hair Spa", defaultPrice: 1600, price: 1800, offerPrice: 1599, discountPercent: 11, durationMinutes: 50, category: "Hair Spa", description: "Keratin scalp nourish, warm steam infusion and relaxing head therapy.", active: true, image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
      { id: 7, name: "Aromatherapy Stress Relief Massage", defaultPrice: 2200, price: 2500, offerPrice: 2199, discountPercent: 12, durationMinutes: 60, category: "Massage", description: "Swedish warm therapeutic essential oil massage targeting muscular tension.", active: true, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" },
      { id: 8, name: "Hair Colour & Balayage", defaultPrice: 3200, price: 3500, offerPrice: null, discountPercent: null, durationMinutes: 90, category: "Hair Colour", description: "Custom shade blending, gloss treatment and colour lock therapy.", active: true, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
      { id: 9, name: "Full Executive Grooming Package", defaultPrice: 2400, price: 2800, offerPrice: 2399, discountPercent: 14, durationMinutes: 80, category: "Grooming", description: "Complete package: Precision haircut, beard architecture, face scrub & head massage.", active: false, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80" }
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

/**
 * Standard salon service categories supported across Glow & Grace
 */
export const SERVICE_CATEGORIES = [
  "Haircut",
  "Beard Styling",
  "Facial",
  "Detan",
  "Face Scrub",
  "Hair Spa",
  "Massage",
  "Hair Colour",
  "Grooming"
];

/**
 * Returns all services for a specific salon, ensuring defaultPrice and pricing fields are properly initialized.
 */
export function getSalonServices(salonId) {
  const salon = getCentralSalonById(salonId);
  if (!salon) return [];

  const rawServices = Array.isArray(salon.services) ? salon.services : [];
  return rawServices.map((srv, idx) => ({
    id: srv.id || idx + 1,
    name: srv.name || "Specialized Salon Service",
    category: srv.category || "Grooming",
    description: srv.description || "",
    durationMinutes: Number(srv.durationMinutes) || 45,
    defaultPrice: Number(srv.defaultPrice) || Number(srv.price) || 1000,
    price: Number(srv.price) || Number(srv.defaultPrice) || 1000,
    offerPrice: srv.offerPrice != null && Number(srv.offerPrice) > 0 ? Number(srv.offerPrice) : null,
    discountPercent: srv.discountPercent != null ? Number(srv.discountPercent) : (srv.offerPrice ? Math.round(((srv.price - srv.offerPrice) / srv.price) * 100) : null),
    image: srv.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    active: srv.active !== false,
    bookingsCount: srv.bookingsCount || 0,
    salonId: salon.id
  }));
}

/**
 * Returns ONLY enabled/active services for customer discovery and booking.
 */
export function getPublishedSalonServices(salonId) {
  const services = getSalonServices(salonId);
  return services.filter(s => s.active !== false);
}

/**
 * Adds a new service to a salon's catalogue.
 * Automatically synchronizes with central store and customer discovery.
 */
export function addSalonService(salonId, serviceData) {
  const salons = getAllCentralSalons();
  const index = salons.findIndex(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (index === -1) throw new Error("Salon not found");

  const salon = salons[index];
  const existingServices = Array.isArray(salon.services) ? salon.services : [];

  const sellingPrice = Math.max(1, Number(serviceData.price) || 500);
  const defaultPrice = Number(serviceData.defaultPrice) || sellingPrice;
  const offerPrice = serviceData.offerPrice && Number(serviceData.offerPrice) > 0 && Number(serviceData.offerPrice) < sellingPrice
    ? Number(serviceData.offerPrice)
    : null;
  const discountPercent = offerPrice ? Math.round(((sellingPrice - offerPrice) / sellingPrice) * 100) : null;

  const newService = {
    id: serviceData.id || ("svc_" + Date.now()),
    name: serviceData.name.trim(),
    category: serviceData.category || "Haircut",
    description: serviceData.description?.trim() || "",
    durationMinutes: Math.max(5, Number(serviceData.durationMinutes) || 30),
    defaultPrice,
    price: sellingPrice,
    offerPrice,
    discountPercent,
    image: serviceData.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    active: serviceData.active !== false,
    bookingsCount: 0,
    createdAt: new Date().toISOString()
  };

  const updatedServices = [...existingServices, newService];
  const activeServices = updatedServices.filter(s => s.active !== false);
  const startingPrice = activeServices.length > 0
    ? Math.min(...activeServices.map(s => s.offerPrice || s.price))
    : salon.startingPrice;

  const updatedSalon = {
    ...salon,
    services: updatedServices,
    startingPrice,
    updatedAt: new Date().toISOString()
  };

  saveCentralSalon(updatedSalon);

  try {
    localStorage.setItem("gg_pro_services", JSON.stringify(updatedServices));
  } catch {}

  return newService;
}

/**
 * Updates a service for a salon.
 * Enforces permissions: professionals can only change their selling price, offer price, and details;
 * Super Admin can also adjust defaultPrice.
 */
export function updateSalonService(salonId, serviceId, updateData, isSuperAdmin = false) {
  const salons = getAllCentralSalons();
  const index = salons.findIndex(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (index === -1) throw new Error("Salon not found");

  const salon = salons[index];
  const existingServices = Array.isArray(salon.services) ? salon.services : [];
  const srvIndex = existingServices.findIndex(s => String(s.id) === String(serviceId));
  if (srvIndex === -1) throw new Error("Service not found");

  const oldSrv = existingServices[srvIndex];

  // Validate selling price
  let sellingPrice = oldSrv.price;
  if (updateData.price !== undefined) {
    const p = Number(updateData.price);
    if (isNaN(p) || p <= 0) {
      throw new Error("Selling price must be a valid positive amount");
    }
    sellingPrice = p;
  }

  // Offer price validation
  let offerPrice = oldSrv.offerPrice;
  if (updateData.offerPrice !== undefined) {
    if (updateData.offerPrice === null || updateData.offerPrice === "" || updateData.offerPrice === 0) {
      offerPrice = null;
    } else {
      const op = Number(updateData.offerPrice);
      if (isNaN(op) || op < 0) {
        throw new Error("Offer price cannot be negative");
      }
      if (op >= sellingPrice) {
        throw new Error("Offer price must be less than regular selling price");
      }
      offerPrice = op > 0 ? op : null;
    }
  }

  // Calculate discount percent
  const discountPercent = offerPrice
    ? Math.round(((sellingPrice - offerPrice) / sellingPrice) * 100)
    : null;

  // Default price: only super admin can change
  const defaultPrice = isSuperAdmin && updateData.defaultPrice !== undefined
    ? Number(updateData.defaultPrice)
    : (oldSrv.defaultPrice || oldSrv.price);

  const updatedService = {
    ...oldSrv,
    name: updateData.name !== undefined ? updateData.name.trim() : oldSrv.name,
    category: updateData.category !== undefined ? updateData.category : oldSrv.category,
    description: updateData.description !== undefined ? updateData.description.trim() : oldSrv.description,
    durationMinutes: updateData.durationMinutes !== undefined ? Math.max(5, Number(updateData.durationMinutes)) : oldSrv.durationMinutes,
    image: updateData.image !== undefined ? updateData.image : oldSrv.image,
    defaultPrice,
    price: sellingPrice,
    offerPrice,
    discountPercent,
    active: updateData.active !== undefined ? Boolean(updateData.active) : oldSrv.active,
    updatedAt: new Date().toISOString()
  };

  const updatedServices = [...existingServices];
  updatedServices[srvIndex] = updatedService;

  const activeServices = updatedServices.filter(s => s.active !== false);
  const startingPrice = activeServices.length > 0
    ? Math.min(...activeServices.map(s => s.offerPrice || s.price))
    : salon.startingPrice;

  const updatedSalon = {
    ...salon,
    services: updatedServices,
    startingPrice,
    updatedAt: new Date().toISOString()
  };

  saveCentralSalon(updatedSalon);

  try {
    localStorage.setItem("gg_pro_services", JSON.stringify(updatedServices));
  } catch {}

  return updatedService;
}

/**
 * Toggles a service between active and inactive.
 */
export function toggleSalonServiceStatus(salonId, serviceId) {
  const salons = getAllCentralSalons();
  const salon = salons.find(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (!salon) return null;

  const srv = (salon.services || []).find(s => String(s.id) === String(serviceId));
  if (!srv) return null;

  return updateSalonService(salonId, serviceId, { active: !srv.active });
}

/**
 * Deletes a service from a salon.
 */
export function deleteSalonService(salonId, serviceId) {
  const salons = getAllCentralSalons();
  const index = salons.findIndex(s => String(s.id) === String(salonId) || String(s.salonId) === String(salonId));
  if (index === -1) return false;

  const salon = salons[index];
  const updatedServices = (salon.services || []).filter(s => String(s.id) !== String(serviceId));

  const activeServices = updatedServices.filter(s => s.active !== false);
  const startingPrice = activeServices.length > 0
    ? Math.min(...activeServices.map(s => s.offerPrice || s.price))
    : 500;

  const updatedSalon = {
    ...salon,
    services: updatedServices,
    startingPrice,
    updatedAt: new Date().toISOString()
  };

  saveCentralSalon(updatedSalon);

  try {
    localStorage.setItem("gg_pro_services", JSON.stringify(updatedServices));
  } catch {}

  return true;
}
