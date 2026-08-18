import React from 'react';

const Hero = ({ profile, socialLinks }) => {
    if (!profile) return null;
    
    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                {profile.freelance_status && (
                    <div className="status-badge">
                        <span className="pulse-dot"></span>
                        {profile.freelance_status}
                    </div>
                )}
                
                <h1 className="hero-name">Xin chào, mình là {profile.full_name}</h1>
                <h2 className="hero-title">{profile.job_title}</h2>
                <p className="hero-desc">
                    {profile.short_description || "I love building software systems that solve real-world problems."}
                </p>
                
                <div className="hero-actions">
                    <a href="#projects" className="btn-primary">Dự án Nổi bật</a>
                    {profile.cv_url && (
                        <a 
                            href={`http://localhost:5000/uploads/profile/${profile.cv_url}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-outline"
                        >
                            Xem CV 
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}>
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </a>
                    )}
                    <a href="#contact" className="btn-outline">Liên hệ</a>
                </div>

                <div className="social-links">
                    {(socialLinks || []).map((social, index) => (
                        <a 
                            key={index} 
                            href={social.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="social-icon"
                            title={social.platform}
                        >
                            <i className={social.icon || 'fas fa-link'} style={{ fontSize: '1.2rem' }}></i>
                        </a>
                    ))}
                </div>
            </div>

            <div className="hero-image-wrapper">
                <div className="hero-bg-gradient"></div>
                <div className="hero-avatar-container">
                    <img 
                        src={profile.avatar_url ? `http://localhost:5000/uploads/profile/${profile.avatar_url}` : '/default-avatar.png'} 
                        alt={profile.full_name} 
                        className="hero-avatar" 
                    />
                    <div className="floating-tag">
                        <span>✨</span>
                        <span>{profile.job_title?.split('/')[0] || 'Developer'}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
