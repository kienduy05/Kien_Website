import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import DataTable from '../../../components/Admin/DataTable';
import alertService from '../../../utils/alert';

const ContactList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMessage, setViewMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/contact_messages');
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
        if (await alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa tin nhắn này?')) {
            try {
                await api.delete(`/contact_messages/${row.id}`);
                fetchData();
                alertService.success('Đã xóa thành công!');
            } catch (error) {
                alertService.error('Xóa thất bại!');
            }
        }
    };

    const handleView = (row) => {
        setViewMessage(row);
        // Có thể gọi API để đánh dấu đã đọc (is_read = 1) ở đây nếu cần
    };

    const closeView = () => {
        setViewMessage(null);
    };

    const columns = [
        { header: 'ID', accessor: 'id', width: '50px' },
        { header: 'Người gửi', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Chủ đề', accessor: 'subject' },
        { header: 'Ngày gửi', accessor: 'created_at', render: (row) => row.created_at ? new Date(row.created_at).toLocaleString() : '' },
        { 
            header: 'Trạng thái', 
            accessor: 'is_read', 
            render: (row) => (
                <span style={{ color: row.is_read ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                    {row.is_read ? 'Đã đọc' : 'Chưa đọc'}
                </span>
            ) 
        }
    ];

    return (
        <div className="admin-module">
            <div className="module-header">
                <div>
                    <h2>Tin nhắn liên hệ</h2>
                    <p>Quản lý tin nhắn từ khách truy cập</p>
                </div>
            </div>
            
            {isLoading ? (
                <div className="loading-spinner">Đang tải...</div>
            ) : (
                <div className="datatable-container">
                    <table className="datatable">
                        <thead>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} style={{ width: col.width || 'auto' }}>{col.header}</th>
                                ))}
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex}>
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                        <td className="datatable-actions">
                                            <button className="btn-icon btn-edit" onClick={() => handleView(row)} title="Xem chi tiết">
                                                👁️
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDelete(row)} title="Xóa">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="datatable-empty">
                                        Không có tin nhắn nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal xem tin nhắn */}
            {viewMessage && (
                <div className="preview-modal-overlay" onClick={closeView}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', background: '#1e293b', padding: '2rem', borderRadius: '12px', color: 'white' }}>
                        <button className="close-modal" onClick={closeView} style={{ top: '10px', right: '15px' }}>✕</button>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Chi tiết tin nhắn</h3>
                        <p><strong>Từ:</strong> {viewMessage.name} ({viewMessage.email})</p>
                        <p><strong>Chủ đề:</strong> {viewMessage.subject}</p>
                        <p><strong>Ngày gửi:</strong> {new Date(viewMessage.created_at).toLocaleString()}</p>
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                            {viewMessage.message}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactList;
