import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import './Post.css';

const PostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Tutorials',
        tags: '',
        is_published: 0,
        published_at: new Date().toISOString().split('T')[0]
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    
    // Slug generation logic
    const [isSlugLocked, setIsSlugLocked] = useState(true);
    
    const iconInputRef = useRef(null);

    const categories = ['Tutorials', 'Tech', 'Life', 'Projects', 'Other'];

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    category: data.category || 'Tutorials',
                    tags: data.tags || '',
                    is_published: data.is_published ? 1 : 0,
                    published_at: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                });
                
                if (data.thumbnail_url) {
                    setExistingImage(`http://localhost:5000/uploads/posts/${data.thumbnail_url}`);
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
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value };
            
            // Auto generate slug if title changes and slug is locked
            if (name === 'title' && isSlugLocked) {
                newData.slug = generateSlug(value);
            }
            
            return newData;
        });
    };

    const handleQuillChange = (value) => {
        setFormData(prev => ({ ...prev, content: value }));
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
    
    const removeImage = async (e) => {
        e.stopPropagation();
        
        if (existingImage || imagePreview) {
            const confirmed = await alertService.confirm('Gỡ ảnh bìa', 'Bạn có chắc chắn muốn gỡ ảnh bìa của bài viết này không?');
            if (confirmed) {
                setImageFile(null);
                setImagePreview('');
                setExistingImage('');
                alertService.success('Đã gỡ ảnh tạm thời. Nhấn Lưu để áp dụng chính thức!');
            }
        }
    };

    const handleSubmit = async (e, publishStatus) => {
        if (e) e.preventDefault();
        
        // Validate
        if (!formData.title.trim()) {
            return alertService.error('Vui lòng nhập tiêu đề bài viết!');
        }
        
        setIsSaving(true);
        try {
            const submitData = new FormData();
            
            // Force status if provided (Lưu nháp vs Xuất bản)
            const finalStatus = publishStatus !== undefined ? publishStatus : formData.is_published;
            const payload = { ...formData, is_published: finalStatus };
            
            Object.keys(payload).forEach(key => {
                submitData.append(key, payload[key]);
            });
            
            // Note: The field name expected by the multer middleware is 'image'
            if (imageFile) {
                submitData.append('image', imageFile);
            } else if (isEditMode && !existingImage) {
                // User removed the image explicitly without uploading a new one
                submitData.append('thumbnail_url', '');
            }

            if (isEditMode) {
                await api.put(`/posts/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/posts', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alertService.success('Đã lưu bài viết!');
            navigate('/admin/posts');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['code-block', 'link', 'image'],
            ['clean']
        ],
    };

    if (isLoading) return <div className="loading-spinner">Đang tải Editor...</div>;

    return (
        <div className="admin-module">
            <div className="module-header" style={{ marginBottom: '16px' }}>
                <div>
                    <h2>{isEditMode ? 'Chỉnh sửa Bài viết' : 'Viết Bài mới'}</h2>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/admin/posts')} disabled={isSaving}>
                    Quay lại danh sách
                </button>
            </div>

            <form className="editor-layout" onSubmit={(e) => handleSubmit(e)}>
                
                {/* LLEFT COLUMN - 70% */}
                <div className="editor-main">
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="Nhập tiêu đề bài viết tại đây..." 
                        className="editor-title-input"
                        autoComplete="off"
                    />
                    
                    <div className="editor-slug-wrapper">
                        <span>🔗</span>
                        <span style={{ color: '#94a3b8' }}>/blog/</span>
                        <input 
                            type="text" 
                            name="slug" 
                            value={formData.slug} 
                            onChange={handleChange} 
                            className="editor-slug-input"
                            readOnly={isSlugLocked}
                        />
                        <button type="button" className="btn-lock" onClick={() => setIsSlugLocked(!isSlugLocked)} title={isSlugLocked ? 'Mở khóa để sửa slug' : 'Đang sửa thủ công'}>
                            {isSlugLocked ? '🔒' : '🔓'}
                        </button>
                    </div>

                    <textarea 
                        name="excerpt" 
                        value={formData.excerpt} 
                        onChange={handleChange} 
                        placeholder="Viết 1-2 dòng tóm tắt bài viết (Excerpt)..."
                        className="editor-excerpt"
                        rows="3"
                    ></textarea>

                    <div className="editor-quill">
                        <ReactQuill 
                            theme="snow" 
                            value={formData.content} 
                            onChange={handleQuillChange}
                            modules={quillModules}
                            placeholder="Bắt đầu viết nội dung tuyệt vời của bạn ở đây..."
                            style={{ height: '500px' }}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN - 30% */}
                <div className="editor-sidebar">
                    
                    {/* Publishing Settings */}
                    <div className="side-card">
                        <div className="side-card-header">Trạng thái & Xuất bản</div>
                        <div className="side-card-body">
                            <div className="status-pills">
                                <div 
                                    className={`status-pill ${formData.is_published === 0 ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, is_published: 0}))}
                                >
                                    Bản nháp
                                </div>
                                <div 
                                    className={`status-pill ${formData.is_published === 1 ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, is_published: 1}))}
                                >
                                    Xuất bản
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '8px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Ngày xuất bản</label>
                                <input 
                                    type="date" 
                                    name="published_at" 
                                    value={formData.published_at} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Taxonomy */}
                    <div className="side-card">
                        <div className="side-card-header">Phân loại & Thẻ</div>
                        <div className="side-card-body">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Danh mục</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleChange} 
                                        list="category-suggestions" 
                                        placeholder="Chọn hoặc gõ nhóm mới..." 
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map(cat => <option key={cat} value={cat} />)}
                                    </datalist>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Thẻ (Tags) - Phân cách bằng dấu phẩy</label>
                                <input 
                                    type="text" 
                                    name="tags" 
                                    value={formData.tags} 
                                    onChange={handleChange} 
                                    placeholder="Ví dụ: react, javascript, tips..." 
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="side-card">
                        <div className="side-card-header">Ảnh bìa bài viết</div>
                        <div className="side-card-body">
                            <div className="cover-upload-box" onClick={triggerFileInput}>
                                {imagePreview || existingImage ? (
                                    <div className="cover-preview">
                                        <img src={imagePreview || existingImage} alt="Cover Preview" />
                                        <div className="cover-actions">
                                            <button type="button" className="cover-btn" onClick={triggerFileInput}>Thay đổi</button>
                                            <button type="button" className="cover-btn" style={{ background: 'rgba(239,68,68,0.8)' }} onClick={removeImage}>Xóa</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Click hoặc kéo thả ảnh vào đây</div>
                                    </>
                                )}
                                <input type="file" ref={iconInputRef} accept="image/jpeg, image/png, image/jpg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sticky Action Bar */}
                <div className="editor-sticky-bar">
                    <div className="sticky-actions-left">
                        {isEditMode && (
                            <button type="button" className="btn-secondary" onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}>
                                👁️ Xem Preview
                            </button>
                        )}
                    </div>
                    <div className="sticky-actions-right">
                        <button type="button" className="btn-secondary" onClick={(e) => handleSubmit(e, 0)} disabled={isSaving}>
                            Lưu bản nháp
                        </button>
                        <button type="button" className="btn-primary" onClick={(e) => handleSubmit(e, 1)} disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : '🚀 Lưu & Xuất bản'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
