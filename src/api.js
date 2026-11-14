import { getFirebaseApiUrl, testFirebaseHandshake } from "./firebase";
import { fallback, demoServices } from "./data/mockData";
import { getPublishedCentralSalons, getCentralSalonById, getAllCentralSalons } from "./services/centralSalonService";
import { extractFirstName } from "./utils/greeting";

export const API = getFirebaseApiUrl();
export const checkFirebaseHealth = testFirebaseHandshake;

export const defaultMockServices = [
  { id: 1, name: "Haircut & Style", price: 1200, durationMinutes: 45, category: "Hair", description: "Precision scissor cut, styling consultation and signature finish" },
  { id: 2, name: "Hair Colour & Balayage", price: 3500, durationMinutes: 90, category: "Hair", description: "Custom shade blending, gloss treatment and colour lock therapy" },
  { id: 3, name: "Glow Radiance Facial", price: 2200, durationMinutes: 60, category: "Skin", description: "Cleansing exfoliation, antioxidant serum and revitalizing gold mask" },
  { id: 4, name: "Beard Trim & Sculpt", price: 650, durationMinutes: 30, category: "Beard", description: "Hot towel prep, precision razor edge and nourishing beard oil massage" },
  { id: 5, name: "Deep Conditioning Hair Spa", price: 1800, durationMinutes: 50, category: "Spa", description: "Keratin scalp nourish, warm steam infusion and relaxing head therapy" },
  { id: 6, name: "Luxury Head Massage", price: 950, durationMinutes: 35, category: "Massage", description: "Warm therapeutic oil massage relieving stress and scalp fatigue" },
  { id: 7, name: "Classic Manicure", price: 800, durationMinutes: 40, category: "Nails", description: "Nail shaping, cuticle treatment, gentle hand scrub and polish" },
  { id: 8, name: "Deluxe Pedicure", price: 1200, durationMinutes: 50, category: "Nails", description: "Aromatic foot soak, exfoliating pumice, callus care and massage" },
];

export const defaultMockOffers = [
  {
    id: 1,
    title: "Signature Grooming Ritual",
    badge: "25% OFF COMBO",
    discount: "25% OFF",
    originalPrice: 2800,
    price: 2100,
    code: "GROOM25",
    description: "Haircut & Style + Beard Trim & Sculpt + Luxury Head Massage for the ultimate grooming experience.",
    durationMinutes: 90,
  },
  {
    id: 2,
    title: "Rejuvenating Glow Spa Package",
    badge: "SAVE ₹800",
    discount: "30% OFF",
    originalPrice: 4000,
    price: 3200,
    code: "GLOWSPA",
    description: "Deep Conditioning Hair Spa + Glow Radiance Facial for complete relaxation and skin brilliance.",
    durationMinutes: 110,
  },
  {
    id: 3,
    title: "Executive Mani-Pedi Duo",
    badge: "SPECIAL DUO",
    discount: "20% OFF",
    originalPrice: 2000,
    price: 1600,
    code: "HANDSFEET",
    description: "Classic Manicure + Deluxe Pedicure with soothing reflexology foot and hand massage.",
    durationMinutes: 80,
  },
];

export const defaultMockReviews = [
  {
    id: 1,
    name: "Rohit Malhotra",
    rating: 5,
    date: "2 days ago",
    comment: "Alex gave me the best fade cut I've had in Bangalore. The salon ambiance is top notch, clean and truly relaxing!",
    service: "Haircut & Style",
    verified: true,
  },
  {
    id: 2,
    name: "Ananya Iyer",
    rating: 5,
    date: "1 week ago",
    comment: "Elena is a hair coloring genius! Loved the balayage tone and the deep conditioning spa. Truly 5-star luxury experience.",
    service: "Hair Colour & Balayage",
    verified: true,
  },
  {
    id: 3,
    name: "Vikram Sengupta",
    rating: 4.8,
    date: "2 weeks ago",
    comment: "Prompt slot timings, zero waiting, and Marcus took great care with precision beard sculpting. Highly recommended!",
    service: "Beard Trim & Sculpt",
    verified: true,
  },
  {
    id: 4,
    name: "Pooja Hegde",
    rating: 5,
    date: "3 weeks ago",
    comment: "The facial treatment was so relaxing and my skin felt rejuvenated immediately. Beautiful luxury salon decor too.",
    service: "Glow Radiance Facial",
    verified: true,
  },
];

export const defaultMockGallery = [
  {
    id: 1,
    title: "Styling Chairs & Private Stations",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Wash Lounge & Steam Therapy",
    category: "Lounge",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Modern VIP Treatment Suite",
    category: "VIP",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Precision Styling & Cutting Area",
    category: "Styling",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Colour Bar & Consultation Lounge",
    category: "Colour",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Skin Rejuvenation & Facial Suite",
    category: "Skin & Spa",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  },
];

export const defaultMockBarbers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Master Stylist",
    specialization: "Signature Skin Fade & Scissor Cut",
    chair: "Chair #1",
    status: "active", // active | break | offline
    available: true,
    rating: 4.9,
    experience: 8,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98765 00001",
    email: "alex@glowgrace.com",
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Colorist & Cut Specialist",
    specialization: "Creative Color & Balayage",
    chair: "Chair #2",
    status: "active",
    available: true,
    rating: 4.85,
    experience: 6,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98765 00002",
    email: "elena@glowgrace.com",
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Fade & Beard Artist",
    specialization: "Razor Fades & Beard Sculpting",
    chair: "Chair #3",
    status: "active",
    available: true,
    rating: 4.95,
    experience: 7,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98765 00003",
    email: "marcus@glowgrace.com",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Spa & Facial Consultant",
    specialization: "Head Spa & Revitalizing Facials",
    chair: "Chair #4",
    status: "break",
    available: false,
    rating: 4.8,
    experience: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98765 00004",
    email: "priya@glowgrace.com",
  },
];

/**
 * Retrieve current barbers roster from localStorage or initialize with defaults.
 */
export function getStoredBarbers() {
  try {
    const raw = localStorage.getItem("gg_barbers");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("gg_barbers", JSON.stringify(defaultMockBarbers));
  } catch {}
  return defaultMockBarbers;
}

/**
 * Save updated barbers roster to localStorage and broadcast event.
 */
export function saveStoredBarbers(barbers) {
  try {
    localStorage.setItem("gg_barbers", JSON.stringify(barbers));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gg_barbers_updated", { detail: barbers }));
    }
  } catch {}
}

/**
 * Retrieve initial seeded appointments if not already stored.
 */
export function getStoredAppointments() {
  const today = new Date().toISOString().split("T")[0];
  try {
    const raw = localStorage.getItem("gg_appointments");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const initialAppts = [
    {
      id: "apt_seed_1",
      customerId: "usr_seed_1",
      customerName: "Rohan Varma",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 1,
      service: "Signature Skin Fade & Hot Towel",
      price: 680,
      barberId: 1,
      barber: { id: 1, name: "Alex Rivera", role: "Master Stylist", chair: "Chair #1" },
      appointmentDate: today,
      appointmentTime: "09:45 AM",
      status: "COMPLETED",
      completedAt: `${today}T10:20:00.000Z`,
      createdAt: `${today}T08:30:00.000Z`,
    },
    {
      id: "apt_seed_2",
      customerId: "usr_seed_2",
      customerName: "Kavita Rao",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 2,
      service: "Creative Color & Balayage",
      price: 2400,
      barberId: 2,
      barber: { id: 2, name: "Elena Rostova", role: "Colorist & Cut Specialist", chair: "Chair #2" },
      appointmentDate: today,
      appointmentTime: "10:30 AM",
      status: "COMPLETED",
      completedAt: `${today}T11:45:00.000Z`,
      createdAt: `${today}T09:00:00.000Z`,
    },
    {
      id: "apt_seed_3",
      customerId: "usr_seed_3",
      customerName: "Siddharth Jain",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 4,
      service: "Beard Trim & Sculpt",
      price: 450,
      barberId: 3,
      barber: { id: 3, name: "Marcus Chen", role: "Fade & Beard Artist", chair: "Chair #3" },
      appointmentDate: today,
      appointmentTime: "09:15 AM",
      status: "COMPLETED",
      completedAt: `${today}T09:45:00.000Z`,
      createdAt: `${today}T08:00:00.000Z`,
    },
    {
      id: "apt_seed_4",
      customerId: "usr_seed_4",
      customerName: "Mehul Rathore",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 1,
      service: "Haircut & Beard Grooming",
      price: 650,
      barberId: 1,
      barber: { id: 1, name: "Alex Rivera", role: "Master Stylist", chair: "Chair #1" },
      appointmentDate: today,
      appointmentTime: "11:15 AM",
      status: "CONFIRMED",
      createdAt: `${today}T09:30:00.000Z`,
    },
    {
      id: "apt_seed_5",
      customerId: "usr_seed_5",
      customerName: "Ananya Krishnan",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 5,
      service: "Deep Conditioning Spa",
      price: 1800,
      barberId: 4,
      barber: { id: 4, name: "Priya Sharma", role: "Spa & Facial Consultant", chair: "Chair #4" },
      appointmentDate: today,
      appointmentTime: "12:00 PM",
      status: "CONFIRMED",
      createdAt: `${today}T10:00:00.000Z`,
    },
    {
      id: "apt_seed_6",
      customerId: "usr_seed_6",
      customerName: "Vikram Teja",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 3,
      service: "Skin Fade & Beard Art",
      price: 680,
      barberId: 3,
      barber: { id: 3, name: "Marcus Chen", role: "Fade & Beard Artist", chair: "Chair #3" },
      appointmentDate: today,
      appointmentTime: "02:45 PM",
      status: "CONFIRMED",
      createdAt: `${today}T10:15:00.000Z`,
    },
    {
      id: "apt_seed_7",
      customerId: "usr_seed_7",
      customerName: "Pranav Mathur",
      salonId: 1,
      salonName: "The Best Cheap Salon",
      serviceId: 1,
      service: "Signature Haircut & Wash",
      price: 720,
      barberId: 2,
      barber: { id: 2, name: "Elena Rostova", role: "Colorist & Cut Specialist", chair: "Chair #2" },
      appointmentDate: today,
      appointmentTime: "04:15 PM",
      status: "PENDING",
      createdAt: `${today}T10:45:00.000Z`,
    },
  ];

  try {
    localStorage.setItem("gg_appointments", JSON.stringify(initialAppts));
  } catch {}
  return initialAppts;
}

export function saveStoredAppointments(appointments) {
  try {
    localStorage.setItem("gg_appointments", JSON.stringify(appointments));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gg_appointments_updated", { detail: appointments }));
    }
  } catch {}
}

const standardSalonSlots = [
  "09:30 AM",
  "10:15 AM",
  "11:00 AM",
  "11:45 AM",
  "12:30 PM",
  "02:00 PM",
  "02:45 PM",
  "03:30 PM",
  "04:15 PM",
  "05:00 PM",
  "05:45 PM",
  "06:30 PM",
];

function normalizeTimeStr(t) {
  if (!t) return "";
  return t.trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * Handle seamless client-side persistence fallback when Firebase Cloud Functions
 * are not yet deployed or in offline mode.
 */
function handleMockFallback(path, opts = {}) {
  const method = (opts.method || "GET").toUpperCase();
  const cleanPath = path.split("?")[0].replace(/\/$/, "");

  let body = {};
  if (opts.body) {
    if (typeof opts.body === "string") {
      try {
        body = JSON.parse(opts.body);
      } catch {
        body = {};
      }
    } else if (typeof opts.body === "object") {
      body = opts.body;
    }
  }

  // 1. Auth Login
  if (cleanPath === "/auth/login" && method === "POST") {
    const email = (body.email || "demo@glowgrace.com").toLowerCase();
    let role = (body.role || "").toUpperCase();
    if (!role) {
      if (email.includes("admin")) role = "ADMIN";
      else if (email.includes("barber") || email.includes("alex") || email.includes("elena")) role = "BARBER";
      else role = "CUSTOMER";
    }

    const firstName = extractFirstName(email);
    let name = firstName;
    let barberId = 1;

    if (role === "ADMIN") {
      name = "Salon Administrator";
    } else if (role === "BARBER") {
      if (email.includes("elena")) {
        name = "Elena Rostova";
        barberId = 2;
      } else if (email.includes("marcus")) {
        name = "Marcus Chen";
        barberId = 3;
      } else if (email.includes("priya")) {
        name = "Priya Sharma";
        barberId = 4;
      } else {
        name = "Alex Rivera";
        barberId = 1;
      }
    }

    return {
      token: "demo_token_" + Date.now(),
      id: role === "BARBER" ? `barber_${barberId}` : role === "ADMIN" ? "admin_main" : "usr_" + Date.now(),
      barberId: role === "BARBER" ? barberId : undefined,
      name,
      fullName: name,
      email,
      phone: "+91 98765 43210",
      role,
    };
  }

  // 2. Auth Register
  if (cleanPath === "/auth/register" && method === "POST") {
    const role = (body.role || "CUSTOMER").toUpperCase();
    return {
      token: "demo_token_" + Date.now(),
      id: "usr_" + Date.now(),
      name: body.fullName || "New Client",
      fullName: body.fullName || "New Client",
      email: body.email || "client@glowgrace.com",
      phone: body.phone || "+91 98765 43210",
      role,
    };
  }

  // 3. Salons List (Only Approved & Published Central Salons)
  if (cleanPath === "/salons" || cleanPath === "") {
    const published = getPublishedCentralSalons();
    if (published && published.length > 0) {
      return published.map((s) => ({
        id: s.id,
        salonId: s.salonId || s.id,
        name: s.name,
        area: s.area || (s.location?.city ? `${s.location.city}` : "Bengaluru"),
        address: s.address || s.location?.fullAddress || "ITPL Main Road, Bengaluru",
        landmark: s.landmark || "Near Metro",
        phone: s.phone,
        latitude: s.location?.latitude || s.latitude || 12.9698,
        longitude: s.location?.longitude || s.longitude || 77.75,
        rating: s.rating || 4.8,
        reviewsCount: s.reviewsCount || 40,
        description: s.description,
        openingHours: s.openingHours || "9:00 AM – 9:00 PM",
        coverImage: s.coverImage,
        galleryImages: s.galleryImages || [],
        images: (Array.isArray(s.galleryImages) && s.galleryImages.length)
          ? s.galleryImages
          : ((Array.isArray(s.images) && s.images.length)
            ? s.images
            : [s.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85"]),
        services: s.services || [],
        servicesSample: (Array.isArray(s.servicesSample) && s.servicesSample.length)
          ? s.servicesSample
          : ((Array.isArray(s.services) && s.services.length)
            ? s.services.slice(0, 4).map((x) => x.name)
            : ["Haircut", "Hair Spa", "Facial", "Grooming"]),
        startingPrice: s.startingPrice || (Array.isArray(s.services) && s.services.length
          ? Math.min(...s.services.map((x) => Number(x.price) || 9999))
          : 650),
        status: s.status,
        publicationStatus: s.publicationStatus || "PUBLISHED",
        isPublished: s.isPublished !== false
      }));
    }
    return fallback;
  }

  // 4. Salon Details
  const salonMatch = cleanPath.match(/^\/salons\/([^/]+)$/) || cleanPath.match(/^\/salon\/([^/]+)$/);
  if (salonMatch) {
    const id = salonMatch[1];
    const s = getCentralSalonById(id) || fallback.find((x) => String(x.id) === String(id)) || fallback[0];
    const isPublished = s.status === "PUBLISHED" || s.publicationStatus === "PUBLISHED" || (s.status === "APPROVED" && s.isPublished !== false);
    const isSuspended = s.status === "SUSPENDED" || s.status === "REJECTED" || s.status === "DRAFT" || s.status === "PENDING" || s.status === "PENDING_APPROVAL";

    return {
      ...s,
      area: s.area || (s.location?.city ? `${s.location.city}` : "Bengaluru"),
      address: s.address || s.location?.fullAddress || "ITPL Main Road, Bengaluru",
      openingHours: s.openingHours || "9:00 AM – 9:00 PM",
      coverImage: s.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      images: (Array.isArray(s.galleryImages) && s.galleryImages.length)
        ? s.galleryImages
        : ((Array.isArray(s.images) && s.images.length)
          ? s.images
          : [s.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85"]),
      isAvailableForBooking: isPublished && !isSuspended,
      isSuspended,
      suspensionNotice: isSuspended ? "This salon venue is currently suspended or not accepting appointments." : null
    };
  }

  // 5. Salon Services
  if (cleanPath.endsWith("/services") || cleanPath.includes("/services")) {
    const idMatch = cleanPath.match(/\/salons\/([^/]+)\/services/);
    if (idMatch) {
      const salon = getCentralSalonById(idMatch[1]);
      if (salon && Array.isArray(salon.services) && salon.services.length > 0) {
        return salon.services.map((srv, idx) => ({
          id: srv.id || idx + 1,
          name: srv.name,
          category: srv.category || "General",
          price: Number(srv.price) || 1000,
          durationMinutes: Number(srv.durationMinutes) || 45,
          description: srv.description || srv.name
        }));
      }
    }
    return defaultMockServices;
  }

  // 6. Salon Barbers
  if (cleanPath.endsWith("/barbers") || (cleanPath.includes("/barbers") && !cleanPath.includes("/availability"))) {
    const idMatch = cleanPath.match(/\/salons\/([^/]+)\/barbers/);
    if (idMatch) {
      const salon = getCentralSalonById(idMatch[1]);
      if (salon && Array.isArray(salon.barbers) && salon.barbers.length > 0) {
        return salon.barbers.map((b, idx) => ({
          id: b.id || idx + 1,
          name: b.name,
          experience: b.experienceYears ? `${b.experienceYears} Years` : "5 Years",
          experienceYears: b.experienceYears || 5,
          specialization: b.specialization || "Senior Stylist",
          rating: b.rating || 4.85,
          phone: b.phone || "+91 98765 00000",
          availability: b.availability || "ON_DUTY",
          chair: `Chair ${idx + 1}`
        }));
      }
    }
    return getStoredBarbers();
  }

  // 6b. Salon Offers
  if (cleanPath.endsWith("/offers") || cleanPath.includes("/offers")) {
    return defaultMockOffers;
  }

  // 6c. Salon Reviews
  if (cleanPath.endsWith("/reviews") || cleanPath.includes("/reviews")) {
    return defaultMockReviews;
  }

  // 6d. Salon Gallery
  if (cleanPath.endsWith("/gallery") || cleanPath.includes("/gallery")) {
    const idMatch = cleanPath.match(/\/salons\/([^/]+)\/gallery/);
    if (idMatch) {
      const salon = getCentralSalonById(idMatch[1]);
      const galleryImgs = salon?.galleryImages || salon?.images;
      if (Array.isArray(galleryImgs) && galleryImgs.length > 0) {
        return galleryImgs.map((url, idx) => ({
          id: idx + 1,
          title: `Salon Interior & Styling Station ${idx + 1}`,
          category: idx === 0 ? "Styling Stations" : idx === 1 ? "Premises" : "Lounge",
          url,
          alt: `${salon.name} view ${idx + 1}`
        }));
      }
    }
    return defaultMockGallery;
  }

  // 7. Availability Slots (Handles /barbers/:id/availability, /salons/:id/availability, /availability)
  if (path.includes("availability")) {
    const urlObj = new URL("http://localhost" + (path.startsWith("/") ? path : "/" + path));
    const reqDate = urlObj.searchParams.get("date") || new Date().toISOString().split("T")[0];
    const barberIdMatch = path.match(/\/barbers\/([^/]+)\/availability/);
    const barberIdParam = barberIdMatch ? barberIdMatch[1] : urlObj.searchParams.get("barberId");

    const allAppts = getStoredAppointments().filter(
      (a) => a.appointmentDate === reqDate && a.status !== "CANCELLED"
    );
    const barbers = getStoredBarbers();

    const isAnyBarber = !barberIdParam || barberIdParam === "any" || String(barberIdParam) === "0";

    const slotData = standardSalonSlots.map((timeStr) => {
      const normTime = normalizeTimeStr(timeStr);
      if (isAnyBarber) {
        // Available if at least one active barber is not booked at this time
        const activeBarbers = barbers.filter((b) => b.status === "active" || b.available !== false);
        const bookedBarberIds = new Set(
          allAppts
            .filter((a) => normalizeTimeStr(a.appointmentTime) === normTime)
            .map((a) => Number(a.barberId || a.barber?.id))
        );
        const availableBarberCount = activeBarbers.filter((b) => !bookedBarberIds.has(Number(b.id))).length;
        return {
          time: timeStr,
          available: availableBarberCount > 0,
          availableCount: availableBarberCount,
        };
      } else {
        const targetId = Number(barberIdParam);
        const isBooked = allAppts.some(
          (a) =>
            Number(a.barberId || a.barber?.id) === targetId &&
            normalizeTimeStr(a.appointmentTime) === normTime
        );
        const barberObj = barbers.find((b) => Number(b.id) === targetId);
        const isBarberActive = barberObj ? barberObj.status !== "offline" : true;
        return {
          time: timeStr,
          available: !isBooked && isBarberActive,
        };
      }
    });

    const availableTimes = slotData.filter((s) => s.available).map((s) => s.time);

    return {
      slots: standardSalonSlots,
      availableSlots: availableTimes,
      data: slotData,
    };
  }

  // 8. Appointments - Create (POST /appointments)
  if (cleanPath.startsWith("/appointments") && method === "POST") {
    const existing = getStoredAppointments();
    const barbers = getStoredBarbers();
    const services = defaultMockServices;

    const requestedDate = body.appointmentDate || body.date || new Date().toISOString().split("T")[0];
    const requestedTime = body.appointmentTime || body.time || "11:00 AM";
    const normReqTime = normalizeTimeStr(requestedTime);

    let targetBarberId = body.barberId;
    const isAny = !targetBarberId || targetBarberId === "any" || String(targetBarberId) === "0";

    let assignedBarber = null;

    if (isAny) {
      // Find active barbers who are free at this date & time
      const activeBarbers = barbers.filter((b) => b.status === "active" || b.available !== false);
      const bookedBarberIds = new Set(
        existing
          .filter(
            (a) =>
              a.appointmentDate === requestedDate &&
              normalizeTimeStr(a.appointmentTime) === normReqTime &&
              a.status !== "CANCELLED"
          )
          .map((a) => Number(a.barberId || a.barber?.id))
      );

      const eligibleFreeBarbers = activeBarbers.filter((b) => !bookedBarberIds.has(Number(b.id)));

      if (eligibleFreeBarbers.length === 0) {
        throw new Error(
          `No stylist is available on ${requestedDate} at ${requestedTime}. Please choose another time slot.`
        );
      }

      // Load balancing: pick eligible barber with the fewest appointments on that date
      assignedBarber = eligibleFreeBarbers.reduce((least, current) => {
        const countCurrent = existing.filter(
          (a) =>
            Number(a.barberId || a.barber?.id) === Number(current.id) &&
            a.appointmentDate === requestedDate &&
            a.status !== "CANCELLED"
        ).length;
        const countLeast = existing.filter(
          (a) =>
            Number(a.barberId || a.barber?.id) === Number(least.id) &&
            a.appointmentDate === requestedDate &&
            a.status !== "CANCELLED"
        ).length;
        return countCurrent < countLeast ? current : least;
      }, eligibleFreeBarbers[0]);
    } else {
      const bId = Number(targetBarberId);
      assignedBarber = barbers.find((b) => Number(b.id) === bId) || barbers[0];

      // Double-booking prevention check
      const alreadyBooked = existing.some(
        (a) =>
          Number(a.barberId || a.barber?.id) === Number(assignedBarber.id) &&
          a.appointmentDate === requestedDate &&
          normalizeTimeStr(a.appointmentTime) === normReqTime &&
          a.status !== "CANCELLED"
      );

      if (alreadyBooked) {
        throw new Error(
          `Stylist ${assignedBarber.name} is already booked at ${requestedTime} on ${requestedDate}. Please select another slot.`
        );
      }
    }

    const salon = fallback.find((s) => String(s.id) === String(body.salonId)) || fallback[0] || {};
    const service = services.find((s) => String(s.id) === String(body.serviceId)) || {
      id: Number(body.serviceId) || 1,
      name: body.serviceName || "Haircut & Beard Grooming",
      price: body.price || 650,
    };

    const newAppt = {
      id: "apt_" + Date.now(),
      customerId: body.customerId || "usr_demo",
      customerName: body.customerName || "Valued Guest",
      salonId: Number(body.salonId) || 1,
      salonName: salon.name || "Quick Groom Barber Saloon",
      salon: {
        id: salon.id || 1,
        name: salon.name || "Quick Groom Barber Saloon",
        phone: salon.phone || "+91 98765 43210",
        address: salon.address || "123, ITPL Main Road, Whitefield",
      },
      serviceId: Number(service.id) || 1,
      serviceItem: { id: service.id || 1, name: service.name, price: service.price },
      service: service.name,
      price: Number(service.price) || 650,
      barberId: Number(assignedBarber.id),
      barber: {
        id: Number(assignedBarber.id),
        name: assignedBarber.name,
        role: assignedBarber.role,
        chair: assignedBarber.chair,
        image: assignedBarber.image,
      },
      assignedVia: isAny ? "ANY_BARBER" : "DIRECT_SELECTION",
      appointmentDate: requestedDate,
      appointmentTime: requestedTime,
      status: "CONFIRMED",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newAppt);
    saveStoredAppointments(existing);

    // Dispatch real-time incoming ring event for the assigned barber station
    const newBarberEvent = {
      id: Date.now(),
      appointmentId: newAppt.id,
      barberId: newAppt.barberId,
      barberName: assignedBarber.name,
      chair: assignedBarber.chair,
      customer: newAppt.customerName,
      service: newAppt.service,
      time: newAppt.appointmentTime,
      price: newAppt.price,
      date: newAppt.appointmentDate,
      assignedVia: newAppt.assignedVia,
      createdAt: newAppt.createdAt,
    };

    try {
      localStorage.setItem("gg_incoming_booking", JSON.stringify(newBarberEvent));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gg_appointment_received", { detail: newBarberEvent }));
      }
    } catch {}

    return { ...newAppt, raw: newAppt, assignedBarber };
  }

  // 9. Appointments - Mine (/appointments/mine)
  if (cleanPath.startsWith("/appointments/mine")) {
    return getStoredAppointments();
  }

  // 10. Appointments - Update / Cancel / Reschedule / Reassign
  const apptActionMatch = cleanPath.match(/^\/appointments\/([^/]+)$/);
  if (apptActionMatch) {
    const apptId = apptActionMatch[1];
    const saved = getStoredAppointments();
    const index = saved.findIndex((a) => String(a.id) === String(apptId));
    if (index >= 0) {
      if (method === "DELETE") {
        saved[index].status = "CANCELLED";
      } else {
        saved[index] = { ...saved[index], ...body };
        if (body.status) saved[index].status = body.status;
        if (body.barberId) {
          const barbers = getStoredBarbers();
          const newB = barbers.find((b) => Number(b.id) === Number(body.barberId));
          if (newB) {
            saved[index].barberId = newB.id;
            saved[index].barber = { id: newB.id, name: newB.name, role: newB.role, chair: newB.chair };
          }
        }
      }
      saveStoredAppointments(saved);
      return { ...saved[index], raw: saved[index] };
    }
    return { message: "Updated successfully", raw: { id: apptId, ...body } };
  }

  // 11. Dashboard stats
  if (cleanPath.startsWith("/dashboard/stats")) {
    const saved = getStoredAppointments();
    const completedAppts = saved.filter((a) => a.status === "COMPLETED");
    const completedRev = completedAppts.reduce((acc, cur) => acc + Number(cur.price || 0), 0);
    const barbers = getStoredBarbers();
    const activeCount = barbers.filter((b) => b.status === "active").length;

    return {
      todayRevenue: completedRev,
      completedEarnings: completedRev,
      totalAppointmentsCount: saved.length,
      completedCount: completedAppts.length,
      activeBarbers: activeCount,
      totalBarbers: barbers.length,
      upcoming: saved.filter((a) => a.status === "CONFIRMED").slice(0, 5),
    };
  }

  // 12. Health Check
  if (cleanPath === "/health") {
    return { status: "ok", service: "Quick Groom Saloon Persistence Engine" };
  }

  // Universal safe return for any other route
  if (method === "GET") return [];
  return { success: true, message: "Action completed successfully" };
}

/**
 * Universal Request Dispatcher:
 * Connects to live Firebase Backend API with automatic, seamless client-side persistence
 * fallback whenever Firebase functions are offline, starting up, or encountering network boundaries.
 */
export async function request(path, opts = {}) {
  const token = localStorage.getItem("gg_token");
  const headers = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  let response = null;
  let networkFailed = false;

  try {
    const controller = new AbortController();
    // 2.5 second timeout to keep UI completely responsive
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    response = await fetch(`${API}${path}`, {
      ...opts,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (err) {
    networkFailed = true;
  }

  // If live backend responded with OK (2xx), use it
  if (response && response.ok) {
    if (response.status === 204) return null;
    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : response.text();
  }

  // If live Firebase backend is unreachable (CORS / offline / network failed) or not deployed (404 / 500 / 503 / 403),
  // seamlessly switch to client persistence mode
  if (networkFailed || !response || response.status >= 400) {
    // If backend specifically returned a 401 Unauthorized for invalid user credentials
    if (response && response.status === 401 && path.startsWith("/auth/login")) {
      let message = "Invalid email or password";
      try {
        const payload = await response.json();
        message = payload.error || payload.message || message;
      } catch {}
      throw new Error(message);
    }

    const fallbackResult = handleMockFallback(path, opts);
    if (fallbackResult !== null && fallbackResult !== undefined) {
      return fallbackResult;
    }
  }

  // Final fallback guarantee: Never block customer booking or app navigation
  return handleMockFallback(path, opts) || { success: true };
}
