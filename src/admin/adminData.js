/**
 * Glow & Grace Admin Data Store & Mock Telemetry
 * Provides stateful persistence in localStorage for Admin Application
 */

// 1. Initial Salons Seed
export const initialSalons = [
  {
    id: 1,
    name: "Quick Groom Saloon & Spa",
    brand: "Glow & Grace Flagship",
    ownerName: "Vikram Malhotra",
    email: "vikram@quickgroom.com",
    phone: "+91 98765 11001",
    address: "102, 100 Feet Road, Indiranagar",
    city: "Bangalore",
    pinCode: "560038",
    status: "APPROVED", // APPROVED | PENDING | REJECTED | SUSPENDED
    verificationStatus: "VERIFIED",
    rating: 4.9,
    reviewsCount: 384,
    chairsCount: 4,
    staffCount: 6,
    activeAppointmentsToday: 14,
    totalRevenue: 284500,
    coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    ],
    documents: [
      { name: "Trade License & Registration", type: "PDF", verified: true },
      { name: "GST Compliance Certificate", type: "PDF", verified: true },
      { name: "Fire Safety & Sanitation Clearance", type: "PDF", verified: true },
    ],
    submittedAt: "2026-08-15T10:30:00.000Z",
    approvedAt: "2026-08-18T14:20:00.000Z",
    notes: "Premier flagship location in Indiranagar. Top hygiene ratings.",
  },
  {
    id: 2,
    name: "Luxe Cut Barber Studio",
    brand: "Luxe Cut International",
    ownerName: "Amanpreet Singh",
    email: "aman@luxecut.in",
    phone: "+91 98765 11002",
    address: "45, 80 Feet Road, 4th Block, Koramangala",
    city: "Bangalore",
    pinCode: "560034",
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    rating: 4.85,
    reviewsCount: 210,
    chairsCount: 5,
    staffCount: 5,
    activeAppointmentsToday: 9,
    totalRevenue: 198000,
    coverImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    ],
    documents: [
      { name: "Business Incorporation Proof", type: "PDF", verified: true },
      { name: "Premises Lease Deed", type: "PDF", verified: true },
    ],
    submittedAt: "2026-09-02T11:00:00.000Z",
    approvedAt: "2026-09-05T09:45:00.000Z",
    notes: "Specializes in razor fades and luxury hot-towel grooming.",
  },
  {
    id: 3,
    name: "Urban Shave & Spa Lounge",
    brand: "Urban Grooming Co.",
    ownerName: "Farhan Qureshi",
    email: "farhan@urbanshave.com",
    phone: "+91 98765 11003",
    address: "88, ITPL Main Road, Whitefield",
    city: "Bangalore",
    pinCode: "560066",
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    rating: 4.8,
    reviewsCount: 165,
    chairsCount: 6,
    staffCount: 7,
    activeAppointmentsToday: 11,
    totalRevenue: 165400,
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    ],
    documents: [
      { name: "BBMP Trade License", type: "PDF", verified: true },
    ],
    submittedAt: "2026-09-20T15:30:00.000Z",
    approvedAt: "2026-09-24T12:00:00.000Z",
    notes: "Popular with tech park executives in Whitefield.",
  },
  {
    id: 4,
    name: "Crown & Comb Gentleman Parlor",
    brand: "Crown & Comb",
    ownerName: "Karthik Nambiar",
    email: "karthik@crowncomb.com",
    phone: "+91 98765 11004",
    address: "21, Church Street, Ashok Nagar",
    city: "Bangalore",
    pinCode: "560001",
    status: "PENDING",
    verificationStatus: "UNDER_REVIEW",
    rating: 0,
    reviewsCount: 0,
    chairsCount: 4,
    staffCount: 4,
    activeAppointmentsToday: 0,
    totalRevenue: 0,
    coverImage: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    ],
    documents: [
      { name: "Trade License Application", type: "PDF", verified: false },
      { name: "Owner Aadhaar & PAN Verification", type: "PDF", verified: true },
      { name: "Premises Rental Agreement", type: "PDF", verified: false },
    ],
    submittedAt: "2026-11-10T08:15:00.000Z",
    approvedAt: null,
    notes: "New application received. Awaiting premises inspection proof.",
  },
  {
    id: 5,
    name: "Elysian Hair & Aesthetics Lounge",
    brand: "Elysian Wellness",
    ownerName: "Sneha Mukherjee",
    email: "sneha@elysianlounge.in",
    phone: "+91 98765 11005",
    address: "14, 12th Main, HAL 2nd Stage, Indiranagar",
    city: "Bangalore",
    pinCode: "560008",
    status: "PENDING",
    verificationStatus: "INFO_REQUIRED",
    rating: 0,
    reviewsCount: 0,
    chairsCount: 6,
    staffCount: 8,
    activeAppointmentsToday: 0,
    totalRevenue: 0,
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    documents: [
      { name: "GST Certificate", type: "PDF", verified: true },
      { name: "Stylist Certification Credentials", type: "PDF", verified: false },
    ],
    submittedAt: "2026-11-11T14:40:00.000Z",
    approvedAt: null,
    notes: "Requested updated cosmetology diploma certificates for lead colorists.",
  },
  {
    id: 6,
    name: "Razor Edge Express Grooming",
    brand: "Razor Edge",
    ownerName: "Ramesh Babu",
    email: "ramesh@razoredge.in",
    phone: "+91 98765 11006",
    address: "5, 27th Main, Sector 1, HSR Layout",
    city: "Bangalore",
    pinCode: "560102",
    status: "REJECTED",
    verificationStatus: "REJECTED",
    rating: 0,
    reviewsCount: 0,
    chairsCount: 2,
    staffCount: 2,
    activeAppointmentsToday: 0,
    totalRevenue: 0,
    coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    documents: [
      { name: "Incomplete Trade Certificate", type: "PDF", verified: false },
    ],
    submittedAt: "2026-10-18T09:20:00.000Z",
    approvedAt: null,
    notes: "Rejected: Incomplete compliance documentation and premises did not meet hygiene baseline.",
  },
];

// 2. Initial Customers Seed
export const initialCustomers = [
  {
    id: "cust_101",
    name: "Rohit Malhotra",
    email: "rohit.malhotra@gmail.com",
    phone: "+91 98765 43210",
    city: "Bangalore",
    registeredDate: "2026-06-12",
    totalBookings: 14,
    totalSpend: 11480,
    status: "ACTIVE",
    lastBookingDate: "Today, 10:15 AM",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    notes: "Prefers Alex Rivera at Quick Groom for Signature Fade.",
  },
  {
    id: "cust_102",
    name: "Ananya Iyer",
    email: "ananya.iyer@outlook.com",
    phone: "+91 98765 43211",
    city: "Bangalore",
    registeredDate: "2026-07-04",
    totalBookings: 9,
    totalSpend: 24500,
    status: "ACTIVE",
    lastBookingDate: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    notes: "Regular balayage client with Elena.",
  },
  {
    id: "cust_103",
    name: "Vikram Sengupta",
    email: "vikram.sengupta@techcorp.in",
    phone: "+91 98765 43212",
    city: "Bangalore",
    registeredDate: "2026-08-19",
    totalBookings: 11,
    totalSpend: 7850,
    status: "ACTIVE",
    lastBookingDate: "Yesterday",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    notes: "Executive hot towel shave and trim.",
  },
  {
    id: "cust_104",
    name: "Pooja Hegde",
    email: "pooja.hegde@gmail.com",
    phone: "+91 98765 43213",
    city: "Bangalore",
    registeredDate: "2026-09-01",
    totalBookings: 7,
    totalSpend: 14200,
    status: "ACTIVE",
    lastBookingDate: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    notes: "Frequent facial and deep conditioning spa bookings.",
  },
  {
    id: "cust_105",
    name: "Arjun Namboodiri",
    email: "arjun.n@gmail.com",
    phone: "+91 98765 43214",
    city: "Bangalore",
    registeredDate: "2026-10-15",
    totalBookings: 4,
    totalSpend: 2800,
    status: "ACTIVE",
    lastBookingDate: "Today, 02:45 PM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    notes: "Walk-in converted to regular member.",
  },
  {
    id: "cust_106",
    name: "Meera Krishnan",
    email: "meera.k@gmail.com",
    phone: "+91 98765 43215",
    city: "Bangalore",
    registeredDate: "2026-10-22",
    totalBookings: 2,
    totalSpend: 3600,
    status: "ACTIVE",
    lastBookingDate: "5 days ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    notes: "Nail manicure & pedicure lover.",
  },
  {
    id: "cust_107",
    name: "Karan Johar",
    email: "karan.j@sample.com",
    phone: "+91 98765 43216",
    city: "Bangalore",
    registeredDate: "2026-11-01",
    totalBookings: 0,
    totalSpend: 0,
    status: "INACTIVE",
    lastBookingDate: "Never",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    notes: "Account registered, zero bookings.",
  },
];

// 3. Initial Offers & Promotions Seed
export const initialOffers = [
  {
    id: "off_1",
    code: "GROOM25",
    title: "Signature Grooming Ritual 25% Off",
    description: "Haircut & Style + Beard Trim & Sculpt + Luxury Head Massage combo discount.",
    discountType: "PERCENTAGE", // PERCENTAGE | FIXED
    discountValue: 25,
    minBookingAmount: 1800,
    maxDiscount: 700,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    applicableSalons: "All Salons",
    usageLimit: 500,
    usedCount: 148,
    status: "ACTIVE", // ACTIVE | PAUSED | EXPIRED
  },
  {
    id: "off_2",
    code: "GLOWSPA",
    title: "Rejuvenating Glow Spa Deal",
    description: "Deep Conditioning Hair Spa + Glow Radiance Facial flat ₹800 savings.",
    discountType: "FIXED",
    discountValue: 800,
    minBookingAmount: 3000,
    maxDiscount: 800,
    startDate: "2026-11-05",
    endDate: "2026-11-30",
    applicableSalons: "All Salons",
    usageLimit: 250,
    usedCount: 92,
    status: "ACTIVE",
  },
  {
    id: "off_3",
    code: "WELCOME50",
    title: "First Booking Privilege 50% Off",
    description: "Exclusive welcome coupon for new guests on any haircut or grooming service.",
    discountType: "PERCENTAGE",
    discountValue: 50,
    minBookingAmount: 500,
    maxDiscount: 500,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    applicableSalons: "All Salons",
    usageLimit: 1000,
    usedCount: 420,
    status: "ACTIVE",
  },
  {
    id: "off_4",
    code: "HANDSFEET",
    title: "Executive Mani-Pedi Duo 20% Off",
    description: "Classic Manicure + Deluxe Pedicure with soothing reflexology foot care.",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minBookingAmount: 1500,
    maxDiscount: 400,
    startDate: "2026-10-15",
    endDate: "2026-11-15",
    applicableSalons: "Quick Groom & Luxe Cut",
    usageLimit: 150,
    usedCount: 150,
    status: "EXPIRED",
  },
];

// Helper functions for persistent storage
export function getStoredAdminSalons() {
  try {
    const centralRaw = localStorage.getItem("gg_central_salons");
    if (centralRaw) {
      const parsed = JSON.parse(centralRaw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const raw = localStorage.getItem("gg_admin_salons");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("gg_admin_salons", JSON.stringify(initialSalons));
    localStorage.setItem("gg_central_salons", JSON.stringify(initialSalons));
  } catch {}
  return initialSalons;
}

export function saveStoredAdminSalons(salons) {
  try {
    localStorage.setItem("gg_admin_salons", JSON.stringify(salons));
    localStorage.setItem("gg_central_salons", JSON.stringify(salons));
    localStorage.setItem("sa_salons", JSON.stringify(salons));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gg_admin_salons_updated", { detail: salons }));
      window.dispatchEvent(new CustomEvent("gg_salons_published_sync", { detail: { all: salons } }));
    }
  } catch {}
}

export function getStoredAdminCustomers() {
  try {
    const raw = localStorage.getItem("gg_admin_customers");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("gg_admin_customers", JSON.stringify(initialCustomers));
  } catch {}
  return initialCustomers;
}

export function saveStoredAdminCustomers(customers) {
  try {
    localStorage.setItem("gg_admin_customers", JSON.stringify(customers));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gg_admin_customers_updated", { detail: customers }));
    }
  } catch {}
}

export function getStoredAdminOffers() {
  try {
    const raw = localStorage.getItem("gg_admin_offers");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("gg_admin_offers", JSON.stringify(initialOffers));
  } catch {}
  return initialOffers;
}

export function saveStoredAdminOffers(offers) {
  try {
    localStorage.setItem("gg_admin_offers", JSON.stringify(offers));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gg_admin_offers_updated", { detail: offers }));
    }
  } catch {}
}
