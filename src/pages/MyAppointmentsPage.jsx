import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock,
  Phone,
  Scissors,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { request } from "../api";
import {
  cancelApptNotification,
  registerServiceWorker,
  requestNotificationPermission,
  syncAllNotifications,
} from "../utils/appointmentNotifications";

/** Build a JS timestamp from a date string + time string (e.g. "2026-11-10", "14:30") */
function buildTimestamp(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    const timePart = timeStr ? timeStr.replace(/\s?(AM|PM)/i, "") : "00:00";
    const dt = new Date(`${dateStr}T${timePart.padStart(5, "0")}:00`);
    return Number.isNaN(dt.getTime()) ? null : dt.getTime();
  } catch {
    return null;
  }
}

/** Returns timestamps for yesterday / today / tomorrow helpers used in mock data */
function daysFromNow(n, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

const INITIAL_DEMO_APPOINTMENTS = [
  {
    id: 101,
    name: "Dr. Patricia Bath",
    role: "Voice Call",
    status: "COMPLETED",
    dateTime: "Yesterday | 02:30 PM",
    apptTimestamp: daysFromNow(-1, 14, 30),
    phone: "+91 98765 43210",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    salonId: 1,
    salonName: "The Best Cheap Salon",
    price: 1200,
  },
  {
    id: 102,
    name: "Dr. Ruth Westheimer",
    role: "Voice Call",
    status: "COMPLETED",
    dateTime: "Jan 02, 2026 | 02:30 PM",
    apptTimestamp: new Date("2026-01-02T14:30:00").getTime(),
    phone: "+91 98765 43211",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    salonId: 2,
    salonName: "Hair care Studio",
    price: 3500,
  },
  {
    id: 103,
    name: "Elena Rostova",
    role: "Signature Styling & Cut",
    status: "UPCOMING",
    dateTime: "Tomorrow | 11:00 AM",
    apptTimestamp: daysFromNow(1, 11, 0),
    phone: "+91 98765 43212",
    image:
      "https://images.unsplash.com/photo-1594824813583-128a11306346?auto=format&fit=crop&w=400&q=80",
    salonId: 3,
    salonName: "The Beauty Lounge",
    price: 2200,
  },
  {
    id: 104,
    name: "Sarah Jenkins",
    role: "Facial & Rejuvenation",
    status: "UPCOMING",
    dateTime: "Nov 15, 2026 | 03:30 PM",
    apptTimestamp: new Date("2026-11-15T15:30:00").getTime(),
    phone: "+91 98765 43210",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    salonId: 1,
    salonName: "The Best Cheap Salon",
    price: 1800,
  },
  {
    id: 105,
    name: "Marcus Vance",
    role: "Beard Trim & Grooming",
    status: "CANCELLED",
    dateTime: "Oct 28, 2026 | 04:00 PM",
    apptTimestamp: new Date("2026-10-28T16:00:00").getTime(),
    phone: "+91 98765 43213",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    salonId: 2,
    salonName: "Hair care Studio",
    price: 900,
  },
];

function formatAppointmentDateTime(dateStr, timeStr) {
  if (!dateStr) return "Upcoming | 10:00 AM";
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appDate = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(appDate.getTime())) return `${dateStr} | ${timeStr || ""}`;

    const diffDays = Math.round((appDate - today) / (1000 * 60 * 60 * 24));
    let datePart = "";
    if (diffDays === 0) datePart = "Today";
    else if (diffDays === 1) datePart = "Tomorrow";
    else if (diffDays === -1) datePart = "Yesterday";
    else {
      datePart = appDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
    return `${datePart} | ${timeStr || "12:00 PM"}`;
  } catch {
    return `${dateStr} | ${timeStr || ""}`;
  }
}

export default function MyAppointmentsPage() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "null");
    } catch {
      return null;
    }
  });

  // Initial tab set to "completed" to match uploaded screenshot
  const [activeTab, setActiveTab] = useState("completed");

  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem("gg_appointments_list");
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_DEMO_APPOINTMENTS;
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Dialog state
  const [dialog, setDialog] = useState(null); // { type: 'review'|'cancel'|'reschedule', appointment }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("11:00");

  // ── Notification timer registry (id → timeoutId) ──
  const notifTimers = useRef(new Map());

  // ── On mount: register SW + request permission ──
  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();

    // Cleanup all timers on unmount
    return () => {
      notifTimers.current.forEach((tid) => clearTimeout(tid));
      notifTimers.current.clear();
    };
  }, []);

  // ── Sync notifications whenever appointments list changes ──
  useEffect(() => {
    if (Notification.permission === "granted") {
      syncAllNotifications(appointments, notifTimers.current);
    }
  }, [appointments]);

  useEffect(() => {
    if (user) {
      request("/appointments/mine")
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((a) => {
              const statusRaw = String(a.status || "").toUpperCase();
              const status =
                statusRaw === "CONFIRMED" || statusRaw === "BOOKED"
                  ? "UPCOMING"
                  : statusRaw;
              return {
                id: a.id,
                name:
                  a.barber?.name ||
                  a.stylist?.name ||
                  a.salon?.name ||
                  "Professional Stylist",
                role: a.serviceItem?.name || a.service || "Salon Appointment",
                status,
                dateTime: formatAppointmentDateTime(
                  a.appointmentDate,
                  a.appointmentTime,
                ),
                apptTimestamp: buildTimestamp(a.appointmentDate, a.appointmentTime),
                phone: a.salon?.phone || "+91 98765 43210",
                image:
                  a.barber?.image ||
                  a.stylist?.image ||
                  a.salon?.image ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
                salonId: a.salonId || a.salon?.id || 1,
                salonName: a.salon?.name || "Quick Groom",
                price: a.serviceItem?.price || a.price || 1200,
                raw: a,
              };
            });
            setAppointments(mapped);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  function saveAppointments(updated) {
    setAppointments(updated);
    try {
      localStorage.setItem("gg_appointments_list", JSON.stringify(updated));
    } catch {}
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  function handleCall(phone) {
    if (phone) {
      window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
    } else {
      window.location.href = "tel:+919876543210";
    }
  }

  function openReviewDialog(appointment) {
    setDialog({ type: "review", appointment });
    setReviewRating(5);
    setReviewComment("");
  }

  function openCancelDialog(appointment) {
    setDialog({ type: "cancel", appointment });
  }

  function openRescheduleDialog(appointment) {
    setDialog({ type: "reschedule", appointment });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(tomorrow.toISOString().split("T")[0]);
    setRescheduleTime("11:00");
  }

  function closeDialog() {
    setDialog(null);
  }

  function submitReview() {
    if (!dialog?.appointment) return;
    const { appointment } = dialog;
    closeDialog();
    showToast(
      `Thank you! Review of ${reviewRating} stars submitted for ${appointment.name}.`,
    );

    // Call API if real id
    if (appointment.raw?.id) {
      request(`/appointments/${appointment.raw.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "COMPLETED",
          rating: reviewRating,
          review: reviewComment,
        }),
      }).catch(() => {});
    }
  }

  function confirmCancel() {
    if (!dialog?.appointment) return;
    const { appointment } = dialog;
    const updated = appointments.map((item) =>
      item.id === appointment.id ? { ...item, status: "CANCELLED" } : item,
    );
    saveAppointments(updated);
    closeDialog();
    showToast("Appointment has been canceled.");

    if (appointment.raw?.id) {
      request(`/appointments/${appointment.raw.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "CANCELLED" }),
      }).catch(() => {});
    }
  }

  function confirmReschedule() {
    if (!dialog?.appointment) return;
    const { appointment } = dialog;
    const formatted = formatAppointmentDateTime(rescheduleDate, rescheduleTime);
    const newTimestamp = buildTimestamp(rescheduleDate, rescheduleTime);
    const updated = appointments.map((item) =>
      item.id === appointment.id
        ? { ...item, status: "UPCOMING", dateTime: formatted, apptTimestamp: newTimestamp }
        : item,
    );
    saveAppointments(updated);
    closeDialog();
    showToast(`Appointment rescheduled to ${formatted}.`);

    if (appointment.raw?.id) {
      request(`/appointments/${appointment.raw.id}`, {
        method: "PUT",
        body: JSON.stringify({
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          status: "CONFIRMED",
        }),
      }).catch(() => {});
    }
  }

  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: <CalendarDays size={16} /> },
    { id: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
    { id: "canceled", label: "Canceled", icon: <X size={16} /> },
  ];

  const now = Date.now();

  const visibleList = appointments.filter((item) => {
    const s = String(item.status || "").toUpperCase();
    const isCancelled = s === "CANCELLED" || s === "CANCELED";

    // Cancelled appointments only appear in the canceled tab
    if (isCancelled) return activeTab === "canceled";

    // For upcoming and completed, classify purely by appointment date/time vs now
    const ts = item.apptTimestamp;

    if (activeTab === "canceled") return false; // non-cancelled never in canceled tab
    if (activeTab === "upcoming")  return ts != null ? ts >= now : false;
    if (activeTab === "completed") return ts != null ? ts < now : true; // no timestamp → treat as past
    return false;
  });

  return (
    <main className="my-appointment-screen page-shell">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="appt-toast-banner">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── DESKTOP HEADER (≥ 769px) ── */}
      <header className="appt-desktop-header">
        <div className="appt-desktop-header-left">
          <h1 className="appt-desktop-title"><span className="appt-title-my">My</span> Appointment</h1>
          <p className="appt-desktop-subtitle">Manage your upcoming and past appointments</p>
        </div>
        <div className="appt-desktop-header-right">
          <button
            type="button"
            className="appt-user-pill"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img
              src={
                user?.avatar ||
                user?.image ||
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80"
              }
              alt={user?.name || "User"}
              className="appt-user-pill-avatar"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=80&q=80";
              }}
            />
            <span className="appt-user-pill-name">
              Hi, {user?.name?.split(" ")[0] || "Guest"}
            </span>
            <ChevronDown size={16} />
          </button>
          {showNotifications && (
            <div className="notif-popover">
              <div className="notif-popover-head">
                <strong>Notifications</strong>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="notif-close-btn"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="notif-item">
                <Calendar size={14} className="notif-icon" />
                <div>
                  <p>Appointment with Dr. Patricia Bath was completed.</p>
                  <small>Yesterday at 02:30 PM</small>
                </div>
              </div>
              <div className="notif-item">
                <Clock size={14} className="notif-icon" />
                <div>
                  <p>Upcoming styling appointment tomorrow at 11:00 AM.</p>
                  <small>1 hour ago</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── MOBILE HEADER (≤ 768px) ── */}
      <header className="my-appointment-header">
        <button
          type="button"
          className="appt-header-icon-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>

        <h1><span className="appt-title-my">My</span> Appointment</h1>

        <button
          type="button"
          className="appt-header-icon-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notif-badge-dot" />
        </button>

        {showNotifications && (
          <div className="notif-popover">
            <div className="notif-popover-head">
              <strong>Notifications</strong>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="notif-close-btn"
              >
                <X size={14} />
              </button>
            </div>
            <div className="notif-item">
              <Calendar size={14} className="notif-icon" />
              <div>
                <p>Appointment with Dr. Patricia Bath was completed.</p>
                <small>Yesterday at 02:30 PM</small>
              </div>
            </div>
            <div className="notif-item">
              <Clock size={14} className="notif-icon" />
              <div>
                <p>Upcoming styling appointment tomorrow at 11:00 AM.</p>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tabs Selector */}
      <nav className="appt-segmented-tabs" aria-label="Appointment Status">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`appt-tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="appt-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Appointment Cards List */}
      <section className="appt-card-list">
        {visibleList.length === 0 ? (
          <div className="empty-state soft-empty">
            <h2>No {activeTab} appointments</h2>
            <p className="muted">Your appointments will appear here.</p>
            <Link className="primary small" to="/">
              Book an appointment
            </Link>
          </div>
        ) : (
          visibleList.map((appt) => {
            const isCompleted = String(appt.status).toUpperCase() === "COMPLETED";
            const isCanceled =
              String(appt.status).toUpperCase() === "CANCELLED" ||
              String(appt.status).toUpperCase() === "CANCELED";
            const statusLabel = isCompleted ? "Completed" : isCanceled ? "Canceled" : "Upcoming";
            const statusClass = isCompleted ? "completed" : isCanceled ? "canceled" : "upcoming";

            return (
              <article className="appointment-ref-card" key={appt.id}>

                {/* ── DESKTOP layout: avatar | info | phone | actions ── */}
                <div className="appt-card-desktop-row">
                  <img
                    src={appt.image}
                    alt={appt.name}
                    className="appt-avatar-img"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80";
                    }}
                  />

                  {/* Info block */}
                  <div className="appt-card-info">
                    <div className="appt-title-badge-row">
                      <h3 className="appt-name-text">{appt.name}</h3>
                      <span className={`appt-status-tag ${statusClass}`}>{statusLabel}</span>
                    </div>
                    <p className="appt-service-text">
                      <Scissors size={14} className="appt-meta-icon" />
                      {appt.role}
                    </p>
                    <p className="appt-datetime-text">
                      <CalendarDays size={14} className="appt-meta-icon" />
                      {appt.dateTime}
                    </p>
                  </div>

                  {/* Divider line (desktop only) */}
                  <div className="appt-card-divider" />

                  {/* Phone button */}
                  <button
                    type="button"
                    className="appt-call-action-btn"
                    onClick={() => handleCall(appt.phone)}
                    title={`Call ${appt.name}`}
                    aria-label={`Call ${appt.name}`}
                  >
                    <Phone size={18} />
                  </button>

                  {/* Desktop stacked action buttons */}
                  <div className="appt-card-desktop-actions">
                    {isCompleted ? (
                      <>
                        <button
                          type="button"
                          className="appt-btn appt-btn-primary"
                          onClick={() => openReviewDialog(appt)}
                        >
                          <Star size={15} />
                          Leave a review
                        </button>
                        <Link
                          to={`/book/${appt.salonId || 1}`}
                          className="appt-btn appt-btn-outline"
                        >
                          Book again
                        </Link>
                      </>
                    ) : isCanceled ? (
                      <>
                        <Link
                          to={`/book/${appt.salonId || 1}`}
                          className="appt-btn appt-btn-primary"
                        >
                          <CalendarDays size={15} />
                          Book again
                        </Link>
                        <Link
                          to={`/salons/${appt.salonId || 1}`}
                          className="appt-btn appt-btn-outline"
                        >
                          View salon
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="appt-btn appt-btn-primary"
                          onClick={() => openRescheduleDialog(appt)}
                        >
                          <CalendarDays size={15} />
                          Reschedule
                        </button>
                        <button
                          type="button"
                          className="appt-btn appt-btn-outline"
                          onClick={() => openCancelDialog(appt)}
                        >
                          <X size={15} />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ── MOBILE TOP: avatar | info | phone ── */}
                <div className="appt-card-top">
                  <img
                    src={appt.image}
                    alt={appt.name}
                    className="appt-avatar-img"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="appt-card-info">
                    <div className="appt-title-badge-row">
                      <h3 className="appt-name-text">{appt.name}</h3>
                      <span className={`appt-status-tag ${statusClass}`}>{statusLabel}</span>
                    </div>
                    <p className="appt-service-text">{appt.role}</p>
                    <p className="appt-datetime-text">{appt.dateTime}</p>
                  </div>
                  <button
                    type="button"
                    className="appt-call-action-btn"
                    onClick={() => handleCall(appt.phone)}
                    title={`Call ${appt.name}`}
                    aria-label={`Call ${appt.name}`}
                  >
                    <Phone size={18} />
                  </button>
                </div>

                {/* ── MOBILE bottom action buttons ── */}
                <div className="appt-card-bottom-actions">
                  {isCompleted ? (
                    <>
                      <Link
                        to={`/book/${appt.salonId || 1}`}
                        className="appt-btn appt-btn-outline"
                      >
                        Booked again
                      </Link>
                      <button
                        type="button"
                        className="appt-btn appt-btn-primary"
                        onClick={() => openReviewDialog(appt)}
                      >
                        Leave a review
                      </button>
                    </>
                  ) : isCanceled ? (
                    <>
                      <Link
                        to={`/salons/${appt.salonId || 1}`}
                        className="appt-btn appt-btn-outline"
                      >
                        View salon
                      </Link>
                      <Link
                        to={`/book/${appt.salonId || 1}`}
                        className="appt-btn appt-btn-primary"
                      >
                        Book again
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="appt-btn appt-btn-outline"
                        onClick={() => openCancelDialog(appt)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="appt-btn appt-btn-primary"
                        onClick={() => openRescheduleDialog(appt)}
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Review Dialog */}
      {dialog?.type === "review" && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div
            className="dialog appt-ref-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header-row">
              <h3>Leave a review</h3>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={closeDialog}
              >
                <X size={18} />
              </button>
            </div>
            <p className="dialog-prompt-text">
              How was your experience with{" "}
              <strong>{dialog.appointment?.name}</strong>?
            </p>

            <div className="rating-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-rating-btn ${
                    star <= reviewRating ? "active" : ""
                  }`}
                  onClick={() => setReviewRating(star)}
                >
                  <Star
                    size={28}
                    fill={star <= reviewRating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>

            <textarea
              className="review-modal-textarea"
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your feedback on service, timing, and styling..."
            />

            <div className="dialog-dual-actions">
              <button
                type="button"
                className="appt-btn appt-btn-outline"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="appt-btn appt-btn-primary"
                onClick={submitReview}
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {dialog?.type === "cancel" && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div
            className="dialog appt-ref-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header-row">
              <h3>Cancel appointment</h3>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={closeDialog}
              >
                <X size={18} />
              </button>
            </div>
            <p className="dialog-prompt-text">
              Are you sure you want to cancel your appointment with{" "}
              <strong>{dialog.appointment?.name}</strong> on{" "}
              <strong>{dialog.appointment?.dateTime}</strong>?
            </p>

            <div className="dialog-dual-actions">
              <button
                type="button"
                className="appt-btn appt-btn-outline"
                onClick={closeDialog}
              >
                Keep appointment
              </button>
              <button
                type="button"
                className="appt-btn appt-btn-danger"
                onClick={confirmCancel}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Dialog */}
      {dialog?.type === "reschedule" && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div
            className="dialog appt-ref-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header-row">
              <h3>Reschedule appointment</h3>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={closeDialog}
              >
                <X size={18} />
              </button>
            </div>
            <p className="dialog-prompt-text">
              Select a new date & time for{" "}
              <strong>{dialog.appointment?.name}</strong>:
            </p>

            <div className="reschedule-form-fields">
              <label className="reschedule-field">
                <span>Date</span>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </label>
              <label className="reschedule-field">
                <span>Time slot</span>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </label>
            </div>

            <div className="dialog-dual-actions">
              <button
                type="button"
                className="appt-btn appt-btn-outline"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="appt-btn appt-btn-primary"
                onClick={confirmReschedule}
              >
                Confirm reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
