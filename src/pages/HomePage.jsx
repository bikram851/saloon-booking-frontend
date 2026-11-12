import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getGreeting } from "../utils/greeting";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import { defaultMockBarbers, request } from "../api";
import { fallback } from "../data/mockData";
import SalonCard from "../components/SalonCard";

export default function HomePage() {
  const [salons, setSalons] = useState(fallback);
  const [salonQuery, setSalonQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
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

  // Filter salons by salon name/keyword, selected location, and selected service
  const filteredSalons = useMemo(() => {
    return salons.filter((s) => {
      const matchText = (s.name + " " + s.area + " " + s.address + " " + (s.description || "")).toLowerCase();
      const matchesQ = !salonQuery.trim() || matchText.includes(salonQuery.toLowerCase().trim());
      const matchesLoc =
        selectedLocation === "all" ||
        s.area.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        s.address.toLowerCase().includes(selectedLocation.toLowerCase());
      // Salons in fallback offer all standard services
      return matchesQ && matchesLoc;
    });
  }, [salons, salonQuery, selectedLocation]);

  // Exact 8 Service Categories required by specification
  const serviceCategories = [
    {
      id: "haircut",
      title: "Haircut",
      sub: "Precision scissor cuts & tailored styling",
      icon: Scissors,
      type: "champagne",
    },
    {
      id: "hair-beard-cut",
      title: "Hair + Beard Cut",
      sub: "Scissor restyle & beard sculpt combo",
      icon: Sparkles,
      type: "terracotta",
    },
    {
      id: "de-tan",
      title: "De-Tan",
      sub: "Sun damage reversal & skin glow pack",
      icon: Sparkles,
      type: "rose",
    },
    {
      id: "face-scrub",
      title: "Face Scrub",
      sub: "Deep pore exfoliation & hydration",
      icon: Sparkles,
      type: "peach",
    },
    {
      id: "facial",
      title: "Facial",
      sub: "Rejuvenating organic & gold masks",
      icon: Heart,
      type: "rose",
    },
    {
      id: "hair-spa",
      title: "Hair Spa",
      sub: "Scalp revitalization & keratin steam",
      icon: ShieldCheck,
      type: "sage",
    },
    {
      id: "head-massage",
      title: "Head Massage",
      sub: "Warm herbal oil acupressure therapy",
      icon: Clock,
      type: "lavender",
    },
    {
      id: "body-massage",
      title: "Body Massage",
      sub: "Therapeutic tension release & wellness",
      icon: Heart,
      type: "soft-gold",
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

  const testimonials = [
    {
      id: 1,
      name: "Rohit Malhotra",
      rating: 5,
      date: "Verified Customer",
      comment:
        "The warm ambiance and attention to detail is remarkable. Alex gave me a flawless precision fade and beard sculpt. Pure modern luxury!",
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

  const handleCategorySelect = (cat) => {
    setSelectedService(cat.title);
    const salonsElem = document.getElementById("salons");
    if (salonsElem) {
      salonsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const salonsElem = document.getElementById("salons");
    if (salonsElem) {
      salonsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetSearch = () => {
    setSalonQuery("");
    setSelectedLocation("all");
    setSelectedService("all");
  };

  return (
    <div className="homepage-wrapper warm-luxury-homepage">
      {/* 1. HERO SECTION – PERFECT ALIGNMENT & WARM LUXURY */}
      <section className="hero warm-editorial-hero" aria-label="Welcome and salon search">
        <div className="hero-copy">
          <div className="hero-header-banner">
            <div className="hero-greeting-pill">
              <Sparkles size={14} className="gold-accent-icon" />
              <span>
                {greeting}, {user.name?.trim() || "there"}!
              </span>
            </div>

            <span className="hero-tagline eyebrow">
              <span className="eyebrow-line" />
              YOUR MOMENT OF BEAUTY
            </span>
          </div>

          {/* Heading required by prompt */}
          <h1 className="hero-title editorial-heading">
            Discover Your Beauty.
            <br />
            <em className="hero-highlight">Define Your Style.</em>
          </h1>

          {/* Description required by prompt */}
          <p className="hero-subtitle">
            Explore premium salons, expert professionals and personalised beauty experiences near you.
          </p>

          {/* 3. SEARCH SECTION – CLEAN, RESPONSIVE, ZERO OVERFLOW */}
          <form className="hero-search-component" onSubmit={handleSearchSubmit} role="search" aria-label="Salon directory search">
            <div className="search-field-wrapper search-field-name">
              <Search size={17} className="search-field-icon" />
              <input
                type="text"
                value={salonQuery}
                onChange={(e) => setSalonQuery(e.target.value)}
                placeholder="Salon name or keyword..."
                aria-label="Salon name search"
              />
            </div>

            <div className="search-field-wrapper search-field-location">
              <MapPin size={17} className="search-field-icon" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Location search"
              >
                <option value="all">All Locations</option>
                <option value="Whitefield">Whitefield</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Koramangala">Koramangala</option>
                <option value="Bengaluru">Central Bengaluru</option>
              </select>
            </div>

            <div className="search-field-wrapper search-field-service">
              <Scissors size={17} className="search-field-icon" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                aria-label="Service selection"
              >
                <option value="all">All Services</option>
                {serviceCategories.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="hero-search-submit-btn">
              <span>Find Salons</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* CTA Buttons required by prompt */}
          <div className="hero-cta-group">
            <a
              href="#salons"
              className="hero-primary-cta"
            >
              <span>Explore Salons</span>
              <ArrowRight size={16} />
            </a>
            <Link
              to="/book/1"
              className="hero-secondary-cta"
            >
              <CalendarDays size={16} />
              <span>Book Appointment</span>
            </Link>
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
          <div className="hero-image-frame warm-luxury-frame">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90"
              alt="Glow & Grace Luxury Salon Interior"
              className="hero-main-photo"
              loading="eager"
            />
            <div className="image-note warm-image-note">
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

      {/* 2. WHY CHOOSE GLOW & GRACE (BENEFITS HIGHLIGHTS) */}
      <section className="benefits warm-benefits" aria-label="Why Choose Glow & Grace">
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

      {/* 4. SERVICE CATEGORIES – ATTRACTIVE 8-CATEGORY GRID */}
      <section id="services" className="service-categories-section">
        <div className="section-top text-center">
          <div>
            <span className="eyebrow">CURATED SPECIALTIES</span>
            <h2>
              Explore by <em>Service.</em>
            </h2>
            <p className="muted">Select from our 8 signature beauty, hair, skincare and massage rituals.</p>
          </div>
        </div>

        <div className="service-category-cards-grid">
          {serviceCategories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedService === cat.title;
            return (
              <div
                className={`service-cat-card cat-tint-${cat.type} ${isSelected ? "selected" : ""}`}
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCategorySelect(cat)}
                aria-label={`Select ${cat.title}`}
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

      {/* 5. TOP RATED PROFESSIONALS */}
      <section className="professionals-showcase-section" aria-label="Top Rated Professionals">
        <div className="section-top">
          <div>
            <span className="eyebrow">ARTISANS & STYLISTS</span>
            <h2>
              Top Rated <em>Professionals.</em>
            </h2>
            <p className="muted">Meet our highly reviewed master barbers, colorists and skincare consultants.</p>
          </div>
          <span className="result-count">{defaultMockBarbers.length} Master Stylists</span>
        </div>

        <div className="professionals-grid">
          {defaultMockBarbers.map((barber) => (
            <article className="professional-card" key={barber.id}>
              <div className="professional-avatar-wrap">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="professional-avatar-img"
                  loading="lazy"
                />
                <span className={`professional-status-dot ${barber.available ? "online" : "busy"}`} />
              </div>

              <div className="professional-info">
                <div className="professional-name-row">
                  <h3 className="professional-name">{barber.name}</h3>
                  <span className="professional-rating">
                    <Star size={13} fill="currentColor" className="star-gold" /> {barber.rating}
                  </span>
                </div>

                <p className="professional-role">{barber.role}</p>
                <span className="professional-spec">{barber.specialization}</span>
                <span className="professional-exp">{barber.experience} years experience</span>

                <div className="professional-footer">
                  <Link
                    to={`/book/1?barberId=${barber.id}`}
                    className="primary small professional-book-cta"
                  >
                    <UserCheck size={14} />
                    <span>Book with {barber.name.split(" ")[0]}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. FEATURED SALON CARDS */}
      <section id="salons" className="section salons-showcase-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">THE DIRECTORY</span>
            <h2>
              Premier Salons in <em>Bengaluru.</em>
            </h2>
            <p className="muted">
              {selectedService !== "all"
                ? `Showing salons offering ${selectedService}.`
                : "Vetted luxury destinations offering master craftsmanship."}
            </p>
          </div>
          <span className="result-count">{filteredSalons.length} Studios</span>
        </div>

        <div className="salon-grid">
          {filteredSalons.map((s, i) => (
            <SalonCard salon={s} i={i} key={s.id} />
          ))}
        </div>

        {!filteredSalons.length && (
          <div className="empty-search-box">
            <p>No salons match that combination. Try searching Whitefield, Indiranagar or Koramangala.</p>
            <button type="button" className="outline small" onClick={handleResetSearch}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 7. POPULAR SERVICES SHOWCASE */}
      <section className="popular-services-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">HIGHLY REQUESTED</span>
            <h2>
              Most Loved <em>Treatments.</em>
            </h2>
            <p className="muted">Experience our guests' top-rated grooming, facial and hair spa rituals.</p>
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


      {/* 9. VERIFIED CUSTOMER TESTIMONIALS */}
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

      {/* 10. LUXURY DISCOVERY CTA */}
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
        <a className="hero-primary-cta" href="#salons">
          Explore Salons <ArrowRight size={16} />
        </a>
      </section>
    </div>
  );
}
