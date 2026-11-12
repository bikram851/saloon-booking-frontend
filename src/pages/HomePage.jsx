import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getGreeting } from "../utils/greeting";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  Scissors,
  Search,
  Star,
} from "lucide-react";
import { request } from "../api";
import { fallback } from "../data/mockData";
import SalonCard from "../components/SalonCard";

export default function HomePage() {
  const [salons, setSalons] = useState(fallback);
  const [q, setQ] = useState("");
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
      window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const filtered = salons.filter((s) =>
    (s.name + " " + s.area + " " + s.address)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">

          <h3>
            {greeting}, {user.name?.trim() || "there"}! ✨
          </h3>

            <span /> YOUR MOMENT OF BEAUTY
          </span>
          <h1>
            Look good.
            <br />
            <em>Feel even better.</em>
          </h1>
          <p>
            Discover Bengaluru's best-loved salons and book your next little
            luxury in minutes.
          </p>
          <div className="searchbox">
            <Search size={19} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search salon, service or area"
            />
            <button
              onClick={() =>
                document
                  .getElementById("salons")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Find a salon <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-trust">
            <span>
              <Star size={15} fill="currentColor" /> Loved by 2,500+ customers
            </span>
            <span>
              <CheckCircle2 size={15} /> Easy online booking
            </span>
          </div>
        </div>

        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90" alt="Salon" />
          <div className="image-note">
            <span className="note-icon">
              <Scissors />
            </span>
            <span>
              <b>Your time, your style.</b>
              <small>Beauty appointments made effortless.</small>
            </span>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div>
          <span className="benefit-icon">
            <MapPin />
          </span>
          <span>
            <b>Salons near you</b>
            <small>Find your neighbourhood favourite</small>
          </span>
        </div>
        <div>
          <span className="benefit-icon">
            <CalendarDays />
          </span>
          <span>
            <b>Book in a few clicks</b>
            <small>Choose a time that suits you</small>
          </span>
        </div>
        <div>
          <span className="benefit-icon">
            <Heart />
          </span>
          <span>
            <b>Stylists you'll love</b>
            <small>Find your perfect match</small>
          </span>
        </div>
      </section>

      <section id="salons" className="section">
        <div className="section-top">
          <div>
            <span className="eyebrow">THE EDIT</span>
            <h2>
              Salons worth <em>your time.</em>
            </h2>
            <p className="muted">
              Thoughtfully selected beauty spots across Bengaluru.
            </p>
          </div>
          <span className="result-count">{filtered.length} salons</span>
        </div>

        <div className="salon-grid">
          {filtered.map((s, i) => (
            <SalonCard salon={s} i={i} key={s.id} />
          ))}
        </div>

        {!filtered.length && (
          <p>
            No salons match that search. Try Whitefield, Indiranagar or
            Koramangala.
          </p>
        )}
      </section>

      <section id="services" className="service-strip">
        <div>
          <span className="eyebrow">A LITTLE SELF-CARE</span>
          <h2>
            Make time for <em>you.</em>
          </h2>
        </div>
        {[
          ["Hair", "Cuts, colour & styling"],
          ["Skin", "Facials & rejuvenation"],
          ["Nails", "Manicure & pedicure"],
          ["Grooming", "Feel-good essentials"],
        ].map(([a, b]) => (
          <div className="service-item" key={a}>
            <Scissors />
            <b>{a}</b>
            <small>{b}</small>
          </div>
        ))}
      </section>

      <section id="location" className="location-cta">
        <div>
          <span className="eyebrow">BEAUTY, AROUND THE CORNER</span>
          <h2>
            Your next favourite salon
            <br />
            might be <em>closer than you think.</em>
          </h2>
          <p>
            Explore salons in Whitefield, Indiranagar, Koramangala and more.
          </p>
        </div>
        <Link className="primary" to="/#salons">
          Explore salons <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
