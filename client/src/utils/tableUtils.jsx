import React from 'react';
import { Space, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

/**
 * Hàm tạo cột "Hành động" dùng chung cho mọi bảng
 * @param {Function} onEdit - Hàm gọi khi bấm nút Sửa (truyền null nếu không có nút Sửa)
 * @param {Function} onDelete - Hàm gọi khi bấm nút Xóa (truyền null nếu không có nút Xóa)
 * @param {Function} extraActions - Hàm render thêm các nút khác (Ví dụ: nút Xem chi tiết, Khóa tài khoản)
 */
export const createActionColumn = (onEdit, onDelete, extraActions = null) => {
  return {
    title: 'Hành động',
    key: 'action',
    align: 'right',
    render: (_, record) => (
      <div className="flex items-center justify-end gap-1">
        {/* Render các nút bổ sung nếu có (Nút View, Nút Approve...) */}
        {extraActions && extraActions(record)}

        {/* Nút Sửa (Chỉ hiện khi có truyền hàm onEdit) */}
        {onEdit && (
          <Tooltip title="Chỉnh sửa">
            <Button 
              variant="solid"
              color="primary"
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
        )}

        {/* Nút Xóa (Chỉ hiện khi có truyền hàm onDelete) */}
        {onDelete && (
          <Tooltip title="Xóa">
            <Button 
              variant="solid"
              color="danger"
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record)} 
            />
          </Tooltip>
        )}
      </div>
    ),
  };
};