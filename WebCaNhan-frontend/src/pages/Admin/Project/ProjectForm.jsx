import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import './ProjectForm.css';
import alertService from '../../../utils/alert';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        project_type: '',
        short_description: '',
        description: '',
        role: '',
        team_size: '',
        start_date: '',
        end_date: '',
        github_url: '',
        demo_url: '',
        is_featured: 0,
        is_published: 1,
        display_order: 0,
        technologies: []
    });

    const [availableTechnologies, setAvailableTechnologies] = useState([]);

    // For existing project images
    const [existingPrimary, setExistingPrimary] = useState('');
    const [existingImages, setExistingImages] = useState([]);

    // For new uploads
    const [primaryFile, setPrimaryFile] = useState(null);
    const [primaryPreview, setPrimaryPreview] = useState('');

    const [multiFiles, setMultiFiles] = useState([]);
    const [multiPreviews, setMultiPreviews] = useState([]);

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAvailableTechnologies();
        if (isEditMode) {
            fetchData();
        }
    }, [id]);

    const fetchAvailableTechnologies = async () => {
        try {
            const response = await api.get('/technologies');
            if (response.data.metadata) {
                setAvailableTechnologies(response.data.metadata);
            }
        } catch (error) {
            console.error("Failed to fetch technologies:", error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await api.get(`/projects/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    name: data.name || '',
                    slug: data.slug || '',
                    project_type: data.project_type || '',
                    short_description: data.short_description || '',
                    description: data.description || '',
                    role: data.role || '',
                    team_size: data.team_size || '',
                    start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
                    end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
                    github_url: data.github_url || '',
                    demo_url: data.demo_url || '',
                    is_featured: data.is_featured ? 1 : 0,
                    is_published: data.is_published !== undefined ? (data.is_published ? 1 : 0) : 1,
                    display_order: data.display_order || 0,
                    technologies: data.project_technologies ? data.project_technologies.map(pt => pt.id) : []
                });

                if (data.thumbnail_url) {
                    setExistingPrimary(`http://localhost:5000/uploads/projects/${data.thumbnail_url}`);
                }

                if (data.project_images && data.project_images.length > 0) {
                    setExistingImages(data.project_images);
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

    const handleTechnologyChange = (techId) => {
        setFormData(prev => {
            const isSelected = prev.technologies.includes(techId);
            if (isSelected) {
                return { ...prev, technologies: prev.technologies.filter(id => id !== techId) };
            } else {
                return { ...prev, technologies: [...prev.technologies, techId] };
            }
        });
    };

    const handlePrimaryFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrimaryFile(file);
            setPrimaryPreview(URL.createObjectURL(file));
        }
    };

    const handleMultiFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setMultiFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setMultiPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewMultiFile = (index) => {
        setMultiFiles(prev => prev.filter((_, i) => i !== index));
        setMultiPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = async (imageId) => {
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa ảnh này?')) {
            try {
                await api.delete(`/project_images/${imageId}`);
                setExistingImages(prev => prev.filter(img => img.id !== imageId));

                alertService.success('Đã xóa ảnh!');
            } catch (error) {
                alertService.error('Xóa ảnh thất bại!');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;

        setIsSaving(true);
        try {
            const submitData = new FormData();

            // Append text fields
            Object.keys(formData).forEach(key => {
                if (key === 'technologies') {
                    submitData.append('technologies', JSON.stringify(formData.technologies));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Append primary image
            if (primaryFile) {
                submitData.append('primary_image', primaryFile);
            }

            // Append multi images
            if (multiFiles.length > 0) {
                multiFiles.forEach(file => {
                    submitData.append('project_images', file);
                });
            }

            if (isEditMode) {
                await api.put(`/projects/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/projects', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/projects');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa thông tin Dự án' : 'Thêm mới Dự án'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/projects')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form extended-form">

                <div className="form-section">
                    <h3 className="section-title">Thông tin cơ bản</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên dự án *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL thân thiện) *</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Loại dự án</label>
                            <select name="project_type" value={formData.project_type} onChange={handleChange}>
                                <option value="">-- Chọn loại dự án --</option>
                                <option value="REAL_PROJECT">Dự án thực tế (REAL_PROJECT)</option>
                                <option value="UNIVERSITY_PROJECT">Dự án môn học/Trường (UNIVERSITY_PROJECT)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Vai trò của bạn</label>
                            <input type="text" name="role" value={formData.role} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Quy mô team (Số lượng)</label>
                            <input type="number" name="team_size" value={formData.team_size} onChange={handleChange} min="1" />
                        </div>
                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc</label>
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Repo URL (Mã nguồn)</label>
                            <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Live URL (Demo)</label>
                            <input type="url" name="demo_url" value={formData.demo_url} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={formData.is_featured === 1}
                                onChange={handleChange}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="is_featured" style={{ marginBottom: 0 }}>Đánh dấu nổi bật (Featured)</label>
                        </div>
                        <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                            <input
                                type="checkbox"
                                id="is_published"
                                name="is_published"
                                checked={formData.is_published === 1}
                                onChange={handleChange}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="is_published" style={{ marginBottom: 0 }}>Xuất bản (Hiển thị công khai)</label>
                        </div>
                        <div className="form-group">
                            <label>Thứ tự hiển thị</label>
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Mô tả ngắn (Summary) *</label>
                        <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="2" required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Mô tả chi tiết (Hỗ trợ Markdown)</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="6"></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Công nghệ sử dụng</h3>
                    <div className="form-group">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {availableTechnologies.map(tech => (
                                <div key={tech.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id={`tech-${tech.id}`}
                                        checked={formData.technologies.includes(tech.id)}
                                        onChange={() => handleTechnologyChange(tech.id)}
                                        style={{ width: 'auto', marginBottom: 0 }}
                                    />
                                    <label htmlFor={`tech-${tech.id}`} style={{ marginBottom: 0 }}>{tech.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Hình ảnh dự án</h3>

                    <div className="form-group file-group">
                        <label>Ảnh chính (Primary Image)</label>
                        <div className="file-preview-container">
                            {primaryPreview || existingPrimary ? (
                                <img
                                    src={primaryPreview || existingPrimary}
                                    alt="Primary Preview"
                                    className="avatar-preview cover-preview"
                                />
                            ) : (
                                <div className="avatar-placeholder cover-placeholder">Chưa có ảnh</div>
                            )}
                            <div className="custom-upload-wrapper">
                                <label htmlFor="primary-upload" className="custom-upload-btn">
                                    <span className="icon">🖼️</span> {isEditMode ? 'Đổi ảnh chính' : 'Tải ảnh chính'}
                                </label>
                                <input id="primary-upload" type="file" accept="image/jpeg, image/png, image/jpg" onChange={handlePrimaryFileChange} className="hidden-file-input" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group file-group" style={{ marginTop: '30px' }}>
                        <label>Ảnh chi tiết (Nhiều ảnh)</label>
                        <div className="custom-upload-wrapper" style={{ marginBottom: '15px' }}>
                            <label htmlFor="multi-upload" className="custom-upload-btn" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                                <span className="icon">➕</span> Thêm ảnh chi tiết
                            </label>
                            <input id="multi-upload" type="file" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleMultiFileChange} className="hidden-file-input" />
                        </div>

                        <div className="project-images-grid">
                            {/* Existing Images */}
                            {existingImages.map((img) => (
                                <div key={img.id} className="image-preview-card">
                                    <img src={`http://localhost:5000/uploads/projects/${img.image_url}`} alt="Project Detail" />
                                    <button
                                        type="button"
                                        className="btn-delete-img"
                                        onClick={() => handleDeleteExistingImage(img.id)}
                                        title="Xóa ảnh này"
                                    >✕</button>
                                </div>
                            ))}

                            {/* New Previews */}
                            {multiPreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="image-preview-card" style={{ border: '2px dashed #10b981' }}>
                                    <img src={preview} alt="New Preview" />
                                    <button
                                        type="button"
                                        className="btn-delete-img"
                                        onClick={() => removeNewMultiFile(index)}
                                        title="Bỏ chọn"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu Dự án'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
