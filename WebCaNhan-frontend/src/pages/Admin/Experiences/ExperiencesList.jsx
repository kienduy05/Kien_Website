import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import Drawer from '../../../components/Admin/Drawer';
import ExperiencesForm from './ExperiencesForm';
import '../../../components/Admin/TimelineCard.css';

const ExperiencesList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/experiences');
            if (response.data.metadata) {
                // Sort by display_order desc, then start_date desc
                const sortedData = response.data.metadata.sort((a, b) => {
                    if (a.display_order !== b.display_order) {
                        return b.display_order - a.display_order;
                    }
                    return new Date(b.start_date) - new Date(a.start_date);
                });
                setData(sortedData);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải danh sách kinh nghiệm");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const isConfirmed = await alertService.confirm('Xóa kinh nghiệm', `Bạn có chắc chắn muốn xóa kinh nghiệm tại "${name}" không?`);
        if (isConfirmed) {
            try {
                await api.delete(`/experiences/${id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const openDrawer = (id = 'new') => {
        setSelectedId(id);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedId(null);
    };

    const handleSaved = () => {
        closeDrawer();
        fetchData();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const calculateDuration = (startDateStr, endDateStr, isCurrent) => {
        if (!startDateStr) return '';
        const start = new Date(startDateStr);
        const end = isCurrent || (!endDateStr) ? new Date() : new Date(endDateStr);
        
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();
        
        if (end.getDate() < start.getDate()) {
            months--;
        }
        
        if (months <= 0) return 'Dưới 1 tháng';
        
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let result = [];
        if (years > 0) result.push(`${years} năm`);
        if (remainingMonths > 0) result.push(`${remainingMonths} tháng`);
        
        return result.join(' ');
    };

    const filteredData = data.filter(item => 
        item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Kinh nghiệm</h2>
                    <p>Quản lý hành trình sự nghiệp và các vị trí đã/đang công tác</p>
                </div>
            </div>

            <div className="top-actions-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Tìm theo công ty hoặc vị trí..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => openDrawer('new')}>
                    + Thêm kinh nghiệm mới
                </button>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Đang tải dữ liệu...</div>
            ) : filteredData.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💼</div>
                    <h3>Chưa có kinh nghiệm nào</h3>
                    <p>Hãy thêm lịch sử làm việc của bạn để làm phong phú hồ sơ.</p>
                    <button className="btn-primary" onClick={() => openDrawer('new')} style={{ marginTop: '1rem' }}>
                        + Thêm kinh nghiệm đầu tiên
                    </button>
                </div>
            ) : (
                <div className="timeline-container">
                    {filteredData.map((item, index) => (
                        <div className="timeline-item" key={item.id}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-card">
                                    <div className="timeline-card-header">
                                        <div className="timeline-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                                🏢
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{item.company_name}</h3>
                                                <p className="timeline-major" style={{ margin: '4px 0 0 0', fontWeight: '500', color: '#3b82f6' }}>{item.position}</p>
                                            </div>
                                        </div>
                                        {item.is_current ? (
                                            <span className="badge badge-success" style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
                                                🟢 Hiện tại
                                            </span>
                                        ) : (
                                            <span className="badge badge-neutral" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                ⚪ Đã kết thúc
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="timeline-meta" style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                        <span className="meta-item">
                                            <span className="icon">🕒</span> 
                                            {formatDate(item.start_date)} - {item.is_current ? 'Hiện tại' : formatDate(item.end_date)}
                                            <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                                                ({calculateDuration(item.start_date, item.end_date, item.is_current)})
                                            </span>
                                        </span>
                                        {item.location && (
                                            <span className="meta-item">
                                                <span className="icon">📍</span> {item.location}
                                            </span>
                                        )}
                                    </div>

                                    {item.description && (
                                        <div className="timeline-description quill-content-readonly" 
                                             style={{ marginTop: '16px', color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}
                                             dangerouslySetInnerHTML={{ __html: item.description }}>
                                        </div>
                                    )}

                                    <div className="timeline-actions">
                                        <button className="btn-icon" onClick={() => openDrawer(item.id)} title="Chỉnh sửa">
                                            ✏️
                                        </button>
                                        <button className="btn-icon text-danger" onClick={() => handleDelete(item.id, item.company_name)} title="Xóa">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={closeDrawer} 
                title={selectedId === 'new' ? 'Thêm Kinh nghiệm mới' : 'Chỉnh sửa Kinh nghiệm'}
            >
                {isDrawerOpen && (
                    <ExperiencesForm 
                        experienceId={selectedId} 
                        onSaved={handleSaved} 
                        onCancel={closeDrawer} 
                    />
                )}
            </Drawer>
        </div>
    );
};

export default ExperiencesList;
