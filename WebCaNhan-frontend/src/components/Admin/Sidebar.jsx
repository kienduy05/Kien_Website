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
                                <span className="nav-text">Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/education" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">🎓</span>
                                <span className="nav-text">Education</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/experiences" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">💼</span>
                                <span className="nav-text">Experiences</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/skills" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">⚡</span>
                                <span className="nav-text">Skills</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/technologies" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">🛠️</span>
                                <span className="nav-text">Technologies</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/projects" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">🚀</span>
                                <span className="nav-text">Projects</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/posts" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">📝</span>
                                <span className="nav-text">Posts</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/labs" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">🧪</span>
                                <span className="nav-text">Labs</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/social-links" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">🔗</span>
                                <span className="nav-text">Social Links</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/contacts" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="nav-icon">✉️</span>
                                <span className="nav-text">Contacts</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
