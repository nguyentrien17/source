import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Input, Select, DatePicker, Upload } from "antd";
import {
  ArrowLeftOutlined,
  CameraOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AppButton from "@/components/ui/AppButton";
import FormField from "@/components/common/FormField";

// provinces: mảng tên tỉnh/thành phố truyền từ UserManagement
export default function UserForm({
  mode,
  initialData,
  onSave,
  onCancel,
  provinces = [],
  wards = [],
  onProvinceChange,
}) {
  const [form] = Form.useForm();
  // Khi chọn province, gọi hàm lấy danh sách ward từ parent
  useEffect(() => {
    const provinceCode = form.getFieldValue("province");
    if (provinceCode && typeof onProvinceChange === "function") {
      onProvinceChange(provinceCode);
    }
    // eslint-disable-next-line
  }, [form.getFieldValue("province")]);

  // State quản lý avatar (để hiện preview hình lớn bên trái)
  const [avatarUrl, setAvatarUrl] = React.useState(null);

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        ...initialData,
        dob: initialData.dob ? dayjs(initialData.dob) : null,
      });
      setAvatarUrl(initialData.avatar);
    } else {
      // Chế độ 'add' - Xóa dữ liệu cũ nếu có
      form.resetFields();
      setAvatarUrl(null);
    }
  }, [initialData, mode, form]);

  // Lắng nghe sự thay đổi của tên để tạo Avatar động (Fallback)
  const watchFullname = Form.useWatch("fullname", form);

  const handleAvatarChange = (info) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(imageUrl);
      form.setFieldsValue({ avatar: imageUrl }); // Cập nhật ngầm vào Antd Form
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl(null);
    form.setFieldsValue({ avatar: null });
  };

  const onFinish = (values) => {
    // 1. Format lại dữ liệu từ form trước khi so sánh (Date, Avatar...)
    const formattedValues = {
      ...values,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      avatar: avatarUrl,
    };

    // 2. Nếu là chế độ thêm mới (add), gửi toàn bộ dữ liệu
    if (mode === "add") {
      onSave(formattedValues, (fields) => form.setFields(fields));
      return;
    }

    // 3. Nếu là chế độ chỉnh sửa (edit), lọc các trường có thay đổi
    const changedData = {};

    Object.keys(formattedValues).forEach((key) => {
      const newValue = formattedValues[key];
      const oldValue = initialData[key];

      // So sánh giá trị mới và cũ
      // Lưu ý: Dùng != để so sánh tương đối hoặc JSON.stringify cho object/array nếu cần
      if (newValue !== oldValue) {
        changedData[key] = newValue;
      }
    });

    // Kiểm tra nếu không có gì thay đổi thì không cần gọi API hoặc báo cho user
    if (Object.keys(changedData).length === 0) {
      // Tùy chọn: Có thể đóng form luôn hoặc thông báo "Không có thay đổi"
      onCancel();
      return;
    }

    onSave(changedData, (fields) => form.setFields(fields));
  };

  // Tạo URL fallback avatar khi người dùng chưa chọn ảnh
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(watchFullname || "User")}&background=10b981&color=fff`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      {/* --- HEADER --- */}
      <div className="mb-6 flex items-center">
        <button
          onClick={onCancel}
          className="mr-4 p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50 border border-transparent"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {mode === "add"
              ? "Điền thông tin chi tiết để tạo tài khoản mới."
              : "Cập nhật thông tin tài khoản người dùng."}
          </p>
        </div>
      </div>

      {/* --- FORM CONTAINER --- */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="p-6 md:p-10 overflow-y-auto flex-1 flex flex-col items-center">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ role: "tenant" }}
            className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14"
            requiredMark={false} // Ẩn dấu hoa thị đỏ mặc định của Antd
          >
            {/* ================= CỘT TRÁI: AVATAR ================= */}
            <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
              <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center">
                {/* Khu vực ảnh tròn */}
                <div className="relative group cursor-pointer mb-4">
                  <img
                    src={avatarUrl || fallbackAvatar}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:border-emerald-100 transition-colors"
                  />

                  {/* Lớp phủ Camera khi Hover */}
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                  >
                    <div className="w-32 h-32 absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                      <CameraOutlined className="text-2xl" />
                    </div>
                  </Upload>
                </div>

                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Ảnh đại diện
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  JPG, PNG, GIF. Tối đa 2MB.
                </p>

                {/* Nút thao tác dưới ảnh */}
                <div className="flex flex-col w-full gap-2.5">
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors"
                    >
                      <UploadOutlined className="mr-2" /> Tải ảnh lên
                    </button>
                  </Upload>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-red-200 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <DeleteOutlined className="mr-2" /> Xóa ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: FORM FIELDS ================= */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {/* --- Cột Thông tin tài khoản --- */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Thông tin tài khoản
                </h3>

                <FormField
                  label="Họ và tên"
                  name="fullname"
                  required
                  placeholder="Nguyễn Văn A"
                  rules={[
                    { min: 2, message: "Họ và tên phải từ 2 ký tự trở lên" },
                  ]}
                />

                <FormField
                  label="Tên đăng nhập"
                  name="username"
                  required={mode === "add"}
                  disabled={mode !== "add"}
                  placeholder="admin_01"
                  rules={[
                    { min: 3, message: "Tên đăng nhập phải từ 3 ký tự trở lên" },
                    { max: 30, message: "Tên đăng nhập tối đa 30 ký tự" },
                    {
                      pattern: /^[a-zA-Z0-9]+$/,
                      message: "Tên đăng nhập chỉ gồm chữ và số",
                    },
                  ]}
                />

                {mode === "add" && (
                  <FormField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    rules={[
                      { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên" },
                    ]}
                  />
                )}

                <FormField
                  label="Email"
                  name="email"
                  required
                  placeholder="email@example.com"
                  rules={[
                    { type: "email", message: "Email không đúng định dạng!" },
                  ]}
                />

                <FormField
                  label="Số điện thoại"
                  name="phone"
                  required={false}
                  placeholder="0901234567"
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value === undefined || value === null || value === "") return Promise.resolve();
                        const ok = /^(?:\d{10,11})$/.test(String(value));
                        return ok
                          ? Promise.resolve()
                          : Promise.reject(new Error("Số điện thoại phải gồm 10-11 chữ số"));
                      },
                    }),
                  ]}
                />

                <FormField
                  label="Vai trò"
                  name="role"
                  type="select"
                  required
                  options={[
                    { label: "Người thuê", value: "tenant" },
                    { label: "Chủ nhà", value: "landlord" },
                    { label: "Quản trị viên", value: "admin" },
                  ]}
                />
              </div>

              {/* --- Cột Thông tin cá nhân & Địa chỉ --- */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Thông tin cá nhân
                </h3>

                <FormField
                  label="Ngày sinh"
                  name="dob"
                  type="date"
                  placeholder="Chọn ngày sinh"
                />

                <FormField
                  label="CMND/CCCD"
                  name="id_card"
                  placeholder="079..."
                />

                <FormField
                  label="Tỉnh/Thành phố"
                  name="province"
                  type="select"
                  placeholder="Chọn Tỉnh/Thành phố"
                  onChange={(value) => {
                    form.setFieldsValue({ ward: undefined });
                    if (typeof onProvinceChange === "function") {
                      onProvinceChange(value);
                    }
                  }}
                  options={provinces.map((p) => ({
                    label: p.province_name,
                    value: p.province_code,
                  }))}
                />

                {/* Logic lấy Quận/Huyện dựa trên Tỉnh đã chọn */}
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.province !== curr.province}
                >
                  {({ getFieldValue }) => {
                    const selectedProvince = getFieldValue("province");
                    return (
                      <FormField
                        label="Phường/xã"
                        name="ward"
                        type="select"
                        placeholder="Chọn Phường/xã"
                        disabled={!selectedProvince}
                        options={wards.map((w) => ({
                          label: w.province_name,
                          value: w.province_code,
                        }))}
                      />
                    );
                  }}
                </Form.Item>

                <FormField
                  label="Địa chỉ chi tiết"
                  name="address"
                  placeholder="Số nhà, tên đường..."
                />
              </div>
            </div>
          </Form>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="px-6 md:px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end space-x-4 shrink-0">
          <AppButton variant="outline" onClick={onCancel}>
            Hủy bỏ
          </AppButton>

          <AppButton variant="primary" onClick={() => form.submit()}>
            {mode === "add" ? "Tạo người dùng" : "Lưu thay đổi"}
          </AppButton>
        </div>
      </div>
    </motion.div>
  );
}
