import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminSpaces from './pages/AdminSpaces';
import AdminCustomers from './pages/AdminCustomers';
import AdminParkingLots from './pages/AdminParkingLots';
import AdminPayments from './pages/AdminPayments';
import AdminReports from './pages/AdminReports';
import AdminNotifications from './pages/AdminNotifications';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerBookings from './pages/CustomerBookings';
import CustomerPayments from './pages/CustomerPayments';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Admin CRM Routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="lots" element={<AdminParkingLots />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="spaces" element={<AdminSpaces />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* Customer CRM Routes with CustomerLayout */}
      <Route path="/dashboard" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      {/* Standalone Profile Route */}
      <Route path="/profile" element={<Profile />} />
      {/* Explicit Login Route Redirect */}
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
