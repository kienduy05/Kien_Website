import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';
import '../components/Admin/AdminComponents.css';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="admin-loading">Đang tải dữ liệu...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout-container">
            <Sidebar />
            <div className="admin-content-wrapper">
                <AdminHeader />
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
