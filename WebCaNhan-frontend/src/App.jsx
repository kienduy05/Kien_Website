import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Client/Home';
import Login from './pages/Admin/Login';
import ProfileEdit from './pages/Admin/ProfileEdit';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            {/* Add more client routes here like /blog, /portfolio */}
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirect /admin to /admin/profile for now as dashboard */}
            <Route index element={<Navigate to="/admin/profile" replace />} />
            <Route path="profile" element={<ProfileEdit />} />
            {/* Add more admin modules here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
