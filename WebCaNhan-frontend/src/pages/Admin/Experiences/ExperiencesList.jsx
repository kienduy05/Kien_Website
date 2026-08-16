import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const ExperiencesList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/experiences');
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
                await api.delete(`/experiences/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { header: 'Công ty', accessor: 'company_name' },
        { header: 'Vị trí', accessor: 'position' },
        { header: 'Bắt đầu', accessor: 'start_date', render: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '' },
        { header: 'Kết thúc', accessor: 'end_date', render: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : 'Hiện tại' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Kinh nghiệm</h2>
                    <p>Danh sách kinh nghiệm làm việc</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/experiences/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/experiences/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default ExperiencesList;
