import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Table, Input, Select } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import AppButton from "@/components/ui/AppButton";

export default function DataTable({
  title,
  description,
  addBtnText,
  onAddClick,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters = [],
  columns,
  dataSource,
  rowKey = "id",
  loading = false,
  
  // 1. Thêm thuộc tính bật/tắt cột STT (mặc định là có bật)
  showIndex = true,
  // Thêm thuộc tính để chỉnh sửa pageSize từ bên ngoài nếu cần
  pageSize = 10,
}) {

  // 2. Dùng useMemo để tính toán lại mảng cột một cách tối ưu
  const finalColumns = useMemo(() => {
    // Nếu không muốn hiện STT, trả về nguyên bản mảng cột cũ
    if (!showIndex) return columns;

    // Nếu muốn hiện STT, tạo một cột STT và nhét lên đầu mảng
    const indexColumn = {
      title: 'STT',
      key: 'index',
      width: 60, // Đặt độ rộng cố định cho đẹp
      align: 'center',
      // Tính toán STT tự động, kể cả khi sang trang mới
      // (Bỏ qua logic trang mới nếu bạn không truyền biến current page, 
      // Antd tự động cấp tham số thứ 3 là index của hàng hiện tại)
      render: (text, record, index) => {
        // Mặc định index bắt đầu từ 0, nên cần +1
        return <span className="text-slate-500 font-medium">{index + 1}</span>;
      },
    };

    return [indexColumn, ...columns];
  }, [columns, showIndex]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* 1. Header & Nút Thêm */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="text-slate-500 mt-1 text-sm">{description}</p>
          )}
        </div>

        {onAddClick && (
          <AppButton
            variant="blue"
            icon={<PlusOutlined />}
            onClick={onAddClick}
          >
            {addBtnText || "Thêm mới"}
          </AppButton>
        )}
      </div>

      {/* 2. Thanh Công Cụ: Tìm kiếm & Bộ lọc */}
      {(onSearchChange || filters.length > 0) && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          {onSearchChange && (
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder={searchPlaceholder || "Tìm kiếm..."}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 rounded-xl h-10 hover:border-emerald-500 focus-within:border-emerald-500"
            />
          )}

          {filters.map((filter, idx) => (
            <Select
              key={idx}
              value={filter.value}
              onChange={filter.onChange}
              className="w-full sm:w-48 h-10"
              options={filter.options}
            />
          ))}
        </div>
      )}

      {/* 3. Bảng Dữ Liệu Ant Design */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          // 3. Truyền mảng cột đã được xử lý (có hoặc không có STT) vào đây
          columns={finalColumns}
          dataSource={dataSource}
          rowKey={rowKey}
          loading={loading}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: false,
            showTotal: (total) => `Hiển thị ${total} kết quả`,
            className:
              "custom-flat-pagination !m-0 px-6 py-4 border-t border-slate-200 bg-slate-50 w-full",
          }}
        />
      </div>
    </motion.div>
  );
}