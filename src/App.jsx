import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SalonDetailPage from "./pages/SalonDetailPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DashboardPage from "./pages/DashboardPage";
import WishlistPage from "./pages/WishlistPage";

// Admin Portal Imports
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminCustomersPage from "./admin/pages/AdminCustomersPage";
import AdminSalonsPage from "./admin/pages/AdminSalonsPage";
import AdminVerificationPage from "./admin/pages/AdminVerificationPage";
import AdminAppointmentsPage from "./admin/pages/AdminAppointmentsPage";
import AdminServicesPage from "./admin/pages/AdminServicesPage";
import AdminOffersPage from "./admin/pages/AdminOffersPage";
import AdminReviewsPage from "./admin/pages/AdminReviewsPage";
import AdminRevenuePage from "./admin/pages/AdminRevenuePage";
import AdminAnalyticsPage from "./admin/pages/AdminAnalyticsPage";
import AdminPerformancePage from "./admin/pages/AdminPerformancePage";
import AdminNotificationsPage from "./admin/pages/AdminNotificationsPage";
import AdminSettingsPage from "./admin/pages/AdminSettingsPage";

// Professional Salon Management Portal Imports
import ProLayout from "./pro/layouts/ProLayout";
import ProDashboardPage from "./pro/pages/ProDashboardPage";
import ProAppointmentsPage from "./pro/pages/ProAppointmentsPage";
import ProCalendarPage from "./pro/pages/ProCalendarPage";
import ProWorkingHoursPage from "./pro/pages/ProWorkingHoursPage";
import ProBarbersPage from "./pro/pages/ProBarbersPage";
import ProBarberAvailabilityPage from "./pro/pages/ProBarberAvailabilityPage";
import ProServicesPage from "./pro/pages/ProServicesPage";
import ProReviewsPage from "./pro/pages/ProReviewsPage";
import ProSalonProfilePage from "./pro/pages/ProSalonProfilePage";
import ProNotificationsPage from "./pro/pages/ProNotificationsPage";
import ProSettingsPage from "./pro/pages/ProSettingsPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        {/* Customer Web Application (Enclosed with MainLayout Header, Navigation, Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/salon/:id" element={<SalonDetailPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        {/* Professional Salon Management Application (Independent Shell & Navigation) */}
        <Route path="/pro" element={<ProLayout />}>
          <Route index element={<Navigate to="/pro/dashboard" replace />} />
          <Route path="dashboard" element={<ProDashboardPage />} />
          <Route path="appointments" element={<ProAppointmentsPage />} />
          <Route path="calendar" element={<ProCalendarPage />} />
          <Route path="hours" element={<ProWorkingHoursPage />} />
          <Route path="barbers" element={<ProBarbersPage />} />
          <Route path="barber-availability" element={<ProBarberAvailabilityPage />} />
          <Route path="services" element={<ProServicesPage />} />
          <Route path="reviews" element={<ProReviewsPage />} />
          <Route path="salon-profile" element={<ProSalonProfilePage />} />
          <Route path="notifications" element={<ProNotificationsPage />} />
          <Route path="settings" element={<ProSettingsPage />} />
        </Route>

        {/* Admin Portal Authentication (Independent Full-Screen Login) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Management Application (Completely Independent Shell & Navigation) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="salons" element={<AdminSalonsPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="offers" element={<AdminOffersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="performance" element={<AdminPerformancePage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
