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

  const activeBarberId =
    selectedBarber === "any"
      ? barbers[0]?.id ?? ""
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

      await request("/appointments", {
        method: "POST",

        body: JSON.stringify({
          customerId: user.id,
          salonId: Number(id),
          serviceId: Number(serviceId),
          barberId: Number(
            selectedBarber === "any"
              ? barbers[0]?.id ?? 0
              : selectedBarber,
          ),
          appointmentDate: date,
          appointmentTime: time,
          notes: notes.trim(),
        }),
      });

      setMessage("Your appointment is confirmed!");
    } catch (err) {
      console.error("Booking failed:", err);

      setError(
        err?.message ||
          "Unable to book this appointment. Please try again.",
      );

      setTime("");
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

  function getSlotValue(slot) {
    if (typeof slot === "string") {
      return slot;
    }

    return slot?.time || slot?.startTime || "";
  }

  const timeButtons = React.useMemo(() => {
    const startMinutes = 9 * 60;
    const endMinutes = 21 * 60;
    const slots = [];

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      const value = `${hour}:${minute}`;
      const available = availableSlots.some(
        (slot) => getSlotValue(slot) === value,
      );

      slots.push({ value, available });
    }

    return slots;
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
            <CheckCircle2 size={36} />

            <h2>You're booked!</h2>

            <p>{message}</p>

            <p>
              {salon.name}
              {" · "}
              {selectedBarber === "any"
                ? "Any barber"
                : selectedBarberDetails?.name}
              {" · "}
              {date}
              {" at "}
              {time}
            </p>

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
                      <div className="barber-name-block">
                        <span className="barber-name">
                          Any barber
                        </span>
                        <small>Best available</small>
                      </div>

                      <div className="barber-meta-inline">
                        {bestBarberRating !== null && (
                          <span className="barber-rating">
                            <Star
                              size={11}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            {Number(bestBarberRating).toFixed(1)}
                          </span>
                        )}

                        <span className="barber-tag">
                          Best match
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
                          <div className="barber-name-block">
                            <span className="barber-name">
                              {barber.name}
                            </span>
                            <small>
                              {barber.specialization ||
                                "Stylist"}
                            </small>
                          </div>

                          <div className="barber-meta-inline">
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
                DATE + TIME
            ============================================= */}

            <div className="form-grid">
              {/* DATE */}

              <label>
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

              {/* TIME */}

              <label>
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
                              available ? "available" : "unavailable"
                            } ${isSelected ? "selected" : ""}`}
                            disabled={!available}
                            onClick={() => {
                              if (available) setTime(value);
                            }}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </label>
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