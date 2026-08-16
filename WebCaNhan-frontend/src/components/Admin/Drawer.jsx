import React, { useEffect } from 'react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, title, children }) => {
    
    // Ngăn chặn cuộn trang phía sau khi mở Drawer
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>{title}</h3>
                    <button className="drawer-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="drawer-content">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Drawer;
