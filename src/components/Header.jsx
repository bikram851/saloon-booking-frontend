import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, House, Heart, MapPin, Sparkles, UserRound, LogOut } from "lucide-react";
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
      return "Locality, Area, City";
    }
    return saved;
  });
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();

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
        location === "Locality, Area, City" ? "" : location
      );
      if (fallbackLoc) {
        const trimmed = fallbackLoc.trim();
        if (trimmed) setLocation(trimmed);
      }
    } finally {
      setIsLocating(false);
    }
  }

  const isBarber = (user?.role || "").toUpperCase() === "BARBER";

  return (
    <header className="header">
      <div className="header-top-row">
        <Link to="/" className="brand brand-logo" aria-label="Quick Groom home">
          <img src={quickGroomLogo} alt="Quick Groom" className="brand-image" />
        </Link>

        {!isBarber && (
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
              {isLocating ? "Locating..." : "Change location"}
            </button>
          </div>
        )}

        <nav className="desktop-nav">
          {isBarber ? (
            <Link to="/dashboard" className="nav-barber-dashboard-link">
              <Sparkles size={14} />
              <span>Barber Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/">Discover</Link>
              <Link to="/#services">Services</Link>
              <Link to="/#location">Locations</Link>
              <Link to="/my-appointments">My appointments</Link>
              <Link to="/wishlist" className="nav-wishlist-link">
                <Heart size={14} />
                <span>Wishlist</span>
              </Link>
              <div className="desktop-location-pill">
                <MapPin size={13} className={isLocating ? "locating-spin" : ""} />
                <strong className="desktop-location-value">
                  {isLocating ? "Locating via Google Maps..." : location}
                </strong>
                <button
                  type="button"
                  className="desktop-location-inline-change"
                  onClick={pickFromGoogleMaps}
                  disabled={isLocating}
                  title="Pick current location from Google Maps"
                >
                  {isLocating ? "Locating..." : "Change location"}
                </button>
              </div>
            </>
          )}
        </nav>

        <div className="header-actions">
          {token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isBarber && <span className="barber-staff-badge">Staff</span>}
              <button className="outline small" onClick={logout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          ) : (
            <Link className="outline small" to="/login">
              <UserRound size={15} /> Sign in
            </Link>
          )}
        </div>
      </div>

      {!isBarber && (
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
          <NavLink
            to="/my-appointments"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <CalendarDays size={16} />
            <span>Bookings</span>
          </NavLink>
          <NavLink to={{ pathname: "/", hash: "#location" }} className={({ isActive }) => (isActive ? "active" : "")}>
            <MapPin size={16} />
            <span>Map</span>
          </NavLink>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active home-item" : "home-item")}>
            <House size={16} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "active" : "")}>
            <Heart size={16} />
            <span>Wishlist</span>
          </NavLink>
          {token ? (
            <button type="button" className="mobile-nav-signout" onClick={logout}>
              <LogOut size={16} />
              <span>Out</span>
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              <UserRound size={16} />
              <span>Profile</span>
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
