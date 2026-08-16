import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './ProfileEdit.css';
import alertService from '../../utils/alert';

const ProfileEdit = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        nickname: '',
        job_title: '',
        dob: '',
        gender: '',
        nationality: '',
        marital_status: '',
        languages: '',
        hobbies: '',
        freelance_status: '',
        timezone: '',
        availability_date: '',
        email: '',
        phone: '',
        location: '',
        short_description: '',
        about_description: '',
        career_goal: '',
        avatar_url: '',
        cover_photo_url: '',
        cv_url: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [cvPreview, setCvPreview] = useState('');
    
    // Modal state for viewing files
    const [viewModal, setViewModal] = useState({ isOpen: false, type: '', url: '' });

    // Assuming profile ID is 1 as established
    const profileId = 1;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/profile/${profileId}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                const safeProfile = Object.keys(data).reduce((acc, key) => {
                    // Format dates for input type="date"
                    if ((key === 'dob' || key === 'availability_date') && data[key]) {
                        acc[key] = new Date(data[key]).toISOString().split('T')[0];
                    } else {
                        acc[key] = data[key] || '';
                    }
                    return acc;
                }, {});
                
                // Merge with default state structure
                setProfile(prev => ({...prev, ...safeProfile}));
                
                if (data.avatar_url) {
                    setAvatarPreview(`http://localhost:5000/uploads/profile/${data.avatar_url}`);
                }
                if (data.cover_photo_url) {
                    setCoverPhotoPreview(`http://localhost:5000/uploads/profile/${data.cover_photo_url}`);
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Tải dữ liệu hồ sơ thất bại!' });
            console.error("Fetch profile error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (name === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
            } else if (name === 'cover_photo') {
                setCoverPhotoFile(file);
                setCoverPhotoPreview(URL.createObjectURL(file));
            } else if (name === 'cv') {
                setCvFile(file);
                setCvPreview(URL.createObjectURL(file));
            }
        }
    };

    const openPreview = (type, url) => {
        setViewModal({ isOpen: true, type, url });
    };

    const closePreview = () => {
        setViewModal({ isOpen: false, type: '', url: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Bạn có chắc chắn muốn lưu các thông tin này không?', 'Lưu', 'Hủy');
        if (!isConfirmed) return;
        
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            
            // Append text fields
            const { id, updated_at, avatar_url, cover_photo_url, cv_url, ...updateData } = profile;
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== null && updateData[key] !== undefined) {
                    formData.append(key, updateData[key]);
                }
            });

            // Append files
            if (avatarFile) formData.append('avatar', avatarFile);
            if (coverPhotoFile) formData.append('cover_photo', coverPhotoFile);
            if (cvFile) formData.append('cv', cvFile);

            await api.put(`/profile/${profileId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            alertService.success('Cập nhật thành công!');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Cập nhật hồ sơ thất bại!' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Đang tải hồ sơ...</div>;

    return (
        <div className="admin-module">
            <div className="module-header">
                <h2>Quản lý Hồ sơ</h2>
                <p>Quản lý thông tin hồ sơ cá nhân hiển thị công khai</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form extended-form">
                
                {/* 1. Basic Info Section */}
                <div className="form-section">
                    <h3 className="section-title">Thông tin Cá nhân</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Họ và Tên</label>
                            <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Biệt danh / Nghệ danh</label>
                            <input type="text" name="nickname" value={profile.nickname} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <input type="date" name="dob" value={profile.dob} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Giới tính</label>
                            <select name="gender" value={profile.gender} onChange={handleChange}>
                                <option value="">Chọn...</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quốc tịch</label>
                            <input type="text" name="nationality" value={profile.nationality} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Tình trạng hôn nhân</label>
                            <select name="marital_status" value={profile.marital_status} onChange={handleChange}>
                                <option value="">Chọn...</option>
                                <option value="Single">Độc thân</option>
                                <option value="Married">Đã kết hôn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Professional & Contact Info */}
                <div className="form-section">
                    <h3 className="section-title">Nghề nghiệp & Liên hệ</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Chức danh (Job Title)</label>
                            <input type="text" name="job_title" value={profile.job_title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái nhận việc</label>
                            <select name="freelance_status" value={profile.freelance_status} onChange={handleChange}>
                                <option value="">Chọn...</option>
                                <option value="Available">Đang tìm việc / Nhận Freelance</option>
                                <option value="Not Available">Chưa sẵn sàng</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Múi giờ làm việc</label>
                            <input type="text" name="timezone" placeholder="VD: GMT+7" value={profile.timezone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Ngày có thể bắt đầu làm</label>
                            <input type="date" name="availability_date" value={profile.availability_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={profile.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <input type="text" name="location" value={profile.location} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* 3. Details */}
                <div className="form-section">
                    <h3 className="section-title">Kỹ năng & Sở thích</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngôn ngữ giao tiếp</label>
                            <input type="text" name="languages" placeholder="VD: Tiếng Việt (Bản ngữ), Tiếng Anh (Lưu loát)" value={profile.languages} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Sở thích</label>
                            <input type="text" name="hobbies" placeholder="VD: Đọc sách, Lập trình, Du lịch" value={profile.hobbies} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* 4. Descriptions */}
                <div className="form-section">
                    <h3 className="section-title">Giới thiệu Bản thân</h3>
                    <div className="form-group">
                        <label>Mô tả ngắn (Hiển thị phần Đầu trang/Hero)</label>
                        <textarea name="short_description" value={profile.short_description} onChange={handleChange} rows="2" />
                    </div>
                    <div className="form-group">
                        <label>Về tôi (Mô tả chi tiết)</label>
                        <textarea name="about_description" value={profile.about_description} onChange={handleChange} rows="4" />
                    </div>
                    <div className="form-group">
                        <label>Mục tiêu nghề nghiệp</label>
                        <textarea name="career_goal" value={profile.career_goal} onChange={handleChange} rows="3" placeholder="Bạn thấy mình ở đâu trong 3-5 năm tới?" />
                    </div>
                </div>

                {/* 5. Media & Files */}
                <div className="form-section">
                    <h3 className="section-title">Hình ảnh & Tệp đính kèm</h3>
                    <div className="form-row">
                        <div className="form-group file-group">
                            <label>Ảnh đại diện (Avatar)</label>
                            <div className="file-preview-container">
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        className="avatar-preview clickable" 
                                        onClick={() => openPreview('image', avatarPreview)}
                                        title="Click để xem ảnh lớn"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">Trống</div>
                                )}
                                <div className="custom-upload-wrapper">
                                    <label htmlFor="avatar-upload" className="custom-upload-btn">
                                        <span className="icon">📷</span> Đổi ảnh
                                    </label>
                                    <input id="avatar-upload" type="file" name="avatar" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} className="hidden-file-input" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group file-group">
                            <label>Ảnh bìa (Cover Banner)</label>
                            <div className="file-preview-container">
                                {coverPhotoPreview ? (
                                    <img 
                                        src={coverPhotoPreview} 
                                        alt="Cover Preview" 
                                        className="avatar-preview clickable cover-preview" 
                                        onClick={() => openPreview('image', coverPhotoPreview)}
                                        title="Click để xem ảnh lớn"
                                    />
                                ) : (
                                    <div className="avatar-placeholder cover-placeholder">Trống</div>
                                )}
                                <div className="custom-upload-wrapper">
                                    <label htmlFor="cover-upload" className="custom-upload-btn">
                                        <span className="icon">🖼️</span> Tải ảnh bìa
                                    </label>
                                    <input id="cover-upload" type="file" name="cover_photo" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} className="hidden-file-input" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group file-group">
                            <label>Hồ sơ năng lực (CV - PDF)</label>
                            <div className="file-preview-container cv-container">
                                {cvPreview || profile.cv_url ? (
                                    <button 
                                        type="button"
                                        className="preview-btn"
                                        onClick={() => openPreview('pdf', cvPreview || `http://localhost:5000/uploads/profile/${profile.cv_url}`)}
                                        title="Click để xem CV"
                                    >
                                        <span className="icon">📄</span> 
                                        <span className="filename">
                                            {cvFile ? cvFile.name : profile.cv_url}
                                        </span>
                                    </button>
                                ) : (
                                    <span className="no-cv">Chưa có CV</span>
                                )}
                                <div className="custom-upload-wrapper">
                                    <label htmlFor="cv-upload" className="custom-upload-btn">
                                        <span className="icon">📁</span> Tải lên CV
                                    </label>
                                    <input id="cv-upload" type="file" name="cv" accept="application/pdf" onChange={handleFileChange} className="hidden-file-input" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
                    </button>
                </div>
            </form>

            {/* Preview Modal */}
            {viewModal.isOpen && (
                <div className="preview-modal-overlay" onClick={closePreview}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={closePreview}>✕</button>
                        {viewModal.type === 'image' ? (
                            <img src={viewModal.url} alt="Large Preview" className="large-preview-img" />
                        ) : (
                            <iframe src={viewModal.url} className="pdf-preview-frame" title="CV Preview"></iframe>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEdit;
