import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getGreeting } from "../utils/greeting";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Percent,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { defaultMockOffers, request } from "../api";
import { fallback } from "../data/mockData";
import SalonCard from "../components/SalonCard";

export default function HomePage() {
  const [salons, setSalons] = useState(fallback);
  const [q, setQ] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("gg_user") || "{}"));
      } catch {
        setUser({});
      }
    };
    window.addEventListener("gg-auth-changed", handleAuthChange);
    return () => window.removeEventListener("gg-auth-changed", handleAuthChange);
  }, []);

  const isBarber = (user?.role || "").toUpperCase() === "BARBER";

  if (isBarber) {
    return <Navigate to="/dashboard" replace />;
  }

  const greeting = getGreeting();

  useEffect(() => {
    request("/salons")
      .then(setSalons)
      .catch(() => {});
    if (window.location.hash) {
      window.setTimeout(
        () => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const filtered = salons.filter((s) =>
    (s.name + " " + s.area + " " + s.address).toLowerCase().includes(q.toLowerCase()),
  );

  const testimonials = [
    {
      id: 1,
      name: "Rohit Malhotra",
      rating: 5,
      date: "Verified Customer",
      comment:
        "The salon ambiance is pure warm luxury. Alex gave me the cleanest precision fade in Bangalore. Zero wait time and exceptional service!",
      service: "Haircut & Beard Sculpt",
    },
    {
      id: 2,
      name: "Ananya Iyer",
      rating: 5,
      date: "Verified Customer",
      comment:
        "Elena is extraordinary with custom balayage. My hair feels revitalized after the deep conditioning spa. Truly five-star experience!",
      service: "Hair Colour & Spa",
    },
    {
      id: 3,
      name: "Vikram Sengupta",
      rating: 5,
      date: "Verified Customer",
      comment:
        "Booking took 30 seconds, the chair was ready the second I walked in. The scalp massage with warm oils melted all my work fatigue away.",
      service: "Luxury Head Massage",
    },
  ];

  const popularServices = [
    {
      name: "Signature Precision Cut",
      category: "Hair",
      duration: "45 mins",
      price: "₹1,200",
      desc: "Tailored scissor cut, hair wash & blowout styling.",
      salonId: 1,
    },
    {
      name: "Glow Radiance Facial",
      category: "Skin",
      duration: "60 mins",
      price: "₹2,200",
      desc: "Deep cleansing exfoliation, antioxidant serum & gold mask.",
      salonId: 1,
    },
    {
      name: "Beard Trim & Sculpt",
      category: "Grooming",
      duration: "30 mins",
      price: "₹650",
      desc: "Hot towel prep, razor edge alignment & soothing beard oil.",
      salonId: 1,
    },
    {
      name: "Deep Conditioning Spa",
      category: "Spa",
      duration: "50 mins",
      price: "₹1,800",
      desc: "Keratin scalp nourish, steam infusion & relaxation head therapy.",
      salonId: 1,
    },
  ];

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero warm-luxury-hero">
        <div className="hero-copy">
          <div className="hero-header-banner">
            <div className="hero-greeting-pill">
              <Sparkles size={14} className="gold-sparkle" />
              <span>
                {greeting}, {user.name?.trim() || "there"}!
              </span>
            </div>

            <span className="hero-tagline eyebrow">
              <span className="eyebrow-line" />
              YOUR MOMENT OF BEAUTY
            </span>
          </div>

          <h1 className="hero-title">
            Look good.
            <br />
            <em className="hero-highlight">Feel even better.</em>
          </h1>

          <p className="hero-subtitle">
            Discover Bengaluru's best-loved salons and book your next little luxury in minutes.
          </p>

          <div className="searchbox warm-searchbox">
            <Search size={19} className="search-icon" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search salon, service or neighbourhood"
              aria-label="Search salons or services"
            />
            <button
              type="button"
              className="search-btn"
              onClick={() =>
                document.getElementById("salons")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Find a salon <ArrowRight size={16} />
            </button>
          </div>

          <div className="hero-trust">
            <span className="trust-pill">
              <Star size={14} fill="currentColor" className="star-gold" /> Loved by 2,500+ clients
            </span>
            <span className="trust-pill">
              <CheckCircle2 size={14} className="check-success" /> Instant online slot confirmation
            </span>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90"
              alt="Luxury Salon Interior"
              className="hero-main-photo"
            />
            <div className="image-note warm-image-note">
              <span className="note-icon">
                <Scissors size={18} />
              </span>
              <div>
                <b>Your time, your style.</b>
                <small>Beauty appointments made effortless.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS HIGHLIGHTS */}
      <section className="benefits warm-benefits">
        <div className="benefit-card">
          <span className="benefit-icon">
            <MapPin size={22} />
          </span>
          <div>
            <b>Salons near you</b>
            <small>Find your neighbourhood favourite</small>
          </div>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">
            <CalendarDays size={22} />
          </span>
          <div>
            <b>Book in a few clicks</b>
            <small>Choose a time that suits your day</small>
          </div>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">
            <Heart size={22} />
          </span>
          <div>
            <b>Stylists you'll love</b>
            <small>Handpicked masters with verified reviews</small>
          </div>
        </div>
      </section>

      {/* 3. SOFT PEACH PROMOTIONAL SECTION: OFFERS & PACKAGES */}
      <section className="promotional-offers-section" aria-label="Curated Offers & Packages">
        <div className="section-top">
          <div>
            <span className="eyebrow">CURATED SAVINGS</span>
            <h2>
              Offers & <em>Bundled Packages.</em>
            </h2>
            <p className="muted">Indulge in artisanal self-care with delightful bundled discounts.</p>
          </div>
          <span className="promo-badge-top">
            <Percent size={14} /> Limited Period Specials
          </span>
        </div>

        <div className="promo-packages-grid">
          {defaultMockOffers.map((off) => (
            <article className="promo-package-card" key={off.id}>
              <div className="package-ribbon">{off.badge}</div>
              <h3 className="package-title">{off.title}</h3>
              <p className="package-desc">{off.description}</p>

              <div className="package-meta">
                <span className="package-duration">
                  <Clock size={13} /> {off.durationMinutes} mins
                </span>
                {off.code && (
                  <span className="package-code">
                    <Tag size={12} /> {off.code}
                  </span>
                )}
              </div>

              <div className="package-footer">
                <div>
                  <span className="package-original">₹{off.originalPrice}</span>
                  <strong className="package-deal">₹{off.price}</strong>
                </div>
                <Link to="/book/1" className="primary small package-book-btn">
                  Book Offer <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. ATTRACTIVE SERVICE CATEGORY CARDS */}
      <section id="services" className="service-categories-section">
        <div className="section-top text-center">
          <div>
            <span className="eyebrow">A LITTLE SELF-CARE</span>
            <h2>
              Make time for <em>you.</em>
            </h2>
            <p className="muted">Browse curated categories crafted for your comfort and style.</p>
          </div>
        </div>

        <div className="service-category-cards-grid">
          {[
            {
              title: "Hair Cuts & Colour",
              sub: "Precision styling, balayage & gloss therapy",
              icon: Scissors,
              colorClass: "card-peach",
            },
            {
              title: "Skin & Facials",
              sub: "Glow restoration, exfoliation & gold masks",
              icon: Sparkles,
              colorClass: "card-ivory",
            },
            {
              title: "Nails & Care",
              sub: "Classic manicure & deluxe soothing pedicure",
              icon: Heart,
              colorClass: "card-peach",
            },
            {
              title: "Bespoke Grooming",
              sub: "Razor fades, beard sculpt & hot towel rituals",
              icon: CheckCircle2,
              colorClass: "card-ivory",
            },
            {
              title: "Head Spa & Therapy",
              sub: "Deep conditioning, warm oils & relaxing head spa",
              icon: ShieldCheck,
              colorClass: "card-peach",
            },
          ].map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                className={`service-cat-card ${cat.colorClass}`}
                key={cat.title}
                onClick={() =>
                  document.getElementById("salons")?.scrollIntoView({ behavior: "smooth" })
                }
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-bubble">
                  <IconComp size={22} />
                </div>
                <b>{cat.title}</b>
                <small>{cat.sub}</small>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED SALONS SECTION */}
      <section id="salons" className="section salons-showcase-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">THE EDIT</span>
            <h2>
              Salons worth <em>your time.</em>
            </h2>
            <p className="muted">Thoughtfully selected beauty spots across Bengaluru.</p>
          </div>
          <span className="result-count">{filtered.length} curated salons</span>
        </div>

        <div className="salon-grid">
          {filtered.map((s, i) => (
            <SalonCard salon={s} i={i} key={s.id} />
          ))}
        </div>

        {!filtered.length && (
          <div className="empty-search-box">
            <p>No salons match that search. Try Whitefield, Indiranagar or Koramangala.</p>
            <button type="button" className="outline small" onClick={() => setQ("")}>
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* 6. POPULAR SERVICES SHOWCASE */}
      <section className="popular-services-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">POPULAR TREATMENTS</span>
            <h2>
              Loved by <em>our guests.</em>
            </h2>
            <p className="muted">Book Bengaluru's most-requested hair and wellness treatments.</p>
          </div>
        </div>

        <div className="popular-services-grid">
          {popularServices.map((ps) => (
            <article className="popular-service-item" key={ps.name}>
              <div className="popular-service-body">
                <div className="service-tag-pill">{ps.category}</div>
                <h3>{ps.name}</h3>
                <p>{ps.desc}</p>
                <span className="service-duration-text">
                  <Clock size={13} /> {ps.duration}
                </span>
              </div>
              <div className="popular-service-action">
                <strong>{ps.price}</strong>
                <Link to={`/book/${ps.salonId}`} className="primary small popular-book-cta">
                  Book Slot
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-top text-center">
          <div>
            <span className="eyebrow">VERIFIED EXPERIENCES</span>
            <h2>
              What our clients <em>say.</em>
            </h2>
            <p className="muted">Real reviews from our community of beauty lovers.</p>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <article className="testimonial-card" key={t.id}>
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={15} fill="currentColor" className="star-gold" />
                ))}
              </div>
              <p className="testimonial-comment">"{t.comment}"</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div
                  className="testimonial-author-info"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "3px",
                    minWidth: 0,
                  }}
                >
                  <strong
                    className="testimonial-author-name"
                    style={{
                      display: "block",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "var(--color-text, #1f1d1a)",
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </strong>
                  <span
                    className="testimonial-author-detail muted"
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      color: "var(--color-muted, #817873)",
                      lineHeight: 1.35,
                    }}
                  >
                    {t.service} · {t.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. BEAUTY AROUND THE CORNER CTA */}
      <section id="location" className="location-cta warm-location-cta">
        <div>
          <span className="eyebrow">BEAUTY, AROUND THE CORNER</span>
          <h2>
            Your next favourite salon
            <br />
            might be <em>closer than you think.</em>
          </h2>
          <p>Explore top salons in Whitefield, Indiranagar, Koramangala and more.</p>
        </div>
        <a
          className="primary"
          href="#salons"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("salons")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explore salons <ArrowRight size={16} />
        </a>
      </section>
    </div>
  );
}
