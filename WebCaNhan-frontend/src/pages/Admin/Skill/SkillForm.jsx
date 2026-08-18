import React, { useState, useEffect, useRef } from 'react';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const SkillForm = ({ skillId, onSaved, onCancel }) => {
    const isEditMode = skillId && skillId !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend', // Default
        level: 50,
        is_active: 1,
        display_order: 0
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    
    const iconInputRef = useRef(null);

    const categories = ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'Design', 'Other'];

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [skillId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/skills/${skillId}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    name: data.name || '',
                    category: data.category || 'Frontend',
                    level: parseInt(data.level) || 50, // Parse level to number
                    is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
                    display_order: data.display_order || 0
                });
                
                if (data.icon_url) {
                    setExistingImage(`http://localhost:5000/uploads/skills/${data.icon_url}`);
                }
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

    const handleSliderChange = (e) => {
        setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        if (iconInputRef.current) iconInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            
            if (imageFile) {
                submitData.append('icon', imageFile);
            }

            if (isEditMode) {
                await api.put(`/skills/${skillId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/skills', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alertService.success('Lưu dữ liệu thành công!');
            if (onSaved) onSaved();
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    const getProficiencyLabel = (level) => {
        if (level < 30) return 'Mới bắt đầu (Beginner)';
        if (level < 60) return 'Trung bình (Intermediate)';
        if (level < 80) return 'Khá giỏi (Advanced)';
        return 'Chuyên gia (Expert)';
    };

    const getProficiencyColor = (level) => {
        if (level < 30) return '#f97316'; // Orange
        if (level < 60) return '#eab308'; // Yellow
        if (level < 80) return '#3b82f6'; // Blue
        return '#10b981'; // Green
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <form onSubmit={handleSubmit} className="admin-form extended-form">
            <div className="form-group file-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <label>Icon / Logo Kỹ năng</label>
                <div 
                    className="dropzone-container" 
                    onClick={triggerFileInput}
                    style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '24px', padding: '10px' }}
                >
                    {imagePreview || existingImage ? (
                        <>
                            <img 
                                src={imagePreview || existingImage} 
                                alt="Icon Preview" 
                                className="dropzone-preview" 
                                style={{ borderRadius: '24px', objectFit: 'contain', padding: '8px' }}
                            />
                            <div className="dropzone-preview-overlay" style={{ borderRadius: '24px', fontSize: '0.8rem' }}>Đổi ảnh</div>
                        </>
                    ) : (
                        <>
                            <span className="dropzone-icon" style={{ fontSize: '2rem', marginBottom: '4px' }}>✨</span>
                            <span className="dropzone-subtext">Click tải ảnh</span>
                        </>
                    )}
                    <input type="file" ref={iconInputRef} accept="image/jpeg, image/png, image/jpg, image/svg+xml" onChange={handleFileChange} className="dropzone-input" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Tên kỹ năng <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ví dụ: React.js, Python..." />
                </div>
                <div className="form-group">
                    <label>Phân loại nhóm (Category) <span style={{color: '#ef4444'}}>*</span></label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            list="category-suggestions" 
                            required 
                            placeholder="Chọn hoặc gõ nhóm mới..." 
                        />
                        <datalist id="category-suggestions">
                            {categories.map(cat => <option key={cat} value={cat} />)}
                        </datalist>
                    </div>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>
                    Mức độ thành thạo: 
                    <span style={{ marginLeft: '8px', fontWeight: 'bold', color: getProficiencyColor(formData.level) }}>
                        {getProficiencyLabel(formData.level)}
                    </span>
                </label>
                <div className="range-slider-container">
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={formData.level} 
                        onChange={handleSliderChange} 
                        className="range-slider"
                    />
                    <input 
                        type="number" 
                        name="level" 
                        min="0" max="100" 
                        value={formData.level} 
                        onChange={handleChange} 
                        className="range-number-input"
                    />
                    <span>%</span>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Thứ tự hiển thị (Số lớn xếp trước)</label>
                    <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} min="0" />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ marginBottom: '12px' }}>Trạng thái hiển thị</label>
                    <label className="skill-status-toggle" style={{ fontSize: '1rem', color: '#0f172a' }}>
                        <div className="toggle-switch">
                            <input 
                                type="checkbox" 
                                name="is_active" 
                                checked={formData.is_active === 1} 
                                onChange={handleChange} 
                            />
                            <span className="toggle-slider"></span>
                        </div>
                        {formData.is_active === 1 ? 'Hiển thị trên Portfolio' : 'Đang ẩn'}
                    </label>
                </div>
            </div>

            <div className="drawer-footer">
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : '💾 Lưu Kỹ năng'}
                </button>
            </div>
        </form>
    );
};

export default SkillForm;
