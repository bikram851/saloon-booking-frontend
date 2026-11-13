import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  CreditCard,
  Heart,
  ImageIcon,
  Info,
  MapPin,
  MessageSquare,
  Navigation,
  Percent,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  UserCheck,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import {
  defaultMockBarbers,
  defaultMockGallery,
  defaultMockOffers,
  defaultMockReviews,
  defaultMockServices,
  request,
} from "../api";
import { fallback, photos } from "../data/mockData";

export default function SalonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [salon, setSalon] = useState(() => {
    return fallback.find((s) => s.id === Number(id)) || fallback[0];
  });
  const [services, setServices] = useState(defaultMockServices);
  const [barbers, setBarbers] = useState(defaultMockBarbers);
  const [offers, setOffers] = useState(defaultMockOffers);
  const [reviews, setReviews] = useState(defaultMockReviews);
  const [gallery, setGallery] = useState(defaultMockGallery);

  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [serviceCategory, setServiceCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "all");

  // Determine current live open/closed status (Standard hours: 9:00 AM to 9:00 PM)
  const openStatus = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const isOpen = currentHour >= 9 && currentHour < 21;
    return {
      isOpen,
      statusText: isOpen ? "Open Now" : "Closed",
      hoursText: salon.openingHours || "9:00 AM – 9:00 PM",
    };
  }, [salon.openingHours]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch salon details
    request(`/salons/${id}`)
      .then((data) => {
        if (isMounted && data) setSalon(data);
      })
      .catch(() => {});

    // Fetch services
    request(`/salons/${id}/services`)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length) setServices(data);
      })
      .catch(() => {});

    // Fetch barbers
    request(`/salons/${id}/barbers`)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length) setBarbers(data);
      })
      .catch(() => {});

    // Fetch offers
    request(`/salons/${id}/offers`)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length) setOffers(data);
      })
      .catch(() => {});

    // Fetch reviews
    request(`/salons/${id}/reviews`)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length) setReviews(data);
      })
      .catch(() => {});

    // Fetch gallery
    request(`/salons/${id}/gallery`)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length) setGallery(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Synchronize hash/tab with state
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["services", "barbers", "offers", "reviews", "gallery", "about"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "all") {
      setSearchParams({});
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      setSearchParams({ tab: tabId });
      const targetElement = document.getElementById(tabId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    }
  };

  const handleBookingClick = (e, path) => {
    const token = localStorage.getItem("gg_token");
    if (!token) {
      if (e?.preventDefault) e.preventDefault();
      navigate("/login", {
        state: {
          from: path || `/book/${salon.id}`,
          authMessage: "Please sign in to continue booking.",
        },
      });
      return false;
    }
    return true;
  };

  const handleMenuCardClick = (category) => {
    if (category.id === "book") {
      if (handleBookingClick(null, `/book/${salon.id}`)) {
        navigate(`/book/${salon.id}`);
      }
      return;
    }
    handleTabChange(category.id);
  };

  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${salon.latitude || 12.9698},${salon.longitude || 77.75}`;

  const heroPhotoIndex = (Number(id) - 1 + photos.length) % photos.length;
  const heroImageUrl = `https://images.unsplash.com/${photos[heroPhotoIndex]}?auto=format&fit=crop&w=1200&q=85`;

  // Categories for services filter
  const serviceCategories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["all", ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (serviceCategory === "all") return services;
    return services.filter((s) => s.category?.toLowerCase() === serviceCategory.toLowerCase());
  }, [services, serviceCategory]);

  // Menu cards list for the responsive Explore Grid
  const menuCategories = [
    {
      id: "services",
      title: "Services",
      desc: "Browse haircuts, hair spa, facial, manicure & pedicure",
      badge: `${services.length} services available`,
      icon: Scissors,
      type: "section",
    },
    {
      id: "barbers",
      title: "Barbers & Stylists",
      desc: "View stylist profiles, experience, ratings & availability",
      badge: `${barbers.length} professionals`,
      icon: Users,
      type: "section",
    },
    {
      id: "book",
      title: "Book Appointment",
      desc: "Select service, barber and convenient slot",
      badge: "Instant Slot Booking",
      icon: CalendarDays,
      type: "action",
      highlight: true,
    },
    {
      id: "offers",
      title: "Offers & Packages",
      desc: "Special bundled discounts and curated self-care packages",
      badge: `${offers.length} active offers`,
      icon: Tag,
      type: "section",
    },
    {
      id: "reviews",
      title: "Reviews & Ratings",
      desc: "Read genuine customer feedback and verified ratings",
      badge: `${salon.rating} ★ (${reviews.length} reviews)`,
      icon: Star,
      type: "section",
    },
    {
      id: "gallery",
      title: "Gallery",
      desc: "View salon interior, styling lounge & previous work",
      badge: `${gallery.length} salon photos`,
      icon: ImageIcon,
      type: "section",
    },
    {
      id: "about",
      title: "About Salon",
      desc: "Salon details, address, contact information & timings",
      badge: "Hours & Directions",
      icon: Info,
      type: "section",
    },
  ];

  return (
    <main className="detail-page explore-salon-page">
      {/* 1. Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Discover</Link>
        <ChevronRight size={13} />
        <Link to="/#salons">Salons</Link>
        <ChevronRight size={13} />
        <span className="current">{salon.name}</span>
      </nav>

      {/* 2. Salon Overview Hero */}
      <section className="explore-hero-card" aria-label="Salon Information">
        <div className="explore-hero-media">
          {!heroImageLoaded && <div className="explore-hero-skeleton" />}
          <img
            src={heroImageUrl}
            alt={salon.name}
            className={`explore-hero-image ${heroImageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setHeroImageLoaded(true)}
          />
          <div className="explore-hero-overlay-badge">
            <Sparkles size={14} />
            <span>Luxury Verified</span>
          </div>
        </div>

        <div className="explore-hero-content">
          <div className="explore-hero-meta-row">
            <span className="eyebrow">PREMIUM SALON PROFILE</span>
            <div className={`explore-status-pill ${openStatus.isOpen ? "is-open" : "is-closed"}`}>
              <span className="status-indicator-dot" />
              <span>{openStatus.statusText}</span>
              <span className="status-separator">·</span>
              <span className="status-hours">{openStatus.hoursText}</span>
            </div>
          </div>

          <h1 className="explore-hero-title">{salon.name}</h1>

          <div className="explore-hero-stats">
            <div className="explore-stat-item rating-badge">
              <Star size={15} fill="currentColor" className="star" />
              <strong>{salon.rating}</strong>
              <span className="muted">({salon.reviewsCount || reviews.length || 142} reviews)</span>
            </div>
            <div className="explore-stat-item location-badge">
              <MapPin size={15} />
              <span>{salon.area}</span>
            </div>
          </div>

          <p className="explore-hero-desc">{salon.description}</p>

          <div className="explore-hero-location-text">
            <MapPin size={14} className="muted-icon" />
            <address className="explore-address">{salon.address}</address>
          </div>

          {/* Primary CTA and Quick Actions */}
          <div className="explore-hero-actions">
            <Link
              to={`/book/${salon.id}`}
              onClick={(e) => handleBookingClick(e, `/book/${salon.id}`)}
              className="primary explore-primary-cta"
              aria-label={`Book appointment at ${salon.name}`}
            >
              <CalendarDays size={18} />
              <span>Book Appointment</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="outline explore-secondary-cta"
              title="Get directions on Google Maps"
            >
              <Navigation size={16} />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Explore Salon Menu Grid Section */}
      <section className="explore-menu-section" aria-label="Explore Salon Menu">
        <div className="explore-menu-header">
          <div>
            <span className="eyebrow">EXPLORE SALON</span>
            <h2 className="explore-menu-title">Explore by Category</h2>
            <p className="muted explore-menu-subtitle">
              Select a section below to browse services, stylists, packages, reviews and more.
            </p>
          </div>
          {activeTab !== "all" && (
            <button
              type="button"
              className="outline small explore-show-all-btn"
              onClick={() => handleTabChange("all")}
            >
              Show All Sections
            </button>
          )}
        </div>

        {/* Responsive Grid */}
        <div className="explore-menu-grid">
          {menuCategories.map((cat) => {
            const IconComponent = cat.icon;
            const isTabActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleMenuCardClick(cat)}
                className={`explore-menu-card ${cat.highlight ? "is-highlighted" : ""} ${
                  isTabActive ? "is-active" : ""
                }`}
                aria-label={`Explore ${cat.title}`}
              >
                <div className="explore-card-top">
                  <div className="explore-card-icon-wrap">
                    <IconComponent size={20} />
                  </div>
                  <span className="explore-card-badge">{cat.badge}</span>
                </div>

                <div className="explore-card-body">
                  <h3 className="explore-card-title">{cat.title}</h3>
                  <p className="explore-card-desc">{cat.desc}</p>
                </div>

                <div className="explore-card-footer">
                  <span className="explore-card-action-text">
                    {cat.id === "book" ? "Book Now" : "View Details"}
                  </span>
                  {cat.id === "book" ? (
                    <ArrowRight size={15} className="explore-card-arrow" />
                  ) : (
                    <ChevronRight size={15} className="explore-card-arrow" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Filter / Jump Bar for Fast Mobile & Desktop In-Page Exploration */}
      <nav className="explore-tabs-bar" aria-label="Quick Category Filter">
        {[
          { id: "all", label: "All Details" },
          { id: "services", label: `Services (${services.length})` },
          { id: "barbers", label: `Stylists (${barbers.length})` },
          { id: "offers", label: `Offers (${offers.length})` },
          { id: "reviews", label: `Reviews (${reviews.length})` },
          { id: "gallery", label: `Gallery (${gallery.length})` },
          { id: "about", label: "About Salon" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`explore-tab-pill ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* =========================================================================
          MODULE SECTIONS
          ========================================================================= */}
      <div className="explore-sections-container">
        {/* SECTION 1: SERVICES */}
        {(activeTab === "all" || activeTab === "services") && (
          <section id="services" className="explore-module-panel" aria-label="Services Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">THE MENU</span>
                <h2>Services & Treatments</h2>
                <p className="muted">Transparent pricing, premium products & experienced specialists.</p>
              </div>
              <span className="explore-count-pill">{filteredServices.length} items</span>
            </div>

            {/* Service Category Pills */}
            <div className="explore-service-category-pills">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`service-cat-pill ${serviceCategory === cat ? "active" : ""}`}
                  onClick={() => setServiceCategory(cat)}
                >
                  {cat === "all" ? "All Services" : cat}
                </button>
              ))}
            </div>

            <div className="explore-services-list">
              {filteredServices.map((s) => (
                <article className="explore-service-row" key={s.id}>
                  <div className="service-info-col">
                    <div className="service-title-row">
                      <b>{s.name}</b>
                      {s.category && <span className="service-category-tag">{s.category}</span>}
                    </div>
                    {s.description && <p className="service-desc">{s.description}</p>}
                    <span className="service-duration">
                      <Clock size={13} /> {s.durationMinutes} minutes
                    </span>
                  </div>

                  <div className="service-action-col">
                    <strong className="service-price">
                      ₹{Number(s.price ?? s.priceRupees ?? 0).toLocaleString("en-IN")}
                    </strong>
                    <Link
                      to={`/book/${salon.id}?service=${s.id}`}
                      className="primary small service-book-btn"
                      aria-label={`Book ${s.name}`}
                    >
                      Book <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: BARBERS & STYLISTS */}
        {(activeTab === "all" || activeTab === "barbers") && (
          <section id="barbers" className="explore-module-panel" aria-label="Barbers & Stylists Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">OUR EXPERTS</span>
                <h2>Master Barbers & Stylists</h2>
                <p className="muted">Dedicated professionals tailored to your personal aesthetic.</p>
              </div>
              <span className="explore-count-pill">{barbers.length} stylists</span>
            </div>

            <div className="explore-barbers-grid">
              {barbers.map((b) => {
                const isAvailable = b.status === "active" || b.available !== false;
                return (
                  <article className="explore-barber-card" key={b.id}>
                    <div className="explore-barber-avatar-wrap">
                      <img src={b.image} alt={b.name} className="explore-barber-avatar" />
                      <span
                        className={`explore-barber-status-badge ${
                          isAvailable ? "status-available" : "status-break"
                        }`}
                      >
                        {isAvailable ? "Available" : "Break"}
                      </span>
                    </div>

                    <div className="explore-barber-details">
                      <div className="explore-barber-name-row">
                        <h3>{b.name}</h3>
                        <span className="barber-rating">
                          <Star size={13} fill="currentColor" /> {b.rating || 4.9}
                        </span>
                      </div>
                      <p className="barber-role">{b.role || "Stylist"}</p>
                      <p className="barber-spec">{b.specialization || "Precision Cuts & Styling"}</p>
                      <div className="barber-meta-tags">
                        <span>{b.experience || 5}+ yrs experience</span>
                        {b.chair && <span>{b.chair}</span>}
                      </div>

                      <Link
                        to={`/book/${salon.id}?barber=${b.id}`}
                        className="outline small barber-book-cta"
                        aria-label={`Book with ${b.name}`}
                      >
                        <UserCheck size={14} /> Book with {b.name.split(" ")[0]}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 3: OFFERS & PACKAGES */}
        {(activeTab === "all" || activeTab === "offers") && (
          <section id="offers" className="explore-module-panel" aria-label="Offers & Packages Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">EXCLUSIVE VALUE</span>
                <h2>Offers & Curated Packages</h2>
                <p className="muted">Hand-crafted combinations offering luxury care with exceptional savings.</p>
              </div>
              <span className="explore-count-pill">{offers.length} offers</span>
            </div>

            <div className="explore-offers-grid">
              {offers.map((off) => (
                <article className="explore-offer-card" key={off.id}>
                  <div className="offer-badge-ribbon">{off.badge}</div>
                  <h3 className="offer-title">{off.title}</h3>
                  <p className="offer-desc">{off.description}</p>

                  <div className="offer-meta-row">
                    <span className="offer-duration">
                      <Clock size={13} /> {off.durationMinutes} mins
                    </span>
                    {off.code && (
                      <span className="offer-code-pill">
                        <Tag size={12} /> {off.code}
                      </span>
                    )}
                  </div>

                  <div className="offer-pricing-row">
                    <div>
                      <span className="original-price">₹{off.originalPrice}</span>
                      <strong className="deal-price">₹{off.price}</strong>
                    </div>
                    <Link
                      to={`/book/${salon.id}`}
                      className="primary small offer-claim-btn"
                      aria-label={`Claim ${off.title}`}
                    >
                      Book Offer <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: REVIEWS & RATINGS */}
        {(activeTab === "all" || activeTab === "reviews") && (
          <section id="reviews" className="explore-module-panel" aria-label="Customer Reviews Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">CLIENT VOICES</span>
                <h2>Reviews & Ratings</h2>
                <p className="muted">Genuine feedback from verified visitors.</p>
              </div>
              <span className="explore-count-pill">{salon.rating} ★ Overall</span>
            </div>

            {/* Scorecard */}
            <div className="explore-scorecard">
              <div className="scorecard-big">
                <strong>{salon.rating}</strong>
                <div className="scorecard-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="star" />
                  ))}
                </div>
                <span>Based on {salon.reviewsCount || reviews.length || 142} ratings</span>
              </div>
              <div className="scorecard-highlights">
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="highlight-icon" />
                  <span>98% recommended by verified customers</span>
                </div>
                <div className="highlight-item">
                  <ShieldCheck size={16} className="highlight-icon" />
                  <span>100% verified appointments via Quick Groom</span>
                </div>
                <div className="highlight-item">
                  <Sparkles size={16} className="highlight-icon" />
                  <span>Punctual slot timings & hygienic stations</span>
                </div>
              </div>
            </div>

            {/* Reviews list */}
            <div className="explore-reviews-grid">
              {reviews.map((rev) => (
                <article className="explore-review-card" key={rev.id}>
                  <div className="review-card-top">
                    <div className="reviewer-avatar">
                      {rev.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="reviewer-name-row">
                        <b>{rev.name}</b>
                        {rev.verified && <span className="verified-badge">Verified</span>}
                      </div>
                      <small className="muted">{rev.date}</small>
                    </div>
                  </div>

                  <div className="review-rating-row">
                    <div className="stars-inline">
                      {[...Array(Math.floor(rev.rating || 5))].map((_, idx) => (
                        <Star key={idx} size={13} fill="currentColor" className="star" />
                      ))}
                    </div>
                    {rev.service && <span className="service-pill-small">{rev.service}</span>}
                  </div>

                  <p className="review-text">"{rev.comment}"</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: GALLERY */}
        {(activeTab === "all" || activeTab === "gallery") && (
          <section id="gallery" className="explore-module-panel" aria-label="Salon Gallery Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">VISUAL TOUR</span>
                <h2>Salon Gallery</h2>
                <p className="muted">Immerse yourself in our serene interior ambiance and craftsmanship.</p>
              </div>
              <span className="explore-count-pill">{gallery.length} photos</span>
            </div>

            <div className="explore-gallery-grid">
              {gallery.map((g) => (
                <div className="explore-gallery-item" key={g.id}>
                  <img src={g.image} alt={g.title} loading="lazy" />
                  <div className="gallery-item-caption">
                    <span className="gallery-item-tag">{g.category}</span>
                    <strong className="gallery-item-title">{g.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: ABOUT SALON */}
        {(activeTab === "all" || activeTab === "about") && (
          <section id="about" className="explore-module-panel" aria-label="About Salon Section">
            <div className="explore-panel-header">
              <div>
                <span className="eyebrow">AT A GLANCE</span>
                <h2>About the Salon</h2>
                <p className="muted">Contact info, location directions, operating schedule & amenities.</p>
              </div>
            </div>

            <div className="explore-about-grid">
              <div className="about-info-box">
                <h3>Location & Contact</h3>
                <p className="about-address-full">
                  <MapPin size={16} className="gold-icon" />
                  <span>
                    <strong>{salon.name}</strong>
                    <br />
                    {salon.address}
                  </span>
                </p>
                {salon.landmark && (
                  <p className="muted landmark-text">
                    <strong>Landmark:</strong> {salon.landmark}
                  </p>
                )}

                <p className="about-phone">
                  <Phone size={15} className="gold-icon" />
                  <a href={`tel:${salon.phone}`}>{salon.phone}</a>
                </p>

                <p className="about-hours">
                  <Clock size={15} className="gold-icon" />
                  <span>Mon–Sun · 9:00 AM – 9:00 PM</span>
                </p>

                <a
                  className="primary full about-directions-cta"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation size={16} /> Get Directions on Google Maps
                </a>
              </div>

              {/* Amenities List */}
              <div className="about-amenities-box">
                <h3>Salon Amenities</h3>
                <ul className="amenities-list">
                  <li>
                    <Wind size={18} />
                    <div>
                      <b>Fully Air Conditioned</b>
                      <small>Climate-controlled comfort throughout</small>
                    </div>
                  </li>
                  <li>
                    <Wifi size={18} />
                    <div>
                      <b>High-Speed Wi-Fi</b>
                      <small>Complimentary guest connection</small>
                    </div>
                  </li>
                  <li>
                    <CreditCard size={18} />
                    <div>
                      <b>Digital & Card Payments</b>
                      <small>UPI, Credit/Debit cards & Cash</small>
                    </div>
                  </li>
                  <li>
                    <ShieldCheck size={18} />
                    <div>
                      <b>Sterilized Tools & Stations</b>
                      <small>Hospital-grade UV sanitization</small>
                    </div>
                  </li>
                  <li>
                    <Coffee size={18} />
                    <div>
                      <b>Complimentary Refreshments</b>
                      <small>Artisanal coffee, tea & purified water</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Floating / Sticky Mobile Booking CTA */}
      <aside className="explore-mobile-sticky-bar" aria-label="Quick Booking Bar">
        <div>
          <strong className="sticky-salon-name">{salon.name}</strong>
          <span className="sticky-salon-rating">
            <Star size={13} fill="currentColor" /> {salon.rating} · {openStatus.statusText}
          </span>
        </div>
        <Link
          to={`/book/${salon.id}`}
          onClick={(e) => handleBookingClick(e, `/book/${salon.id}`)}
          className="primary small sticky-book-btn"
        >
          Book Slot <ArrowRight size={14} />
        </Link>
      </aside>
    </main>
  );
}
