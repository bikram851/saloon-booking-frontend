import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Clock, MapPin, Navigation, Phone, Star } from "lucide-react";
import { request } from "../api";
import { fallback, photos } from "../data/mockData";

export default function SalonDetailPage() {
  const { id } = useParams();
  const [salon, setSalon] = useState(
    fallback.find((s) => s.id === Number(id)) || fallback[0],
  );
  const [services, setServices] = useState([]);

  useEffect(() => {
    request("/salons/" + id)
      .then(setSalon)
      .catch(() => {});

    request("/salons/" + id + "/services")
      .then(setServices)
      .catch(() => setServices([]));
  }, [id]);

  const map = `https://www.google.com/maps/dir/?api=1&destination=${salon.latitude},${salon.longitude}`;

  return (
    <main className="detail-page">
      <div className="breadcrumbs">
        <Link to="/">Discover</Link>
        <ChevronRight size={14} />
        {salon.name}
      </div>

      <div className="detail-hero">
        <img
          src={`https://images.unsplash.com/${photos[(Number(id) - 1) % photos.length]}?auto=format&fit=crop&w=1200&q=85`}
          alt={salon.name}
        />
        <div>
          <span className="eyebrow">SALON PROFILE</span>
          <h1>{salon.name}</h1>
          <p className="muted">
            <Star size={15} fill="currentColor" className="star" /> {salon.rating}{" "}
            <span>·</span> Premium salon
          </p>
          <p>{salon.description}</p>
          <p className="muted">
            <MapPin size={16} />
            {salon.area}
          </p>
          <Link to={`/book/${salon.id}`} className="primary">
            Book appointment <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="detail-columns">
        <section className="panel">
          <span className="eyebrow">THE MENU</span>
          <h2>Services & pricing</h2>
          {!services.length && <p className="muted">No services are available right now. Please try again shortly.</p>}
          {services.map((s) => (
            <div className="service-row" key={s.id}>
              <div>
                <b>{s.name}</b>
                <small>
                  <Clock size={13} /> {s.durationMinutes} minutes
                </small>
              </div>
              <strong>₹{Number(s.price ?? s.priceRupees ?? 0).toLocaleString("en-IN")}</strong>
              <Link to={`/book/${salon.id}?service=${s.id}`} className="outline small">
                Book
              </Link>
            </div>
          ))}
        </section>

        <aside className="panel location-panel">
          <span className="eyebrow">COME ON IN</span>
          <h2>Find us</h2>
          <div className="map-placeholder">
            <MapPin size={30} />
            <span>{salon.area}</span>
            <small>Map directions open in Google Maps</small>
          </div>
          <h3>{salon.address}</h3>
          <p className="muted">Landmark: {salon.landmark}</p>
          <p className="muted">
            <Phone size={15} /> {salon.phone}
          </p>
          <a className="primary full" href={map} target="_blank" rel="noreferrer">
            <Navigation size={16} /> Get directions
          </a>
          <p className="hours">
            <Clock size={15} /> Mon–Sun · 9:00 AM – 9:00 PM
          </p>
        </aside>
      </div>
    </main>
  );
}
