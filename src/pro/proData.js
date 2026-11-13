// Professional Salon Data Layer & LocalStorage Persistence

export const DEFAULT_SALON_ID = 1;

export const initialProSalon = {
  id: 1,
  name: "Glow & Grace Luxury Lounge Whitefield",
  shortName: "Whitefield Lounge",
  ownerName: "Alex Rivera & Partners",
  ownerEmail: "pro@glowgrace.com",
  phone: "+91 98765 43210",
  address: "123, ITPL Main Road, Whitefield",
  city: "Bengaluru",
  pincode: "560066",
  landmark: "Near ITPL Metro Station",
  rating: 4.85,
  reviewsCount: 142,
  description: "Boutique luxury salon providing bespoke haircutting, signature fades, artisanal hair coloring, revitalizing skin treatments and relaxing head therapy.",
  coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
  ],
  status: "OPEN", // 'OPEN' | 'CLOSED' | 'BREAK'
  temporaryClosureReason: "",
  exceptionalNotice: ""
};

export const initialWorkingHours = [
  { day: "Monday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Tuesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Wednesday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Thursday", openTime: "09:00", closeTime: "21:00", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Friday", openTime: "09:00", closeTime: "21:30", isClosed: false, breakStart: "13:30", breakEnd: "14:30" },
  { day: "Saturday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" },
  { day: "Sunday", openTime: "08:30", closeTime: "22:00", isClosed: false, breakStart: "13:00", breakEnd: "14:00" }
];

export const initialProBarbers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Master Stylist & Salon Director",
    specialization: "Signature Skin Fade & Scissor Cut",
    chair: "Chair #1",
    status: "ON_DUTY", // 'ON_DUTY' | 'BREAK' | 'OFF_DUTY'
    experience: 8,
    rating: 4.9,
    reviewsCount: 88,
    phone: "+91 98765 00001",
    email: "alex@glowgrace.com",
    weeklyOff: "Tuesday",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    active: true
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Senior Colorist & Cut Specialist",
    specialization: "Creative Color, Highlights & Balayage",
    chair: "Chair #2",
    status: "ON_DUTY",
    experience: 6,
    rating: 4.85,
    reviewsCount: 64,
    phone: "+91 98765 00002",
    email: "elena@glowgrace.com",
    weeklyOff: "Wednesday",
    shiftStart: "11:00",
    shiftEnd: "20:00",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    active: true
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Beard Sculptor & Texture Artist",
    specialization: "Razor Fades & Beard Architecture",
    chair: "Chair #3",
    status: "ON_DUTY",
    experience: 7,
    rating: 4.95,
    reviewsCount: 79,
    phone: "+91 98765 00003",
    email: "marcus@glowgrace.com",
    weeklyOff: "Monday",
    shiftStart: "10:00",
    shiftEnd: "19:00",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    active: true
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Spa & Facial Consultant",
    specialization: "Head Spa, Glow Facials & Scalp Therapy",
    chair: "Chair #4",
    status: "BREAK",
    experience: 5,
    rating: 4.88,
    reviewsCount: 52,
    phone: "+91 98765 00004",
    email: "priya@glowgrace.com",
    weeklyOff: "Thursday",
    shiftStart: "12:00",
    shiftEnd: "21:00",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    active: true
  }
];

export const initialProServices = [
  {
    id: 1,
    name: "Haircut & Style",
    category: "Hair",
    price: 1200,
    durationMinutes: 45,
    active: true,
    bookingsCount: 248,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    description: "Precision scissor cut, styling consultation and signature hot towel finish."
  },
  {
    id: 2,
    name: "Hair Colour & Balayage",
    category: "Hair",
    price: 3500,
    durationMinutes: 90,
    active: true,
    bookingsCount: 114,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
    description: "Custom shade blending, gloss treatment and colour lock therapy."
  },
  {
    id: 3,
    name: "Glow Radiance Facial",
    category: "Skin Care",
    price: 2200,
    durationMinutes: 60,
    active: true,
    bookingsCount: 96,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
    description: "Cleansing exfoliation, antioxidant serum and revitalizing gold mask."
  },
  {
    id: 4,
    name: "Beard Trim & Sculpt",
    category: "Beard and Grooming",
    price: 650,
    durationMinutes: 30,
    active: true,
    bookingsCount: 189,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
    description: "Hot towel prep, precision razor edge and nourishing beard oil massage."
  },
  {
    id: 5,
    name: "Deep Conditioning Hair Spa",
    category: "Massage and Spa",
    price: 1800,
    durationMinutes: 50,
    active: true,
    bookingsCount: 135,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
    description: "Keratin scalp nourish, warm steam infusion and relaxing head therapy."
  },
  {
    id: 6,
    name: "Executive Grooming Combo",
    category: "Premium Packages",
    price: 2600,
    durationMinutes: 80,
    active: true,
    bookingsCount: 72,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80",
    description: "Signature Haircut + Hot Towel Shave + Rejuvenating Express Facial."
  }
];

export const initialProAppointments = [
  {
    id: "APT-801",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98451 22340",
    customerEmail: "rahul.sharma@gmail.com",
    serviceName: "Haircut & Style",
    serviceId: 1,
    barberId: 1,
    barberName: "Alex Rivera",
    date: new Date().toISOString().slice(0, 10),
    time: "10:30 AM",
    duration: "45 mins",
    price: 1200,
    status: "CONFIRMED", // 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
    paymentStatus: "PAID_ONLINE",
    notes: "Requires zero fade on sides with textured top scissor work."
  },
  {
    id: "APT-802",
    customerName: "Deepika Padukone",
    customerPhone: "+91 97312 99881",
    customerEmail: "deepika.p@gmail.com",
    serviceName: "Hair Colour & Balayage",
    serviceId: 2,
    barberId: 2,
    barberName: "Elena Rostova",
    date: new Date().toISOString().slice(0, 10),
    time: "11:45 AM",
    duration: "90 mins",
    price: 3500,
    status: "CONFIRMED",
    paymentStatus: "PAID_ONLINE",
    notes: "Prefers warm honey tones with soft highlights."
  },
  {
    id: "APT-803",
    customerName: "Karan Mehta",
    customerPhone: "+91 91234 56789",
    customerEmail: "karan.mehta@outlook.com",
    serviceName: "Beard Trim & Sculpt",
    serviceId: 4,
    barberId: 3,
    barberName: "Marcus Chen",
    date: new Date().toISOString().slice(0, 10),
    time: "02:00 PM",
    duration: "30 mins",
    price: 650,
    status: "PENDING",
    paymentStatus: "PAY_AT_SALON",
    notes: "First time customer. Sharp jawline shaping."
  },
  {
    id: "APT-804",
    customerName: "Sneha Reddy",
    customerPhone: "+91 99887 76655",
    customerEmail: "sneha.reddy@gmail.com",
    serviceName: "Glow Radiance Facial",
    serviceId: 3,
    barberId: 4,
    barberName: "Priya Sharma",
    date: new Date().toISOString().slice(0, 10),
    time: "03:30 PM",
    duration: "60 mins",
    price: 2200,
    status: "PENDING",
    paymentStatus: "PAID_ONLINE",
    notes: "Sensitive skin. Uses hypoallergenic products."
  },
  {
    id: "APT-805",
    customerName: "Vikram Sengupta",
    customerPhone: "+91 98765 11223",
    customerEmail: "vikram.s@gmail.com",
    serviceName: "Haircut & Style",
    serviceId: 1,
    barberId: 1,
    barberName: "Alex Rivera",
    date: new Date().toISOString().slice(0, 10),
    time: "05:00 PM",
    duration: "45 mins",
    price: 1200,
    status: "CONFIRMED",
    paymentStatus: "PAID_ONLINE",
    notes: "Regular client. Classic executive cut."
  },
  {
    id: "APT-806",
    customerName: "Ananya Roy",
    customerPhone: "+91 94432 11099",
    customerEmail: "ananya.roy@yahoo.com",
    serviceName: "Deep Conditioning Hair Spa",
    serviceId: 5,
    barberId: 4,
    barberName: "Priya Sharma",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "11:00 AM",
    duration: "50 mins",
    price: 1800,
    status: "CONFIRMED",
    paymentStatus: "PAID_ONLINE",
    notes: "Extra head massage requested."
  },
  {
    id: "APT-807",
    customerName: "Arjun Kapoor",
    customerPhone: "+91 98888 77777",
    customerEmail: "arjun.k@gmail.com",
    serviceName: "Executive Grooming Combo",
    serviceId: 6,
    barberId: 1,
    barberName: "Alex Rivera",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    time: "04:00 PM",
    duration: "80 mins",
    price: 2600,
    status: "COMPLETED",
    paymentStatus: "PAID_ONLINE",
    notes: "Appointment completed successfully."
  }
];

export const initialProReviews = [
  {
    id: "REV-101",
    customerName: "Rohit Malhotra",
    rating: 5,
    date: "Yesterday",
    serviceName: "Haircut & Style",
    barberName: "Alex Rivera",
    comment: "The salon ambiance is pure warm luxury. Alex gave me the cleanest precision fade in Bangalore. Zero wait time and exceptional service!",
    verified: true,
    response: "Thank you Rohit! It was a pleasure styling you at our Whitefield Lounge."
  },
  {
    id: "REV-102",
    customerName: "Ananya Iyer",
    rating: 5,
    date: "3 days ago",
    serviceName: "Hair Colour & Balayage",
    barberName: "Elena Rostova",
    comment: "Elena is a hair coloring genius! Loved the balayage tone and the deep conditioning spa. Truly 5-star luxury experience.",
    verified: true,
    response: null
  },
  {
    id: "REV-103",
    customerName: "Vikram Sengupta",
    rating: 4.8,
    date: "1 week ago",
    serviceName: "Beard Trim & Sculpt",
    barberName: "Marcus Chen",
    comment: "Prompt slot timings, zero waiting, and Marcus took great care with precision beard sculpting. Highly recommended!",
    verified: true,
    response: "Thanks Vikram! Looking forward to having you back next month."
  }
];

// Helper functions with localStorage caching
export function getProSalon() {
  try {
    const data = localStorage.getItem("gg_pro_salon");
    if (data) return JSON.parse(data);
  } catch {}
  return initialProSalon;
}

export function saveProSalon(salon) {
  try {
    localStorage.setItem("gg_pro_salon", JSON.stringify(salon));
  } catch {}
}

export function getProWorkingHours() {
  try {
    const data = localStorage.getItem("gg_pro_hours");
    if (data) return JSON.parse(data);
  } catch {}
  return initialWorkingHours;
}

export function saveProWorkingHours(hours) {
  try {
    localStorage.setItem("gg_pro_hours", JSON.stringify(hours));
  } catch {}
}

export function getProBarbers() {
  try {
    const data = localStorage.getItem("gg_pro_barbers");
    if (data) return JSON.parse(data);
  } catch {}
  return initialProBarbers;
}

export function saveProBarbers(barbers) {
  try {
    localStorage.setItem("gg_pro_barbers", JSON.stringify(barbers));
  } catch {}
}

export function getProAppointments() {
  try {
    const data = localStorage.getItem("gg_pro_appointments");
    if (data) return JSON.parse(data);
  } catch {}
  return initialProAppointments;
}

export function saveProAppointments(appointments) {
  try {
    localStorage.setItem("gg_pro_appointments", JSON.stringify(appointments));
  } catch {}
}

export function getProServices() {
  try {
    const data = localStorage.getItem("gg_pro_services");
    if (data) return JSON.parse(data);
  } catch {}
  return initialProServices;
}

export function saveProServices(services) {
  try {
    localStorage.setItem("gg_pro_services", JSON.stringify(services));
  } catch {}
}

export function getProReviews() {
  try {
    const data = localStorage.getItem("gg_pro_reviews");
    if (data) return JSON.parse(data);
  } catch {}
  return initialProReviews;
}

export function saveProReviews(reviews) {
  try {
    localStorage.setItem("gg_pro_reviews", JSON.stringify(reviews));
  } catch {}
}
