import React from 'react';

const TimelineLabsSection = ({ experiences, labs }) => {
    // Sort descending by start_date
    const recentExp = (experiences || [])
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        .slice(0, 3); // Get top 3

    const recentLabs = (labs || []).slice(0, 2);

    if (recentExp.length === 0 && recentLabs.length === 0) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Present';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="portfolio-section">
            <h2 className="section-title">Hành trình & <span>Nghiên cứu</span></h2>
            
            <div className="timeline-labs-grid">
                {/* Column 1: Timeline */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Kinh nghiệm làm việc</h3>
                    <div className="timeline-list">
                        {recentExp.map((item, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-date">
                                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                                </div>
                                <h4 className="timeline-title">{item.position}</h4>
                                <div className="timeline-subtitle">{item.company_name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Labs */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Nghiên cứu & Thử nghiệm</h3>
                    <div className="labs-list">
                        {recentLabs.map((lab, index) => (
                            <div key={index} className="lab-card">
                                <div className="lab-icon">
                                    {lab.icon_url ? (
                                        <img src={`http://localhost:5000/uploads/labs/${lab.icon_url}`} alt={lab.name} style={{width: '32px', height: '32px'}} />
                                    ) : (
                                        "🔬"
                                    )}
                                </div>
                                <div className="lab-info">
                                    <h4>{lab.name}</h4>
                                    <p>{lab.short_description || "Khám phá công nghệ và ý tưởng mới."}</p>
                                    {lab.demo_url && (
                                        <a href={lab.demo_url} target="_blank" rel="noreferrer" style={{color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '500'}}>
                                            Xem Demo ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TimelineLabsSection;
