import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quickGroomLogo from "../assets/quick_groom.jpg";

export default function Footer() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const refreshAuth = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("gg_user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("gg-auth-changed", refreshAuth);
    return () => window.removeEventListener("gg-auth-changed", refreshAuth);
  }, []);

  const isBarber = (user?.role || "").toUpperCase() === "BARBER";

  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link to={isBarber ? "/dashboard" : "/"} className="brand">
          <img
            src={quickGroomLogo}
            alt="Quick Groom"
            className="brand-image footer-brand-image"
          />
        </Link>
        <p>
          {isBarber
            ? "Quick Groom Barber & Staff Operations Portal."
            : "Beauty, wellness & a little time for yourself."}
        </p>
      </div>

      <div className="footer-links">
        {isBarber ? (
          <div>
            <span>Barber Station</span>
            <Link to="/dashboard">Barber Dashboard</Link>
            <Link to="/dashboard">Chair Schedule</Link>
          </div>
        ) : (
          <>
            <div>
              <span>Explore</span>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
                Home
              </Link>
              <Link to="/#salons">Salons</Link>
              <Link to="/#services">Services</Link>
            </div>
            <div>
              <span>Company</span>
              <Link to="/my-appointments">My bookings</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/login">Account</Link>
            </div>
          </>
        )}
      </div>

      <div className="footer-meta">
        <small>© 2026 Quick Groom · Bengaluru, India</small>
      </div>
    </footer>
  );
}
