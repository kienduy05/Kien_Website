import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import './Project.css';

const ProjectList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [filterTab, setFilterTab] = useState('all'); // all, featured, REAL_PROJECT, UNIVERSITY, PERSONAL
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/projects');
            if (response.data.metadata) {
                // Sort by display_order desc, then updated_at
                const sorted = response.data.metadata.sort((a, b) => {
                    if (a.display_order !== b.display_order) return b.display_order - a.display_order;
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });
                setData(sorted);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải danh sách dự án");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const isConfirmed = await alertService.confirm('Xóa dự án', `Bạn có chắc chắn muốn xóa dự án "${name}" không?`);
        if (isConfirmed) {
            try {
                await api.delete(`/projects/${id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus = item.is_published ? 0 : 1;
            
            // Optimistic UI update
            setData(prev => prev.map(p => p.id === item.id ? { ...p, is_published: newStatus } : p));
            
            const submitData = new FormData();
            Object.keys(item).forEach(key => {
                const ignoredKeys = ['is_published', 'thumbnail_url', 'created_at', 'updated_at', 'project_technologies', 'project_images'];
                if (!ignoredKeys.includes(key)) {
                    if (key === 'technologies' && Array.isArray(item[key])) {
                        submitData.append(key, JSON.stringify(item[key]));
                    } else if (item[key] !== null) {
                        submitData.append(key, item[key]);
                    }
                }
            });
            submitData.append('is_published', newStatus);

            await api.put(`/projects/${item.id}`, submitData);
        } catch (error) {
            alertService.error('Đổi trạng thái thất bại!');
            fetchData();
        }
    };

    // Filters
    const filteredData = data.filter(item => {
        // Tab Filter
        if (filterTab === 'featured' && !item.is_featured) return false;
        if (filterTab === 'REAL_PROJECT' && item.project_type !== 'REAL_PROJECT') return false;
        if (filterTab === 'UNIVERSITY' && item.project_type !== 'UNIVERSITY') return false;
        if (filterTab === 'PERSONAL' && item.project_type !== 'PERSONAL') return false;

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchName = item.name?.toLowerCase().includes(q);
            const matchRole = item.role?.toLowerCase().includes(q);
            // Search in technologies if it's an array or string
            let matchTech = false;
            if (Array.isArray(item.technologies)) {
                matchTech = item.technologies.some(t => t.toLowerCase().includes(q));
            } else if (typeof item.technologies === 'string') {
                matchTech = item.technologies.toLowerCase().includes(q);
            }
            return matchName || matchRole || matchTech;
        }

        return true;
    });

    const getProjectTypeLabel = (type) => {
        switch(type) {
            case 'REAL_PROJECT': return { label: 'Doanh nghiệp', class: 'real' };
            case 'UNIVERSITY': return { label: 'Đại học', class: 'uni' };
            case 'PERSONAL': return { label: 'Cá nhân', class: 'personal' };
            default: return { label: 'Khác', class: 'uni' };
        }
    };

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Dự án (Projects Portfolio)</h2>
                    <p>Trưng bày các sản phẩm, dự án đã thực hiện</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/projects/new')}>
                    + Thêm Dự án mới
                </button>
            </div>

            <div className="project-dashboard">
                {/* Stats & Filters Row */}
                <div className="project-stats-row">
                    <div className={`stat-card ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>
                        <div className="stat-icon all">📁</div>
                        <div className="stat-info">
                            <h4>Tất cả dự án</h4>
                            <p>{data.length}</p>
                        </div>
                    </div>
                    <div className={`stat-card ${filterTab === 'featured' ? 'active' : ''}`} onClick={() => setFilterTab('featured')}>
                        <div className="stat-icon featured">⭐</div>
                        <div className="stat-info">
                            <h4>Nổi bật</h4>
                            <p>{data.filter(i => i.is_featured).length}</p>
                        </div>
                    </div>
                    <div className={`stat-card ${filterTab === 'REAL_PROJECT' ? 'active' : ''}`} onClick={() => setFilterTab('REAL_PROJECT')}>
                        <div className="stat-icon real">🏢</div>
                        <div className="stat-info">
                            <h4>Doanh nghiệp</h4>
                            <p>{data.filter(i => i.project_type === 'REAL_PROJECT').length}</p>
                        </div>
                    </div>
                    <div className={`stat-card ${filterTab === 'UNIVERSITY' ? 'active' : ''}`} onClick={() => setFilterTab('UNIVERSITY')}>
                        <div className="stat-icon uni">🎓</div>
                        <div className="stat-info">
                            <h4>Đại học</h4>
                            <p>{data.filter(i => i.project_type === 'UNIVERSITY').length}</p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="project-toolbar">
                    <div className="project-search">
                        <span className="icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm dự án, công nghệ, vai trò..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Container */}
                {isLoading ? (
                    <div className="loading-spinner">Đang tải danh sách dự án...</div>
                ) : filteredData.length === 0 ? (
                    <div className="empty-state" style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div className="empty-icon" style={{ fontSize: '3rem' }}>🚀</div>
                        <h3>Chưa có dự án nào</h3>
                        <p style={{ color: '#64748b' }}>Hãy thêm dự án đầu tiên để làm phong phú Portfolio của bạn.</p>
                        <button className="btn-primary" onClick={() => navigate('/admin/projects/new')} style={{ marginTop: '16px' }}>
                            + Thêm Dự án
                        </button>
                    </div>
                ) : (
                    <div className="project-grid-container">
                        {filteredData.map(item => {
                            const typeInfo = getProjectTypeLabel(item.project_type);
                            // Parse technologies from project_technologies
                            const techs = (item.project_technologies || []).map(t => t.name);

                            return (
                                <div className="project-card" key={item.id} style={{ opacity: item.is_published ? 1 : 0.6 }}>
                                    <div className="project-card-thumb" onClick={() => navigate(`/admin/projects/${item.id}`)} style={{ cursor: 'pointer' }}>
                                        {item.thumbnail_url ? (
                                            <img src={`http://localhost:5000/uploads/projects/${item.thumbnail_url}`} alt={item.name} />
                                        ) : (
                                            <div style={{ color: '#94a3b8', fontSize: '2rem' }}>🖼️</div>
                                        )}
                                        
                                        {item.is_featured ? (
                                            <div className="featured-badge">⭐ Nổi bật</div>
                                        ) : null}

                                        <div className="project-links-overlay">
                                            {item.github_url && (
                                                <a href={item.github_url} target="_blank" rel="noreferrer" className="overlay-btn" onClick={(e) => e.stopPropagation()} title="Source Code">
                                                    <i className="fab fa-github"></i>
                                                </a>
                                            )}
                                            {item.demo_url && (
                                                <a href={item.demo_url} target="_blank" rel="noreferrer" className="overlay-btn" onClick={(e) => e.stopPropagation()} title="Live Demo">
                                                    <i className="fas fa-external-link-alt"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="project-card-body">
                                        <div className="project-card-header">
                                            <h3 className="project-card-title" onClick={() => navigate(`/admin/projects/${item.id}`)}>
                                                {item.name}
                                            </h3>
                                            <span className={`project-type-badge ${typeInfo.class}`}>
                                                {typeInfo.label}
                                            </span>
                                        </div>
                                        
                                        <div className="project-card-role">
                                            Vai trò: <strong>{item.role || 'Không xác định'}</strong>
                                        </div>

                                        <div className="project-card-tech">
                                            {techs.slice(0, 4).map((tech, idx) => (
                                                <span key={idx} className="tech-chip">{tech}</span>
                                            ))}
                                            {techs.length > 4 && <span className="tech-chip">+{techs.length - 4}</span>}
                                        </div>

                                        <div className="project-card-footer">
                                            <label className="project-status-toggle">
                                                <div className="toggle-switch">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={item.is_published} 
                                                        onChange={() => handleToggleStatus(item)} 
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </div>
                                                {item.is_published ? 'Hiển thị' : 'Đang ẩn'}
                                            </label>
                                            
                                            <div className="project-actions">
                                                <button className="btn-icon" onClick={() => navigate(`/admin/projects/${item.id}`)} title="Chỉnh sửa">✏️</button>
                                                <button className="btn-icon text-danger" onClick={() => handleDelete(item.id, item.name)} title="Xóa">🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
