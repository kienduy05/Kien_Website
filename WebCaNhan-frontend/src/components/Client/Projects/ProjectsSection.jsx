import React from 'react';

const ProjectsSection = ({ projects }) => {
    // Show only published and featured projects
    const featuredProjects = (projects || []).filter(p => p.is_published && p.is_featured);

    if (featuredProjects.length === 0) return null;

    return (
        <section id="projects" className="portfolio-section">
            <h2 className="section-title">Dự án <span>Nổi bật</span></h2>
            <div className="projects-grid">
                {featuredProjects.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-img-wrapper">
                            <span className="project-type-badge">
                                {project.type === 'university' ? '🎓 UNIVERSITY' : '🚀 REAL PROJECT'}
                            </span>
                            <img 
                                src={project.thumbnail_url ? `http://localhost:5000/uploads/projects/${project.thumbnail_url}` : '/placeholder-image.jpg'} 
                                alt={project.name} 
                                className="project-img" 
                            />
                        </div>
                        <div className="project-info">
                            <h3 className="project-title">{project.name}</h3>
                            <p className="project-desc">{project.short_description || "Chưa có mô tả."}</p>
                            
                            <div className="project-tech">
                                {(project.project_technologies || []).map((tech, i) => (
                                    <span key={i} className="tech-chip">{tech.name}</span>
                                ))}
                            </div>
                            
                            <div className="project-actions">
                                {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noreferrer" className="project-btn">
                                        Mã nguồn
                                    </a>
                                )}
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noreferrer" className="project-btn">
                                        Xem Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <a href="/projects" className="btn-outline">Xem tất cả dự án ↗</a>
            </div>
        </section>
    );
};

export default ProjectsSection;
