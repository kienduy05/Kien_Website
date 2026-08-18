import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import alertService from '../../../utils/alert';
import './Post.css';

const PostList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [filterTab, setFilterTab] = useState('all'); // all, published, draft
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/posts');
            if (response.data.metadata) {
                // Sort by updated_at desc
                const sorted = response.data.metadata.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                setData(sorted);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alertService.error('Lỗi khi tải dữ liệu bài viết');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (await alertService.confirm('Xóa bài viết', `Xóa vĩnh viễn bài viết "${title}"?`)) {
            try {
                await api.delete(`/posts/${id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const categories = [...new Set(data.map(item => item.category).filter(Boolean))];

    // Filter logic
    const filteredData = data.filter(item => {
        // Tab filter
        if (filterTab === 'published' && !item.is_published) return false;
        if (filterTab === 'draft' && item.is_published) return false;
        
        // Category filter
        if (selectedCategory && item.category !== selectedCategory) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchTitle = item.title?.toLowerCase().includes(query);
            return matchTitle;
        }
        
        return true;
    });

    // Stats
    const totalPosts = data.length;
    const publishedPosts = data.filter(i => i.is_published).length;
    const draftPosts = totalPosts - publishedPosts;

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Bài viết (Blog)</h2>
                    <p>Hệ thống nội dung chuẩn CMS</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/posts/new')}>
                    + Viết bài mới
                </button>
            </div>

            <div className="post-dashboard">
                {/* Stats Row */}
                <div className="post-stats-row">
                    <div className="stat-card" onClick={() => setFilterTab('all')} style={{cursor: 'pointer', borderColor: filterTab === 'all' ? '#3b82f6' : '#e2e8f0'}}>
                        <div className="stat-icon total">📄</div>
                        <div className="stat-info">
                            <h4>Tổng số bài viết</h4>
                            <p>{totalPosts}</p>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => setFilterTab('published')} style={{cursor: 'pointer', borderColor: filterTab === 'published' ? '#10b981' : '#e2e8f0'}}>
                        <div className="stat-icon published">✅</div>
                        <div className="stat-info">
                            <h4>Đã xuất bản</h4>
                            <p>{publishedPosts}</p>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => setFilterTab('draft')} style={{cursor: 'pointer', borderColor: filterTab === 'draft' ? '#f59e0b' : '#e2e8f0'}}>
                        <div className="stat-icon draft">📝</div>
                        <div className="stat-info">
                            <h4>Bản nháp</h4>
                            <p>{draftPosts}</p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="post-toolbar">
                    <div className="post-filters">
                        <div className="filter-search">
                            <span>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm tiêu đề bài viết..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select 
                            className="filter-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                {/* List Container */}
                {isLoading ? (
                    <div className="loading-spinner">Đang tải bài viết...</div>
                ) : filteredData.length === 0 ? (
                    <div className="empty-state" style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div className="empty-icon" style={{ fontSize: '3rem' }}>✍️</div>
                        <h3>Chưa có bài viết nào ở đây</h3>
                        <p style={{ color: '#64748b' }}>Bắt đầu viết bài đầu tiên để chia sẻ kiến thức của bạn.</p>
                        <button className="btn-primary" onClick={() => navigate('/admin/posts/new')} style={{ marginTop: '16px' }}>
                            + Viết bài ngay
                        </button>
                    </div>
                ) : (
                    <div className="post-list-container">
                        {filteredData.map(post => (
                            <div className="post-row-card" key={post.id}>
                                <div className="post-row-thumb" onClick={() => navigate(`/admin/posts/${post.id}`)} style={{ cursor: 'pointer' }}>
                                    {post.thumbnail_url ? (
                                        <img src={`http://localhost:5000/uploads/posts/${post.thumbnail_url}`} alt={post.title} />
                                    ) : (
                                        <div className="no-image">🖼️</div>
                                    )}
                                </div>
                                <div className="post-row-content">
                                    <div className="post-row-header">
                                        <div>
                                            <h3 className="post-row-title" onClick={() => navigate(`/admin/posts/${post.id}`)}>
                                                {post.title}
                                            </h3>
                                            <span className="post-row-slug">/blog/{post.slug}</span>
                                        </div>
                                        {post.is_published ? (
                                            <span className="post-badge badge-published">🟢 Đã xuất bản</span>
                                        ) : (
                                            <span className="post-badge badge-draft">🟡 Bản nháp</span>
                                        )}
                                    </div>
                                    
                                    <p className="post-row-excerpt">
                                        {post.excerpt || 'Chưa có tóm tắt...'}
                                    </p>

                                    <div className="post-row-footer">
                                        <div className="post-row-meta">
                                            {post.category && <span className="category">{post.category}</span>}
                                            {post.is_published && post.published_at && (
                                                <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <div className="post-row-actions">
                                            <button className="btn-secondary" onClick={() => window.open(`/blog/${post.slug}`, '_blank')} title="Xem bài viết ngoài trang chủ">
                                                👁️ Live Preview
                                            </button>
                                            <button className="btn-icon" onClick={() => navigate(`/admin/posts/${post.id}`)} title="Chỉnh sửa">
                                                ✏️
                                            </button>
                                            <button className="btn-icon text-danger" onClick={() => handleDelete(post.id, post.title)} title="Xóa">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;
