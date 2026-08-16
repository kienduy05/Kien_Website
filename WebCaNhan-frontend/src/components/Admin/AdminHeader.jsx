import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <header className="admin-header">
            <div className="header-search">
                <span className="search-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input type="text" placeholder="Tìm kiếm nhanh..." className="search-input" />
            </div>

            <div className="header-actions">
                <button className="icon-btn" title="Thông báo">
                    <span className="icon">🔔</span>
                    <span className="header-badge">3</span>
                </button>
                <button className="icon-btn" title="Hộp thư">
                    <span className="icon">✉️</span>
                </button>

                <div className="user-profile">
                    <div className="avatar-wrapper" onClick={toggleProfileMenu}>
                        <img 
                            src={user?.avatar_url ? `http://localhost:5000/uploads/profile/${user.avatar_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'Admin')}&background=e0e7ff&color=4f46e5`} 
                            alt="Admin Avatar" 
                            className="header-avatar" 
                        />
                        <span className="user-name">{user?.full_name || 'Admin'}</span>
                        <span className="dropdown-icon">▼</span>
                    </div>

                    {isProfileMenuOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <p className="dropdown-name">{user?.full_name || 'Admin'}</p>
                                <p className="dropdown-email">{user?.email || 'admin@example.com'}</p>
                            </div>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item">⚙️ Cài đặt</button>
                                </li>
                                <li>
                                    <button className="dropdown-item logout" onClick={logout}>🚪 Đăng xuất</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
