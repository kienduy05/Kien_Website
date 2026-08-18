import React from 'react';

const TechStackSection = ({ technologies }) => {
    const activeTechs = (technologies || []).filter(tech => tech.is_active);

    if (activeTechs.length === 0) return null;

    // Group technologies by category
    const categories = activeTechs.reduce((acc, tech) => {
        const cat = tech.category || 'Khác';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tech);
        return acc;
    }, {});

    return (
        <section id="skills" className="portfolio-section" style={{ background: 'var(--bg-main)' }}>
            <div className="home-container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Công nghệ <span>Sử dụng</span></h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Hệ sinh thái công cụ và ngôn ngữ mình sử dụng để xây dựng các sản phẩm phần mềm chất lượng.
                    </p>
                </div>

                <div className="tech-category-grid">
                    {Object.keys(categories).map((category, idx) => (
                        <div key={idx} className="tech-category-card">
                            <h3 className="tech-category-title">{category}</h3>
                            <div className="tech-chips-container">
                                {categories[category].map((tech, i) => (
                                    <div key={i} className="tech-chip-modern">
                                        {tech.icon_url ? (
                                            <img 
                                                src={`http://localhost:5000/uploads/technologies/${tech.icon_url}`} 
                                                alt={tech.name} 
                                                className="tech-chip-icon" 
                                            />
                                        ) : (
                                            <span className="tech-chip-dot"></span>
                                        )}
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStackSection;
