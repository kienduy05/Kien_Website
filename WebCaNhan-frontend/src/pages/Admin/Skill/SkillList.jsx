import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const SkillList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/skills');
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
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa kỹ năng này?')) {
            try {
                await api.delete(`/skills/${row.id}`);
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
            render: (row) => row.icon_url ? <img src={`http://localhost:5000/uploads/skills/${row.icon_url}`} alt={row.name} /> : <div className="no-image-ph">Trống</div> 
        },
        { header: 'Tên kỹ năng', accessor: 'name' },
        { header: 'Phân loại', accessor: 'category' },
        { header: 'Mức độ (%)', accessor: 'level', render: (row) => `${row.level}%` },
        { header: 'Thứ tự', accessor: 'display_order' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Kỹ năng</h2>
                    <p>Danh sách các kỹ năng cá nhân</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/skills/new')}>
                    + Thêm mới
                </button>
            </div>
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/skills/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default SkillList;
