import React from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, onEdit, onDelete, disableActions }) => {
    return (
        <div className="datatable-container">
            <table className="datatable">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} style={{ width: col.width || 'auto' }}>{col.header}</th>
                        ))}
                        {!disableActions && <th>Hành động</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={col.className || ''}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {!disableActions && (
                                    <td className="datatable-actions">
                                        {onEdit && (
                                            <button className="btn-icon btn-edit" onClick={() => onEdit(row)} title="Sửa">
                                                ✏️
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button className="btn-icon btn-delete" onClick={() => onDelete(row)} title="Xóa">
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (disableActions ? 0 : 1)} className="datatable-empty">
                                Không có dữ liệu.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
