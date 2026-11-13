import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Scissors, User, ShieldCheck } from "lucide-react";
import { request } from "../api";
import quickGroomLogo from "../assets/quick_groom.jpg";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        role: selectedRole,
      };

      const data = await request("/auth/" + (mode === "login" ? "login" : "register"), {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const userRole = (data.role || selectedRole || "CUSTOMER").toUpperCase();
      localStorage.setItem("gg_token", data.token || "demo_token_" + Date.now());
      localStorage.setItem(
        "gg_user",
        JSON.stringify({
          id: data.id,
          barberId: data.barberId,
          name: data.name || data.fullName,
          fullName: data.fullName || data.name,
          email: data.email || form.email,
          role: userRole,
          phone: data.phone || form.phone,
        })
      );
      window.dispatchEvent(new Event("gg-auth-changed"));

      nav(userRole === "BARBER" || userRole === "ADMIN" ? "/dashboard" : "/my-appointments");
    } catch (e) {
      setError(e.message);
    }
  }

  function fillDemo(role) {
    setSelectedRole(role);
    setError("");
    if (role === "ADMIN") {
      setForm({
        ...form,
        email: "admin@glowgrace.com",
        password: "password123",
        fullName: "Salon Administrator",
        phone: "+91 98765 00000",
      });
    } else if (role === "BARBER") {
      setForm({
        ...form,
        email: "barber@glowgrace.com",
        password: "password123",
        fullName: "Alex Rivera",
        phone: "+91 98765 00001",
      });
    } else {
      setForm({
        ...form,
        email: "customer@glowgrace.com",
        password: "password123",
        fullName: "Demo Client",
        phone: "+91 98765 00002",
      });
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <img src={quickGroomLogo} alt="Quick Groom" className="login-brand-image" />
        <span className="eyebrow">
          {selectedRole === "ADMIN"
            ? "SALON EXECUTIVE PORTAL"
            : selectedRole === "BARBER"
            ? "STAFF & STYLIST PORTAL"
            : "WELCOME TO QUICK GROOM"}
        </span>
        <h1>
          {mode === "login"
            ? selectedRole === "ADMIN"
              ? "Salon Admin Command Center"
              : selectedRole === "BARBER"
              ? "Barber Dashboard Login"
              : "A little time for you."
            : "Let’s get acquainted."}
        </h1>
        <p className="muted">
          {mode === "login"
            ? selectedRole === "ADMIN"
              ? "Sign in to monitor all salon barbers, chair stations, and overall revenue."
              : selectedRole === "BARBER"
              ? "Sign in to manage your appointments, availability, and daily earnings."
              : "Sign in to manage your beauty appointments."
            : "Choose how you want to join Quick Groom."}
        </p>

        {/* Role Selector: Customer vs Barber vs Admin */}
        <div className="role-picker" aria-label="Choose account type" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <button
            type="button"
            className={selectedRole === "CUSTOMER" ? "role-option active" : "role-option"}
            onClick={() => {
              setSelectedRole("CUSTOMER");
              setError("");
            }}
          >
            <span className="role-title">
              <User size={15} /> Customer
            </span>
            <small>{mode === "login" ? "Book & view" : "Book"}</small>
          </button>
          <button
            type="button"
            className={selectedRole === "BARBER" ? "role-option active" : "role-option"}
            onClick={() => {
              setSelectedRole("BARBER");
              setError("");
            }}
          >
            <span className="role-title">
              <Scissors size={15} /> Barber
            </span>
            <small>{mode === "login" ? "My Station" : "Stylist"}</small>
          </button>
          <button
            type="button"
            className={selectedRole === "ADMIN" ? "role-option active" : "role-option"}
            onClick={() => {
              setSelectedRole("ADMIN");
              setError("");
            }}
          >
            <span className="role-title">
              <ShieldCheck size={15} /> Admin
            </span>
            <small>{mode === "login" ? "All Barbers" : "Admin"}</small>
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="demo-credentials-bar">
          <span className="demo-credentials-label">Quick Sign-in:</span>
          <div className="demo-pills-wrap">
            <button
              type="button"
              className={selectedRole === "ADMIN" ? "demo-pill-btn active" : "demo-pill-btn"}
              onClick={() => fillDemo("ADMIN")}
            >
              👑 Demo Admin
            </button>
            <button
              type="button"
              className={selectedRole === "BARBER" ? "demo-pill-btn active" : "demo-pill-btn"}
              onClick={() => fillDemo("BARBER")}
            >
              💈 Demo Barber
            </button>
            <button
              type="button"
              className={selectedRole === "CUSTOMER" ? "demo-pill-btn active" : "demo-pill-btn"}
              onClick={() => fillDemo("CUSTOMER")}
            >
              👤 Demo Customer
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
          {mode === "register" && (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary full" type="submit">
            {mode === "login"
              ? selectedRole === "ADMIN"
                ? "Enter Admin Command Center"
                : selectedRole === "BARBER"
                ? "Enter Barber Dashboard"
                : "Sign in"
              : "Create account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-footer auth-switch">
          {mode === "login" ? "First time here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <p className="tiny muted" style={{ marginTop: "1rem" }}>
          By continuing, you agree to Quick Groom's Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
