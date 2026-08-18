import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import './Project.css';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        project_type: 'REAL_PROJECT',
        role: '',
        team_size: 1,
        start_date: '',
        end_date: '',
        github_url: '',
        demo_url: '',
        short_description: '',
        description: '',
        is_featured: 0,
        is_published: 1,
        display_order: 0,
        technologies: [] // Stores array of IDs
    });

    const [isSlugLocked, setIsSlugLocked] = useState(true);
    
    // Primary Image
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [primaryImagePreview, setPrimaryImagePreview] = useState('');
    const [existingPrimaryImage, setExistingPrimaryImage] = useState('');
    const primaryInputRef = useRef(null);

    // Tech Chips state
    const [techInput, setTechInput] = useState('');
    const [allTechnologies, setAllTechnologies] = useState([]); // Array of {id, name}

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        try {
            // Fetch all technologies first
            const techRes = await api.get('/technologies');
            let techs = [];
            if (techRes.data.metadata) {
                techs = techRes.data.metadata;
                setAllTechnologies(techs);
            }

            if (isEditMode) {
                const response = await api.get(`/projects/${id}`);
                if (response.data.metadata) {
                    const data = response.data.metadata;
                    // project_technologies comes as [{id, name, ...}]
                    const selectedTechIds = (data.project_technologies || []).map(t => t.id);

                    setFormData({
                        name: data.name || '',
                        slug: data.slug || '',
                        project_type: data.project_type || 'REAL_PROJECT',
                        role: data.role || '',
                        team_size: data.team_size || 1,
                        start_date: data.start_date ? data.start_date.split('T')[0] : '',
                        end_date: data.end_date ? data.end_date.split('T')[0] : '',
                        github_url: data.github_url || '',
                        demo_url: data.demo_url || '',
                        short_description: data.short_description || '',
                        description: data.description || '',
                        is_featured: data.is_featured ? 1 : 0,
                        is_published: data.is_published ? 1 : 0,
                        display_order: data.display_order || 0,
                        technologies: selectedTechIds
                    });

                    if (data.thumbnail_url) {
                        setExistingPrimaryImage(`http://localhost:5000/uploads/projects/${data.thumbnail_url}`);
                    }
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (text) => {
        return text.toString().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, '-') 
            .replace(/[^\w\-]+/g, '') 
            .replace(/\-\-+/g, '-') 
            .replace(/^-+/, '') 
            .replace(/-+$/, ''); 
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value };
            if (name === 'name' && isSlugLocked) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleQuillChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    // Primary Image Handlers
    const handlePrimaryFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrimaryImageFile(file);
            setPrimaryImagePreview(URL.createObjectURL(file));
        }
    };

    const removePrimaryImage = async (e) => {
        e.stopPropagation();
        if (existingPrimaryImage || primaryImagePreview) {
            const confirmed = await alertService.confirm('Gỡ ảnh', 'Xóa ảnh đại diện của dự án này?');
            if (confirmed) {
                setPrimaryImageFile(null);
                setPrimaryImagePreview('');
                setExistingPrimaryImage('');
                alertService.success('Đã gỡ ảnh. Nhấn Lưu để áp dụng chính thức!');
            }
        }
    };

    // Tech Chips Handlers
    const addTech = (techId) => {
        if (!formData.technologies.includes(techId)) {
            setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techId] }));
        }
        setTechInput('');
    };

    const removeTech = (techId) => {
        setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(id => id !== techId) }));
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) return alertService.error('Vui lòng nhập tên dự án!');
        if (!formData.slug.trim()) return alertService.error('Đường dẫn (slug) không được để trống!');

        setIsSaving(true);
        try {
            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key === 'technologies') {
                    // Send array of IDs as JSON string
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            if (!primaryImageFile && !existingPrimaryImage && isEditMode) {
                submitData.append('thumbnail_url', '');
            }

            if (primaryImageFile) {
                submitData.append('primary_image', primaryImageFile);
            }

            if (isEditMode) {
                await api.put(`/projects/${id}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/projects', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            
            alertService.success('Đã lưu dự án thành công!');
            navigate('/admin/projects');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dự án!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải dữ liệu...</div>;

    const filteredSuggestions = allTechnologies.filter(t => 
        t.name.toLowerCase().includes(techInput.toLowerCase()) && !formData.technologies.includes(t.id)
    );

    return (
        <div className="admin-module">
            <div className="module-header" style={{ marginBottom: '16px' }}>
                <div>
                    <h2>{isEditMode ? 'Chỉnh sửa Dự án' : 'Thêm Dự án mới'}</h2>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/admin/projects')} disabled={isSaving}>
                    Quay lại danh sách
                </button>
            </div>

            <form className="editor-layout" onSubmit={handleSubmit}>
                
                {/* LEFT COLUMN - 65% */}
                <div className="editor-main">
                    <div className="editor-card">
                        <div className="editor-card-header">Thông tin cơ bản</div>
                        <div className="editor-card-body">
                            <div className="form-group">
                                <label>Tên dự án *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="VD: SusuShop E-commerce" style={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
                            </div>

                            <div className="form-group">
                                <label>Đường dẫn thân thiện (Slug) *</label>
                                <div className="editor-slug-wrapper" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>
                                    <span style={{ color: '#94a3b8' }}>/projects/</span>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="form-input" style={{ flex: 1 }} readOnly={isSlugLocked} />
                                    <button type="button" className="btn-lock" onClick={() => setIsSlugLocked(!isSlugLocked)} title="Mở khóa slug">
                                        {isSlugLocked ? '🔒' : '🔓'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Loại dự án *</label>
                                    <select name="project_type" value={formData.project_type} onChange={handleChange} className="form-input">
                                        <option value="REAL_PROJECT">Dự án Doanh nghiệp/Thực tế</option>
                                        <option value="UNIVERSITY">Dự án làm ở đại học</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Vai trò của bạn *</label>
                                    <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-input" placeholder="VD: Fullstack Developer" />
                                </div>
                                <div className="form-group">
                                    <label>Quy mô nhóm</label>
                                    <input type="number" name="team_size" value={formData.team_size} onChange={handleChange} className="form-input" min="1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="editor-card">
                        <div className="editor-card-header">Thời gian & Liên kết</div>
                        <div className="editor-card-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ngày bắt đầu</label>
                                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Ngày kết thúc</label>
                                    <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="form-input" />
                                    <small style={{ color: '#94a3b8' }}>Bỏ trống nếu đang phát triển</small>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Source Code URL (Github/Gitlab)</label>
                                    <input type="text" name="github_url" value={formData.github_url} onChange={handleChange} className="form-input" placeholder="https://github.com/..." />
                                </div>
                                <div className="form-group">
                                    <label>Live Demo URL</label>
                                    <input type="text" name="demo_url" value={formData.demo_url} onChange={handleChange} className="form-input" placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="editor-card">
                        <div className="editor-card-header">Chi tiết Dự án</div>
                        <div className="editor-card-body">
                            <div className="form-group">
                                <label>Mô tả ngắn (Hiển thị trên thẻ dự án) *</label>
                                <textarea name="short_description" value={formData.short_description} onChange={handleChange} className="form-input" rows="3" placeholder="Tóm tắt tính năng chính 2-3 dòng..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Bài viết giới thiệu chi tiết (Markdown/Rich Text)</label>
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.description} 
                                    onChange={handleQuillChange}
                                    style={{ height: '400px', marginBottom: '40px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - 35% */}
                <div className="editor-sidebar">
                    
                    <div className="editor-card">
                        <div className="editor-card-header">Công nghệ sử dụng</div>
                        <div className="editor-card-body" style={{ position: 'relative' }}>
                            <div className="tech-multi-select" onClick={() => document.getElementById('tech-input').focus()}>
                                {formData.technologies.map(techId => {
                                    const tech = allTechnologies.find(t => t.id === techId);
                                    if (!tech) return null;
                                    return (
                                        <span key={techId} className="tech-multi-chip">
                                            {tech.name}
                                            <button type="button" onClick={() => removeTech(techId)}>×</button>
                                        </span>
                                    );
                                })}
                                <input 
                                    id="tech-input"
                                    type="text" 
                                    className="tech-multi-input" 
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    placeholder={formData.technologies.length === 0 ? "Gõ tìm kiếm..." : ""}
                                />
                            </div>
                            {techInput && filteredSuggestions.length > 0 && (
                                <div className="tech-suggestions">
                                    {filteredSuggestions.map(s => (
                                        <div key={s.id} className="tech-suggestion-item" onClick={() => addTech(s.id)}>
                                            {s.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <small style={{ color: '#94a3b8', display: 'block', marginTop: '8px' }}>Nhập tên công nghệ để lọc và chọn từ hệ thống.</small>
                        </div>
                    </div>

                    <div className="editor-card">
                        <div className="editor-card-header">Trạng thái hiển thị</div>
                        <div className="editor-card-body">
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h5>⭐ Nổi bật (Featured)</h5>
                                    <p>Ghim lên đầu trang chủ</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" name="is_featured" checked={formData.is_featured === 1} onChange={handleChange} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h5>Xuất bản (Public)</h5>
                                    <p>Hiển thị công khai trên web</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" name="is_published" checked={formData.is_published === 1} onChange={handleChange} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h5>Thứ tự hiển thị</h5>
                                </div>
                                <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="form-input" style={{ width: '80px', padding: '4px 8px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="editor-card">
                        <div className="editor-card-header">Ảnh đại diện (Thumbnail)</div>
                        <div className="editor-card-body">
                            <div className="gallery-dropzone" onClick={() => primaryInputRef.current?.click()}>
                                {primaryImagePreview || existingPrimaryImage ? (
                                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={primaryImagePreview || existingPrimaryImage} alt="Cover" style={{ width: '100%', display: 'block' }} />
                                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '8px' }}>
                                            <button type="button" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); primaryInputRef.current?.click(); }}>Đổi</button>
                                            <button type="button" className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#dc2626', borderColor: '#dc2626' }} onClick={removePrimaryImage}>Xóa</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2.5rem', color: '#94a3b8' }}>📸</div>
                                        <div style={{ color: '#64748b', marginTop: '8px' }}>Click để tải ảnh 16:9 lên</div>
                                    </>
                                )}
                                <input type="file" ref={primaryInputRef} accept="image/*" onChange={handlePrimaryFileChange} style={{ display: 'none' }} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="editor-card">
                        <div className="editor-card-header">Thư viện ảnh (Gallery)</div>
                        <div className="editor-card-body">
                            <div className="gallery-dropzone" onClick={() => document.getElementById('galleryInput').click()}>
                                <div style={{ fontSize: '2rem', color: '#94a3b8' }}>🖼️</div>
                                <div style={{ color: '#64748b', marginTop: '8px' }}>Tải lên nhiều ảnh minh họa...</div>
                            </div>
                            <input 
                                id="galleryInput" 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={(e) => {
                                    if(e.target.files.length > 0) alertService.info("Tính năng up nhiều ảnh đang được phát triển backend!");
                                }} 
                            />
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                                * Tính năng Gallery sẽ sớm được kích hoạt trong bản cập nhật sau.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Sticky Bottom Bar */}
                <div className="editor-sticky-bar">
                    <div className="sticky-actions-left">
                        {isEditMode && (
                            <button type="button" className="btn-secondary" onClick={() => window.open(`/projects/${formData.slug}`, '_blank')}>
                                👁️ Xem Preview
                            </button>
                        )}
                    </div>
                    <div className="sticky-actions-right">
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : '🚀 Lưu Dự án'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default ProjectForm;
