import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";
import { request } from "../api";
import { fallback, photos } from "../data/mockData";

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  /* =========================
     SALON
  ========================= */

  const [salon, setSalon] = useState(
    fallback.find((s) => s.id === Number(id)) || fallback[0],
  );

  /* =========================
     SERVICES
  ========================= */

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [serviceLoadError, setServiceLoadError] = useState("");

  /* =========================
     BARBERS
  ========================= */

  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [barberLoadError, setBarberLoadError] = useState("");

  /* =========================
     AVAILABLE SLOTS
  ========================= */

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotLoadError, setSlotLoadError] = useState("");

  /* =========================
     BOOKING FORM
  ========================= */

  const [date, setDate] = useState(
    new Date(
      Date.now() -
        new Date().getTimezoneOffset() * 60000 +
        86400000,
    )
      .toISOString()
      .slice(0, 10),
  );

  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  const [confirmedAppt, setConfirmedAppt] = useState(null);

  const activeBarberId =
    selectedBarber === "any"
      ? "any"
      : selectedBarber;

  /* =========================================================
     LOAD SALON + SERVICES + BARBERS
  ========================================================= */

  useEffect(() => {
    if (!id) return;

    setServiceLoadError("");
    setBarberLoadError("");

    /* ---------- Salon ---------- */

    request(`/salons/${id}`)
      .then((data) => {
        setSalon(data);
      })
      .catch((err) => {
        console.error("Failed to load salon:", err);
      });

    /* ---------- Services ---------- */

    request(`/salons/${id}/services`)
      .then((data) => {
        const serviceList = Array.isArray(data) ? data : [];

        setServices(serviceList);
        setServiceLoadError("");

        const requestedService = searchParams.get("service");

        if (
          requestedService &&
          serviceList.some(
            (service) =>
              String(service.id) === requestedService,
          )
        ) {
          setServiceId(requestedService);
        } else if (serviceList.length > 0) {
          setServiceId(String(serviceList[0].id));
        } else {
          setServiceId("");
        }
      })
      .catch((err) => {
        console.error("Failed to load services:", err);

        setServices([]);
        setServiceId("");

        setServiceLoadError(
          err?.message || "Unable to load salon services.",
        );
      });

    /* ---------- Barbers ---------- */

    request(`/salons/${id}/barbers`)
      .then((data) => {
        const barberList = Array.isArray(data) ? data : [];

        setBarbers(barberList);
        setBarberLoadError("");

        if (barberList.length > 0) {
          setSelectedBarber("any");
        } else {
          setSelectedBarber("");
        }
      })
      .catch((err) => {
        console.error("Failed to load barbers:", err);

        setBarbers([]);
        setSelectedBarber("");

        setBarberLoadError(
          err?.message || "Unable to load barbers.",
        );
      });
  }, [id, searchParams]);

  /* =========================================================
     LOAD BARBER AVAILABILITY
  ========================================================= */

  useEffect(() => {
    if (!activeBarberId || !serviceId || !date) {
      setAvailableSlots([]);
      setTime("");
      setSlotLoadError("");
      return;
    }

    let cancelled = false;

    setLoadingSlots(true);
    setSlotLoadError("");
    setAvailableSlots([]);
    setTime("");

    const query =
      `/barbers/${activeBarberId}/availability` +
      `?date=${encodeURIComponent(date)}` +
      `&serviceId=${encodeURIComponent(serviceId)}`;

    request(query)
      .then((data) => {
        if (cancelled) return;

        let slots = [];

        if (Array.isArray(data)) {
          slots = data;
        } else if (Array.isArray(data?.availableSlots)) {
          slots = data.availableSlots;
        } else if (Array.isArray(data?.slots)) {
          slots = data.slots;
        }

        setAvailableSlots(slots);

        if (slots.length > 0) {
          const firstSlot =
            typeof slots[0] === "string"
              ? slots[0]
              : slots[0]?.time;

          setTime(firstSlot || "");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.error(
          "Failed to load barber availability:",
          err,
        );

        setAvailableSlots([]);
        setTime("");

        setSlotLoadError(
          err?.message ||
            "Unable to load available time slots.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeBarberId, serviceId, date]);

  /* =========================================================
     BOOK APPOINTMENT
  ========================================================= */

  async function book(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("gg_user") || "null",
      );
    } catch {
      user = null;
    }

    const token = localStorage.getItem("gg_token");

    if (!user || !token) {
      nav("/login");
      return;
    }

    if (!serviceId) {
      setError("Please choose a service.");
      return;
    }

    if (!selectedBarber) {
      setError("Please choose a barber.");
      return;
    }

    if (!date) {
      setError("Please choose an appointment date.");
      return;
    }

    if (!time) {
      setError("Please choose an available time.");
      return;
    }

    try {
      setBooking(true);

      const res = await request("/appointments", {
        method: "POST",
        body: JSON.stringify({
          customerId: user.id,
          customerName: user.name || user.fullName || "Valued Client",
          salonId: Number(id),
          serviceId: Number(serviceId),
          barberId: selectedBarber === "any" ? "any" : Number(selectedBarber),
          appointmentDate: date,
          appointmentTime: time,
          notes: notes.trim(),
        }),
      });

      setConfirmedAppt(res);
      setMessage("Your appointment is confirmed!");

      const svcObj = services.find((s) => s.id === Number(serviceId));
      const assignedBarberName = res?.assignedBarber?.name || res?.barber?.name || "Alex Rivera";
      const assignedChair = res?.assignedBarber?.chair || res?.barber?.chair || "Chair #1";

      const newApptEvent = {
        id: Date.now(),
        customer: user.name || "Valued Client",
        service: svcObj?.name || "Haircut & Beard Grooming",
        barberName: assignedBarberName,
        chair: assignedChair,
        time: time,
        price: svcObj?.price || 650,
        date: date,
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem("gg_incoming_booking", JSON.stringify(newApptEvent));
        window.dispatchEvent(new CustomEvent("gg_appointment_received", { detail: newApptEvent }));
      } catch (e) {}

      // Refresh slot availability immediately to prevent any double booking
      setAvailableSlots((prev) => prev.filter((s) => {
        const val = typeof s === "string" ? s : s?.time;
        return val !== time;
      }));
    } catch (err) {
      console.warn("Booking request error:", err);
      setError(err?.message || "Unable to book this appointment. Please select another slot.");
      // Trigger slot refresh on error so user sees updated availability
      request(`/barbers/${activeBarberId}/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`)
        .then((data) => {
          let slots = Array.isArray(data) ? data : data?.availableSlots || data?.slots || [];
          setAvailableSlots(slots);
        })
        .catch(() => {});
    } finally {
      setBooking(false);
    }
  }

  /* =========================================================
     SELECTED VALUES
  ========================================================= */

  const selectedService = services.find(
    (service) =>
      String(service.id) === String(serviceId),
  );

  const selectedBarberDetails = barbers.find(
    (barber) =>
      String(barber.id) === String(selectedBarber),
  );

  const bestBarberRating = barbers.reduce((best, barber) => {
    const rating =
      barber.rating ??
      barber.averageRating ??
      barber.starRating ??
      null;

    if (rating === null) {
      return best;
    }

    return best === null || Number(rating) > Number(best)
      ? Number(rating)
      : best;
  }, null);

  const standardSlotList = [
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

  function normTime(t) {
    return (t || "").toLowerCase().replace(/\s+/g, "");
  }

  function getSlotValue(slot) {
    if (typeof slot === "string") {
      return slot;
    }
    return slot?.time || slot?.startTime || "";
  }

  const timeButtons = React.useMemo(() => {
    return standardSlotList.map((slotStr) => {
      const isAvailable = availableSlots.some((slot) => {
        const val = getSlotValue(slot);
        return normTime(val) === normTime(slotStr);
      });
      return { value: slotStr, available: isAvailable };
    });
  }, [availableSlots]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="booking-layout">
      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="booking-main">
        <Link
          className="back-link"
          to={`/salon/${id}`}
        >
          ← Back to salon
        </Link>

        <span className="eyebrow">
          YOUR APPOINTMENT
        </span>

        <h1>
          Make it <em>your moment.</em>
        </h1>

        <p className="muted">
          Choose your service, professional, date and
          available time.
        </p>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message ? (
          <div className="success">
            <CheckCircle2 size={40} style={{ color: "#22c55e", margin: "0 auto" }} />

            <h2>You're booked!</h2>

            <p style={{ color: "#475569", fontSize: "15px" }}>{message}</p>

            <div className="booking-confirmed-card" style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "18px 20px",
              border: "1px solid var(--line)",
              margin: "18px 0",
              textAlign: "left",
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>SALON</span>
                <strong style={{ fontSize: "13px", color: "var(--brown)" }}>{salon.name}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", display: "block" }}>ASSIGNED STYLIST</span>
                  <strong style={{ fontSize: "14px", color: "#25221d" }}>
                    {confirmedAppt?.assignedBarber?.name || confirmedAppt?.barber?.name || selectedBarberDetails?.name || "Alex Rivera"}
                  </strong>
                  <span style={{ fontSize: "11px", color: "#78716c", marginLeft: "6px" }}>
                    ({confirmedAppt?.assignedBarber?.chair || confirmedAppt?.barber?.chair || selectedBarberDetails?.chair || "Chair #1"})
                  </span>
                </div>
                {(confirmedAppt?.assignedVia === "ANY_BARBER" || selectedBarber === "any") && (
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    background: "#fef3c7",
                    color: "#b45309",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    border: "1px solid #fde68a"
                  }}>
                    ✨ Auto-Assigned Best Match
                  </span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>DATE & TIME</span>
                <strong style={{ fontSize: "13px", color: "var(--brown)" }}>
                  {date} at {time}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>RESERVATION STATUS</span>
                <span className="status-pill confirmed" style={{ fontSize: "11px", padding: "3px 10px" }}>
                  Slot Reserved & Double-Booking Protected
                </span>
              </div>
            </div>

            <Link
              className="primary"
              to="/my-appointments"
            >
              View my appointments
            </Link>
          </div>
        ) : (
          /* =================================================
             BOOKING FORM
          ================================================= */

          <form
            className="booking-form"
            onSubmit={book}
          >
            {/* =============================================
                SERVICE
            ============================================= */}

            {serviceLoadError && (
              <p className="error">
                Could not load services:{" "}
                {serviceLoadError}
              </p>
            )}

            {!services.length &&
              !serviceLoadError && (
                <p className="muted">
                  Loading services…
                </p>
              )}

            <label>
              1. Choose a service

              <select
                required
                disabled={!services.length}
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setTime("");
                }}
              >
                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                    {" — ₹"}
                    {Number(
                      service.price ??
                        service.priceRupees ??
                        0,
                    ).toLocaleString("en-IN")}
                    {" ("}
                    {service.durationMinutes}
                    {" min)"}
                  </option>
                ))}
              </select>
            </label>

            {/* =============================================
                BARBER
            ============================================= */}

            <div className="barber-section">
              <label>
                2. Choose your barber / stylist
              </label>

              <div className="barber-picker">
                <label
                  className={`barber-option ${
                    selectedBarber === "any"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="barber"
                    value="any"
                    checked={selectedBarber === "any"}
                    onChange={(e) => {
                      setSelectedBarber(e.target.value);
                      setTime("");
                    }}
                  />

                  <div className="barber-option-content">
                    <div className="barber-main-row">
                      <div className="barber-avatar-circle" style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #d49a5b, #9a652e)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        flexShrink: 0,
                        boxShadow: "0 2px 6px rgba(212, 154, 91, 0.3)"
                      }}>
                        ⚡
                      </div>

                      <div className="barber-name-block">
                        <span className="barber-name">
                          Any Barber (Automatic Assignment)
                        </span>
                        <small>Auto-assigns best available stylist for your slot</small>
                      </div>

                      <div className="barber-meta-inline">
                        <span className="barber-tag" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", fontWeight: "700" }}>
                          Recommended
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {barbers.map((barber) => {
                  const rating =
                    barber.rating ??
                    barber.averageRating ??
                    barber.starRating ??
                    null;

                  const experience =
                    barber.experienceYears ??
                    barber.experience ??
                    barber.yearsExperience ??
                    barber.experienceYear ??
                    null;

                  const chairLabel = barber.chair || `Chair #${barber.id}`;
                  const isAvailable = barber.status === "active" || barber.available !== false;

                  return (
                    <label
                      key={barber.id}
                      className={`barber-option ${
                        String(selectedBarber) ===
                        String(barber.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="barber"
                        value={barber.id}
                        checked={
                          String(selectedBarber) ===
                          String(barber.id)
                        }
                        onChange={(e) => {
                          setSelectedBarber(
                            e.target.value,
                          );
                          setTime("");
                        }}
                      />

                      <div className="barber-option-content">
                        <div className="barber-main-row">
                          {barber.image ? (
                            <img
                              src={barber.image}
                              alt={barber.name}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #e7ded5",
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "#25221d",
                                color: "#d49a5b",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700",
                                flexShrink: 0
                              }}
                            >
                              {barber.name.charAt(0)}
                            </div>
                          )}

                          <div className="barber-name-block">
                            <span className="barber-name">
                              {barber.name}
                              <em style={{ fontStyle: "normal", fontSize: "11px", color: "var(--gold)", marginLeft: "6px", fontWeight: "600" }}>
                                {chairLabel}
                              </em>
                            </span>
                            <small>
                              {barber.specialization ||
                                barber.role ||
                                "Stylist"}
                            </small>
                          </div>

                          <div className="barber-meta-inline">
                            <span style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              background: isAvailable ? "#dcfce7" : "#f1f5f9",
                              color: isAvailable ? "#15803d" : "#64748b"
                            }}>
                              {isAvailable ? "● On Duty" : "○ Break"}
                            </span>

                            {rating !== null && (
                              <span className="barber-rating">
                                <Star
                                  size={11}
                                  fill="currentColor"
                                  strokeWidth={1.5}
                                />
                                {Number(rating).toFixed(1)}
                              </span>
                            )}

                            {experience !== null && (
                              <span className="barber-experience">
                                {Number(experience)}+
                                {" "}yrs
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {barberLoadError && (
              <p className="error">
                Could not load barbers:{" "}
                {barberLoadError}
              </p>
            )}

            {!barbers.length &&
              !barberLoadError && (
                <p className="muted">
                  Loading professionals…
                </p>
              )}

            {/* =============================================
                DATE & TIME SECTIONS
            ============================================= */}

            <div className="booking-datetime-group">
              {/* DATE */}
              <div className="booking-field-block">
                <label className="booking-field-label">
                  3. Appointment date

                  <input
                    type="date"
                    min={new Date(
                      Date.now() -
                        new Date().getTimezoneOffset() *
                          60000,
                    )
                      .toISOString()
                      .slice(0, 10)}
                    required
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime("");
                    }}
                  />
                </label>
              </div>

              {/* TIME SLOTS */}
              <div className="booking-field-block time-slot-block">
                <label className="booking-field-label">
                  4. Available time

                  <div className="time-slot-wrapper">
                    {!activeBarberId ? (
                      <p className="muted small-placeholder">
                        Choose barber first
                      </p>
                    ) : loadingSlots ? (
                      <p className="muted small-placeholder">
                        Checking availability...
                      </p>
                    ) : (
                      <div className="time-slot-grid">
                        {timeButtons.map(({ value, available }) => {
                          const isSelected = time === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              className={`time-slot ${
                                available ? "available" : "unavailable booked"
                              } ${isSelected ? "selected" : ""}`}
                              disabled={!available}
                              onClick={() => {
                                if (available) setTime(value);
                              }}
                              title={
                                available
                                  ? `Select ${value}`
                                  : `Time slot ${value} is already booked`
                              }
                            >
                              <span className="slot-val-time">{value}</span>
                              {!available && (
                                <span className="slot-state-badge booked">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {loadingSlots && (
              <p className="muted">
                Checking {selectedBarber === "any"
                  ? "your selected professional"
                  : selectedBarberDetails?.name}
                's availability…
              </p>
            )}

            {slotLoadError && (
              <p className="error">
                {slotLoadError}
              </p>
            )}

            {activeBarberId &&
              !loadingSlots &&
              !slotLoadError &&
              availableSlots.length === 0 && (
                <p className="muted">
                  No available appointments for{" "}
                  {selectedBarber === "any"
                    ? "the selected professionals"
                    : selectedBarberDetails?.name}{" "}
                  on {date}. Please choose another date or professional.
                </p>
              )}

            {/* =============================================
                NOTES
            ============================================= */}

            <label>
              5. Anything we should know?

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Special requests (optional)"
                rows="3"
              />
            </label>

            {/* =============================================
                ERROR
            ============================================= */}

            {error && (
              <p className="error">{error}</p>
            )}

            {/* =============================================
                SUBMIT
            ============================================= */}

            <button
              className="primary full"
              type="submit"
              disabled={
                booking ||
                !services.length ||
                !selectedBarber ||
                !date ||
                !time
              }
            >
              {booking
                ? "Confirming..."
                : "Confirm appointment"}

              {!booking && (
                <ArrowRight size={16} />
              )}
            </button>

            <p className="tiny muted">
              Your selected slot is confirmed only
              after the booking succeeds.
            </p>
          </form>
        )}
      </div>

      {/* =====================================================
          BOOKING SUMMARY
      ===================================================== */}

      <aside className="booking-summary">
        <img
          src={`https://images.unsplash.com/${
            photos[
              (Number(id) - 1) % photos.length
            ]
          }?auto=format&fit=crop&w=700&q=80`}
          alt={salon.name}
        />

        <div className="summary-content">
          <span className="eyebrow">
            YOUR SALON
          </span>

          <h2>{salon.name}</h2>

          <p className="muted">
            <MapPin size={14} />
            {salon.area}
          </p>

          <hr />

          <span className="eyebrow">
            BOOKING SUMMARY
          </span>

          {/* SERVICE */}

          <p>
            {selectedService?.name ||
              "Select a service"}
          </p>

          {/* BARBER */}

          <div className="summary-line">
            <span>
              <UserRound size={14} /> Professional
            </span>

            <b>
              {selectedBarber === "any"
                ? "Any barber"
                : selectedBarberDetails?.name ||
                  "Not selected"}
            </b>
          </div>

          {/* DATE */}

          <div className="summary-line">
            <span>Date</span>
            <b>{date || "—"}</b>
          </div>

          {/* TIME */}

          <div className="summary-line">
            <span>Time</span>
            <b>{time || "—"}</b>
          </div>

          {/* DURATION */}

          <div className="summary-line">
            <span>Duration</span>

            <b>
              {selectedService?.durationMinutes ||
                "—"}{" "}
              min
            </b>
          </div>

          {/* TOTAL */}

          <div className="summary-line total">
            <span>Estimated total</span>

            <b>
              ₹
              {Number(
                selectedService?.price ??
                  selectedService?.priceRupees ??
                  0,
              ).toLocaleString("en-IN")}
            </b>
          </div>

          <p className="tiny muted">
            Your slot is confirmed only after the
            booking succeeds.
          </p>
        </div>
      </aside>
    </main>
  );
}