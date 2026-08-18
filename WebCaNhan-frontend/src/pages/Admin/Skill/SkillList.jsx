import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import Drawer from '../../../components/Admin/Drawer';
import SkillForm from './SkillForm';
import './Skill.css';

const SkillList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Tất cả');
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/skills');
            if (response.data.metadata) {
                // Sort by display_order desc, then name asc
                const sortedData = response.data.metadata.sort((a, b) => {
                    if (a.display_order !== b.display_order) {
                        return b.display_order - a.display_order;
                    }
                    return a.name.localeCompare(b.name);
                });
                setData(sortedData);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải danh sách kỹ năng");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const isConfirmed = await alertService.confirm('Xóa kỹ năng', `Bạn có chắc chắn muốn xóa kỹ năng "${name}" không?`);
        if (isConfirmed) {
            try {
                await api.delete(`/skills/${id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            // Find the item to get full payload, as some controllers require all fields
            // But since we use FormData in form, and our controller merges req.body,
            // we might be able to just pass is_active. Let's pass the whole object updated.
            const item = data.find(s => s.id === id);
            if (!item) return;
            
            const newStatus = currentStatus ? 0 : 1;
            
            // Optimistic update
            setData(prevData => prevData.map(s => s.id === id ? { ...s, is_active: newStatus } : s));

            const submitData = new FormData();
            submitData.append('name', item.name);
            submitData.append('category', item.category);
            submitData.append('level', item.level);
            submitData.append('display_order', item.display_order);
            submitData.append('is_active', newStatus);

            await api.put(`/skills/${id}`, submitData);
        } catch (error) {
            alertService.error('Đổi trạng thái thất bại!');
            fetchData(); // Revert on failure
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

    // Extract unique categories for tabs
    const categories = ['Tất cả', ...new Set(data.map(item => item.category).filter(Boolean))];

    // Filter data
    const filteredData = data.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchTab = activeTab === 'Tất cả' || item.category === activeTab;
        return matchSearch && matchTab;
    });

    const getCategoryClass = (cat) => {
        if (!cat) return 'cat-other';
        const lower = cat.toLowerCase();
        if (lower.includes('front')) return 'cat-frontend';
        if (lower.includes('back')) return 'cat-backend';
        if (lower.includes('data') || lower.includes('sql')) return 'cat-database';
        if (lower.includes('devops') || lower.includes('cloud')) return 'cat-devops';
        return 'cat-other';
    };

    const getProgressFillClass = (level) => {
        if (level < 30) return 'fill-beginner';
        if (level < 60) return 'fill-intermediate';
        if (level < 80) return 'fill-advanced';
        return 'fill-expert';
    };

    const getProficiencyLabel = (level) => {
        if (level < 30) return 'Beginner';
        if (level < 60) return 'Intermediate';
        if (level < 80) return 'Advanced';
        return 'Expert';
    };

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Kỹ năng (Skills)</h2>
                    <p>Bộ kỹ năng chuyên môn, công nghệ hiển thị trên Portfolio</p>
                </div>
            </div>

            <div className="skills-container">
                {/* Top Action Bar */}
                <div className="top-actions-bar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm tên kỹ năng..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => openDrawer('new')}>
                        + Thêm Kỹ năng mới
                    </button>
                </div>

                {/* Tabs Bar */}
                {data.length > 0 && (
                    <div className="skills-tabs">
                        {categories.map(cat => {
                            const count = cat === 'Tất cả' 
                                ? data.length 
                                : data.filter(i => i.category === cat).length;
                            return (
                                <button 
                                    key={cat} 
                                    className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat} <span className="tab-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className="loading-spinner">Đang tải dữ liệu...</div>
                ) : filteredData.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⚡</div>
                        <h3>Không tìm thấy kỹ năng nào</h3>
                        <p>{searchQuery ? 'Thử thay đổi từ khóa tìm kiếm.' : 'Hãy thêm kỹ năng đầu tiên của bạn.'}</p>
                        {!searchQuery && (
                            <button className="btn-primary" onClick={() => openDrawer('new')} style={{ marginTop: '1rem' }}>
                                + Thêm Kỹ năng
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="skills-grid">
                        {filteredData.map(item => (
                            <div className={`skill-card ${item.is_active ? '' : 'inactive'}`} key={item.id}>
                                <div className="skill-card-header">
                                    <div className="skill-icon-wrapper">
                                        {item.icon_url ? (
                                            <img src={`http://localhost:5000/uploads/skills/${item.icon_url}`} alt={item.name} className="skill-icon" />
                                        ) : (
                                            <span className="skill-icon-placeholder">⌨️</span>
                                        )}
                                    </div>
                                    <div className="skill-info">
                                        <h3 className="skill-name" title={item.name}>{item.name}</h3>
                                        <span className={`skill-category ${getCategoryClass(item.category)}`}>
                                            {item.category || 'Chưa phân loại'}
                                        </span>
                                    </div>
                                </div>

                                <div className="skill-progress-container">
                                    <div className="skill-progress-header">
                                        <span className="skill-progress-label">{getProficiencyLabel(item.level)}</span>
                                        <span className="skill-progress-pct">{item.level}%</span>
                                    </div>
                                    <div className="skill-progress-track">
                                        <div 
                                            className={`skill-progress-fill ${getProgressFillClass(item.level)}`} 
                                            style={{ width: `${item.level}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="skill-card-footer">
                                    <label className="skill-status-toggle">
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={item.is_active} 
                                                onChange={() => handleToggleStatus(item.id, item.is_active)} 
                                            />
                                            <span className="toggle-slider"></span>
                                        </div>
                                        {item.is_active ? 'Hiển thị' : 'Đang ẩn'}
                                    </label>
                                    <div className="skill-actions">
                                        <button className="btn-icon" onClick={() => openDrawer(item.id)} title="Chỉnh sửa">✏️</button>
                                        <button className="btn-icon text-danger" onClick={() => handleDelete(item.id, item.name)} title="Xóa">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={closeDrawer} 
                title={selectedId === 'new' ? 'Thêm Kỹ năng mới' : 'Chỉnh sửa Kỹ năng'}
            >
                {isDrawerOpen && (
                    <SkillForm 
                        skillId={selectedId} 
                        onSaved={handleSaved} 
                        onCancel={closeDrawer} 
                    />
                )}
            </Drawer>
        </div>
    );
};

export default SkillList;
