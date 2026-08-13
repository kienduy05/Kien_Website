import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">P</div>
                <h2 className="brand-name">Portfolio Admin</h2>
            </div>
            
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <p className="nav-section-title">CHÍNH</p>
                    <ul>
                        <li>
                            <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">📊</span>
                                <span className="nav-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/profile" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">👤</span>
                                <span className="nav-text">profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>


            </nav>
        </aside>
    );
};

export default Sidebar;
