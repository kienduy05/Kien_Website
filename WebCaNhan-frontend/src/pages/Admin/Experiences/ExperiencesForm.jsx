import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const ExperiencesForm = ({ experienceId, onSaved, onCancel }) => {
    const isEditMode = experienceId && experienceId !== 'new';

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
        } else {
            setIsLoading(false);
        }
    }, [experienceId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/experiences/${experienceId}`);
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
            alertService.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'is_current' && checked) {
            setFormData(prev => ({ ...prev, is_current: true, end_date: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleQuillChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSaving(true);
        try {
            if (isEditMode) {
                await api.put(`/experiences/${experienceId}`, formData);
            } else {
                await api.post('/experiences', formData);
            }
            alertService.success('Lưu dữ liệu thành công!');
            if (onSaved) onSaved();
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <form onSubmit={handleSubmit} className="admin-form extended-form">
            <div className="form-group">
                <label>Tên công ty / Doanh nghiệp <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Ví dụ: Google, FPT Software..." />
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Vị trí / Chức vụ <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} required placeholder="Ví dụ: Senior Frontend Developer" />
                </div>
                <div className="form-group">
                    <label>Địa điểm làm việc</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ position: 'absolute', left: '12px', color: '#94a3b8' }}>📍</span>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ví dụ: Hà Nội, Việt Nam" style={{ paddingLeft: '36px' }} />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} disabled={formData.is_current} style={{ opacity: formData.is_current ? 0.5 : 1 }} />
                </div>
            </div>

            <div className="form-group checkbox-group" style={{ marginTop: '-10px', marginBottom: '20px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" name="is_current" checked={formData.is_current} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    Đây là công việc hiện tại của tôi
                </label>
            </div>

            <div className="form-group" style={{ marginBottom: '60px' }}>
                <label>Mô tả công việc & Thành tựu</label>
                <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={handleQuillChange}
                    modules={quillModules}
                    style={{ height: '200px' }}
                />
            </div>

            <div className="form-group">
                <label>Thứ tự hiển thị (Số lớn xếp trước)</label>
                <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} min="0" />
            </div>

            <div className="drawer-footer">
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : '💾 Lưu Kinh nghiệm'}
                </button>
            </div>
        </form>
    );
};

export default ExperiencesForm;
