import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';

const PostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        content: '',
        is_published: 0,
        published_at: ''
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
            const response = await api.get(`/posts/${id}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    category: data.category || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    is_published: data.is_published ? 1 : 0,
                    published_at: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : ''
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
                submitData.append('image', imageFile);
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
            alertService.success('Lưu dữ liệu thành công!');
            navigate('/admin/posts');
        } catch (error) {
            alertService.error(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>{isEditMode ? 'Sửa Bài viết' : 'Thêm mới Bài viết'}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/posts')}>Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form extended-form">
                <div className="form-section">
                    <h3 className="section-title">Nội dung</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tiêu đề *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL thân thiện) *</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Danh mục (Category)</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Tóm tắt (Summary)</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3"></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label>Nội dung chi tiết (Markdown / HTML)</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows="10"></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Xuất bản & Hình ảnh</h3>
                    
                    <div className="form-row">
                        <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                            <label>Ngày xuất bản</label>
                            <input type="date" name="published_at" value={formData.published_at} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group file-group" style={{ marginTop: '20px' }}>
                        <label>Ảnh bìa bài viết</label>
                        <div className="file-preview-container">
                            {imagePreview || existingImage ? (
                                <img 
                                    src={imagePreview || existingImage} 
                                    alt="Cover Preview" 
                                    className="avatar-preview cover-preview" 
                                />
                            ) : (
                                <div className="avatar-placeholder cover-placeholder">Chưa có ảnh</div>
                            )}
                            <div className="custom-upload-wrapper">
                                <label htmlFor="image-upload" className="custom-upload-btn">
                                    <span className="icon">🖼️</span> Chọn ảnh
                                </label>
                                <input id="image-upload" type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} className="hidden-file-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu Bài viết'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
