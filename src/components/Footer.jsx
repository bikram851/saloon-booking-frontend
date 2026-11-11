import React from "react";
import { Link } from "react-router-dom";
import quickGroomLogo from "../assets/quick_groom.jpg";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link to="/" className="brand">
          <img
            src={quickGroomLogo}
            alt="Quick Groom"
            className="brand-image footer-brand-image"
          />
        </Link>
        <p>Beauty, wellness & a little time for yourself.</p>
      </div>

      <div className="footer-links">
        <div>
          <span>Explore</span>
          <Link to="/">Home</Link>
          <Link to="/#salons">Salons</Link>
          <Link to="/#services">Services</Link>
        </div>
        <div>
          <span>Company</span>
          <Link to="/my-appointments">My bookings</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/login">Account</Link>
        </div>
      </div>

      <div className="footer-meta">
        <small>© 2026 Quick Groom · Bengaluru, India</small>
      </div>
    </footer>
  );
}
