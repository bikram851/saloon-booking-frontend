import { getFirebaseApiUrl, testFirebaseHandshake } from "./firebase";
import { fallback, demoServices } from "./data/mockData";

export const API = getFirebaseApiUrl();
export const checkFirebaseHealth = testFirebaseHandshake;

/**
 * Handle seamless client-side persistence fallback when Firebase Cloud Functions
 * are not yet deployed or in offline mode.
 */
function handleMockFallback(path, opts = {}) {
  const method = (opts.method || "GET").toUpperCase();
  const body = opts.body ? JSON.parse(opts.body) : {};

  // 1. Auth Login
  if (path.startsWith("/auth/login") && method === "POST") {
    const email = body.email || "demo@glowgrace.com";
    const role = email.toLowerCase().includes("barber") ? "BARBER" : "CUSTOMER";
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      token: "demo_token_" + Date.now(),
      id: "usr_" + Math.abs(email.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      name,
      fullName: name,
      email,
      phone: "+91 98765 43210",
      role,
    };
  }

  // 2. Auth Register
  if (path.startsWith("/auth/register") && method === "POST") {
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

  // 3. Salons List
  if (path === "/salons" || path === "/salons/") {
    return fallback;
  }

  // 4. Salon Details
  const salonMatch = path.match(/^\/salons\/(\d+|[a-zA-Z0-9_-]+)$/);
  if (salonMatch) {
    const id = salonMatch[1];
    const s = fallback.find((x) => String(x.id) === String(id)) || fallback[0];
    return s;
  }

  // 5. Salon Services
  const servicesMatch = path.match(/^\/salons\/(\d+|[a-zA-Z0-9_-]+)\/services$/);
  if (servicesMatch) {
    return [
      ...demoServices,
      { id: 4, name: "Beard Trim & Sculpt", price: 650, durationMinutes: 30, category: "Beard" },
      { id: 5, name: "Deep Conditioning Spa", price: 1800, durationMinutes: 50, category: "Spa" },
      { id: 6, name: "Luxury Head Massage", price: 950, durationMinutes: 35, category: "Massage" },
    ];
  }

  // 6. Salon Barbers
  const barbersMatch = path.match(/^\/salons\/(\d+|[a-zA-Z0-9_-]+)\/barbers$/);
  if (barbersMatch) {
    return [
      { id: 1, name: "Alex Rivera", role: "Master Stylist", available: true, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
      { id: 2, name: "Elena Rostova", role: "Colorist & Cut Specialist", available: true, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
      { id: 3, name: "Marcus Chen", role: "Fade & Beard Artist", available: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
      { id: 4, name: "Priya Sharma", role: "Spa & Facial Consultant", available: true, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    ];
  }

  // 7. Availability Slots
  if (path.startsWith("/availability") || path.startsWith("/salons") && path.includes("availability")) {
    return {
      slots: [
        { time: "09:00 AM", available: true },
        { time: "09:45 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "11:15 AM", available: true },
        { time: "12:00 PM", available: true },
        { time: "02:00 PM", available: true },
        { time: "02:45 PM", available: true },
        { time: "03:30 PM", available: true },
        { time: "04:15 PM", available: true },
        { time: "05:00 PM", available: true },
        { time: "05:45 PM", available: true },
        { time: "06:30 PM", available: true },
      ],
    };
  }

  // 8. Appointments - Create
  if (path === "/appointments" && method === "POST") {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("gg_appointments") || "[]");
    } catch {}

    const salon = fallback.find((s) => String(s.id) === String(body.salonId)) || fallback[0];
    const service = demoServices.find((s) => String(s.id) === String(body.serviceId)) || { name: "Haircut & Styling", price: 1200 };

    const newAppt = {
      id: "apt_" + Date.now(),
      customerId: body.customerId || "usr_demo",
      salonId: body.salonId,
      salonName: salon.name,
      salon: { id: salon.id, name: salon.name, phone: salon.phone, image: "https://images.unsplash.com/" + salon.image },
      serviceId: body.serviceId,
      serviceItem: { id: service.id, name: service.name, price: service.price },
      service: service.name,
      price: service.price,
      barberId: body.barberId,
      barber: { id: body.barberId, name: body.barberName || "Alex Rivera" },
      appointmentDate: body.appointmentDate || body.date || new Date().toISOString().split("T")[0],
      appointmentTime: body.appointmentTime || body.time || "10:30 AM",
      status: "CONFIRMED",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    saved.unshift(newAppt);
    localStorage.setItem("gg_appointments", JSON.stringify(saved));
    return { ...newAppt, raw: newAppt };
  }

  // 9. Appointments - Mine
  if (path.startsWith("/appointments/mine")) {
    try {
      const saved = JSON.parse(localStorage.getItem("gg_appointments") || "[]");
      if (saved.length > 0) return saved;
    } catch {}

    // Default sample appointment if none booked yet
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        id: "apt_initial_1",
        salonId: 1,
        salonName: "The Best Cheap Salon",
        salon: { id: 1, name: "The Best Cheap Salon", phone: "+91 98765 43210" },
        serviceItem: { id: 1, name: "Haircut & Style", price: 1200 },
        service: "Haircut & Style",
        price: 1200,
        barber: { id: 1, name: "Alex Rivera" },
        appointmentDate: today,
        appointmentTime: "11:15 AM",
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // 10. Appointments - Update / Cancel / Reschedule
  const apptActionMatch = path.match(/^\/appointments\/([^/]+)$/);
  if (apptActionMatch) {
    const apptId = apptActionMatch[1];
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("gg_appointments") || "[]");
    } catch {}

    const index = saved.findIndex((a) => String(a.id) === String(apptId));
    if (index >= 0) {
      if (method === "DELETE") {
        saved[index].status = "CANCELLED";
      } else {
        saved[index] = { ...saved[index], ...body };
        if (body.status) saved[index].status = body.status;
      }
      localStorage.setItem("gg_appointments", JSON.stringify(saved));
      return { ...saved[index], raw: saved[index] };
    }
    return { message: "Updated successfully", raw: { id: apptId, ...body } };
  }

  // 11. Dashboard stats
  if (path.startsWith("/dashboard/stats")) {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("gg_appointments") || "[]");
    } catch {}
    const totalRev = saved.reduce((acc, cur) => acc + (cur.price || 1200), 4500);
    return {
      todayRevenue: totalRev,
      totalRevenue: totalRev,
      todayAppointmentsCount: Math.max(saved.length, 3),
      completedCount: 2,
      activeBarbers: 4,
      upcoming: saved.slice(0, 3),
    };
  }

  return null;
}

export async function request(path, opts = {}) {
  const token = localStorage.getItem("gg_token");
  const headers = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  let response;
  let networkFailed = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    response = await fetch(`${API}${path}`, {
      ...opts,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (err) {
    networkFailed = true;
  }

  // If live backend responded with OK, use it
  if (response && response.ok) {
    if (response.status === 204) return null;
    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : response.text();
  }

  // If live Firebase backend is not yet deployed (404/500/timeout), use seamless client persistence mode
  if (networkFailed || (response && (response.status === 404 || response.status >= 500))) {
    const fallbackResult = handleMockFallback(path, opts);
    if (fallbackResult !== null) {
      console.info(`[Glow & Grace] Using client-side mode for: ${path}`);
      return fallbackResult;
    }
  }

  // If backend returned a specific business error (e.g. 400 or 401)
  if (response && !response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.details
        ? Object.values(payload.details).join("; ")
        : payload.error || payload.message || message;
    } catch {
      try {
        message = (await response.text()) || message;
      } catch {}
    }

    if (response.status === 401) {
      localStorage.removeItem("gg_token");
      localStorage.removeItem("gg_user");
    }
    throw new Error(message);
  }

  throw new Error(
    `Cannot connect to Firebase Backend (${API}). Please start the Firebase Functions or check your connection.`
  );
}
