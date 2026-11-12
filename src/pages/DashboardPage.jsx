import React, { useMemo, useState, useEffect } from "react";
import {
  Scissors,
  Clock,
  User,
  Plus,
  Coffee,
  Flame,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Coins,
  X,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Calendar,
  ArrowRight,
  ArrowLeftRight,
  Check,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import {
  request,
  getStoredBarbers,
  saveStoredBarbers,
  getStoredAppointments,
  saveStoredAppointments,
} from "../api";
import quickGroomLogo from "../assets/quick_groom.jpg";
import { ringtoneManager } from "../utils/audioRing";

const barberNavItems = [
  { key: "home", label: "Station Home", icon: Scissors },
  { key: "appointments", label: "My Appointments", icon: Calendar },
  { key: "confirm", label: "Confirm Queue", badgeKey: "confirm", icon: Bell },
  { key: "earnings", label: "Station Earnings", icon: Coins },
  { key: "timings", label: "My Availability", icon: Sparkles },
];

const adminNavItems = [
  { key: "overview", label: "Command Overview", icon: ShieldCheck },
  { key: "schedule", label: "Master Schedule", icon: Calendar },
  { key: "roster", label: "Staff Roster", icon: User },
  { key: "earnings", label: "Salon Revenue", icon: Coins },
  { key: "timings", label: "Salon Hours", icon: Sparkles },
];

export default function DashboardPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "null");
    } catch {
      return null;
    }
  });

  const userRole = (user?.role || "").toUpperCase();
  const isAdmin = userRole === "ADMIN";

  // Barbers Roster state
  const [barbers, setBarbers] = useState(getStoredBarbers);

  // Appointments state
  const [appointments, setAppointments] = useState(getStoredAppointments);

  // Active View: "admin" or barber ID (1, 2, 3, 4)
  const [currentView, setCurrentView] = useState(() => {
    if (isAdmin) return "admin";
    if (user?.barberId) return String(user.barberId);
    return "1"; // Default to Alex Rivera (Chair #1)
  });

  // Tab state within the active view
  const [activeTab, setActiveTab] = useState(() => (isAdmin ? "overview" : "home"));

  // Open & Close salon hours
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("20:00");

  // In-chair state mapped per barber: { 1: { ... }, 2: { ... }, 3: null, 4: null }
  const [inChairMap, setInChairMap] = useState(() => {
    try {
      const saved = localStorage.getItem("gg_in_chair_map");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      1: {
        id: "chair_cut_1",
        customer: "Arjun Verma",
        service: "Skin Fade + Royal Beard Sculpt",
        price: 750,
        startedAt: "10:15 AM",
      },
      2: null,
      3: {
        id: "chair_cut_3",
        customer: "Devendra Singhania",
        service: "Razor Fade & Hot Towel",
        price: 680,
        startedAt: "10:30 AM",
      },
      4: null,
    };
  });

  // Walk-in modal state
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInTargetBarber, setWalkInTargetBarber] = useState(1);
  const [walkInForm, setWalkInForm] = useState({
    customer: "",
    service: "Signature Skin Fade",
    price: 680,
  });

  // Re-assign appointment modal state
  const [reassignModal, setReassignModal] = useState(null); // { appt: {...}, newBarberId: 2 }

  // Station ops checklist
  const [stationChecklist, setStationChecklist] = useState({
    bladeDisinfected: true,
    towelSteamer: true,
    freshCapes: true,
    clippersOiled: true,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");

  // Incoming 10-Second Ring Alert
  const [incomingAlert, setIncomingAlert] = useState(null);
  const [ringRemaining, setRingRemaining] = useState(10);

  // Master schedule filter
  const [adminBarberFilter, setAdminBarberFilter] = useState("all");
  const [apptStatusFilter, setApptStatusFilter] = useState("all");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3800);
  }

  // Persist in-chair map
  useEffect(() => {
    try {
      localStorage.setItem("gg_in_chair_map", JSON.stringify(inChairMap));
    } catch {}
  }, [inChairMap]);

  // Sync external events for appointments & barbers
  useEffect(() => {
    const handleApptUpdate = () => setAppointments(getStoredAppointments());
    const handleBarberUpdate = () => setBarbers(getStoredBarbers());

    window.addEventListener("gg_appointments_updated", handleApptUpdate);
    window.addEventListener("gg_barbers_updated", handleBarberUpdate);

    return () => {
      window.removeEventListener("gg_appointments_updated", handleApptUpdate);
      window.removeEventListener("gg_barbers_updated", handleBarberUpdate);
    };
  }, []);

  /* =========================================================
     INCOMING APPOINTMENT 10-SECOND RING HANDLER
  ========================================================= */

  function triggerIncomingAppointment(customData) {
    const demoClients = [
      { customer: "Vikram Malhotra", service: "Signature Skin Fade & Hot Towel", price: 680, time: "Today 02:30 PM", barberId: 1, barberName: "Alex Rivera", chair: "Chair #1" },
      { customer: "Rohan Kapoor", service: "Royal Beard Sculpt & Head Spa", price: 740, time: "Today 03:15 PM", barberId: 2, barberName: "Elena Rostova", chair: "Chair #2" },
      { customer: "Aakash Mehta", service: "Classic Haircut & Charcoal Mask", price: 580, time: "Today 04:00 PM", barberId: 3, barberName: "Marcus Chen", chair: "Chair #3" },
      { customer: "Devendra Singhania", service: "Executive Grooming & Shave", price: 820, time: "Today 05:30 PM", barberId: 4, barberName: "Priya Sharma", chair: "Chair #4" },
    ];
    const picked = customData || demoClients[Math.floor(Math.random() * demoClients.length)];

    const targetBarber = barbers.find((b) => Number(b.id) === Number(picked.barberId)) || barbers[0];

    const alertPayload = {
      id: picked.appointmentId || picked.id || Date.now(),
      customer: picked.customer || "Valued Client",
      service: picked.service || "Signature Cut",
      price: Number(picked.price) || 650,
      time: picked.time || "Today 02:30 PM",
      date: picked.date || new Date().toISOString().split("T")[0],
      barberId: targetBarber.id,
      barberName: targetBarber.name,
      chair: targetBarber.chair,
      status: "PENDING",
    };

    setIncomingAlert(alertPayload);
    setRingRemaining(10);

    ringtoneManager.start10SecondRing({
      onTick: (left) => {
        setRingRemaining(left);
      },
      onEnd: () => {
        setIncomingAlert(null);
        showToast(`🔔 10s ring finished. ${alertPayload.customer}'s booking is in queue for ${alertPayload.barberName}.`);
      },
    });
  }

  function handleAcceptRing() {
    if (!incomingAlert) return;
    ringtoneManager.stop();
    const apptId = incomingAlert.id;

    const updated = appointments.map((a) =>
      a.id === apptId ? { ...a, status: "CONFIRMED" } : a
    );
    // If not already in array, prepend
    if (!updated.some((a) => a.id === apptId)) {
      updated.unshift({ ...incomingAlert, status: "CONFIRMED" });
    }
    setAppointments(updated);
    saveStoredAppointments(updated);

    showToast(`💈 Confirmed appointment for ${incomingAlert.customer} with ${incomingAlert.barberName}!`);
    setIncomingAlert(null);
  }

  function handleMuteRing() {
    if (!incomingAlert) return;
    ringtoneManager.stop();
    showToast(`🔕 Ring muted. Appointment queued for ${incomingAlert.barberName}.`);
    setIncomingAlert(null);
  }

  useEffect(() => {
    const handleCustomAppt = (e) => {
      if (e.detail) triggerIncomingAppointment(e.detail);
    };

    const handleStorageAppt = (e) => {
      if (e.key === "gg_incoming_booking" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          triggerIncomingAppointment(parsed);
          localStorage.removeItem("gg_incoming_booking");
        } catch {}
      }
    };

    window.addEventListener("gg_appointment_received", handleCustomAppt);
    window.addEventListener("storage", handleStorageAppt);

    return () => {
      window.removeEventListener("gg_appointment_received", handleCustomAppt);
      window.removeEventListener("storage", handleStorageAppt);
      ringtoneManager.stop();
    };
  }, [barbers, appointments]);

  /* =========================================================
     ACTIVE VIEW HELPERS (ADMIN vs INDIVIDUAL BARBER)
  ========================================================= */

  const isViewingAdmin = currentView === "admin";
  const selectedBarberId = Number(currentView);
  const currentBarber = barbers.find((b) => Number(b.id) === selectedBarberId) || barbers[0];

  // Filter appointments for currently selected individual barber
  const barberAppointments = useMemo(() => {
    if (isViewingAdmin) return [];
    return appointments.filter(
      (a) => Number(a.barberId || a.barber?.id) === selectedBarberId && a.status !== "CANCELLED"
    );
  }, [appointments, isViewingAdmin, selectedBarberId]);

  // Accurate earnings calculation for individual barber:
  // Completed earnings MUST only count completed cuts!
  const barberCompletedRevenue = useMemo(() => {
    return barberAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((sum, a) => sum + Number(a.price || 0), 0);
  }, [barberAppointments]);

  const barberCompletedCount = useMemo(() => {
    return barberAppointments.filter((a) => a.status === "COMPLETED").length;
  }, [barberAppointments]);

  const barberConfirmedCount = useMemo(() => {
    return barberAppointments.filter((a) => a.status === "CONFIRMED").length;
  }, [barberAppointments]);

  const barberPendingCount = useMemo(() => {
    return barberAppointments.filter((a) => a.status === "PENDING").length;
  }, [barberAppointments]);

  const barberProjectedRevenue = useMemo(() => {
    return barberAppointments
      .filter((a) => a.status === "CONFIRMED")
      .reduce((sum, a) => sum + Number(a.price || 0), 0);
  }, [barberAppointments]);

  // Salon-wide aggregate calculations for Administrator:
  const salonCompletedRevenue = useMemo(() => {
    return appointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((sum, a) => sum + Number(a.price || 0), 0);
  }, [appointments]);

  const salonCompletedCount = useMemo(() => {
    return appointments.filter((a) => a.status === "COMPLETED").length;
  }, [appointments]);

  const salonActiveStaffCount = useMemo(() => {
    return barbers.filter((b) => b.status === "active").length;
  }, [barbers]);

  const salonTotalInQueue = useMemo(() => {
    return appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length;
  }, [appointments]);

  // Current in-chair cut for individual barber
  const inChairForCurrent = inChairMap[currentBarber?.id] || null;

  /* =========================================================
     ACTIONS
  ======================================================== */

  // Toggle barber availability: active -> break -> offline -> active
  function handleBarberStatusChange(barberId, nextStatus) {
    const updated = barbers.map((b) => {
      if (Number(b.id) === Number(barberId)) {
        return {
          ...b,
          status: nextStatus,
          available: nextStatus === "active",
        };
      }
      return b;
    });
    setBarbers(updated);
    saveStoredBarbers(updated);

    const bObj = updated.find((b) => Number(b.id) === Number(barberId));
    const statusLabel =
      nextStatus === "active" ? "🟢 On Duty & Active" : nextStatus === "break" ? "☕ On Quick Break" : "🔴 Off Duty";
    showToast(`${bObj.name} (${bObj.chair}): Status set to ${statusLabel}`);
  }

  // Finish haircut in chair and collect payment -> Accurately increments completed earnings!
  function handleFinishInChairCut(barberId) {
    const cut = inChairMap[barberId];
    if (!cut) return;

    const bObj = barbers.find((b) => Number(b.id) === Number(barberId)) || barbers[0];
    const today = new Date().toISOString().split("T")[0];

    // Create completed appointment record
    const completedRecord = {
      id: "cut_" + Date.now(),
      customerId: "usr_walkin",
      customerName: cut.customer,
      service: cut.service,
      price: Number(cut.price) || 650,
      barberId: bObj.id,
      barber: { id: bObj.id, name: bObj.name, role: bObj.role, chair: bObj.chair },
      appointmentDate: today,
      appointmentTime: cut.startedAt || "Just now",
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const nextAppts = [completedRecord, ...appointments];
    setAppointments(nextAppts);
    saveStoredAppointments(nextAppts);

    // Free the chair
    setInChairMap((prev) => ({ ...prev, [barberId]: null }));

    showToast(`✅ Cut completed for ${cut.customer}! ₹${cut.price} collected & added to ${bObj.name}'s verified earnings.`);
  }

  // Seat next client in chair
  function handleSeatInChair(booking, barberId) {
    const bId = barberId || booking.barberId || currentBarber.id;
    const currentOccupant = inChairMap[bId];

    if (currentOccupant) {
      // Prompt completion of current occupant
      handleFinishInChairCut(bId);
    }

    setInChairMap((prev) => ({
      ...prev,
      [bId]: {
        id: booking.id,
        customer: booking.customerName || booking.customer,
        service: booking.service,
        price: Number(booking.price) || 650,
        startedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    }));

    // Update appointment status to IN_CHAIR or keep confirmed
    const updated = appointments.map((a) =>
      a.id === booking.id ? { ...a, status: "IN_CHAIR" } : a
    );
    setAppointments(updated);
    saveStoredAppointments(updated);

    const bObj = barbers.find((b) => Number(b.id) === Number(bId)) || barbers[0];
    showToast(`💈 ${booking.customerName || booking.customer} is now seated at ${bObj.chair} (${bObj.name})!`);
  }

  // Mark confirmed appointment directly as COMPLETED -> Accurate earnings!
  function handleMarkApptCompleted(apptId) {
    const updated = appointments.map((a) => {
      if (a.id === apptId) {
        return {
          ...a,
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
        };
      }
      return a;
    });
    setAppointments(updated);
    saveStoredAppointments(updated);

    const target = appointments.find((a) => a.id === apptId);
    showToast(`✅ Service marked completed! ₹${target?.price || 0} added to completed earnings.`);
  }

  // Confirm pending appointment
  function handleConfirmAppt(apptId) {
    const updated = appointments.map((a) => {
      if (a.id === apptId) {
        return { ...a, status: "CONFIRMED" };
      }
      return a;
    });
    setAppointments(updated);
    saveStoredAppointments(updated);
    showToast("✅ Appointment confirmed!");
  }

  // Re-assign appointment from one barber to another (Administrator Feature)
  function handleReassignSubmit(e) {
    e.preventDefault();
    if (!reassignModal?.appt || !reassignModal?.newBarberId) return;

    const apptId = reassignModal.appt.id;
    const newBarber = barbers.find((b) => Number(b.id) === Number(reassignModal.newBarberId));
    if (!newBarber) return;

    const updated = appointments.map((a) => {
      if (a.id === apptId) {
        return {
          ...a,
          barberId: newBarber.id,
          barber: { id: newBarber.id, name: newBarber.name, role: newBarber.role, chair: newBarber.chair },
          reassignedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setAppointments(updated);
    saveStoredAppointments(updated);

    // Dispatch notification to alert the new barber station
    const reassignedAppt = updated.find((a) => a.id === apptId);
    triggerIncomingAppointment({
      ...reassignedAppt,
      barberId: newBarber.id,
      barberName: newBarber.name,
      chair: newBarber.chair,
    });

    showToast(`🔄 Appointment for ${reassignModal.appt.customerName || reassignModal.appt.customer} successfully transferred to ${newBarber.name} (${newBarber.chair})!`);
    setReassignModal(null);
  }

  // Walk-in form submit
  function handleWalkInSubmit(e) {
    e.preventDefault();
    const bId = walkInTargetBarber || currentBarber.id;
    const bObj = barbers.find((b) => Number(b.id) === Number(bId)) || barbers[0];
    const clientName = walkInForm.customer.trim() || "Walk-in Guest";
    const svcName = walkInForm.service;
    const priceVal = Number(walkInForm.price) || 680;

    // Check if chair is free
    if (!inChairMap[bId]) {
      setInChairMap((prev) => ({
        ...prev,
        [bId]: {
          id: "walkin_" + Date.now(),
          customer: clientName,
          service: svcName,
          price: priceVal,
          startedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      }));
      showToast(`💈 Seated ${clientName} immediately in ${bObj.chair}!`);
    } else {
      // Add to confirmed queue
      const newAppt = {
        id: "apt_walkin_" + Date.now(),
        customerId: "usr_walkin",
        customerName: clientName,
        salonId: 1,
        salonName: "Quick Groom Barber Saloon",
        service: svcName,
        price: priceVal,
        barberId: bObj.id,
        barber: { id: bObj.id, name: bObj.name, role: bObj.role, chair: bObj.chair },
        appointmentDate: new Date().toISOString().split("T")[0],
        appointmentTime: "Walk-in Next",
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      };
      const nextAppts = [newAppt, ...appointments];
      setAppointments(nextAppts);
      saveStoredAppointments(nextAppts);
      showToast(`📋 Walk-in client ${clientName} added to ${bObj.name}'s queue!`);
    }

    setShowWalkIn(false);
    setWalkInForm({ customer: "", service: "Signature Skin Fade", price: 680 });
  }

  return (
    <main className="barber-layout">
      {/* 10-Second Incoming Appointment Ring Banner Overlay */}
      {incomingAlert && (
        <div className="incoming-ring-overlay" role="dialog" aria-modal="true" aria-label="Incoming appointment alert">
          <div className="incoming-ring-card">
            <div className="ring-pulse-aura" />

            <div className="ring-card-top">
              <div className="ring-bell-badge">
                <BellRing size={20} className="ringing-bell-anim" />
                <span className="ring-live-dot" />
              </div>
              <div className="ring-top-info">
                <span className="ring-eyebrow">INCOMING APPOINTMENT ALERT</span>
                <h3 className="ring-title">
                  {incomingAlert.barberName} · {incomingAlert.chair}
                </h3>
              </div>
              <button
                type="button"
                className="ring-quick-mute-btn"
                onClick={handleMuteRing}
                title="Mute 10s Ring"
              >
                <VolumeX size={18} />
              </button>
            </div>

            {/* Visual 10s Countdown Progress Bar */}
            <div className="ring-timer-track">
              <div
                className="ring-timer-fill"
                style={{ width: `${(ringRemaining / 10) * 100}%` }}
              />
            </div>
            <div className="ring-countdown-row">
              <span className="ring-countdown-status">
                <Volume2 size={13} className="volume-pulse-icon" /> Ringing live on station...
              </span>
              <strong className="ring-countdown-seconds">{ringRemaining}s ring</strong>
            </div>

            {/* Client & Service Info */}
            <div className="ring-client-box">
              <div className="ring-client-avatar">
                {(incomingAlert.customer || "C").charAt(0).toUpperCase()}
              </div>
              <div className="ring-client-main">
                <strong className="ring-client-name">{incomingAlert.customer}</strong>
                <span className="ring-client-service">
                  <Scissors size={13} style={{ color: "var(--gold)" }} /> {incomingAlert.service}
                </span>
                <span className="ring-client-time">
                  <Clock size={13} /> {incomingAlert.time} · {incomingAlert.chair}
                </span>
              </div>
              <div className="ring-price-badge">
                <small>Fee</small>
                <strong>₹{incomingAlert.price}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="ring-actions-row">
              <button
                type="button"
                className="outline ring-mute-action-btn"
                onClick={handleMuteRing}
              >
                <VolumeX size={15} /> Mute & Queue Later
              </button>
              <button
                type="button"
                className="primary ring-accept-action-btn"
                onClick={handleAcceptRing}
              >
                <CheckCircle2 size={16} /> Accept & Confirm (₹{incomingAlert.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Multi-Barber & Admin Switcher Bar */}
      <section className="barber-view-switcher-bar" aria-label="Select Barber Station or Admin Command Center">
        <div className="switcher-scroll-track">
          <span className="switcher-label">
            <SlidersHorizontal size={13} /> Switch View:
          </span>

          <button
            type="button"
            className={`switcher-pill admin-pill ${isViewingAdmin ? "active" : ""}`}
            onClick={() => {
              setCurrentView("admin");
              setActiveTab("overview");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ShieldCheck size={14} />
            <span>Salon Admin Command</span>
            <span className="switcher-badge-dot" />
          </button>

          {barbers.map((b) => {
            const isSelected = currentView === String(b.id);
            const inChair = inChairMap[b.id];
            const isOnline = b.status === "active";

            return (
              <button
                key={b.id}
                type="button"
                className={`switcher-pill barber-pill ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setCurrentView(String(b.id));
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className={`status-micro-dot ${b.status}`} />
                <span className="pill-name">{b.name}</span>
                <span className="pill-chair">({b.chair})</span>
                {inChair && <span className="pill-in-chair-tag">In Chair</span>}
              </button>
            );
          })}
        </div>
      </section>

      <div className="barber-shell">
        {/* Sidebar Nav */}
        <aside className="barber-sidebar">
          <div className="barber-profile">
            {isViewingAdmin ? (
              <div className="barber-avatar admin">👑</div>
            ) : currentBarber.image ? (
              <img src={currentBarber.image} alt={currentBarber.name} className="barber-sidebar-img" />
            ) : (
              <div className="barber-avatar">{currentBarber.name.charAt(0)}</div>
            )}
            <div>
              <strong>{isViewingAdmin ? "Salon Administrator" : currentBarber.name}</strong>
              <small>{isViewingAdmin ? "Full Salon Command" : `${currentBarber.role} · ${currentBarber.chair}`}</small>
            </div>
          </div>

          <nav className="barber-nav" aria-label="Dashboard navigation">
            {(isViewingAdmin ? adminNavItems : barberNavItems).map((item) => {
              const IconComp = item.icon;
              const badgeCount =
                item.badgeKey === "confirm"
                  ? isViewingAdmin
                    ? appointments.filter((a) => a.status === "PENDING").length
                    : barberPendingCount
                  : 0;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={activeTab === item.key ? "barber-tab active" : "barber-tab"}
                  onClick={() => {
                    setActiveTab(item.key);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {IconComp && <IconComp size={15} className="barber-tab-icon" />}
                  <span>{item.label}</span>
                  {badgeCount > 0 && <span className="barber-tab-badge">{badgeCount}</span>}
                </button>
              );
            })}
          </nav>

          {/* Quick Shift Status Controls for Individual Barber */}
          {!isViewingAdmin && (
            <div className="sidebar-shift-card">
              <span className="shift-card-title">My Station Duty:</span>
              <div className="shift-status-buttons">
                <button
                  type="button"
                  className={`shift-btn active ${currentBarber.status === "active" ? "selected" : ""}`}
                  onClick={() => handleBarberStatusChange(currentBarber.id, "active")}
                  title="Accepting appointments and walk-ins"
                >
                  🟢 On Duty
                </button>
                <button
                  type="button"
                  className={`shift-btn break ${currentBarber.status === "break" ? "selected" : ""}`}
                  onClick={() => handleBarberStatusChange(currentBarber.id, "break")}
                  title="Pause incoming bookings for a short break"
                >
                  ☕ Break
                </button>
                <button
                  type="button"
                  className={`shift-btn offline ${currentBarber.status === "offline" ? "selected" : ""}`}
                  onClick={() => handleBarberStatusChange(currentBarber.id, "offline")}
                  title="Off shift for the rest of today"
                >
                  🔴 Off Duty
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <section className="barber-content">
          {toastMessage && (
            <div className="appt-toast-banner" style={{ top: "18px" }}>
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* =========================================================
             A. SALON ADMINISTRATOR VIEW
          ========================================================= */}
          {isViewingAdmin ? (
            <div className="admin-command-view">
              {/* Executive Hero Banner */}
              <div className="barber-home-hero-banner admin-theme">
                <div
                  className="barber-banner-bg"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=85')",
                  }}
                >
                  <div className="barber-banner-overlay" />
                </div>

                <div className="barber-banner-content">
                  <div className="barber-banner-top">
                    <div className="barber-banner-badge-group">
                      <div className="barber-salon-avatar">
                        <img src={quickGroomLogo} alt="Quick Groom Saloon" />
                      </div>
                      <div>
                        <span className="barber-banner-eyebrow">
                          <ShieldCheck size={13} /> SALON ADMINISTRATOR COMMAND CENTER
                        </span>
                        <h1 className="barber-banner-title">Salon Executive Operations</h1>
                        <p className="barber-banner-subtitle">
                          Monitoring all 4 barbers, live chair stations, master queue & accurate revenue
                        </p>
                      </div>
                    </div>

                    <div className="barber-banner-actions">
                      <button
                        type="button"
                        className="outline small banner-test-ring-btn"
                        onClick={() => triggerIncomingAppointment()}
                        title="Simulate booking with 10s ring"
                      >
                        <BellRing size={14} className="ring-pulse-icon" /> Test 10s Ring
                      </button>
                      <button
                        type="button"
                        className="primary small banner-walkin-btn"
                        onClick={() => {
                          setWalkInTargetBarber(1);
                          setShowWalkIn(true);
                        }}
                      >
                        <Plus size={15} /> Assign Walk-in
                      </button>
                    </div>
                  </div>

                  <div className="barber-banner-footer-pills">
                    <div className="banner-pill">
                      <Clock size={13} />
                      <span>Salon Hours: {openTime} – {closeTime}</span>
                    </div>
                    <div className="banner-pill">
                      <User size={13} />
                      <span>Staff on Duty: {salonActiveStaffCount} of {barbers.length} Active</span>
                    </div>
                    <div className="banner-pill highlight">
                      <Coins size={13} />
                      <span>Salon Revenue: ₹{salonCompletedRevenue} (Completed)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for Admin */}
              {activeTab === "overview" && (
                <>
                  {/* Executive KPI Stats */}
                  <div className="stats-grid">
                    <div className="stat-card accent">
                      <small>Salon Completed Revenue</small>
                      <strong>₹{salonCompletedRevenue}</strong>
                      <span>From {salonCompletedCount} finished haircuts</span>
                    </div>
                    <div className="stat-card">
                      <small>Total Completed Cuts</small>
                      <strong>{salonCompletedCount} Services</strong>
                      <span>100% verified completed services</span>
                    </div>
                    <div className="stat-card">
                      <small>Active Stylists</small>
                      <strong>{salonActiveStaffCount} / {barbers.length} Active</strong>
                      <span>Ready to receive bookings</span>
                    </div>
                    <div className="stat-card">
                      <small>Lounge & Queued</small>
                      <strong>{salonTotalInQueue} Clients</strong>
                      <span>Upcoming today</span>
                    </div>
                  </div>

                  {/* Multi-Barber Station Grid (Req #2) */}
                  <div className="admin-stations-section">
                    <div className="section-title-row">
                      <div className="title-left">
                        <h3>Live Barber Stations & Chairs</h3>
                        <p className="subtitle">Real-time status, active haircut in chair, and earnings for each stylist</p>
                      </div>
                      <span className="badge-count">{barbers.length} Station Chairs</span>
                    </div>

                    <div className="stations-cards-grid">
                      {barbers.map((barber) => {
                        const inChair = inChairMap[barber.id];
                        const bAppts = appointments.filter(
                          (a) => Number(a.barberId || a.barber?.id) === Number(barber.id) && a.status !== "CANCELLED"
                        );
                        const bCompleted = bAppts.filter((a) => a.status === "COMPLETED");
                        const bRevenue = bCompleted.reduce((s, a) => s + Number(a.price || 0), 0);
                        const bQueueCount = bAppts.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length;

                        return (
                          <div className={`station-card ${barber.status}`} key={barber.id}>
                            <div className="station-card-top">
                              <div className="station-barber-info">
                                <img
                                  src={barber.image}
                                  alt={barber.name}
                                  className="station-barber-avatar"
                                />
                                <div>
                                  <div className="station-name-row">
                                    <h4 className="station-name">{barber.name}</h4>
                                    <span className="chair-badge">{barber.chair}</span>
                                  </div>
                                  <span className="station-role">{barber.specialization || barber.role}</span>
                                </div>
                              </div>

                              <div className="station-status-selector">
                                <select
                                  value={barber.status}
                                  onChange={(e) => handleBarberStatusChange(barber.id, e.target.value)}
                                  className={`status-dropdown ${barber.status}`}
                                >
                                  <option value="active">🟢 On Duty</option>
                                  <option value="break">☕ On Break</option>
                                  <option value="offline">🔴 Off Duty</option>
                                </select>
                              </div>
                            </div>

                            {/* Chair Live Status */}
                            <div className="station-chair-box">
                              {inChair ? (
                                <div className="chair-occupied">
                                  <div className="occupied-badge">
                                    <Scissors size={12} className="spin-slow" /> Seated in Chair
                                  </div>
                                  <strong className="occupied-client">{inChair.customer}</strong>
                                  <span className="occupied-service">{inChair.service}</span>
                                  <div className="occupied-footer">
                                    <span className="occupied-time">Started: {inChair.startedAt}</span>
                                    <button
                                      type="button"
                                      className="primary small finish-cut-pill"
                                      onClick={() => handleFinishInChairCut(barber.id)}
                                    >
                                      <Check size={12} /> Finish (₹{inChair.price})
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="chair-vacant">
                                  <span className="vacant-text">💺 Chair Vacant · Ready</span>
                                  <button
                                    type="button"
                                    className="outline small vacant-seat-btn"
                                    onClick={() => {
                                      const next = bAppts.find((a) => a.status === "CONFIRMED");
                                      if (next) handleSeatInChair(next, barber.id);
                                      else {
                                        setWalkInTargetBarber(barber.id);
                                        setShowWalkIn(true);
                                      }
                                    }}
                                  >
                                    <Plus size={12} /> Seat Client
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Stylist Stats Row */}
                            <div className="station-metrics-row">
                              <div className="station-metric">
                                <small>Completed</small>
                                <strong>{bCompleted.length} cuts</strong>
                              </div>
                              <div className="station-metric">
                                <small>Earnings</small>
                                <strong className="gold">₹{bRevenue}</strong>
                              </div>
                              <div className="station-metric">
                                <small>In Queue</small>
                                <strong>{bQueueCount}</strong>
                              </div>
                            </div>

                            {/* Action to switch directly into that barber station */}
                            <div className="station-card-footer">
                              <button
                                type="button"
                                className="outline small full-btn"
                                onClick={() => {
                                  setCurrentView(String(barber.id));
                                  setActiveTab("home");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                Inspect Station ({barber.name}) <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Master Salon Schedule Tab */}
              {(activeTab === "overview" || activeTab === "schedule") && (
                <div className="info-panel full-width master-schedule-panel" style={{ marginTop: "24px" }}>
                  <div className="panel-title-bar">
                    <div className="title-bar-left">
                      <h3>Master Salon Schedule & Booking Queue</h3>
                      <span className="eyebrow">{appointments.length} Total Bookings</span>
                    </div>

                    <div className="schedule-filters-group">
                      {/* Filter by Barber */}
                      <select
                        value={adminBarberFilter}
                        onChange={(e) => setAdminBarberFilter(e.target.value)}
                        className="admin-select-filter"
                      >
                        <option value="all">All Barbers ({barbers.length})</option>
                        {barbers.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.chair})
                          </option>
                        ))}
                      </select>

                      {/* Filter by Status */}
                      <select
                        value={apptStatusFilter}
                        onChange={(e) => setApptStatusFilter(e.target.value)}
                        className="admin-select-filter"
                      >
                        <option value="all">All Statuses</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Appointments Table with Re-Assignment Capability */}
                  <div className="desktop-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Assigned Stylist</th>
                          <th>Date & Time</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Admin Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter((a) => {
                            if (a.status === "CANCELLED") return false;
                            if (adminBarberFilter !== "all" && Number(a.barberId || a.barber?.id) !== Number(adminBarberFilter)) {
                              return false;
                            }
                            if (apptStatusFilter !== "all" && a.status !== apptStatusFilter) {
                              return false;
                            }
                            return true;
                          })
                          .map((entry) => {
                            const bObj = barbers.find((b) => Number(b.id) === Number(entry.barberId || entry.barber?.id)) || barbers[0];

                            return (
                              <tr key={entry.id}>
                                <td>
                                  <strong>{entry.customerName || entry.customer}</strong>
                                </td>
                                <td>{entry.service}</td>
                                <td>
                                  <span className="table-barber-cell">
                                    <span className="table-barber-name">{bObj.name}</span>
                                    <small className="table-barber-chair">{bObj.chair}</small>
                                  </span>
                                </td>
                                <td>
                                  <span className="table-datetime">
                                    {entry.appointmentDate || "Today"} · {entry.appointmentTime || entry.time}
                                  </span>
                                </td>
                                <td>
                                  <strong>₹{entry.price}</strong>
                                </td>
                                <td>
                                  <span className={`status-pill ${entry.status.toLowerCase()}`}>
                                    {entry.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="table-action-group">
                                    {entry.status === "CONFIRMED" && (
                                      <button
                                        type="button"
                                        className="outline small action-seat-btn"
                                        onClick={() => handleSeatInChair(entry, bObj.id)}
                                      >
                                        <Scissors size={12} /> Seat
                                      </button>
                                    )}
                                    {entry.status === "PENDING" && (
                                      <button
                                        type="button"
                                        className="primary small"
                                        onClick={() => handleConfirmAppt(entry.id)}
                                      >
                                        <Check size={12} /> Confirm
                                      </button>
                                    )}
                                    {entry.status !== "COMPLETED" && (
                                      <button
                                        type="button"
                                        className="outline small reassign-btn"
                                        onClick={() => setReassignModal({ appt: entry, newBarberId: bObj.id })}
                                        title="Transfer this appointment to another barber"
                                      >
                                        <ArrowLeftRight size={12} /> Reassign
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Staff Roster Tab */}
              {activeTab === "roster" && (
                <div className="info-panel full-width">
                  <div className="panel-title-bar">
                    <h3>Salon Stylist Roster & Station Assignment</h3>
                    <span className="eyebrow">{barbers.length} Staff Members</span>
                  </div>
                  <div className="roster-grid">
                    {barbers.map((b) => (
                      <div className="roster-card" key={b.id}>
                        <img src={b.image} alt={b.name} className="roster-img" />
                        <div className="roster-info">
                          <h4>{b.name}</h4>
                          <span className="roster-chair">{b.chair} · {b.role}</span>
                          <p className="roster-spec">{b.specialization}</p>
                          <div className="roster-meta">
                            <span>⭐ {b.rating}</span>
                            <span>⏳ {b.experience} yrs exp</span>
                            <span>📞 {b.phone}</span>
                          </div>
                          <div className="roster-status-row">
                            <span className="roster-status-label">Shift Status:</span>
                            <select
                              value={b.status}
                              onChange={(e) => handleBarberStatusChange(b.id, e.target.value)}
                              className={`status-dropdown ${b.status}`}
                            >
                              <option value="active">🟢 Active (On Duty)</option>
                              <option value="break">☕ Quick Break</option>
                              <option value="offline">🔴 Off Duty</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Salon Revenue Tab (Req #6) */}
              {activeTab === "earnings" && (
                <div className="info-panel full-width">
                  <div className="panel-title-bar">
                    <h3>Salon Executive Revenue & Performance</h3>
                    <span className="eyebrow">Accurately Calculated from Completed Services</span>
                  </div>

                  <div className="earnings-box">
                    <div className="earnings-stat-card highlight">
                      <small>Total Completed Salon Revenue</small>
                      <strong>₹{salonCompletedRevenue}</strong>
                      <span>100% verified completed services</span>
                    </div>
                    <div className="earnings-stat-card">
                      <small>Total Completed Services</small>
                      <strong>{salonCompletedCount}</strong>
                      <span>Finished haircuts & treatments</span>
                    </div>
                    <div className="earnings-stat-card">
                      <small>Projected Revenue (Queue)</small>
                      <strong>
                        ₹
                        {appointments
                          .filter((a) => a.status === "CONFIRMED")
                          .reduce((s, a) => s + Number(a.price || 0), 0)}
                      </strong>
                      <span>Confirmed upcoming appointments</span>
                    </div>
                  </div>

                  {/* Revenue Breakdown by Stylist */}
                  <div className="stylist-revenue-breakdown" style={{ marginTop: "24px" }}>
                    <h4 style={{ marginBottom: "14px", fontSize: "16px" }}>Earnings by Stylist Station</h4>
                    <div className="barber-revenue-cards-grid">
                      {barbers.map((b) => {
                        const completedForB = appointments.filter(
                          (a) => Number(a.barberId || a.barber?.id) === Number(b.id) && a.status === "COMPLETED"
                        );
                        const revForB = completedForB.reduce((s, a) => s + Number(a.price || 0), 0);

                        return (
                          <div className="stylist-rev-card" key={b.id}>
                            <div className="rev-card-header">
                              <img src={b.image} alt={b.name} className="rev-card-img" />
                              <div>
                                <strong>{b.name}</strong>
                                <small>{b.chair}</small>
                              </div>
                            </div>
                            <div className="rev-card-body">
                              <span className="rev-amount">₹{revForB}</span>
                              <span className="rev-count">{completedForB.length} completed cuts</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Timings Tab */}
              {activeTab === "timings" && (
                <div className="info-panel full-width">
                  <div className="panel-title-bar">
                    <h3>Salon Operating Hours</h3>
                    <span className="eyebrow">Whitefield Flagship</span>
                  </div>
                  <div className="time-form">
                    <div className="time-inputs-group">
                      <label>
                        Opening Time
                        <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                      </label>
                      <label>
                        Closing Time
                        <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="primary full-mobile-btn"
                      onClick={() => showToast("Salon operating timings updated successfully!")}
                    >
                      Save Operating Hours
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================
               B. INDIVIDUAL BARBER STATION VIEW (Req #1)
            ========================================================= */
            <div className="individual-barber-view">
              {/* Barber Station Hero Banner */}
              <div className="barber-home-hero-banner">
                <div
                  className="barber-banner-bg"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=85')",
                  }}
                >
                  <div className="barber-banner-overlay" />
                </div>

                <div className="barber-banner-content">
                  <div className="barber-banner-top">
                    <div className="barber-banner-badge-group">
                      <div className="barber-salon-avatar">
                        <img src={currentBarber.image || quickGroomLogo} alt={currentBarber.name} />
                      </div>
                      <div>
                        <span className="barber-banner-eyebrow">
                          <Scissors size={13} /> QUICK GROOM BARBER SALOON · {currentBarber.chair.toUpperCase()}
                        </span>
                        <h1 className="barber-banner-title">{currentBarber.name}'s Station</h1>
                        <p className="barber-banner-subtitle">
                          {currentBarber.specialization} · Managing live haircuts, appointments & verified earnings
                        </p>
                      </div>
                    </div>

                    <div className="barber-banner-actions">
                      <button
                        type="button"
                        className="outline small banner-test-ring-btn"
                        onClick={() =>
                          triggerIncomingAppointment({
                            barberId: currentBarber.id,
                            barberName: currentBarber.name,
                            chair: currentBarber.chair,
                          })
                        }
                        title="Test 10s incoming appointment ring for this station"
                      >
                        <BellRing size={14} className="ring-pulse-icon" /> Test 10s Ring
                      </button>

                      {/* Interactive Station Availability Toggle */}
                      <button
                        type="button"
                        className={`station-active-badge ${currentBarber.status}`}
                        onClick={() => {
                          const next = currentBarber.status === "active" ? "break" : "active";
                          handleBarberStatusChange(currentBarber.id, next);
                        }}
                      >
                        <span className="station-dot" />
                        {currentBarber.status === "active"
                          ? `${currentBarber.chair} Active`
                          : currentBarber.status === "break"
                          ? "Station on Break"
                          : "Station Offline"}
                      </button>

                      <button
                        type="button"
                        className="primary small banner-walkin-btn"
                        onClick={() => {
                          setWalkInTargetBarber(currentBarber.id);
                          setShowWalkIn(true);
                        }}
                      >
                        <Plus size={15} /> Quick Walk-in
                      </button>
                    </div>
                  </div>

                  <div className="barber-banner-footer-pills">
                    <div className="banner-pill">
                      <Clock size={13} />
                      <span>Shift: {openTime} – {closeTime}</span>
                    </div>
                    <div className="banner-pill">
                      <User size={13} />
                      <span>Stylist: {currentBarber.name} ({currentBarber.chair})</span>
                    </div>
                    <div className="banner-pill highlight">
                      <Sparkles size={13} />
                      <span>{barberCompletedCount} Cuts Completed Today (₹{barberCompletedRevenue})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Station Home Tab */}
              {activeTab === "home" && (
                <>
                  {/* Active Barber Chair Card */}
                  {inChairForCurrent ? (
                    <div className="barber-chair-card">
                      <div className="barber-chair-header">
                        <div className="chair-header-left">
                          <span className="chair-pulse-badge">
                            <Scissors size={14} className="spin-slow" /> LIVE IN {currentBarber.chair.toUpperCase()}
                          </span>
                          <span className="chair-timer">
                            <Clock size={13} /> Started at {inChairForCurrent.startedAt || "10:15 AM"} · ~15m left
                          </span>
                        </div>
                        <span className="chair-price-tag">₹{inChairForCurrent.price}</span>
                      </div>

                      {/* Visual Cut Progress Bar */}
                      <div className="chair-progress-wrap">
                        <div className="chair-progress-bar">
                          <div className="chair-progress-fill" style={{ width: "70%" }} />
                        </div>
                        <div className="chair-progress-labels">
                          <small>{inChairForCurrent.service} in progress</small>
                          <small>70% completed</small>
                        </div>
                      </div>

                      <div className="barber-chair-body">
                        <div className="chair-client-info">
                          <h2 className="chair-client-name">{inChairForCurrent.customer}</h2>
                          <p className="chair-service-name">
                            <Sparkles size={14} style={{ color: "var(--gold)" }} /> {inChairForCurrent.service}
                          </p>
                        </div>
                        <div className="barber-chair-actions">
                          <div className="chair-addons-row">
                            <button
                              type="button"
                              className="outline small chair-addon-btn"
                              onClick={() => {
                                setInChairMap((prev) => ({
                                  ...prev,
                                  [currentBarber.id]: {
                                    ...inChairForCurrent,
                                    price: inChairForCurrent.price + 150,
                                    service: inChairForCurrent.service + " + Hot Towel",
                                  },
                                }));
                                showToast("♨️ Added Hot Towel Steamer (+₹150)!");
                              }}
                            >
                              <Flame size={13} /> + Hot Towel (+₹150)
                            </button>
                            <button
                              type="button"
                              className="outline small chair-addon-btn"
                              onClick={() => {
                                setInChairMap((prev) => ({
                                  ...prev,
                                  [currentBarber.id]: {
                                    ...inChairForCurrent,
                                    price: inChairForCurrent.price + 100,
                                    service: inChairForCurrent.service + " + Beard Balm",
                                  },
                                }));
                                showToast("🧴 Added Organic Beard Balm (+₹100)!");
                              }}
                            >
                              <Sparkles size={13} /> + Beard Balm (+₹100)
                            </button>
                          </div>
                          <button
                            type="button"
                            className="primary chair-finish-btn"
                            onClick={() => handleFinishInChairCut(currentBarber.id)}
                          >
                            <CheckCircle2 size={16} /> Finish Cut & Collect ₹{inChairForCurrent.price}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="barber-chair-empty-card">
                      <div className="empty-chair-text">
                        <h3>💺 {currentBarber.chair} is Vacant & Ready</h3>
                        <p>No client is currently in the chair. Seat the next appointment or log a walk-in.</p>
                      </div>
                      <div className="empty-chair-actions">
                        <button
                          type="button"
                          className="primary small"
                          onClick={() => {
                            const next = barberAppointments.find((b) => b.status === "CONFIRMED");
                            if (next) handleSeatInChair(next, currentBarber.id);
                            else showToast("No confirmed appointments in queue. Add a walk-in!");
                          }}
                        >
                          <Scissors size={14} /> Seat Next from Queue
                        </button>
                        <button
                          type="button"
                          className="outline small"
                          onClick={() => {
                            setWalkInTargetBarber(currentBarber.id);
                            setShowWalkIn(true);
                          }}
                        >
                          <Plus size={14} /> + Walk-in Client
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Individual Stylist Live Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card accent">
                      <small>Completed Earnings</small>
                      <strong>₹{barberCompletedRevenue}</strong>
                      <span>From {barberCompletedCount} completed cuts</span>
                    </div>
                    <div className="stat-card">
                      <small>Completed Cuts Today</small>
                      <strong>{barberCompletedCount} cuts</strong>
                      <span>Groomed at {currentBarber.chair}</span>
                    </div>
                    <div className="stat-card">
                      <small>Waiting in Lounge</small>
                      <strong>{barberConfirmedCount} clients</strong>
                      <span>Next up in queue</span>
                    </div>
                    <div className="stat-card">
                      <small>Pending Approval</small>
                      <strong>{barberPendingCount} requests</strong>
                      <span>Awaiting confirmation</span>
                    </div>
                  </div>

                  {/* 2-Panel Grid: Queue & Station Operations */}
                  <div className="panel-grid">
                    {/* Left: Today's Barber Schedule */}
                    <div className="info-panel">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0 }}>My Haircut Queue</h3>
                        <span className="eyebrow" style={{ margin: 0 }}>{barberAppointments.length} Scheduled</span>
                      </div>

                      <ul className="list-stack">
                        {barberAppointments.slice(0, 5).map((entry) => (
                          <li key={entry.id} className="barber-queue-item">
                            <div className="queue-item-info">
                              <div className="queue-item-top">
                                <strong className="queue-customer-name">{entry.customerName || entry.customer}</strong>
                                <span className="queue-service-badge">{entry.service}</span>
                              </div>
                              <span className="queue-item-meta">
                                ⏰ {entry.appointmentTime || entry.time} • <b>₹{entry.price}</b>
                              </span>
                            </div>
                            {entry.status === "CONFIRMED" ? (
                              <button
                                type="button"
                                className="outline small barber-seat-btn"
                                onClick={() => handleSeatInChair(entry, currentBarber.id)}
                                title="Seat client in chair"
                              >
                                <Scissors size={13} /> Seat in Chair
                              </button>
                            ) : (
                              <span className={`status-pill ${entry.status.toLowerCase()}`}>
                                {entry.status}
                              </span>
                            )}
                          </li>
                        ))}
                        {barberAppointments.length === 0 && (
                          <div className="queue-empty-box">
                            <Calendar size={28} style={{ color: "var(--gold)", margin: "0 auto 8px" }} />
                            <p>No appointments scheduled yet today.</p>
                          </div>
                        )}
                      </ul>
                    </div>

                    {/* Right: Station Readiness Checklist */}
                    <div className="info-panel">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0 }}>Station Ops & Hygiene</h3>
                        <span className="status-pill open">
                          <ShieldCheck size={12} style={{ marginRight: "4px" }} /> Inspected
                        </span>
                      </div>

                      <div className="station-checklist">
                        <label className="station-check-item">
                          <input
                            type="checkbox"
                            checked={stationChecklist.bladeDisinfected}
                            onChange={() =>
                              setStationChecklist((p) => ({ ...p, bladeDisinfected: !p.bladeDisinfected }))
                            }
                          />
                          <span>Straight Razors & Blades Sterilized</span>
                        </label>
                        <label className="station-check-item">
                          <input
                            type="checkbox"
                            checked={stationChecklist.towelSteamer}
                            onChange={() =>
                              setStationChecklist((p) => ({ ...p, towelSteamer: !p.towelSteamer }))
                            }
                          />
                          <span>Hot Towel Steamer Ready (65°C)</span>
                        </label>
                        <label className="station-check-item">
                          <input
                            type="checkbox"
                            checked={stationChecklist.freshCapes}
                            onChange={() =>
                              setStationChecklist((p) => ({ ...p, freshCapes: !p.freshCapes }))
                            }
                          />
                          <span>Fresh Neck Strips & Barber Capes</span>
                        </label>
                        <label className="station-check-item">
                          <input
                            type="checkbox"
                            checked={stationChecklist.clippersOiled}
                            onChange={() =>
                              setStationChecklist((p) => ({ ...p, clippersOiled: !p.clippersOiled }))
                            }
                          />
                          <span>Clippers & Trimmers Oiled</span>
                        </label>
                      </div>

                      <div className="barber-rate-box">
                        <span className="barber-rate-title">Station Rate Card</span>
                        <div className="barber-rate-tags">
                          <span className="rate-pill">Skin Fade: ₹680</span>
                          <span className="rate-pill">Royal Shave: ₹560</span>
                          <span className="rate-pill">Beard Sculpt: ₹420</span>
                          <span className="rate-pill">Hair Spa: ₹940</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* My Appointments Tab (Req #1) */}
              {activeTab === "appointments" && (
                <div className="info-panel full-width barber-appt-panel">
                  <div className="panel-title-bar">
                    <div className="title-bar-left">
                      <h3>Appointments for {currentBarber.name}</h3>
                      <span className="eyebrow">{barberAppointments.length} Total</span>
                    </div>
                    <div className="barber-filter-pills">
                      <button
                        type="button"
                        className={`filter-pill ${apptStatusFilter === "all" ? "active" : ""}`}
                        onClick={() => setApptStatusFilter("all")}
                      >
                        All ({barberAppointments.length})
                      </button>
                      <button
                        type="button"
                        className={`filter-pill ${apptStatusFilter === "CONFIRMED" ? "active" : ""}`}
                        onClick={() => setApptStatusFilter("CONFIRMED")}
                      >
                        Confirmed ({barberConfirmedCount})
                      </button>
                      <button
                        type="button"
                        className={`filter-pill ${apptStatusFilter === "PENDING" ? "active" : ""}`}
                        onClick={() => setApptStatusFilter("PENDING")}
                      >
                        Pending ({barberPendingCount})
                      </button>
                      <button
                        type="button"
                        className={`filter-pill ${apptStatusFilter === "COMPLETED" ? "active" : ""}`}
                        onClick={() => setApptStatusFilter("COMPLETED")}
                      >
                        Completed ({barberCompletedCount})
                      </button>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="desktop-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Time</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {barberAppointments
                          .filter((a) => (apptStatusFilter === "all" ? true : a.status === apptStatusFilter))
                          .map((entry) => (
                            <tr key={entry.id}>
                              <td><strong>{entry.customerName || entry.customer}</strong></td>
                              <td>{entry.service}</td>
                              <td>⏰ {entry.appointmentTime || entry.time}</td>
                              <td><strong>₹{entry.price}</strong></td>
                              <td>
                                <span className={`status-pill ${entry.status.toLowerCase()}`}>
                                  {entry.status}
                                </span>
                              </td>
                              <td>
                                <div className="table-action-group">
                                  {entry.status === "CONFIRMED" && (
                                    <>
                                      <button
                                        type="button"
                                        className="outline small table-action-btn"
                                        onClick={() => handleSeatInChair(entry, currentBarber.id)}
                                      >
                                        <Scissors size={12} /> Seat
                                      </button>
                                      <button
                                        type="button"
                                        className="primary small table-action-btn"
                                        onClick={() => handleMarkApptCompleted(entry.id)}
                                      >
                                        <Check size={12} /> Done
                                      </button>
                                    </>
                                  )}
                                  {entry.status === "PENDING" && (
                                    <button
                                      type="button"
                                      className="primary small table-action-btn"
                                      onClick={() => handleConfirmAppt(entry.id)}
                                    >
                                      <CheckCircle2 size={12} /> Confirm
                                    </button>
                                  )}
                                  {entry.status === "COMPLETED" && (
                                    <span className="completed-stamp">Collected</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="mobile-appt-list">
                    {barberAppointments
                      .filter((a) => (apptStatusFilter === "all" ? true : a.status === apptStatusFilter))
                      .map((entry) => (
                        <div className="mobile-appt-card" key={entry.id}>
                          <div className="mobile-appt-header">
                            <div className="mobile-appt-header-main">
                              <strong className="mobile-appt-customer">{entry.customerName || entry.customer}</strong>
                              <span className="mobile-appt-time">⏰ {entry.appointmentTime || entry.time}</span>
                            </div>
                            <span className={`status-pill ${entry.status.toLowerCase()}`}>
                              {entry.status}
                            </span>
                          </div>

                          <div className="mobile-appt-service">
                            <Scissors size={13} style={{ color: "var(--gold)" }} />
                            <span>{entry.service}</span>
                          </div>

                          <div className="mobile-appt-footer">
                            <div className="mobile-appt-price-wrap">
                              <small>Fee</small>
                              <strong className="mobile-appt-price">₹{entry.price}</strong>
                            </div>
                            <div className="mobile-appt-actions">
                              {entry.status === "CONFIRMED" && (
                                <>
                                  <button
                                    type="button"
                                    className="outline small mobile-card-action-btn"
                                    onClick={() => handleSeatInChair(entry, currentBarber.id)}
                                  >
                                    <Scissors size={13} /> Seat
                                  </button>
                                  <button
                                    type="button"
                                    className="primary small mobile-card-action-btn"
                                    onClick={() => handleMarkApptCompleted(entry.id)}
                                  >
                                    <Check size={13} /> Done
                                  </button>
                                </>
                              )}
                              {entry.status === "PENDING" && (
                                <button
                                  type="button"
                                  className="primary small mobile-card-action-btn"
                                  onClick={() => handleConfirmAppt(entry.id)}
                                >
                                  <CheckCircle2 size={13} /> Confirm
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {barberAppointments.length === 0 && (
                    <div className="queue-empty-box">
                      <Calendar size={32} style={{ color: "var(--gold)", margin: "0 auto 8px" }} />
                      <p>No appointments found for this filter.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Queue Tab */}
              {activeTab === "confirm" && (
                <div className="info-panel full-width barber-confirm-panel">
                  <div className="panel-title-bar">
                    <div className="title-bar-left">
                      <h3>Pending Approval Queue</h3>
                      <span className="eyebrow">{barberPendingCount} Awaiting Confirmation</span>
                    </div>
                    <button
                      type="button"
                      className="outline small test-ring-btn"
                      onClick={() =>
                        triggerIncomingAppointment({
                          barberId: currentBarber.id,
                          barberName: currentBarber.name,
                          chair: currentBarber.chair,
                        })
                      }
                    >
                      <BellRing size={13} /> Simulate Booking (10s Ring)
                    </button>
                  </div>

                  <div className="confirm-list">
                    {barberAppointments
                      .filter((a) => a.status === "PENDING")
                      .map((entry) => (
                        <div className="confirm-card" key={entry.id}>
                          <div className="confirm-info">
                            <strong className="confirm-customer-name">{entry.customerName || entry.customer}</strong>
                            <p className="confirm-service-desc">{entry.service}</p>
                          </div>
                          <div className="confirm-meta">
                            <span className="confirm-time-badge">⏰ {entry.appointmentTime || entry.time}</span>
                            <strong className="confirm-price">₹{entry.price}</strong>
                          </div>
                          <div className="confirm-actions-row">
                            <button
                              type="button"
                              className="outline small confirm-seat-direct-btn"
                              onClick={() => {
                                handleConfirmAppt(entry.id);
                                handleSeatInChair({ ...entry, status: "CONFIRMED" }, currentBarber.id);
                              }}
                            >
                              <Scissors size={13} /> Direct Seat
                            </button>
                            <button
                              type="button"
                              className="primary small confirm-action-btn"
                              onClick={() => handleConfirmAppt(entry.id)}
                            >
                              <CheckCircle2 size={14} /> Confirm
                            </button>
                          </div>
                        </div>
                      ))}

                    {barberPendingCount === 0 && (
                      <div className="queue-empty-box">
                        <CheckCircle2 size={36} style={{ color: "#22c55e", margin: "0 auto 10px" }} />
                        <h4 style={{ margin: "0 0 6px", color: "#25221d" }}>All Caught Up!</h4>
                        <p style={{ margin: "0 0 14px" }}>No appointment requests are pending approval for {currentBarber.name}.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Station Earnings Tab (Req #1 & #6) */}
              {activeTab === "earnings" && (
                <div className="info-panel full-width">
                  <div className="panel-title-bar">
                    <h3>{currentBarber.name}'s Verified Station Earnings</h3>
                    <span className="eyebrow">{currentBarber.chair} Ledger</span>
                  </div>

                  <div className="earnings-box">
                    <div className="earnings-stat-card highlight">
                      <small>Verified Completed Earnings</small>
                      <strong>₹{barberCompletedRevenue}</strong>
                      <span>From {barberCompletedCount} completed services</span>
                    </div>
                    <div className="earnings-stat-card">
                      <small>Completed Haircuts</small>
                      <strong>{barberCompletedCount}</strong>
                      <span>Finished and collected</span>
                    </div>
                    <div className="earnings-stat-card">
                      <small>Projected Upcoming</small>
                      <strong>₹{barberProjectedRevenue}</strong>
                      <span>From {barberConfirmedCount} confirmed bookings</span>
                    </div>
                  </div>

                  {/* Itemized Ledger of Completed Services */}
                  <div className="itemized-ledger-wrap" style={{ marginTop: "24px" }}>
                    <h4 style={{ marginBottom: "14px", fontSize: "16px" }}>Itemized Completed Services</h4>
                    {barberCompletedCount > 0 ? (
                      <div className="desktop-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Client</th>
                              <th>Service Completed</th>
                              <th>Completion Time</th>
                              <th>Amount Collected</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {barberAppointments
                              .filter((a) => a.status === "COMPLETED")
                              .map((entry) => (
                                <tr key={entry.id}>
                                  <td><strong>{entry.customerName || entry.customer}</strong></td>
                                  <td>{entry.service}</td>
                                  <td>
                                    {entry.completedAt
                                      ? new Date(entry.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                      : entry.appointmentTime || "Earlier today"}
                                  </td>
                                  <td><strong className="gold">₹{entry.price}</strong></td>
                                  <td>
                                    <span className="status-pill confirmed">Verified Completed</span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="queue-empty-box">
                        <Coins size={32} style={{ color: "var(--gold)", margin: "0 auto 8px" }} />
                        <p>No completed services recorded yet today. Complete a cut in chair to add earnings!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* My Availability Tab */}
              {activeTab === "timings" && (
                <div className="info-panel full-width">
                  <div className="panel-title-bar">
                    <h3>Stylist Station Availability & Shift</h3>
                    <span className="eyebrow">{currentBarber.chair}</span>
                  </div>

                  <div className="barber-availability-card">
                    <p style={{ margin: "0 0 16px", color: "#64748b" }}>
                      Set your real-time shift status so customers booking online know when you are available.
                    </p>

                    <div className="shift-selection-grid">
                      <label className={`shift-option-card ${currentBarber.status === "active" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="shiftStatus"
                          value="active"
                          checked={currentBarber.status === "active"}
                          onChange={() => handleBarberStatusChange(currentBarber.id, "active")}
                        />
                        <div className="shift-card-content">
                          <strong className="shift-title">🟢 On Duty & Active</strong>
                          <small>Chair ready to accept online bookings and walk-ins.</small>
                        </div>
                      </label>

                      <label className={`shift-option-card ${currentBarber.status === "break" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="shiftStatus"
                          value="break"
                          checked={currentBarber.status === "break"}
                          onChange={() => handleBarberStatusChange(currentBarber.id, "break")}
                        />
                        <div className="shift-card-content">
                          <strong className="shift-title">☕ Quick Break</strong>
                          <small>Temporarily paused. Customers cannot book immediate slots.</small>
                        </div>
                      </label>

                      <label className={`shift-option-card ${currentBarber.status === "offline" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="shiftStatus"
                          value="offline"
                          checked={currentBarber.status === "offline"}
                          onChange={() => handleBarberStatusChange(currentBarber.id, "offline")}
                        />
                        <div className="shift-card-content">
                          <strong className="shift-title">🔴 Off Duty</strong>
                          <small>Station closed for the rest of today.</small>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Quick Walk-In Modal */}
      {showWalkIn && (
        <div className="walkin-overlay" onClick={() => setShowWalkIn(false)}>
          <div className="walkin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Scissors size={18} style={{ color: "var(--gold)" }} /> Add Walk-in Client
              </h3>
              <button
                type="button"
                onClick={() => setShowWalkIn(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                Assign to Stylist / Chair
                <select
                  value={walkInTargetBarber}
                  onChange={(e) => setWalkInTargetBarber(Number(e.target.value))}
                  style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.chair}) — {b.status === "active" ? "🟢 On Duty" : "○ Busy/Break"}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                Client Name
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={walkInForm.customer}
                  onChange={(e) => setWalkInForm({ ...walkInForm, customer: e.target.value })}
                  autoFocus
                  style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                Haircut / Grooming Service
                <select
                  value={walkInForm.service}
                  onChange={(e) => {
                    const val = e.target.value;
                    let p = 680;
                    if (val.includes("Fade")) p = 680;
                    else if (val.includes("Royal")) p = 560;
                    else if (val.includes("Beard")) p = 420;
                    else if (val.includes("Spa")) p = 940;
                    setWalkInForm({ ...walkInForm, service: val, price: p });
                  }}
                  style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)", background: "#fff" }}
                >
                  <option value="Signature Skin Fade">Signature Skin Fade (₹680)</option>
                  <option value="Classic Beard Trim & Styling">Classic Beard Trim & Styling (₹420)</option>
                  <option value="Royal Hot Towel Shave">Royal Hot Towel Shave (₹560)</option>
                  <option value="Hair Cut + Head Wash">Hair Cut + Head Wash (₹550)</option>
                  <option value="Complete Grooming & Hair Spa">Complete Grooming & Hair Spa (₹940)</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600" }}>
                Price (₹)
                <input
                  type="number"
                  required
                  value={walkInForm.price}
                  onChange={(e) => setWalkInForm({ ...walkInForm, price: e.target.value })}
                  style={{ minHeight: "42px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                />
              </label>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="outline" onClick={() => setShowWalkIn(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="primary" style={{ flex: 1 }}>
                  💈 Add to Chair / Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administrator Re-Assign Appointment Modal (Req #2) */}
      {reassignModal && (
        <div className="walkin-overlay" onClick={() => setReassignModal(null)}>
          <div className="walkin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <ArrowLeftRight size={18} style={{ color: "var(--gold)" }} /> Reassign Appointment
              </h3>
              <button
                type="button"
                onClick={() => setReassignModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
              <strong style={{ display: "block", fontSize: "14px" }}>
                {reassignModal.appt.customerName || reassignModal.appt.customer}
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {reassignModal.appt.service} · ⏰ {reassignModal.appt.appointmentTime || reassignModal.appt.time} (₹{reassignModal.appt.price})
              </span>
            </div>

            <form onSubmit={handleReassignSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "600" }}>
                Transfer to Stylist:
                <select
                  value={reassignModal.newBarberId}
                  onChange={(e) => setReassignModal({ ...reassignModal, newBarberId: Number(e.target.value) })}
                  style={{ minHeight: "44px", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--line)" }}
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.chair}) — {b.status === "active" ? "🟢 On Duty" : "○ Break/Offline"}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="outline" onClick={() => setReassignModal(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="primary" style={{ flex: 1 }}>
                  🔄 Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <button
        type="button"
        className="barber-mobile-fab"
        onClick={() => {
          setWalkInTargetBarber(currentBarber?.id || 1);
          setShowWalkIn(true);
        }}
        aria-label="Add Walk-in Cut"
      >
        <Scissors size={18} />
        <span>+ Walk-in</span>
      </button>
    </main>
  );
}
