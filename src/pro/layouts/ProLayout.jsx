import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  UserCheck,
  Scissors,
  Star,
  Store,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { getProSalon, saveProSalon, getProAppointments } from '../proData';
import '../pro.css';

export default function ProLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salon, setSalon] = useState(getProSalon());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load authenticated professional user or initialize demo pro session
  useEffect(() => {
    try {
      const storedPro = localStorage.getItem('gg_pro_user');
      const generalUser = localStorage.getItem('gg_user');
      if (storedPro) {
        setUser(JSON.parse(storedPro));
      } else if (generalUser) {
        const u = JSON.parse(generalUser);
        if (u.role === 'PROFESSIONAL' || u.role === 'BARBER') {
          setUser(u);
        } else if (u.role === 'CUSTOMER') {
          // SEC-001: Access Barber Portal using customer role is blocked
          navigate('/login', {
            state: { authMessage: 'Access denied. Salon professional account required.' },
            replace: true
          });
          return;
        } else {
          // demo pro
          const demoPro = {
            id: 'pro_1',
            name: 'Alex Rivera',
            email: 'pro@glowgrace.com',
            role: 'PROFESSIONAL',
            salonId: 1,
            salonName: 'Glow & Grace Luxury Lounge Whitefield'
          };
          localStorage.setItem('gg_pro_user', JSON.stringify(demoPro));
          setUser(demoPro);
        }
      } else {
        const demoPro = {
          id: 'pro_1',
          name: 'Alex Rivera',
          email: 'pro@glowgrace.com',
          role: 'PROFESSIONAL',
          salonId: 1,
          salonName: 'Glow & Grace Luxury Lounge Whitefield'
        };
        localStorage.setItem('gg_pro_user', JSON.stringify(demoPro));
        setUser(demoPro);
      }
    } catch {
      setUser({ name: 'Alex Rivera', role: 'PROFESSIONAL', salonName: 'Whitefield Lounge' });
    }
  }, []);

  // Close sidebar on mobile route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleToggleOperatingStatus = () => {
    const nextStatus = salon.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const updated = { ...salon, status: nextStatus };
    setSalon(updated);
    saveProSalon(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('gg_pro_user');
    const u = localStorage.getItem('gg_user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        if (parsed.role === 'PROFESSIONAL' || parsed.role === 'BARBER') {
          localStorage.removeItem('gg_user');
          localStorage.removeItem('gg_token');
          window.dispatchEvent(new Event('gg-auth-changed'));
        }
      } catch {}
    }
    navigate('/login');
  };

  // Calculate pending appointment count for badge
  const pendingCount = getProAppointments().filter(a => a.status === 'PENDING').length;

  const navItems = [
    { section: 'Operations' },
    { to: '/pro/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/pro/appointments', label: 'Appointments', icon: CalendarCheck, badge: pendingCount > 0 ? pendingCount : null },
    { to: '/pro/calendar', label: 'Schedule Calendar', icon: Calendar },
    { to: '/pro/hours', label: 'Working Hours', icon: Clock },
    { section: 'Staff & Services' },
    { to: '/pro/barbers', label: 'Barber Team', icon: Users },
    { to: '/pro/barber-availability', label: 'Barber Availability', icon: UserCheck },
    { to: '/pro/services', label: 'Services Catalog', icon: Scissors },
    { to: '/pro/reviews', label: 'Client Reviews', icon: Star },
    { section: 'Salon & Account' },
    { to: '/pro/salon-profile', label: 'Salon Profile', icon: Store },
    { to: '/pro/notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { to: '/pro/settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="pro-app-root">
      <div className="pro-layout">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div className="pro-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`pro-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="pro-sidebar-brand">
            <div className="pro-brand-logo-icon">
              <Scissors size={20} />
            </div>
            <div>
              <h2 className="pro-brand-title">Glow & Grace</h2>
              <span className="pro-brand-badge">PROFESSIONAL PORTAL</span>
            </div>
          </div>

          <div className="pro-sidebar-salon-pill">
            <div className="pro-sidebar-salon-name" title={salon.name}>
              {salon.name}
            </div>
            <div className="pro-sidebar-salon-status">
              <span className={`pro-status-dot ${salon.status === 'OPEN' ? '' : 'closed'}`} />
              <span>{salon.status === 'OPEN' ? 'Accepting Online Bookings' : 'Temporarily Closed'}</span>
            </div>
          </div>

          <nav className="pro-sidebar-nav">
            {navItems.map((item, idx) => {
              if (item.section) {
                return (
                  <div key={idx} className="pro-nav-section-title">
                    {item.section}
                  </div>
                );
              }
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `pro-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="pro-nav-item-content">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="pro-nav-pill-count">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="pro-sidebar-footer">
            <div className="pro-user-info">
              <div className="pro-user-avatar">
                {user?.name ? user.name.charAt(0) : 'P'}
              </div>
              <div className="pro-user-text">
                <div className="pro-user-name">{user?.name || 'Alex Rivera'}</div>
                <div className="pro-user-role">Salon Partner & Stylist</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="pro-btn pro-btn-secondary pro-btn-sm"
              title="Sign out of Professional Portal"
              style={{ padding: '6px', border: 'none', background: 'transparent', color: '#A0AEC0' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="pro-main-wrapper">
          <header className="pro-header">
            <div className="pro-header-left">
              <button
                className="pro-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle navigation menu"
              >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <div
                className={`pro-header-status-pill ${salon.status === 'OPEN' ? '' : 'closed'}`}
                style={{ cursor: 'pointer' }}
                onClick={handleToggleOperatingStatus}
                title="Click to toggle salon open / closed status"
              >
                <span className={`pro-status-dot ${salon.status === 'OPEN' ? '' : 'closed'}`} />
                <span className="pro-status-label-desktop">Salon Status: </span>
                <strong className="pro-status-label-val">
                  <span className="hide-mobile">{salon.status === 'OPEN' ? 'OPEN TODAY' : 'CLOSED'}</span>
                  <span className="show-mobile-only">{salon.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</span>
                </strong>
                <span className="pro-status-change-link">Change</span>
              </div>
            </div>

            <div className="pro-header-right">
              <a
                href={`/salon/${salon.id}`}
                target="_blank"
                rel="noreferrer"
                className="pro-header-btn hide-mobile"
                title="Preview public salon page as customers see it"
              >
                <span>View Public Page</span>
                <ExternalLink size={14} />
              </a>

              <NavLink to="/pro/appointments" className="pro-header-btn primary" title="Manage Bookings">
                <CalendarCheck size={16} />
                <span className="pro-btn-text-desktop">Manage Bookings</span>
                <span className="pro-btn-text-mobile">Bookings</span>
                {pendingCount > 0 && <span className="pro-nav-pill-count">{pendingCount}</span>}
              </NavLink>
            </div>
          </header>

          <main className="pro-content">
            <Outlet context={{ salon, setSalon }} />
          </main>
        </div>
      </div>
    </div>
  );
}
