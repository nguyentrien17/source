import React from "react";
import { Tag, Button, Modal, Space, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

// Import Component Bảng Dùng Chung (Đảm bảo bạn đã tạo file này nhé)
import DataTable from "@/components/common/DataTable";
import { createActionColumn } from "@/utils/tableUtils";

const { confirm } = Modal;

export default function UserTable(props) {
  // Lấy dữ liệu mẫu (users) và các hàm xử lý từ thằng cha (UserManagement) truyền xuống
  const {
    users,
    searchQuery,
    roleFilter,
    onSearchChange,
    onRoleFilterChange,
    onAddClick,
    onEditClick,
    onDeleteConfirm,
  } = props;

  // Hàm hiển thị popup xác nhận xóa
  const handleDelete = (user) => {
    confirm({
      title: "Xóa người dùng?",
      icon: <ExclamationCircleFilled style={{ color: "#ef4444" }} />,
      content: `Bạn có chắc chắn muốn xóa tài khoản ${user.fullname}? Hành động này không thể hoàn tác.`,
      okText: "Xóa vĩnh viễn",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        onDeleteConfirm(user.id);
      },
    });
  };

  // Định nghĩa cấu trúc các Cột (Columns) cho bảng Người dùng
  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={
              record.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(record.fullname)}&background=10b981&color=fff`
            }
            alt={record.fullname}
            className="w-10 h-10 rounded-full border border-slate-200 object-cover"
          />
          <div className="ml-3">
            <p className="font-semibold text-slate-900">{record.fullname}</p>
            <p className="text-xs text-slate-500">@{record.username}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "";
        let text = "";
        if (role === "admin") {
          color = "purple";
          text = "Admin";
        } else if (role === "landlord") {
          color = "blue";
          text = "Chủ nhà";
        } else {
          color = "green";
          text = "Người thuê";
        }
        return (
          <Tag color={color} className="rounded-full px-3">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div>
          <p className="text-slate-700 font-medium">{record.email}</p>
          <p className="text-slate-500 text-xs mt-0.5">{record.phone}</p>
        </div>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => {
        // 1. Chặn ngay nếu dữ liệu rỗng (null, undefined, "")
        if (!date)
          return <span className="text-slate-400 italic">Chưa cập nhật</span>;

        // 2. Chuẩn hóa chuỗi (Biến khoảng trắng thành chữ 'T' chuẩn ISO)
        const safeDateString =
          typeof date === "string" ? date.replace(" ", "T") : date;
        const parsedDate = new Date(safeDateString);

        // 3. Chặn lỗi nếu chuỗi ngày tháng gửi từ Backend bị sai định dạng hoàn toàn
        if (isNaN(parsedDate.getTime())) {
          return <span className="text-red-400">Lỗi dữ liệu</span>;
        }

        // 4. Render ngon lành
        return (
          <span className="text-slate-600 font-medium">
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(parsedDate)}
          </span>
        );
      },
    },
    createActionColumn(onEditClick, handleDelete),
  ];

  // Trả về Component DataTable và "bơm" cấu hình vào
  return (
    <DataTable
      title="Quản lý người dùng"
      description="Thêm, sửa, xóa và quản lý tài khoản trong hệ thống."
      addBtnText="Thêm người dùng"
      onAddClick={onAddClick}
      searchPlaceholder="Tìm kiếm tên, email, sđt..."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      // Truyền cấu hình bộ lọc thả xuống
      filters={[
        {
          value: roleFilter,
          onChange: onRoleFilterChange,
          options: [
            { value: "all", label: "Tất cả vai trò" },
            { value: "admin", label: "Admin" },
            { value: "landlord", label: "Chủ nhà" },
            { value: "tenant", label: "Người thuê" },
          ],
        },
      ]}
      // Nhét mảng cấu trúc Cột và Dữ liệu vào Bảng
      columns={columns}
      dataSource={users}
    />
  );
}
