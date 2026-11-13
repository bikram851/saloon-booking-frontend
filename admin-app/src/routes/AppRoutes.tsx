import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';

// Core Pages
import { SuperAdminLoginPage } from '../pages/SuperAdminLoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SalonsPage } from '../pages/SalonsPage';
import { AddSalonWizardPage } from '../pages/AddSalonWizardPage';

// Remaining Management Pages
import {
  VerificationPage,
  ProfessionalsPage,
  BarbersPage,
  CustomersPage,
  LiveUsersPage,
  OffersPage,
  AppointmentsPage,
  RevenuePage,
  AnalyticsPage,
  PerformancePage,
  StoragePage,
  NotificationsPage,
  SettingsPage,
  AuditLogsPage
} from '../pages/RemainingPages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<SuperAdminLoginPage />} />

      {/* Protected Super Admin Console */}
      <Route
        element={
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Salon Network */}
        <Route path="/salons" element={<SalonsPage />} />
        <Route path="/salons/new" element={<AddSalonWizardPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/offers" element={<OffersPage />} />

        {/* People & Operations */}
        <Route path="/professionals" element={<ProfessionalsPage />} />
        <Route path="/barbers" element={<BarbersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/live-users" element={<LiveUsersPage />} />

        {/* Executive & Analytics */}
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        {/* Telemetry & Governance */}
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
