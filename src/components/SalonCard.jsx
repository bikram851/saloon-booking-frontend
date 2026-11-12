import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { photos } from "../data/mockData";

function getWishlistIds() {
  try {
    const saved = JSON.parse(localStorage.getItem("gg_wishlist") || "[]");
    return saved.map(String);
  } catch {
    return [];
  }
}

export default function SalonCard({ salon, i }) {
  const [isFavorite, setIsFavorite] = useState(() =>
    getWishlistIds().includes(String(salon.id)),
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(() => {
    if (Array.isArray(salon.images) && salon.images.length) return salon.images;
    return [
      `https://images.unsplash.com/${photos[i % photos.length]}?auto=format&fit=crop&w=900&q=85`,
      `https://images.unsplash.com/${photos[(i + 1) % photos.length]}?auto=format&fit=crop&w=900&q=85`,
      `https://images.unsplash.com/${photos[(i + 2) % photos.length]}?auto=format&fit=crop&w=900&q=85`,
    ];
  }, [i, salon.images]);

  useEffect(() => {
    setIsFavorite(getWishlistIds().includes(String(salon.id)));
  }, [salon.id]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [salon.id]);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [images.length]);

  function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    const wishlist = getWishlistIds();
    const nextWishlist = wishlist.includes(String(salon.id))
      ? wishlist.filter((id) => id !== String(salon.id))
      : [...wishlist, String(salon.id)];

    localStorage.setItem("gg_wishlist", JSON.stringify(nextWishlist));
    setIsFavorite(nextWishlist.includes(String(salon.id)));
    window.dispatchEvent(new Event("gg-wishlist-changed"));
  }

  function goToImage(direction) {
    setActiveImageIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }

  // Live open status (9:00 AM - 9:00 PM)
  const isOpen = useMemo(() => {
    const hours = new Date().getHours();
    return hours >= 9 && hours < 21;
  }, []);

  // Popular services specified in design requirements:
  // Haircut, Hair + Beard Cut, De-Tan, Face Scrub, Facial, Hair Spa and Massage
  const popularChips = [
    { name: "Haircut", type: "champagne" },
    { name: "Hair + Beard Cut", type: "terracotta" },
    { name: "De-Tan", type: "rose" },
    { name: "Face Scrub", type: "rose" },
    { name: "Facial", type: "rose" },
    { name: "Hair Spa", type: "sage" },
    { name: "Massage", type: "lavender" },
  ];

  const startingPrice = salon.startingPrice || 650;

  return (
    <article className="salon-card modern-rich-luxury-card" style={{ "--card-delay": `${i * 100}ms` }}>
      <div className="salon-image-slider">
        <Link
          to={"/salon/" + salon.id}
          className="salon-image"
          style={{
            backgroundImage: `url(${images[activeImageIndex]})`,
          }}
          aria-label={`View ${salon.name}`}
        />

        <button
          type="button"
          className="slider-arrow slider-prev"
          onClick={(event) => {
            event.preventDefault();
            goToImage(-1);
          }}
          aria-label="Previous salon photo"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          type="button"
          className="slider-arrow slider-next"
          onClick={(event) => {
            event.preventDefault();
            goToImage(1);
          }}
          aria-label="Next salon photo"
        >
          <ChevronRight size={14} />
        </button>

        <div className="slider-dots" aria-label="Salon image slide indicators">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeImageIndex ? "dot active" : "dot"}
              onClick={(event) => {
                event.preventDefault();
                setActiveImageIndex(index);
              }}
              aria-label={`View salon photo ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={`heart ${isFavorite ? "is-favorite" : ""}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.2} />
        </button>

        {/* Sage Availability Badge */}
        <div className={`salon-live-status-badge ${isOpen ? "open" : "closed"}`}>
          <span className="live-status-dot" />
          <span>{isOpen ? "Open Now" : "Closed"}</span>
        </div>
      </div>

      <div className="salon-info">
        <div className="salon-heading">
          <Link to={"/salon/" + salon.id} className="salon-title-link">
            <h3 className="salon-title-burgundy">{salon.name}</h3>
          </Link>
          <span className="rating gold-rating">
            <Star size={14} fill="currentColor" /> {salon.rating}
          </span>
        </div>

        <p className="muted salon-card-location">
          <MapPin size={13} className="location-icon" /> {salon.area}
        </p>

        <p className="desc">{salon.description}</p>

        {/* Coloured Service Chips (Soft pastel backgrounds with readable dark text) */}
        <div className="salon-service-chips-row" aria-label="Popular services">
          {popularChips.map((chip) => (
            <span
              key={chip.name}
              className={`service-chip chip-${chip.type}`}
            >
              {chip.name}
            </span>
          ))}
        </div>

        {/* Starting Price & CTAs */}
        <div className="salon-card-footer">
          <div className="salon-price-block">
            <span className="price-label">Starts at</span>
            <strong className="price-value">₹{startingPrice}</strong>
          </div>

          <div className="salon-actions-group">
            <Link
              className="outline small salon-explore-btn"
              to={"/salon/" + salon.id}
            >
              Explore Salon
            </Link>

            <Link
              className="primary small salon-book-btn"
              to={"/book/" + salon.id}
            >
              <CalendarDays size={13} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
