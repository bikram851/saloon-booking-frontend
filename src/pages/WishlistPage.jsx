import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";
import { fallback } from "../data/mockData";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    function loadWishlist() {
      try {
        const saved = JSON.parse(localStorage.getItem("gg_wishlist") || "[]");
        const ids = new Set(saved.map(String));
        const favorites = fallback.filter((salon) => ids.has(String(salon.id)));
        setWishlist(favorites);
      } catch {
        setWishlist([]);
      }
    }

    loadWishlist();
    window.addEventListener("gg-wishlist-changed", loadWishlist);
    return () => window.removeEventListener("gg-wishlist-changed", loadWishlist);
  }, []);

  return (
    <main className="page-shell wishlist-page">
      <header className="section-top wishlist-header">
        <div>
          <span className="eyebrow">YOUR SAVED SPOTS</span>
          <h1>
            My <em>wishlist.</em>
          </h1>
        </div>
      </header>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-heart">
            <Heart size={28} />
          </div>
          <h3>No liked salons yet</h3>
          <p>Tap the heart on any salon card to save your favourites here.</p>
          <Link className="primary" to="/">
            Explore salons
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((salon) => (
            <article className="wishlist-card" key={salon.id}>
              <div
                className="wishlist-image"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/${salon.image || "photo-1560066984-138dadb4c035"}?auto=format&fit=crop&w=900&q=85)`,
                }}
              >
                <span className="wishlist-badge">Saved</span>
              </div>

              <div className="wishlist-body">
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

                <Link className="text-link" to={"/salon/" + salon.id}>
                  View salon
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
