import React, { useState } from 'react';
import api from '../../../utils/api';

const ContactSection = ({ profile }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    if (!profile) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact_messages', formData);
            setStatus({ type: 'success', msg: 'Message sent successfully! I will get back to you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyEmail = () => {
        if (profile.email) {
            navigator.clipboard.writeText(profile.email);
            alert('Đã sao chép email!');
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="home-container">
                <h2 className="section-title">Kết nối với <span>Mình</span></h2>
                <div className="contact-grid">
                    {/* Left: Info */}
                    <div className="contact-text">
                        <h3 className="contact-subtitle">Thông tin Liên hệ</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                            Mình luôn sẵn sàng đón nhận các cơ hội mới, dự án thú vị và những cuộc trò chuyện sáng tạo.
                        </p>
                        
                        {profile.email && (
                            <div className="contact-info-box">
                                <div className="contact-info-icon">📧</div>
                                <div className="contact-info-details">
                                    <h4>Email</h4>
                                    <p>{profile.email}</p>
                                </div>
                                <button className="btn-outline" onClick={handleCopyEmail} style={{padding: '8px 12px', marginLeft: 'auto', fontSize: '0.8rem'}}>
                                    Sao chép
                                </button>
                            </div>
                        )}

                        {profile.location && (
                            <div className="contact-info-box">
                                <div className="contact-info-icon">📍</div>
                                <div className="contact-info-details">
                                    <h4>Địa điểm</h4>
                                    <p>{profile.location}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Form */}
                    <div className="contact-form">
                        <h3 className="contact-subtitle">Gửi lời nhắn</h3>
                        {status.msg && (
                            <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', background: status.type === 'success' ? '#dcfce7' : '#fee2e2', color: status.type === 'success' ? '#166534' : '#991b1b', fontWeight: '500' }}>
                                {status.msg}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên của bạn</label>
                                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Email liên hệ</label>
                                <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Nội dung tin nhắn</label>
                                <textarea name="message" placeholder="Xin chào, mình muốn trao đổi về..." value={formData.message} onChange={handleChange} className="form-control" rows="4" required></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
