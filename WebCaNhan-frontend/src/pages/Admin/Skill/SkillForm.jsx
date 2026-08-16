import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const SkillForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        level: 50,
        is_active: 1,
        display_order: 0
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/skills/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    name: data.name || '',
                    category: data.category || '',
                    level: data.level || 50,
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;
        
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
                await api.put(`/skills/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/skills', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/skills');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa Kỹ năng' : 'Thêm mới Kỹ năng'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/skills')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <div className="form-group">
                        <label>Tên kỹ năng *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phân loại (VD: Frontend, Backend, Design)</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mức độ thành thạo (0 - 100%)</label>
                            <input type="number" name="level" min="0" max="100" value={formData.level} onChange={handleChange} />
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
                    
                    <div className="form-group file-group" style={{ marginTop: '20px' }}>
                        <label>Icon kỹ năng (Tùy chọn)</label>
                        <div className="file-preview-container">
                            {imagePreview || existingImage ? (
                                <img 
                                    src={imagePreview || existingImage} 
                                    alt="Icon Preview" 
                                    className="avatar-preview cover-preview" 
                                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="avatar-placeholder cover-placeholder" style={{ width: '80px', height: '80px' }}>Trống</div>
                            )}
                            <div className="custom-upload-wrapper">
                                <label htmlFor="icon-upload" className="custom-upload-btn">
                                    <span className="icon">🖼️</span> Chọn Icon
                                </label>
                                <input id="icon-upload" type="file" accept="image/jpeg, image/png, image/jpg, image/svg+xml" onChange={handleFileChange} className="hidden-file-input" />
                            </div>
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

export default SkillForm;
