import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../utils/api';
import './ProfileEdit.css';
import alertService from '../../utils/alert';

// --- Internal Component: TagInput ---
const TagInput = ({ tags, setTags, placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputValue.trim().replace(/^,+|,+$/g, '');
            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            setTags(tags.slice(0, tags.length - 1));
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="tag-input-container">
            {tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                    {tag}
                    <span className="tag-close" onClick={() => removeTag(index)}>×</span>
                </span>
            ))}
            <input
                type="text"
                className="tag-input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
            />
        </div>
    );
};

// --- Main Component: ProfileEdit ---
const ProfileEdit = () => {
    const [profile, setProfile] = useState({
        full_name: '', nickname: '', job_title: '', dob: '', gender: '', nationality: '', marital_status: '',
        freelance_status: '', timezone: '', availability_date: '', email: '', phone: '', location: '',
        short_description: '', about_description: '', career_goal: '',
        avatar_url: '', cover_photo_url: '', cv_url: ''
    });
    
    // Arrays for TagInputs
    const [languageTags, setLanguageTags] = useState([]);
    const [hobbyTags, setHobbyTags] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [cvPreview, setCvPreview] = useState('');
    
    // Modal state for viewing files
    const [viewModal, setViewModal] = useState({ isOpen: false, type: '', url: '' });

    const profileId = 1;

    // File input refs
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const cvInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/profile/${profileId}`);
            if (response.data.metadata) {
                const data = response.data.metadata;
                const safeProfile = Object.keys(data).reduce((acc, key) => {
                    if ((key === 'dob' || key === 'availability_date') && data[key]) {
                        acc[key] = new Date(data[key]).toISOString().split('T')[0];
                    } else {
                        acc[key] = data[key] || '';
                    }
                    return acc;
                }, {});
                
                setProfile(prev => ({...prev, ...safeProfile}));
                
                // Parse tags
                if (data.languages) setLanguageTags(data.languages.split(',').map(t => t.trim()).filter(Boolean));
                if (data.hobbies) setHobbyTags(data.hobbies.split(',').map(t => t.trim()).filter(Boolean));

                if (data.avatar_url) setAvatarPreview(`http://localhost:5000/uploads/profile/${data.avatar_url}`);
                if (data.cover_photo_url) setCoverPhotoPreview(`http://localhost:5000/uploads/profile/${data.cover_photo_url}`);
                
                // Reset unsaved changes flag after load
                setTimeout(() => setHasUnsavedChanges(false), 100);
            }
        } catch (error) {
            alertService.error('Tải dữ liệu hồ sơ thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    // Track changes
    useEffect(() => {
        if (!isLoading) {
            setHasUnsavedChanges(true);
        }
    }, [profile, languageTags, hobbyTags, avatarFile, coverPhotoFile, cvFile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleQuillChange = (value) => {
        setProfile(prev => ({ ...prev, about_description: value }));
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

    const openPreview = (e, type, url) => {
        e.stopPropagation();
        setViewModal({ isOpen: true, type, url });
    };

    const closePreview = () => {
        setViewModal({ isOpen: false, type: '', url: '' });
    };

    const triggerFileInput = (ref) => {
        if (ref.current) ref.current.click();
    };

    const handleSubmit = async () => {
        const isConfirmed = await alertService.confirm('Xác nhận lưu', 'Lưu các thông tin thay đổi vào hồ sơ?');
        if (!isConfirmed) return;
        
        setIsSaving(true);
        try {
            const formData = new FormData();
            
            const { id, updated_at, avatar_url, cover_photo_url, cv_url, languages, hobbies, ...updateData } = profile;
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== null && updateData[key] !== undefined) {
                    formData.append(key, updateData[key]);
                }
            });

            // Append comma-separated tags
            formData.append('languages', languageTags.join(', '));
            formData.append('hobbies', hobbyTags.join(', '));

            if (avatarFile) formData.append('avatar', avatarFile);
            if (coverPhotoFile) formData.append('cover_photo', coverPhotoFile);
            if (cvFile) formData.append('cv', cvFile);

            await api.put(`/profile/${profileId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            alertService.success('Cập nhật hồ sơ thành công!');
            setHasUnsavedChanges(false);
            
            // Re-fetch to get new URLs and reset files
            setAvatarFile(null);
            setCoverPhotoFile(null);
            setCvFile(null);
            fetchProfile();

        } catch (error) {
            alertService.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = async () => {
        if (hasUnsavedChanges) {
            const isConfirmed = await alertService.confirm('Hủy thay đổi', 'Những thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn?');
            if (!isConfirmed) return;
        }
        setAvatarFile(null);
        setCoverPhotoFile(null);
        setCvFile(null);
        setIsLoading(true);
        fetchProfile();
    };

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    if (isLoading) return <div className="loading-spinner">Đang tải hồ sơ...</div>;

    return (
        <div className="profile-dashboard admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Hồ sơ Cá nhân</h2>
                    <p>Thiết lập thông tin hiển thị chính trên trang chủ Portfolio</p>
                </div>
            </div>

            <div className="profile-layout">
                {/* LEFT COLUMN: Overview Card */}
                <div className="profile-sidebar">
                    <div className="overview-card">
                        <div className="overview-avatar-wrapper">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="overview-avatar" />
                            ) : (
                                <div className="overview-avatar-placeholder">👤</div>
                            )}
                        </div>
                        <h3 className="overview-name">{profile.full_name || 'Tên của bạn'}</h3>
                        <p className="overview-title">{profile.job_title || 'Chức danh công việc'}</p>
                        
                        <div className={`overview-status ${profile.freelance_status === 'Available' ? 'status-available' : profile.freelance_status === 'Not Available' ? 'status-busy' : 'status-neutral'}`}>
                            {profile.freelance_status === 'Available' ? '🟢 Đang tìm việc / Nhận Freelance' : profile.freelance_status === 'Not Available' ? '🔴 Đang bận' : '⚪ Chưa cập nhật'}
                        </div>

                        <div className="quick-stats">
                            <div className="stat-item">
                                <span className="icon">📧</span>
                                <span>{profile.email || 'Chưa cập nhật email'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="icon">📞</span>
                                <span>{profile.phone || 'Chưa cập nhật SĐT'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="icon">📍</span>
                                <span>{profile.location || 'Chưa cập nhật vị trí'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="icon">🌍</span>
                                <span>{profile.nationality || 'Chưa cập nhật Quốc tịch'}</span>
                            </div>
                        </div>

                        {(cvPreview || profile.cv_url) && (
                            <button 
                                className="btn-secondary" 
                                style={{ width: '100%', marginTop: '16px' }}
                                onClick={(e) => openPreview(e, 'pdf', cvPreview || `http://localhost:5000/uploads/profile/${profile.cv_url}`)}
                            >
                                📄 Xem trước CV
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Main Content Forms */}
                <div className="profile-content">
                    
                    {/* CARD 1: Basic Identity */}
                    <div className="profile-card">
                        <div className="card-header">
                            <div className="card-icon">👤</div>
                            <div>
                                <h3 className="card-title">Thông tin cơ bản & Định danh</h3>
                                <p className="card-subtitle">Họ tên, ngày sinh, quốc tịch...</p>
                            </div>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Họ và Tên <span style={{color: '#ef4444'}}>*</span></label>
                                <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} placeholder="Tên đầy đủ của bạn" required />
                            </div>
                            <div className="form-group">
                                <label>Biệt danh / Nghệ danh</label>
                                <input type="text" name="nickname" value={profile.nickname} onChange={handleChange} placeholder="Ví dụ: Kien Nguyen" />
                            </div>
                        </div>
                        <div className="form-grid-3">
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
                                <div className="input-with-icon">
                                    <span className="input-icon">🏳️</span>
                                    <input type="text" name="nationality" value={profile.nationality} onChange={handleChange} placeholder="Ví dụ: Việt Nam" />
                                </div>
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

                    {/* CARD 2: Career & Contact */}
                    <div className="profile-card">
                        <div className="card-header">
                            <div className="card-icon">💼</div>
                            <div>
                                <h3 className="card-title">Nghề nghiệp & Liên hệ</h3>
                                <p className="card-subtitle">Chức danh, trạng thái việc làm, email, SĐT...</p>
                            </div>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Chức danh công việc (Job Title) <span style={{color: '#ef4444'}}>*</span></label>
                                <input type="text" name="job_title" value={profile.job_title} onChange={handleChange} placeholder="Ví dụ: Fullstack Developer" required />
                            </div>
                            <div className="form-group">
                                <label>Trạng thái việc làm</label>
                                <select name="freelance_status" value={profile.freelance_status} onChange={handleChange}>
                                    <option value="">Chọn...</option>
                                    <option value="Available">🟢 Đang tìm việc / Nhận Freelance</option>
                                    <option value="Not Available">🔴 Đang bận / Chưa sẵn sàng</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Múi giờ làm việc</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">🕒</span>
                                    <select name="timezone" value={profile.timezone} onChange={handleChange}>
                                        <option value="">Chọn múi giờ...</option>
                                        <option value="GMT+7 (Asia/Ho_Chi_Minh)">GMT+7 (Asia/Ho_Chi_Minh)</option>
                                        <option value="GMT+8 (Asia/Singapore)">GMT+8 (Asia/Singapore)</option>
                                        <option value="GMT+9 (Asia/Tokyo)">GMT+9 (Asia/Tokyo)</option>
                                        <option value="EST (US Eastern)">EST (US Eastern)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Ngày có thể bắt đầu làm</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">📅</span>
                                    <input type="date" name="availability_date" value={profile.availability_date} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
                        <div className="form-grid-3">
                            <div className="form-group">
                                <label>Email liên hệ</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">@</span>
                                    <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="email@example.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">📞</span>
                                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="+84 123 456 789" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ / Nơi cư trú</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">📍</span>
                                    <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="Thành phố, Quốc gia" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Skills, Langs & Hobbies */}
                    <div className="profile-card">
                        <div className="card-header">
                            <div className="card-icon">⚡</div>
                            <div>
                                <h3 className="card-title">Kỹ năng mềm, Ngôn ngữ & Sở thích</h3>
                                <p className="card-subtitle">Gõ từ khóa và bấm Enter để thêm Tag</p>
                            </div>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Ngôn ngữ giao tiếp</label>
                                <TagInput 
                                    tags={languageTags} 
                                    setTags={setLanguageTags} 
                                    placeholder="Ví dụ: Tiếng Anh (IELTS 7.0)..." 
                                />
                                <span className="input-hint">Nhấn Enter để thêm mới</span>
                            </div>
                            <div className="form-group">
                                <label>Sở thích cá nhân</label>
                                <TagInput 
                                    tags={hobbyTags} 
                                    setTags={setHobbyTags} 
                                    placeholder="Ví dụ: Đọc sách, Chơi game..." 
                                />
                                <span className="input-hint">Nhấn Enter để thêm mới</span>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Bio & Pitch */}
                    <div className="profile-card">
                        <div className="card-header">
                            <div className="card-icon">📝</div>
                            <div>
                                <h3 className="card-title">Giới thiệu Bản thân (Bio & Pitch)</h3>
                                <p className="card-subtitle">Headline, mô tả chi tiết và mục tiêu nghề nghiệp</p>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Mô tả ngắn gọn (Headline / Tagline)</label>
                            <input 
                                type="text" 
                                name="short_description" 
                                value={profile.short_description} 
                                onChange={handleChange} 
                                maxLength={120}
                                placeholder="Một câu slogan hoặc mô tả cực ngắn về bạn..." 
                            />
                            <span className="input-hint">{profile.short_description.length}/120 ký tự</span>
                        </div>
                        <div className="form-group" style={{ marginBottom: '60px' }}>
                            <label>Về bản thân chi tiết (About Me)</label>
                            <ReactQuill 
                                theme="snow" 
                                value={profile.about_description} 
                                onChange={handleQuillChange}
                                modules={quillModules}
                                style={{ height: '200px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mục tiêu nghề nghiệp (Career Objective)</label>
                            <textarea 
                                name="career_goal" 
                                value={profile.career_goal} 
                                onChange={handleChange} 
                                rows="3" 
                                placeholder="Bạn thấy mình ở đâu trong 3-5 năm tới? Mục tiêu của bạn là gì?" 
                            />
                        </div>
                    </div>

                    {/* CARD 5: Media & Files */}
                    <div className="profile-card">
                        <div className="card-header">
                            <div className="card-icon">🖼️</div>
                            <div>
                                <h3 className="card-title">Tệp đính kèm & Hình ảnh</h3>
                                <p className="card-subtitle">Ảnh đại diện, ảnh bìa và CV file</p>
                            </div>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Ảnh đại diện (Avatar)</label>
                                <div className="dropzone-container" onClick={() => triggerFileInput(avatarInputRef)}>
                                    {avatarPreview ? (
                                        <>
                                            <img src={avatarPreview} alt="Avatar" className="dropzone-preview" style={{ borderRadius: '50%', width: '140px', height: '140px', objectFit: 'cover', top: 'calc(50% - 70px)', left: 'calc(50% - 70px)' }} />
                                            <div className="dropzone-preview-overlay" style={{ borderRadius: '50%', width: '140px', height: '140px', top: 'calc(50% - 70px)', left: 'calc(50% - 70px)' }}>Đổi ảnh</div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="dropzone-icon">👤</span>
                                            <span className="dropzone-text">Click để chọn ảnh</span>
                                            <span className="dropzone-subtext">JPG, PNG (Tỷ lệ 1:1)</span>
                                        </>
                                    )}
                                    <input type="file" ref={avatarInputRef} name="avatar" accept="image/*" onChange={handleFileChange} className="dropzone-input" />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Ảnh bìa (Cover Banner)</label>
                                <div className="dropzone-container" onClick={() => triggerFileInput(coverInputRef)}>
                                    {coverPhotoPreview ? (
                                        <>
                                            <img src={coverPhotoPreview} alt="Cover" className="dropzone-preview" />
                                            <div className="dropzone-preview-overlay">Đổi ảnh bìa</div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="dropzone-icon">🖼️</span>
                                            <span className="dropzone-text">Click để chọn ảnh</span>
                                            <span className="dropzone-subtext">Tỷ lệ khuyên dùng 16:9 hoặc 3:1</span>
                                        </>
                                    )}
                                    <input type="file" ref={coverInputRef} name="cover_photo" accept="image/*" onChange={handleFileChange} className="dropzone-input" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Hồ sơ năng lực (CV - PDF)</label>
                            {(cvPreview || profile.cv_url) ? (
                                <div className="cv-file-card">
                                    <span className="cv-file-icon">📄</span>
                                    <div className="cv-file-info">
                                        <div className="cv-file-name">{cvFile ? cvFile.name : profile.cv_url}</div>
                                    </div>
                                    <div className="cv-actions">
                                        <button type="button" className="btn-secondary" onClick={(e) => openPreview(e, 'pdf', cvPreview || `http://localhost:5000/uploads/profile/${profile.cv_url}`)}>Xem</button>
                                        <button type="button" className="btn-secondary" onClick={() => triggerFileInput(cvInputRef)}>Đổi file</button>
                                    </div>
                                    <input type="file" ref={cvInputRef} name="cv" accept="application/pdf" onChange={handleFileChange} style={{display: 'none'}} />
                                </div>
                            ) : (
                                <div className="dropzone-container" onClick={() => triggerFileInput(cvInputRef)} style={{ minHeight: '100px', flexDirection: 'row', gap: '16px' }}>
                                    <span className="dropzone-icon" style={{ marginBottom: 0 }}>📁</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div className="dropzone-text">Tải lên file CV (PDF)</div>
                                        <div className="dropzone-subtext">Nhà tuyển dụng có thể tải xuống hồ sơ này</div>
                                    </div>
                                    <input type="file" ref={cvInputRef} name="cv" accept="application/pdf" onChange={handleFileChange} className="dropzone-input" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* STICKY BOTTOM BAR */}
            <div className="sticky-bottom-bar">
                <div className="bar-info">
                    <div className="bar-status">
                        <span className={`status-dot ${hasUnsavedChanges ? 'unsaved' : ''}`}></span>
                        {hasUnsavedChanges ? 'Chưa lưu thay đổi' : 'Đã đồng bộ'}
                    </div>
                </div>
                <div className="bar-actions">
                    <button type="button" className="btn-secondary" onClick={handleCancel} disabled={!hasUnsavedChanges || isSaving}>
                        Hủy thay đổi
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSubmit} disabled={!hasUnsavedChanges || isSaving}>
                        {isSaving ? 'Đang lưu...' : '💾 Lưu Hồ sơ'}
                    </button>
                </div>
            </div>

            {/* Preview Modal for Images & CV */}
            {viewModal.isOpen && (
                <div className="preview-modal-overlay" onClick={closePreview} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '90%', maxWidth: '1000px', height: '90vh', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                        <button className="close-modal" onClick={closePreview} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10 }}>✕</button>
                        {viewModal.type === 'image' ? (
                            <img src={viewModal.url} alt="Large Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <iframe src={viewModal.url} title="CV Preview" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEdit;
