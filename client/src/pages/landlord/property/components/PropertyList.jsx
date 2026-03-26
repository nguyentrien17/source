import React, { useMemo, useState } from "react";
import { Button, Input, Popconfirm, Space, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import DataTable from "@/components/common/DataTable";
import AppButton from "@/components/ui/AppButton";
import { createActionColumn } from "@/utils/tableUtils";

const safeLower = (val) => String(val || "").toLowerCase();

export default function PropertyList({
  data = [],
  rooms = [],
  handleAddClick,
  handleEditClick,
  onDeleteConfirm,
  handleManageRooms,
  onSearchChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const roomCountByPropertyId = useMemo(() => {
    const counts = Object.create(null);
    for (const r of rooms) {
      if (!r?.property_id) continue;
      counts[r.property_id] = (counts[r.property_id] || 0) + 1;
    }
    return counts;
  }, [rooms]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = safeLower(searchQuery);
    return data.filter(
      (p) =>
        safeLower(p?.name).includes(q) || safeLower(p?.address).includes(q),
    );
  }, [data, searchQuery]);

  const columns = [
    {
      title: "Khu trọ",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
            {record.images?.[0] ? (
              <img
                src={record.images[0]}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : null}
          </div>
          <div>
            <div className="font-medium text-slate-900">{text}</div>
            <div className="text-xs text-slate-500">
              {record.id}
              {record.host_name ? ` • ${record.host_name}` : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) => (
        <div>
          <div className="text-slate-900">{record.address || "-"}</div>
          <div className="text-xs text-slate-500">
            {[record.ward, record.province].filter(Boolean).join(", ")}
          </div>
        </div>
      ),
    },
    {
      title: "Tọa độ",
      key: "coords",
      render: (_, record) => (
        <div className="text-xs text-slate-600">
          {record.latitude && record.longitude
            ? `${record.latitude}, ${record.longitude}`
            : "-"}
        </div>
      ),
    },
    {
      title: "Số phòng",
      key: "rooms",
      render: (_, record) => (
        <span className="font-medium text-slate-700">
          {roomCountByPropertyId[record.id] || 0}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Tạm ngưng"}
        </Tag>
      ),
    },
    createActionColumn(
      handleEditClick, // Tham số 1: onEdit
      onDeleteConfirm, // Tham số 2: onDelete
      (
        record, // Tham số 3: extraActions
      ) => (
        <>
          <Tooltip title="Quản lý phòng">
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => handleManageRooms(record)}
            />
          </Tooltip>
        </>
      ),
    ),
  ];

  return (
    <DataTable
      title="Quản lý khu trọ"
      description="Thêm, sửa, xóa và quản lý khu trọ trong hệ thống."
      addBtnText="Thêm khu trọ"
      onAddClick={handleAddClick}
      searchPlaceholder="Tìm kiếm..."
      searchValue={searchQuery}
      onSearchChange={(q) => {
        setSearchQuery(q);
        onSearchChange?.(q);
      }}
      columns={columns}
      dataSource={filteredData}
    />
  );
}
