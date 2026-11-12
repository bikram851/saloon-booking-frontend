import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Heart,
  House,
  LogOut,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import quickGroomLogo from "../assets/quick_groom.jpg";
import { getCurrentLocationFromGoogleMaps } from "../utils/googleMaps";

export default function Header() {
  const [token, setToken] = useState(() => localStorage.getItem("gg_token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gg_user") || "null");
    } catch {
      return null;
    }
  });

  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("gg_location");
    if (!saved || saved.includes("Belandur") || saved.includes("Marathahalli")) {
      return "Bengaluru, Karnataka";
    }
    return saved;
  });
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();
  const locationObj = useLocation();
  const isAuthPage = locationObj.pathname === "/login";

  useEffect(() => {
    const refreshAuth = () => {
      setToken(localStorage.getItem("gg_token"));
      try {
        setUser(JSON.parse(localStorage.getItem("gg_user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("gg-auth-changed", refreshAuth);
    return () => window.removeEventListener("gg-auth-changed", refreshAuth);
  }, []);

  useEffect(() => {
    localStorage.setItem("gg_location", location);
  }, [location]);

  function logout() {
    localStorage.removeItem("gg_token");
    localStorage.removeItem("gg_user");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("gg-auth-changed"));
    navigate("/", { replace: true });
  }

  async function pickFromGoogleMaps() {
    setIsLocating(true);
    try {
      const loc = await getCurrentLocationFromGoogleMaps();
      setLocation(loc);
    } catch (err) {
      const fallbackLoc = window.prompt(
        `${err.message || "Could not detect location from Google Maps."}\n\nPlease enter your location (Locality, Area, City):`,
        location === "Bengaluru, Karnataka" ? "" : location
      );
      if (fallbackLoc) {
        const trimmed = fallbackLoc.trim();
        if (trimmed) setLocation(trimmed);
      }
    } finally {
      setIsLocating(false);
    }
  }

  const userRole = (user?.role || "").toUpperCase();
  const isStaff = userRole === "BARBER" || userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <header className="header">
      <div className="header-top-row">
        <Link
          to={isStaff ? "/dashboard" : "/"}
          className="brand brand-logo"
          aria-label="Glow & Grace home"
          onClick={handleHomeClick}
        >
          <img src={quickGroomLogo} alt="Glow & Grace" className="brand-image" />
        </Link>

        {!isStaff && (
          <div className="mobile-header-location">
            <MapPin size={13} className={isLocating ? "locating-spin" : ""} />
            <strong>{isLocating ? "Locating..." : location}</strong>
            <button
              type="button"
              className="mobile-header-location-change"
              onClick={pickFromGoogleMaps}
              disabled={isLocating}
              title="Pick current location from Google Maps"
            >
              {isLocating ? "Locating..." : "Change"}
            </button>
          </div>
        )}

        <nav className="desktop-nav" aria-label="Desktop primary navigation">
          {isStaff ? (
            <Link to="/dashboard" className="nav-barber-dashboard-link" onClick={handleHomeClick}>
              <Sparkles size={14} />
              <span>{isAdmin ? "Salon Admin Command" : "Barber Dashboard"}</span>
            </Link>
          ) : (
            <>
              <Link to="/" onClick={handleHomeClick}>Home</Link>
              <Link to="/#salons">Explore</Link>
              <Link to="/#services">Services</Link>
              <Link to="/my-appointments">Bookings</Link>
              <Link to="/wishlist" className="nav-wishlist-link">
                <Heart size={14} />
                <span>Wishlist</span>
              </Link>
              <div className="desktop-location-pill">
                <MapPin size={13} className={isLocating ? "locating-spin" : ""} />
                <strong className="desktop-location-value">
                  {isLocating ? "Locating via Maps..." : location}
                </strong>
                <button
                  type="button"
                  className="desktop-location-inline-change"
                  onClick={pickFromGoogleMaps}
                  disabled={isLocating}
                  title="Pick current location"
                >
                  {isLocating ? "..." : "Change"}
                </button>
              </div>
            </>
          )}
        </nav>

        <div className="header-actions">
          {!isStaff && (
            <Link className="primary small mmt-btn-orange desktop-book-cta" to="/#salons">
              <CalendarDays size={14} />
              <span>Book Appointment</span>
            </Link>
          )}

          {token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isStaff && (
                <span className="barber-staff-badge">
                  {isAdmin ? "Admin" : "Staff"}
                </span>
              )}
              <button className="outline small" onClick={logout} title="Sign Out">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : (
            <Link className="outline small" to="/login">
              <UserRound size={14} /> Sign in
            </Link>
          )}
        </div>
      </div>

      {!isStaff && !isAuthPage && (
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleHomeClick}
          >
            <House size={18} />
            <span>Home</span>
          </NavLink>
          <a
            href="#salons"
            className="mobile-nav-link"
          >
            <Sparkles size={18} />
            <span>Explore</span>
          </a>
          <NavLink
            to="/my-appointments"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <CalendarDays size={18} />
            <span>Bookings</span>
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </NavLink>
          {token ? (
            <button type="button" className="mobile-nav-signout" onClick={logout} title="Sign Out">
              <LogOut size={18} />
              <span>Out</span>
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              <UserRound size={18} />
              <span>Profile</span>
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
