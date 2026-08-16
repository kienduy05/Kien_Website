import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const SocialLinksList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/social_links');
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
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                await api.delete(`/social_links/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { header: 'Nền tảng', accessor: 'platform' },
        { header: 'URL', accessor: 'url', render: (row) => <a href={row.url} target="_blank" rel="noreferrer" style={{color: '#60a5fa'}}>{row.url}</a> },
        { header: 'Thứ tự', accessor: 'display_order', width: '80px' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Mạng xã hội</h2>
                    <p>Quản lý các liên kết mạng xã hội</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/social-links/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/social-links/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default SocialLinksList;
