import React from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import DataTable from '@/components/common/DataTable';
import AppButton from '@/components/ui/AppButton';

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};

export default function RoomList({ property, data = [], onBack, onAddRoom, onEditRoom, onDeleteRoom }) {
  const columns = [
    {
      title: 'Phòng / Tiêu đề',
      dataIndex: 'title',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
            {record.images?.[0] ? <img src={record.images[0]} alt="" className="w-full h-full object-cover" /> : null}
          </div>
          <div>
            <div className="font-medium text-slate-900">{text}</div>
            <div className="text-xs text-slate-500">
              {record.room_number ? `P.${record.room_number} ` : ''}
              {record.floor ? `• Tầng ${record.floor} ` : ''}
              <span className="opacity-75">({record.id})</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      render: (type) => {
        if (type === 'can_ho') return <Tag color="purple">Căn hộ</Tag>;
        if (type === 'nha_nguyen_can') return <Tag color="green">Nhà nguyên căn</Tag>;
        return <Tag color="blue">Phòng trọ</Tag>;
      }
    },
    { 
      title: 'Giá thuê', 
      dataIndex: 'price', 
      render: (_, record) => (
        <div>
          <div className="font-semibold text-emerald-600">{formatCurrency(record.price)}</div>
          <div className="text-xs text-slate-500">{record.area ? `${record.area}m²` : '-'} • {record.capacity ? `${record.capacity} người` : '-'}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        if (status === 'rented') return <Tag>Đã thuê</Tag>;
        if (status === 'maintenance') return <Tag color="red">Bảo trì</Tag>;
        return <Tag color="green">Còn trống</Tag>;
      }
    },
    {
      title: 'Hành động',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => onEditRoom(record)} />
          <Popconfirm
            title="Xác nhận xóa phòng?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDeleteRoom?.(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Space size="middle">
          <AppButton variant="text" onClick={onBack} className="inline-flex items-center gap-2">
            <ArrowLeftOutlined />
            Quay lại
          </AppButton>
          <h2 className="text-xl font-bold text-slate-800">Phòng thuộc: {property?.name}</h2>
        </Space>
        <AppButton variant="primary" onClick={onAddRoom} className="inline-flex items-center gap-2">
          <PlusOutlined />
          Thêm phòng
        </AppButton>
      </div>
      <DataTable columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}