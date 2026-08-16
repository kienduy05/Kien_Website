import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import Drawer from '../../../components/Admin/Drawer';
import EducationForm from './EducationForm';
import '../../../components/Admin/TimelineCard.css';

const EducationList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/education');
            if (response.data.metadata) {
                setData(response.data.metadata);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                await api.delete(`/education/${id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const openDrawer = (id = null) => {
        setEditingId(id);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setEditingId(null), 300); // wait for animation
    };

    const handleFormSuccess = () => {
        closeDrawer();
        fetchData();
    };

    const filteredData = data.filter(item => 
        (item.school_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.major?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Học vấn</h2>
                    <p>Danh sách quá trình học tập và bằng cấp</p>
                </div>
            </div>

            <div className="top-actions-bar" style={{ justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={() => openDrawer()}>
                    + Thêm học vấn mới
                </button>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Đang tải dữ liệu...</div>
            ) : filteredData.length > 0 ? (
                <div className="timeline-container">
                    {filteredData.map((item) => (
                        <div className="timeline-item" key={item.id}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-card">
                                <div className="timeline-card-header">
                                    <div className="timeline-title-wrapper">
                                        <h3>{item.school_name}</h3>
                                        <p className="timeline-major">{item.major}</p>
                                    </div>
                                    <span className="badge badge-neutral" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                                        🎓 {item.degree}
                                    </span>
                                </div>
                                
                                <div className="timeline-time">
                                    <span>🗓️</span>
                                    <span>
                                        {item.start_date ? new Date(item.start_date).getFullYear() : ''} 
                                        {' - '} 
                                        {item.end_date ? new Date(item.end_date).getFullYear() : 'Hiện tại'}
                                    </span>
                                </div>

                                {item.description && (
                                    <div 
                                        className="timeline-desc"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    ></div>
                                )}

                                <div className="timeline-actions">
                                    <button className="btn-icon btn-edit" onClick={() => openDrawer(item.id)} title="Sửa">
                                        ✏️
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDelete(item.id)} title="Xóa">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="timeline-item">
                        <div className="dashed-card" onClick={() => openDrawer()}>
                            <div className="dashed-icon">+</div>
                            <div className="dashed-text">Thêm quá trình học tập</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🎓</div>
                    <h3>Chưa có dữ liệu học vấn</h3>
                    <p>Hãy thêm trường học hoặc khóa học đầu tiên của bạn vào hệ thống.</p>
                    <button className="btn-primary" onClick={() => openDrawer()}>
                        + Thêm dữ liệu ngay
                    </button>
                </div>
            )}

            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={closeDrawer} 
                title={editingId ? "Sửa thông tin Học vấn" : "Thêm mới Học vấn"}
            >
                {isDrawerOpen && (
                    <EducationForm 
                        educationId={editingId} 
                        onSuccess={handleFormSuccess} 
                        onCancel={closeDrawer} 
                    />
                )}
            </Drawer>
        </div>
    );
};

export default EducationList;
