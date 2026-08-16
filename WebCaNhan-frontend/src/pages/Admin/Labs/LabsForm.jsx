import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const LabsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        content: '',
        github_url: '',
        demo_url: '',
        is_published: true,
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
            const response = await api.get(`/labs/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    title: data.title || '',
                    short_description: data.short_description || '',
                    content: data.content || '',
                    github_url: data.github_url || '',
                    demo_url: data.demo_url || '',
                    is_published: data.is_published !== undefined ? data.is_published : true,
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
                await api.put(`/labs/${id}`, formData);
            } else {
                await api.post('/labs', formData);
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/labs');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa thông tin Lab' : 'Thêm mới Lab'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/labs')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <div className="form-group">
                        <label>Tiêu đề *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Đường dẫn Github (Link)</label>
                        <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Đường dẫn Demo (Link)</label>
                        <input type="url" name="demo_url" value={formData.demo_url} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mô tả ngắn</label>
                        <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Nội dung chi tiết</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows="6"></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Thứ tự hiển thị</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group checkbox-group" style={{marginTop: '2rem'}}>
                            <label>
                                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
                                {' '}Xuất bản (Hiển thị)
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

export default LabsForm;
