import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  Scissors,
  Tag,
  Star,
  Coins,
  TrendingUp,
  Activity,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import "../admin.css";

const adminNavSections = [
  {
    category: "Operations",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/customers", label: "Customers", icon: Users },
      { path: "/admin/salons", label: "Salons", icon: Store, badge: "4 New" },
      { path: "/admin/appointments", label: "Appointments", icon: Calendar },
    ],
  },
  {
    category: "Management",
    items: [
      { path: "/admin/services", label: "Services Menu", icon: Scissors },
      { path: "/admin/offers", label: "Offers & Promos", icon: Tag },
      { path: "/admin/reviews", label: "Reviews & Ratings", icon: Star },
      { path: "/admin/revenue", label: "Payments & Revenue", icon: Coins },
    ],
  },
  {
    category: "Platform & Health",
    items: [
      { path: "/admin/analytics", label: "Analytics & Trends", icon: TrendingUp },
      { path: "/admin/performance", label: "App Performance", icon: Activity, badge: "99.9%" },
      { path: "/admin/notifications", label: "Notifications", icon: Bell },
      { path: "/admin/settings", label: "Admin Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("gg_admin_user") || "null");
      if (u) return u;
      // Also check general user if role is admin
      const general = JSON.parse(localStorage.getItem("gg_user") || "null");
      if (general && general.role === "ADMIN") return general;
    } catch {}
    return {
      name: "Administrator",
      email: "admin@glowgrace.com",
      role: "SUPER_ADMIN",
    };
  });

  const nav = useNavigate();
  const location = useLocation();

  // Route security check: Ensure admin authentication
  useEffect(() => {
    const token = localStorage.getItem("gg_admin_token") || localStorage.getItem("gg_token");
    const user = JSON.parse(localStorage.getItem("gg_admin_user") || localStorage.getItem("gg_user") || "null");

    if (!token || !user || user.role !== "ADMIN") {
      // If not logged in as admin, redirect to admin login
      if (location.pathname !== "/admin/login") {
        nav("/admin/login");
      }
    }
  }, [location.pathname, nav]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowNotifMenu(false);
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("gg_admin_token");
    localStorage.removeItem("gg_admin_user");
    // If the general user was admin, clear it
    try {
      const cur = JSON.parse(localStorage.getItem("gg_user") || "null");
      if (cur?.role === "ADMIN") {
        localStorage.removeItem("gg_user");
        localStorage.removeItem("gg_token");
        window.dispatchEvent(new Event("gg-auth-changed"));
      }
    } catch {}
    nav("/admin/login");
  }

  return (
    <div className="admin-app-root">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div className="admin-drawer-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Admin Sidebar Navigation */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-brand">
          <Link to="/admin/dashboard" className="admin-brand-link">
            <div className="admin-brand-avatar">
              <ShieldCheck size={20} />
            </div>
            {!collapsed && (
              <div className="admin-brand-text">
                <span className="admin-brand-name">Glow & Grace</span>
                <span className="admin-brand-badge">Admin Enterprise</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-sidebar-nav" aria-label="Admin Navigation">
          {adminNavSections.map((section, idx) => (
            <div key={idx} className="admin-nav-group">
              {!collapsed && <span className="admin-nav-category-label">{section.category}</span>}
              {section.items.map((item) => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname === "/admin");

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-item ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : ""}
                  >
                    <IconComp size={18} className="admin-nav-icon" />
                    {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className={`admin-nav-badge ${item.badge.includes("99") ? "blue" : "orange"}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Quick link to view customer live website */}
          <div style={{ marginTop: "auto", paddingTop: "14px" }}>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="admin-nav-item"
              style={{ color: "#0879E8", background: "#f0f7ff" }}
              title="View Customer Site"
            >
              <ExternalLink size={16} />
              {!collapsed && <span>View Customer Site</span>}
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer: Admin Profile */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {(adminUser?.name || "A").charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="admin-user-details">
                <span className="admin-user-name">{adminUser?.name || "Administrator"}</span>
                <span className="admin-user-role">Super Administrator</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              className="admin-logout-icon-btn"
              onClick={handleLogout}
              title="Sign Out of Admin Portal"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`admin-main-wrap ${collapsed ? "expanded" : ""}`}>
        {/* Sticky Top Header Bar */}
        <header className="admin-top-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>

            {/* Global Search */}
            <div className="admin-search-bar">
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search salons, bookings, users..."
              />
              <span className="admin-search-kbd">⌘K</span>
            </div>
          </div>

          <div className="admin-header-right">
            {/* System Health Badge */}
            <Link to="/admin/performance" className="admin-health-badge" title="View Application Performance">
              <span className="pulse-dot" />
              <span>System Healthy (99.98%)</span>
            </Link>

            {/* Notifications Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="admin-notifications-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="View notifications"
              >
                <Bell size={18} />
                <span className="unread-dot" />
              </button>

              {showNotifMenu && (
                <div className="notifications-dropdown">
                  <div className="notif-header">
                    <strong>Administrative Alerts</strong>
                    <span className="admin-badge warning">3 New</span>
                  </div>

                  <div className="notif-item">
                    <span style={{ fontSize: "16px" }}>💈</span>
                    <div className="notif-text">
                      <strong>New Salon Onboarding Request</strong>
                      <small>Crown & Comb submitted verification documents</small>
                    </div>
                  </div>

                  <div className="notif-item">
                    <span style={{ fontSize: "16px" }}>⚡</span>
                    <div className="notif-text">
                      <strong>Peak Booking Traffic Detected</strong>
                      <small>84 req/s on Whitefield cluster · 42ms avg</small>
                    </div>
                  </div>

                  <div className="notif-item">
                    <span style={{ fontSize: "16px" }}>🏷️</span>
                    <div className="notif-text">
                      <strong>Coupon Limit Reached</strong>
                      <small>Code 'HANDSFEET' reached 150 redemptions</small>
                    </div>
                  </div>

                  <Link
                    to="/admin/notifications"
                    className="admin-btn outline sm"
                    style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="admin-user-avatar" style={{ cursor: "pointer" }} onClick={() => nav("/admin/settings")}>
              {(adminUser?.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Routes */}
        <main className="admin-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
