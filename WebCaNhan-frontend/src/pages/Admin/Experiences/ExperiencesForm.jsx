import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const ExperiencesForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        company_name: '',
        position: '',
        start_date: '',
        end_date: '',
        is_current: false,
        location: '',
        description: '',
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
            const response = await api.get(`/experiences/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    company_name: data.company_name || '',
                    position: data.position || '',
                    start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
                    end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
                    is_current: data.is_current || false,
                    location: data.location || '',
                    description: data.description || '',
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
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;
        
        setIsSaving(true);
        try {
            if (isEditMode) {
                await api.put(`/experiences/${id}`, formData);
            } else {
                await api.post('/experiences', formData);
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/experiences');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa thông tin Kinh nghiệm' : 'Thêm mới Kinh nghiệm'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/experiences')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <div className="form-group">
                        <label>Tên công ty *</label>
                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Vị trí / Chức vụ *</label>
                        <input type="text" name="position" value={formData.position} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Địa điểm</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc (Để trống nếu hiện tại)</label>
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} disabled={formData.is_current} />
                        </div>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="is_current" checked={formData.is_current} onChange={handleChange} />
                            {' '}Công việc hiện tại
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Mô tả công việc</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Thứ tự hiển thị</label>
                        <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} min="0" />
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

export default ExperiencesForm;
