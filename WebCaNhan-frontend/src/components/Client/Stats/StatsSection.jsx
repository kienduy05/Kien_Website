import React from 'react';

const StatsSection = ({ projectsCount, techCount, experiences }) => {
    
    // Calculate years of experience (from earliest experience to now)
    let yearsOfExp = 0;
    if (experiences && experiences.length > 0) {
        const startDates = experiences.map(exp => new Date(exp.start_date).getTime());
        const earliest = Math.min(...startDates);
        const diffTime = Math.abs(new Date().getTime() - earliest);
        yearsOfExp = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    }

    return (
        <section className="portfolio-section">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3 className="stat-number">{projectsCount || 0}+</h3>
                    <p className="stat-label">Dự án hoàn thành</p>
                </div>
                
                <div className="stat-card">
                    <h3 className="stat-number">{techCount || 0}+</h3>
                    <p className="stat-label">Công nghệ sử dụng</p>
                </div>

                <div className="stat-card">
                    <h3 className="stat-number">{yearsOfExp}+</h3>
                    <p className="stat-label">Năm kinh nghiệm</p>
                </div>
                
                <div className="stat-card">
                    <h3 className="stat-number">100%</h3>
                    <p className="stat-label">Độ tận tâm</p>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
