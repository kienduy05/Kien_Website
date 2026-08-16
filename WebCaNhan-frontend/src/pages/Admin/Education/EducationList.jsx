import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const EducationList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/education');
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
                await api.delete(`/education/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!'); // Reload
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { header: 'Trường / Tổ chức', accessor: 'school_name' },
        { header: 'Bằng cấp', accessor: 'degree' },
        { header: 'Bắt đầu', accessor: 'start_date', render: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '' },
        { header: 'Kết thúc', accessor: 'end_date', render: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : 'Hiện tại' }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Quản lý Học vấn</h2>
                    <p>Danh sách các quá trình học tập</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/admin/education/new')}>
                    + Thêm mới
                </button>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    onEdit={(row) => navigate(`/admin/education/${row.id}`)} 
                    onDelete={handleDelete} 
                />
            )}
        </div>
    );
};

export default EducationList;
