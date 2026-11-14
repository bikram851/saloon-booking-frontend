import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Images,
  Maximize2,
  X,
  CalendarDays,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { fallback, photos } from "../data/mockData";
import { getAllCentralSalons } from "../services/centralSalonService";

/**
 * Extract an array of all distinct, high-quality photographs for a salon
 */
function getSalonSlides(salon, index = 0) {
  const list = [];
  const seenUrls = new Set();

  function addSlide(url, title, category) {
    if (!url || typeof url !== "string") return;
    const cleanUrl = url.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);
    list.push({
      url: cleanUrl.startsWith("http")
        ? cleanUrl
        : `https://images.unsplash.com/${cleanUrl}?auto=format&fit=crop&w=1200&q=85`,
      title: title || "Salon Interior & Styling",
      category: category || "Premises",
    });
  }

  // 1. Cover photo
  if (salon.coverImage) {
    addSlide(salon.coverImage, `${salon.name} Entrance & Lounge`, "Cover");
  }

  // 2. Explicit images array
  if (Array.isArray(salon.images) && salon.images.length > 0) {
    salon.images.forEach((img, idx) => {
      const url = typeof img === "string" ? img : img.url || img.image;
      const title = typeof img === "object" ? img.title : `Styling Floor ${idx + 1}`;
      const category = typeof img === "object" ? img.category : "Interior";
      addSlide(url, title, category);
    });
  }

  // 3. Gallery images array
  if (Array.isArray(salon.galleryImages) && salon.galleryImages.length > 0) {
    salon.galleryImages.forEach((url, idx) => {
      addSlide(url, `Salon Gallery Photo ${idx + 1}`, "Gallery");
    });
  }

  // 4. Named interior/exterior photographs
  if (salon.interiorImage) {
    addSlide(salon.interiorImage, "Main Styling Floor & Chairs", "Interior");
  }
  if (salon.exteriorImage) {
    addSlide(salon.exteriorImage, "Storefront & Exterior Presence", "Exterior");
  }
  if (salon.receptionImage) {
    addSlide(salon.receptionImage, "Reception Desk & Client Lounge", "Reception");
  }

  // 5. If fewer than 5 images, supplement with curated Unsplash beauty salon gallery
  const defaultPhotoCollection = [
    {
      id: "photo-1560066984-138dadb4c035",
      title: "Signature Styling Chairs & Mirrors",
      category: "Styling Area",
    },
    {
      id: "photo-1521590832167-7bcbfaa6381f",
      title: "Wash Lounge & Steam Conditioning",
      category: "Wash Lounge",
    },
    {
      id: "photo-1600948836101-f9ffda59d250",
      title: "VIP Private Treatment Suite",
      category: "VIP Suite",
    },
    {
      id: "photo-1503951914875-452162b0f3f1",
      title: "Precision Haircutting & Barber Station",
      category: "Barber Station",
    },
    {
      id: "photo-1562322140-8baeececf3df",
      title: "Colour Bar & Consultation Desk",
      category: "Colour Bar",
    },
    {
      id: "photo-1570172619644-dfd03ed5d881",
      title: "Skin Rejuvenation & Facial Suite",
      category: "Skin & Spa",
    },
  ];

  if (list.length < 5) {
    defaultPhotoCollection.forEach((item, offset) => {
      const shiftedIdx = (index * 2 + offset) % defaultPhotoCollection.length;
      const p = defaultPhotoCollection[shiftedIdx];
      const url = `https://images.unsplash.com/${p.id}?auto=format&fit=crop&w=1200&q=85`;
      addSlide(url, p.title, p.category);
    });
  }

  return list;
}

/**
 * Saved Salon Card with Interactive Photo Slider
 */
function WishlistSalonCard({ salon, index, onRemove, onOpenLightbox }) {
  const slides = useMemo(() => getSalonSlides(salon, index), [salon, index]);
  const [slideIndex, setSlideIndex] = useState(0);

  const prevSlide = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSlideIndex((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const nextSlide = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSlideIndex((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  const currentSlide = slides[slideIndex] || slides[0];

  return (
    <article className="wishlist-card">
      {/* Slider Container */}
      <div className="wishlist-slider-wrap">
        <div
          className="wishlist-slider-img"
          style={{ backgroundImage: `url(${currentSlide.url})` }}
          onClick={() => onOpenLightbox(salon, slideIndex, slides)}
          role="button"
          tabIndex={0}
          title="Click to view all photos in fullscreen"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onOpenLightbox(salon, slideIndex, slides);
            }
          }}
        >
          {/* Top Header Overlay */}
          <div className="wishlist-slide-top-bar">
            <span className="wishlist-badge">Saved</span>
            <span className="wishlist-slide-tag">{currentSlide.category}</span>
            <div className="wishlist-slide-actions">
              <button
                type="button"
                className="wishlist-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(salon, slideIndex, slides);
                }}
                title="View full gallery"
                aria-label="View full gallery"
              >
                <Maximize2 size={13} />
              </button>
              <button
                type="button"
                className="wishlist-icon-btn heart-active"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(salon.id);
                }}
                title="Remove from saved salons"
                aria-label="Remove from saved salons"
              >
                <Heart size={14} fill="#EF4444" color="#EF4444" />
              </button>
            </div>
          </div>

          {/* Slide Arrow Navigation */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="wishlist-nav-arrow prev"
                onClick={prevSlide}
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="wishlist-nav-arrow next"
                onClick={nextSlide}
                aria-label="Next photo"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Bottom Bar: Dots & Photo Count */}
          <div className="wishlist-slide-bottom-bar">
            <div className="wishlist-slide-dots">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`wishlist-dot ${dotIdx === slideIndex ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIndex(dotIdx);
                  }}
                  aria-label={`Go to photo ${dotIdx + 1}`}
                />
              ))}
            </div>
            <div className="wishlist-photo-counter">
              <Images size={11} />
              <span>
                {slideIndex + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Information */}
      <div className="wishlist-body">
        <div className="salon-heading">
          <Link to={`/salon/${salon.id}`} className="wishlist-salon-title-link">
            <h3>{salon.name}</h3>
          </Link>
          <span className="rating">
            <Star size={14} fill="currentColor" /> {salon.rating || 4.8}
          </span>
        </div>

        <p
          className="muted"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            margin: "4px 0 8px",
          }}
        >
          <MapPin size={13} style={{ flexShrink: 0 }} />{" "}
          {salon.area || salon.address}
        </p>

        {salon.openingHours && (
          <p className="wishlist-hours-pill">
            <Clock size={12} /> {salon.openingHours}
          </p>
        )}

        <p className="desc">{salon.description}</p>

        {/* Action Buttons */}
        <div className="wishlist-actions-row">
          <Link className="wishlist-btn-explore" to={`/salon/${salon.id}`}>
            Explore Salon
          </Link>
          <Link className="wishlist-btn-book" to={`/book/${salon.id}`}>
            Book Appointment
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Fullscreen Interactive Lightbox Slider Modal
 */
function LightboxModal({ data, onClose }) {
  const { salon, initialIndex = 0, slides = [] } = data;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  const activePhoto = slides[currentIndex] || slides[0];

  return (
    <div className="wishlist-lightbox-backdrop" onClick={onClose}>
      {/* Header */}
      <div
        className="wishlist-lightbox-header"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3>{salon.name}</h3>
          <span style={{ fontSize: "12px", color: "#d1d5db" }}>
            Photo {currentIndex + 1} of {slides.length} — {activePhoto?.title}
          </span>
        </div>
        <button
          type="button"
          className="wishlist-lightbox-close-btn"
          onClick={onClose}
          aria-label="Close photo slider"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Slide Stage */}
      <div
        className="wishlist-lightbox-main"
        onClick={(e) => e.stopPropagation()}
      >
        {slides.length > 1 && (
          <button
            type="button"
            className="wishlist-lightbox-arrow prev"
            onClick={prev}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="wishlist-lightbox-img-wrap">
          <img src={activePhoto?.url} alt={activePhoto?.title || salon.name} />
          <div className="wishlist-lightbox-caption">
            <div>
              <strong style={{ fontSize: "14px" }}>{activePhoto?.title}</strong>
              <div style={{ fontSize: "12px", opacity: 0.85 }}>
                Category: {activePhoto?.category}
              </div>
            </div>
            <Link
              to={`/book/${salon.id}`}
              className="primary"
              style={{
                fontSize: "12px",
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Book at this Salon
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <button
            type="button"
            className="wishlist-lightbox-arrow next"
            onClick={next}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div
        className="wishlist-lightbox-footer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wishlist-lightbox-thumbs">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`wishlist-lightbox-thumb ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              role="button"
              tabIndex={0}
            >
              <img src={s.url} alt={`Thumbnail ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [lightboxData, setLightboxData] = useState(null);

  function loadWishlist() {
    try {
      const saved = JSON.parse(localStorage.getItem("gg_wishlist") || "[]");
      const ids = new Set(saved.map(String));

      // Gather salons from central database and fallback
      let allSalons = [];
      try {
        allSalons = getAllCentralSalons();
      } catch {
        allSalons = [];
      }

      fallback.forEach((fb) => {
        if (!allSalons.some((s) => String(s.id) === String(fb.id))) {
          allSalons.push(fb);
        }
      });

      const favorites = allSalons.filter((salon) =>
        ids.has(String(salon.id || salon.salonId)),
      );
      setWishlist(favorites);
    } catch {
      setWishlist([]);
    }
  }

  useEffect(() => {
    loadWishlist();
    window.addEventListener("gg-wishlist-changed", loadWishlist);
    window.addEventListener("gg_central_salons_updated", loadWishlist);
    window.addEventListener("gg_salons_published_sync", loadWishlist);
    return () => {
      window.removeEventListener("gg-wishlist-changed", loadWishlist);
      window.removeEventListener("gg_central_salons_updated", loadWishlist);
      window.removeEventListener("gg_salons_published_sync", loadWishlist);
    };
  }, []);

  function handleRemoveFavorite(salonId) {
    try {
      const saved = JSON.parse(localStorage.getItem("gg_wishlist") || "[]");
      const next = saved.filter((id) => String(id) !== String(salonId));
      localStorage.setItem("gg_wishlist", JSON.stringify(next));
      window.dispatchEvent(new Event("gg-wishlist-changed"));
    } catch {}
  }

  function handleOpenLightbox(salon, initialIndex, slides) {
    setLightboxData({ salon, initialIndex, slides });
  }

  return (
    <main className="page-shell wishlist-page">
      <header className="section-top wishlist-header">
        <div>
          <span className="eyebrow">YOUR SAVED SPOTS</span>
          <h1>
            My <em>wishlist.</em>
          </h1>
          <p
            className="muted"
            style={{ marginTop: "4px", fontSize: "0.95rem" }}
          >
            Browse all interior and exterior photography of your saved salons in
            interactive sliders.
          </p>
        </div>
      </header>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-heart">
            <Heart size={28} />
          </div>
          <h3>No liked salons yet</h3>
          <p>
            Tap the heart on any salon card to save your favourites here and
            browse all their photos.
          </p>
          <Link className="primary" to="/">
            Explore salons
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((salon, idx) => (
            <WishlistSalonCard
              key={salon.id}
              salon={salon}
              index={idx}
              onRemove={handleRemoveFavorite}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxData && (
        <LightboxModal
          data={lightboxData}
          onClose={() => setLightboxData(null)}
        />
      )}
    </main>
  );
}
