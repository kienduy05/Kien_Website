import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const TechnologyList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/technologies');
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
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa công nghệ này?')) {
            try {
                await api.delete(`/technologies/${row.id}`);
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
            header: 'Icon', 
            accessor: 'icon_url', 
            className: 'td-image',
            render: (row) => row.icon_url ? <img src={`http://localhost:5000/uploads/technologies/${row.icon_url}`} alt={row.name} /> : <div className="no-image-ph">Trống</div> 
        },
        { header: 'Tên Công nghệ', accessor: 'name' },
        { header: 'Phân loại', accessor: 'category' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Công nghệ (Tech Stack)</h2>
                    <p>Danh sách các công cụ, ngôn ngữ lập trình</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/technologies/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/technologies/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default TechnologyList;
