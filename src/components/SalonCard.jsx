import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Star } from "lucide-react";
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
  const [isFavorite, setIsFavorite] = useState(() => getWishlistIds().includes(String(salon.id)));
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
    }, 3000);

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

  return (
    <article className="salon-card" style={{ "--card-delay": `${i * 120}ms` }}>
      <div className="salon-image-slider">
        <Link
          to={"/salon/" + salon.id}
          className="salon-image"
          style={{
            backgroundImage: `url(${images[activeImageIndex]})`,
          }}
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
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.2} />
        </button>

        <span className="tag">Premium salon</span>
      </div>

      <div className="salon-info">
        <div className="salon-heading">
          <h3>{salon.name}</h3>
          <span className="rating">
            <Star size={14} fill="currentColor" /> {salon.rating}
          </span>
        </div>

        <p className="muted">
          <MapPin size={14} /> {salon.area}
        </p>
        <p className="desc">{salon.description}</p>

        <div className="card-bottom">
          <span className="muted">
            <Clock size={14} /> 45–90 min
          </span>
          <Link className="text-link" to={"/salon/" + salon.id}>
            View salon <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
