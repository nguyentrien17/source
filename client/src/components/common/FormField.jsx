import React from "react";
import { Form, Input, Select, DatePicker } from "antd";

const { Password } = Input;

/**
 * Component nhập liệu dùng chung
 * @param {string} label - Tiêu đề ô nhập
 * @param {string} name - Tên trường dữ liệu (liên kết với Form)
 * @param {boolean} required - Có bắt buộc hay không
 * @param {string} type - Loại ô nhập: 'text' | 'password' | 'select' | 'date' | 'textarea'
 * @param {object} props - Các thuộc tính khác (placeholder, options, rows...)
 */
export default function FormField({
  label,
  name,
  required = false,
  type = "text",
  rules = [],
  ...props
}) {
  // 1. Tạo Label có dấu sao đỏ chuẩn UI của bạn
  const customLabel = (
    <span className="font-semibold text-slate-700">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );

  // 2. Gom các Rule xác thực (Bắt buộc nhập + các rule bổ sung)
  const fieldRules = [
    ...(required
      ? [{ required: true, message: `Vui lòng nhập ${label.toLowerCase()}!` }]
      : []),
    ...rules,
  ];

  // 4. Chọn Component hiển thị dựa trên 'type'
  const renderInput = () => {
    // Dùng h-[46px] và items-center để tất cả các ô cao bằng nhau
    const commonClass =
      "h-[40px] rounded-xl px-4 hover:border-emerald-500 focus:border-emerald-500 bg-slate-50/50 w-full transition-all flex items-center";

    switch (type) {
      case "password":
        // Với Password, ta cần dùng focus-within thay vì focus
        return (
          <Input.Password
            className={`${commonClass} focus-within:border-emerald-500`}
            {...props}
          />
        );

      case "select":
        return (
          <Select
            className={`${commonClass} w-full custom-select-height`}
            // Gom tất cả vào bên trong object showSearch
            showSearch={{
              optionFilterProp: "label",
              filterOption: (input, option) => {
                // Hàm xóa dấu tiếng Việt (Gõ "ha noi" ra "Hà Nội")
                const removeAccents = (str) =>
                  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                const optionLabel = option?.label ?? "";
                return removeAccents(optionLabel).includes(removeAccents(input));
              },
            }}
            {...props}
          />
        );

      case "date":
        return (
          <DatePicker className={commonClass} format="DD/MM/YYYY" {...props} />
        );

      case "textarea":
        // Textarea thì không nên fix chiều cao h-[46px]
        return (
          <Input.TextArea
            className="rounded-xl px-4 py-3 hover:border-emerald-500 focus:border-emerald-500 bg-slate-50/50 w-full transition-all"
            rows={4}
            {...props}
          />
        );

      default:
        return <Input className={commonClass} {...props} />;
    }
  };

  return (
    <Form.Item
      label={customLabel}
      name={name}
      rules={fieldRules}
      // Giúp căn chỉnh Grid không bị lệch khi báo lỗi
      className="mb-4"
    >
      {renderInput()}
    </Form.Item>
  );
}
