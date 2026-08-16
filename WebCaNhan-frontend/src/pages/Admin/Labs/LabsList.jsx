import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const LabsList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/labs');
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
                await api.delete(`/labs/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { header: 'Tiêu đề', accessor: 'title' },
        { header: 'Link', accessor: 'github_url', render: (row) => <a href={row.github_url} target="_blank" rel="noreferrer" style={{color: '#60a5fa'}}>Xem Lab</a> },
        { header: 'Mô tả', accessor: 'short_description' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Labs (Thử nghiệm)</h2>
                    <p>Quản lý các project thử nghiệm nhỏ</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/labs/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/labs/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default LabsList;
