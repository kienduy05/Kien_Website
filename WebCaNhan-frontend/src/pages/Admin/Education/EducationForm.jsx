import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const EducationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        school_name: '',
        major: '',
        degree: '',
        start_date: '',
        end_date: '',
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
            const response = await api.get(`/education/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    school_name: data.school_name || '',
                    major: data.major || '',
                    degree: data.degree || '',
                    start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
                    end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;
        
        setIsSaving(true);
        try {
            if (isEditMode) {
                await api.put(`/education/${id}`, formData);
            } else {
                await api.post('/education', formData);
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/education');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa thông tin Học vấn' : 'Thêm mới Học vấn'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/education')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <div className="form-group">
                        <label>Trường / Tổ chức *</label>
                        <input type="text" name="school_name" value={formData.school_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Chuyên ngành</label>
                        <input type="text" name="major" value={formData.major} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bằng cấp / Khóa học *</label>
                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc (Để trống nếu hiện tại)</label>
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
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

export default EducationForm;
