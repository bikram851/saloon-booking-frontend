import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SalonDetailPage from "./pages/SalonDetailPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DashboardPage from "./pages/DashboardPage";
import WishlistPage from "./pages/WishlistPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/salon/:id" element={<SalonDetailPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
