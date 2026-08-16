import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const EducationForm = ({ educationId, onSuccess, onCancel }) => {
    const isEditMode = !!educationId;

    const [formData, setFormData] = useState({
        school_name: '',
        major: '',
        degree: '',
        start_date: '',
        end_date: '',
        description: '',
        display_order: 0
    });
    const [isCurrent, setIsCurrent] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        } else {
            // Reset form when opening in create mode
            setFormData({
                school_name: '',
                major: '',
                degree: '',
                start_date: '',
                end_date: '',
                description: '',
                display_order: 0
            });
            setIsCurrent(false);
            setIsLoading(false);
        }
    }, [educationId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/education/${educationId}`);
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
                setIsCurrent(!data.end_date);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải dữ liệu");
            onCancel();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleCurrentChange = (e) => {
        const checked = e.target.checked;
        setIsCurrent(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, end_date: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSaving(true);
        try {
            const dataToSubmit = { ...formData };
            if (isCurrent) {
                dataToSubmit.end_date = null;
            }

            if (isEditMode) {
                await api.put(`/education/${educationId}`, dataToSubmit);
                alertService.success('Cập nhật dữ liệu thành công!');
            } else {
                await api.post('/education', dataToSubmit);
                alertService.success('Thêm mới thành công!');
            }
            onSuccess();
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải dữ liệu...</div>;

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form" style={{ gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Trường / Tổ chức giáo dục <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                    type="text" 
                    name="school_name" 
                    value={formData.school_name} 
                    onChange={handleChange} 
                    required 
                    placeholder="VD: Đại học Bách Khoa Hà Nội"
                />
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Chuyên ngành</label>
                <input 
                    type="text" 
                    name="major" 
                    value={formData.major} 
                    onChange={handleChange} 
                    placeholder="VD: Khoa học Máy tính"
                />
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Bằng cấp / Chứng chỉ <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                    type="text" 
                    name="degree" 
                    value={formData.degree} 
                    onChange={handleChange} 
                    required 
                    placeholder="VD: Cử nhân"
                />
            </div>
            
            <div className="form-row" style={{ marginBottom: '12px' }}>
                <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input 
                        type="date" 
                        name="start_date" 
                        value={formData.start_date} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Ngày kết thúc</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'normal', color: '#3b82f6', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={isCurrent} 
                                onChange={handleCurrentChange}
                                style={{ width: 'auto' }}
                            />
                            Đang học tại đây
                        </label>
                    </label>
                    <input 
                        type="date" 
                        name="end_date" 
                        value={formData.end_date} 
                        onChange={handleChange} 
                        disabled={isCurrent}
                        style={{ opacity: isCurrent ? 0.5 : 1 }}
                    />
                </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Mô tả chi tiết</label>
                <div style={{ backgroundColor: 'white' }}>
                    <ReactQuill 
                        theme="snow" 
                        value={formData.description} 
                        onChange={handleDescriptionChange}
                        modules={modules}
                        style={{ height: '150px', marginBottom: '40px' }}
                    />
                </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Thứ tự hiển thị (Tùy chọn)</label>
                <input 
                    type="number" 
                    name="display_order" 
                    value={formData.display_order} 
                    onChange={handleChange} 
                    min="0" 
                />
            </div>

            <div style={{ 
                position: 'sticky', 
                bottom: '-2rem', 
                background: '#f8fafc', 
                padding: '1rem 0',
                borderTop: '1px solid #e2e8f0',
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px',
                marginTop: 'auto',
                zIndex: 10
            }}>
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>
                    Hủy bỏ
                </button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                </button>
            </div>
        </form>
    );
};

export default EducationForm;
