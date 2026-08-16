import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import alertService from '../../utils/alert';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;
    if (user) return <Navigate to="/admin" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-decorative-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
            
            <div className="login-box">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-icon">🔐</span>
                    </div>
                    <h2>Đăng nhập Hệ thống</h2>
                    <p>Nhập thông tin xác thực để truy cập bảng điều khiển (Admin Dashboard)</p>
                </div>
                
                {error && <div className="login-error">⚠️ {error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                placeholder="Nhập tên đăng nhập..."
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔑</span>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                placeholder="Nhập mật khẩu..."
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-text">Đang xác thực...</span>
                        ) : (
                            <span className="btn-text">Đăng nhập <span className="btn-arrow">→</span></span>
                        )}
                    </button>
                    
                    <div className="login-footer">
                        <a href="/" className="back-link">← Quay lại Trang chủ</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
