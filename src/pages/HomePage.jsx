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
        "The rich ambiance and attention to detail is remarkable. Alex gave me a flawless precision fade and beard sculpt. Pure modern luxury!",
      service: "Haircut & Beard Sculpt",
    },
    {
      id: 2,
      name: "Ananya Iyer",
      rating: 5,
      date: "Verified Customer",
      comment:
        "Elena's balayage technique is Parisian standard. My hair feels silken after the organic hair spa. A truly elevated salon marketplace experience.",
      service: "Hair Colour & Hair Spa",
    },
    {
      id: 3,
      name: "Vikram Sengupta",
      rating: 5,
      date: "Verified Customer",
      comment:
        "Instant slot confirmation, warm beverage upon arrival, and zero wait time. The restorative head therapy and de-tan facial were sublime.",
      service: "De-Tan & Head Massage",
    },
  ];

  // Specific service categories with distinct subtle backgrounds:
  // - Hair services: Soft champagne
  // - Beard grooming: Warm terracotta tint
  // - Facial and skincare: Dusty rose tint
  // - Massage: Soft lavender
  // - Hair spa: Sage tint
  // - Premium treatments: Champagne and cream
  const serviceCategories = [
    {
      title: "Hair Services",
      sub: "Cuts, creative styling, balayage & gloss",
      icon: Scissors,
      type: "champagne",
    },
    {
      title: "Beard Grooming",
      sub: "Precision razor lining & hot towel sculpt",
      icon: CheckCircle2,
      type: "terracotta",
    },
    {
      title: "Facial & Skincare",
      sub: "De-tan, purifying scrub & gold glow masks",
      icon: Sparkles,
      type: "rose",
    },
    {
      title: "Relaxing Massage",
      sub: "Therapeutic warm oil & tension release",
      icon: Heart,
      type: "lavender",
    },
    {
      title: "Hair Spa Rituals",
      sub: "Deep keratin scalp nourish & steam therapy",
      icon: ShieldCheck,
      type: "sage",
    },
    {
      title: "Premium Treatments",
      sub: "Executive bridal, mani-pedi duo & VIP suites",
      icon: Star,
      type: "cream",
    },
  ];

  const popularTreatments = [
    {
      name: "Signature Precision Haircut",
      category: "Hair Services",
      duration: "45 mins",
      price: "₹1,200",
      desc: "Tailored consultation, precision scissor cut, hair wash & blowout.",
      salonId: 1,
      chipType: "champagne",
    },
    {
      name: "Hair + Beard Cut Combo",
      category: "Beard Grooming",
      duration: "60 mins",
      price: "₹1,750",
      desc: "Complete restyle: Scissor cut + beard sculpt + hot towel steam.",
      salonId: 1,
      chipType: "terracotta",
    },
    {
      name: "De-Tan & Purifying Scrub",
      category: "Facial & Skincare",
      duration: "45 mins",
      price: "₹1,400",
      desc: "Sun damage reversal, gentle fruit-acid scrub & hydration pack.",
      salonId: 1,
      chipType: "rose",
    },
    {
      name: "Restorative Hair Spa",
      category: "Hair Spa Rituals",
      duration: "50 mins",
      price: "₹1,800",
      desc: "Scalp revitalization, warm keratin infusion & neck pressure relief.",
      salonId: 1,
      chipType: "sage",
    },
  ];

  return (
    <div className="homepage-wrapper modern-luxury-homepage">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="hero modern-editorial-hero">
        <div className="hero-copy">
          <div className="hero-greeting-pill">
            <Sparkles size={14} className="gold-accent-icon" />
            <span>
              {greeting}, {user.name?.trim() || "there"}!
            </span>
          </div>

          <span className="eyebrow">MODERN RICH LUXURY</span>

          {/* Heading required by prompt */}
          <h1 className="hero-title editorial-heading">
            Your Beauty.
            <br />
            <em className="hero-highlight">Your Moment.</em>
            <br />
            Your Glow.
          </h1>

          {/* Description required by prompt */}
          <p className="hero-subtitle">
            Discover exceptional salons, talented professionals and beauty experiences crafted around you.
          </p>

          <div className="searchbox luxury-searchbox">
            <Search size={19} className="search-icon-gold" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search salon, service or neighbourhood"
              aria-label="Search salons or services"
            />
            <button
              type="button"
              className="champagne-cta search-btn"
              onClick={() =>
                document.getElementById("salons")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Find a Salon <ArrowRight size={16} />
            </button>
          </div>

          <div className="hero-trust">
            <span className="trust-pill">
              <Star size={14} fill="currentColor" className="star-gold" /> 2,500+ Verified 5-Star Reviews
            </span>
            <span className="trust-pill">
              <CheckCircle2 size={14} className="check-sage" /> Double-Booking Protected
            </span>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-frame luxury-frame">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90"
              alt="High-end Salon Aesthetics"
              className="hero-main-photo"
            />
            <div className="image-note modern-image-note">
              <span className="note-icon">
                <Scissors size={18} />
              </span>
              <div>
                <b>Artisanal Care.</b>
                <small>Bespoke beauty appointments made effortless.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS HIGHLIGHTS */}
      <section className="benefits modern-benefits">
        <div className="benefit-card">
          <span className="benefit-icon icon-champagne">
            <MapPin size={22} />
          </span>
          <div>
            <b>Top Salons Near You</b>
            <small>Bengaluru's most acclaimed studios</small>
          </div>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon icon-terracotta">
            <CalendarDays size={22} />
          </span>
          <div>
            <b>Book in Seconds</b>
            <small>Instant real-time slot reservation</small>
          </div>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon icon-rose">
            <Heart size={22} />
          </span>
          <div>
            <b>Master Stylists</b>
            <small>Vetted professionals with verified ratings</small>
          </div>
        </div>
      </section>

      {/* 3. COLOURFUL PREMIUM SERVICE CATEGORIES */}
      <section id="services" className="service-categories-section">
        <div className="section-top text-center">
          <div>
            <span className="eyebrow">CURATED SPECIALTIES</span>
            <h2>
              Explore by <em>Service.</em>
            </h2>
            <p className="muted">Immerse yourself in our distinct beauty and wellness specialties.</p>
          </div>
        </div>

        <div className="service-category-cards-grid">
          {serviceCategories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                className={`service-cat-card cat-tint-${cat.type}`}
                key={cat.title}
                onClick={() =>
                  document.getElementById("salons")?.scrollIntoView({ behavior: "smooth" })
                }
                role="button"
                tabIndex={0}
              >
                <div className={`cat-icon-bubble bubble-${cat.type}`}>
                  <IconComp size={22} />
                </div>
                <b>{cat.title}</b>
                <small>{cat.sub}</small>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PROMOTIONS & PACKAGES (DUSTY ROSE & CHAMPAGNE ACCENTS) */}
      <section className="promotional-offers-section" aria-label="Curated Offers & Packages">
        <div className="section-top">
          <div>
            <span className="eyebrow">EXCLUSIVE PACKAGES</span>
            <h2>
              Indulgent <em>Combinations.</em>
            </h2>
            <p className="muted">Hand-crafted combinations offering luxury care with exceptional savings.</p>
          </div>
          <span className="promo-badge-top">
            <Percent size={14} /> Seasonal Privileges
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

      {/* 5. FEATURED SALON LISTINGS */}
      <section id="salons" className="section salons-showcase-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">THE DIRECTORY</span>
            <h2>
              Premier Salons in <em>Bengaluru.</em>
            </h2>
            <p className="muted">Vetted luxury destinations offering master craftsmanship.</p>
          </div>
          <span className="result-count">{filtered.length} Studios</span>
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
              Reset Search
            </button>
          </div>
        )}
      </section>

      {/* 6. POPULAR SERVICES SHOWCASE */}
      <section className="popular-services-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">HIGHLY REQUESTED</span>
            <h2>
              Most Loved <em>Treatments.</em>
            </h2>
            <p className="muted">Experience our guests' top-rated grooming and beauty services.</p>
          </div>
        </div>

        <div className="popular-services-grid">
          {popularTreatments.map((pt) => (
            <article className="popular-service-item" key={pt.name}>
              <div className="popular-service-body">
                <div className={`service-tag-pill tag-${pt.chipType}`}>{pt.category}</div>
                <h3>{pt.name}</h3>
                <p>{pt.desc}</p>
                <span className="service-duration-text">
                  <Clock size={13} /> {pt.duration}
                </span>
              </div>
              <div className="popular-service-action">
                <strong className="treatment-price">{pt.price}</strong>
                <Link to={`/book/${pt.salonId}`} className="primary small popular-book-cta">
                  Book Slot
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-top text-center">
          <div>
            <span className="eyebrow">CLIENT PRAISE</span>
            <h2>
              Words of <em>Delight.</em>
            </h2>
            <p className="muted">Real experiences from Bengaluru's beauty and styling aficionados.</p>
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
                <div>
                  <b className="testimonial-name">{t.name}</b>
                  <small className="muted">
                    {t.service} · {t.date}
                  </small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. LUXURY DISCOVERY CTA */}
      <section id="location" className="location-cta modern-location-cta">
        <div>
          <span className="eyebrow">BEAUTY, AROUND THE CORNER</span>
          <h2>
            Your next favourite salon
            <br />
            might be <em>closer than you think.</em>
          </h2>
          <p>Explore salons in Whitefield, Indiranagar, Koramangala and beyond.</p>
        </div>
        <Link className="champagne-cta" to="/#salons">
          Explore Salons <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
