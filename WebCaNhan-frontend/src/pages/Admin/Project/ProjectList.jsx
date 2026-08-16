import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const ProjectList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/projects');
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
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa dự án này? Các ảnh liên quan cũng sẽ bị xóa.')) {
            try {
                await api.delete(`/projects/${row.id}`);
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
            header: 'Ảnh chính', 
            accessor: 'primary_image', 
            className: 'td-image',
            render: (row) => row.primary_image ? <img src={`http://localhost:5000/uploads/projects/${row.primary_image}`} alt={row.name} /> : <div className="no-image-ph">Trống</div> 
        },
        { header: 'Tên dự án', accessor: 'name' },
        { header: 'Nổi bật', accessor: 'is_featured', render: (row) => row.is_featured ? '⭐ Có' : 'Không' },
        { header: 'Thứ tự', accessor: 'display_order' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Dự án</h2>
                    <p>Danh sách các dự án trong Portfolio</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/projects/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/projects/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default ProjectList;
