import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const SocialLinksForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        platform: '',
        url: '',
        icon: '',
        is_active: 1,
        display_order: 0
    });
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/social_links/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    platform: data.platform || '',
                    url: data.url || '',
                    icon: data.icon || '',
                    is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
                    display_order: data.display_order || 0
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;
        
        setIsSaving(true);
        try {
            if (isEditMode) {
                await api.put(`/social_links/${id}`, formData);
            } else {
                await api.post('/social_links', formData);
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/social-links');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa thông tin Mạng xã hội' : 'Thêm mới Mạng xã hội'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/social-links')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <div className="form-group">
                        <label>Nền tảng (VD: Facebook, LinkedIn) *</label>
                        <input type="text" name="platform" value={formData.platform} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Đường dẫn (URL) *</label>
                        <input type="url" name="url" value={formData.url} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Icon Class (VD: fab fa-facebook)</label>
                            <input type="text" name="icon" value={formData.icon} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Thứ tự hiển thị</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} />
                        </div>
                        <div className="form-group checkbox-group" style={{ marginTop: '25px' }}>
                            <label>
                                <input type="checkbox" name="is_active" checked={formData.is_active === 1} onChange={handleChange} />
                                {' '}Kích hoạt (Hiển thị)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SocialLinksForm;
