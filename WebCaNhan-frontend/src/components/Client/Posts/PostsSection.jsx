import React from 'react';

const PostsSection = ({ posts }) => {
    // Only published posts, sorted by published_at DESC, max 3
    const recentPosts = (posts || [])
        .filter(p => p.is_published)
        .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
        .slice(0, 3);

    if (recentPosts.length === 0) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <section id="blog" className="portfolio-section">
            <h2 className="section-title">Bài viết <span>Mới nhất</span></h2>
            
            <div className="posts-grid">
                {recentPosts.map((post, index) => (
                    <div key={index} className="post-card">
                        <img 
                            src={post.thumbnail_url ? `http://localhost:5000/uploads/posts/${post.thumbnail_url}` : '/placeholder-blog.jpg'} 
                            alt={post.title} 
                            className="post-img" 
                        />
                        <div className="post-content">
                            <div className="post-meta">
                                <span className="post-category">{post.category || 'Chưa phân loại'}</span>
                                <span>{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-excerpt">{post.excerpt || 'Đọc bài viết để biết thêm chi tiết...'}</p>
                            
                            <a href={`/posts/${post.slug}`} className="btn-outline" style={{width: '100%', textAlign: 'center', marginTop: 'auto'}}>
                                Đọc tiếp &rarr;
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PostsSection;
