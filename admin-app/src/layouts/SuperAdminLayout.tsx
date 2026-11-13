import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  Scissors,
  Users,
  Radio,
  Tag,
  CalendarCheck,
  DollarSign,
  BarChart3,
  Activity,
  HardDrive,
  Bell,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/superAdmin.css';

export const SuperAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { section: 'Executive Overview' },
    { to: '/dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: '12. Platform Analytics', icon: BarChart3 },
    { to: '/revenue', label: '11. Revenue & GMV', icon: DollarSign },

    { section: 'Salon Network' },
    { to: '/salons', label: '2. Salon Management', icon: Store },
    { to: '/salons/new', label: '3. Add New Salon', icon: PlusCircle, badge: 'Wizard' },
    { to: '/verification', label: '4. Salon Verification', icon: ShieldCheck, badge: '1 New' },
    { to: '/appointments', label: '10. Master Appointments', icon: CalendarCheck },
    { to: '/offers', label: '9. Offers & Promos', icon: Tag },

    { section: 'People & Operations' },
    { to: '/professionals', label: '5. Professional Accounts', icon: UserCheck },
    { to: '/barbers', label: '6. Barber Team', icon: Scissors },
    { to: '/customers', label: '7. Customer Base', icon: Users },
    { to: '/live-users', label: '8. Live Users', icon: Radio, badge: '4 Active' },

    { section: 'Health & Telemetry' },
    { to: '/performance', label: '13. Application Performance', icon: Activity },
    { to: '/storage', label: '14. Memory & Storage', icon: HardDrive },
    { to: '/notifications', label: '15. System Notifications', icon: Bell },

    { section: 'Governance' },
    { to: '/settings', label: '16. Admin Settings', icon: Settings },
    { to: '/audit-logs', label: '17. Audit Logs', icon: FileText }
  ];

  return (
    <div className="sa-app">
      {sidebarOpen && (
        <div className="sa-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sa-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sa-sidebar-brand">
          <div className="sa-brand-icon">
            <Store size={22} />
          </div>
          <div className="sa-brand-text">
            <div className="sa-brand-title">Glow & Grace</div>
            <span className="sa-brand-badge">SUPER ADMIN PORTAL</span>
          </div>
        </div>

        <nav className="sa-sidebar-nav">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx} className="sa-nav-section-title">
                  {item.section}
                </div>
              );
            }
            const Icon = item.icon as any;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="sa-nav-item-inner">
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="sa-badge-pill">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sa-sidebar-footer">
          <div className="sa-admin-pill">
            <div className="sa-admin-avatar">
              {userProfile?.displayName?.charAt(0) || 'V'}
            </div>
            <div className="sa-admin-details">
              <div className="sa-admin-name">{userProfile?.displayName || 'Vikramaditya Rao'}</div>
              <div className="sa-admin-role">Super Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sa-btn"
            style={{ padding: '6px', background: 'transparent', color: '#94A3B8' }}
            title="Sign out of Super Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="sa-main-area">
        <header className="sa-header">
          <div className="sa-header-left">
            <button
              className="sa-mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="sa-system-health-pill">
              <span className="sa-live-pulse-dot" />
              <span>Firebase Cloud: Active (99.98% Uptime)</span>
            </div>
          </div>

          <div className="sa-header-right">
            <NavLink to="/salons/new" className="sa-btn sa-btn-primary">
              <PlusCircle size={16} />
              <span>Onboard Salon</span>
            </NavLink>
          </div>
        </header>

        <main className="sa-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
