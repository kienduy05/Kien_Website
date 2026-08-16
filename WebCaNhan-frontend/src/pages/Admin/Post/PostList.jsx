import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const PostList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/posts');
            if (response.data.metadata) {
                setData(response.data.metadata);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (row) => {
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                await api.delete(`/posts/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { 
            header: 'Ảnh bìa', 
            accessor: 'image', 
            className: 'td-image',
            render: (row) => row.image ? <img src={`http://localhost:5000/uploads/posts/${row.image}`} alt={row.title} /> : <div className="no-image-ph">Trống</div> 
        },
        { header: 'Tiêu đề', accessor: 'title' },
        { 
            header: 'Trạng thái', 
            accessor: 'is_published', 
            render: (row) => (
                <span style={{ color: row.is_published ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                    {row.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
            ) 
        },
        { header: 'Ngày xuất bản', accessor: 'published_at', render: (row) => row.published_at ? new Date(row.published_at).toLocaleDateString() : '' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Bài viết</h2>
                    <p>Danh sách bài viết blog / tin tức</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/posts/new')}>
                    + Viết bài mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/posts/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default PostList;
