import React, { useEffect, useRef } from "react";
import { Form, Input, message, Upload } from "antd";
import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import FormField from "@/components/common/FormField";
import EntityFormShell from "@/components/common/EntityFormShell";

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
  const avatarFileRef = useRef(null);

  // Theo dõi giá trị để làm Avatar preview động
  const avatarUrl = Form.useWatch("avatar", form);
  const watchFullname = Form.useWatch("fullname", form);

  // 1. Khởi tạo dữ liệu khi mở Form
  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        ...initialData,
        dob: initialData.dob ? dayjs(initialData.dob) : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ role: "tenant", avatar: null });
    }
    avatarFileRef.current = null;
  }, [initialData, mode, form]);

  // 2. Xử lý logic Avatar
  const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  
  const beforeUploadAvatar = (file) => {
    const name = String(file?.name || "").toLowerCase();
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";

    if (!allowedExts.includes(ext)) {
      message.error(`Chỉ chấp nhận file ảnh: ${allowedExts.join(", ")}`);
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 <= 2;
    if (!isLt2M) {
      message.error("Ảnh quá lớn (tối đa 2MB)");
      return Upload.LIST_IGNORE;
    }
    return false; // Chặn upload tự động
  };

  const handleAvatarChange = (info) => {
    const fileObj = info.file?.originFileObj || info.file;
    if (!fileObj) return;

    avatarFileRef.current = fileObj;
    const previewUrl = URL.createObjectURL(fileObj);
    form.setFieldsValue({ avatar: previewUrl });
  };

  const handleDeleteAvatar = () => {
    avatarFileRef.current = null;
    form.setFieldsValue({ avatar: null });
  };

  // 3. Xử lý khi nhấn Lưu (Refactored: Gửi FormData 1 lần gồm cả file và data)
  const onFinish = async (values) => {
    const formData = new FormData();

    // Duyệt qua các field để append vào FormData
    Object.keys(values).forEach((key) => {
      if (key === "avatar") return; // Avatar xử lý riêng

      let val = values[key];
      if (val === undefined || val === null) return; // Bỏ qua null/undefined

      if (key === "dob" && val) {
        val = dayjs(val).format("YYYY-MM-DD");
      }

      // Với password logic:
      // - Add Mode: Bắt buộc (đã check required ở Form.Item), gửi bình thường.
      // - Edit Mode: Nếu trống (người dùng không nhập gì) thì không gửi field này đi để giữ pass cũ.
      if (mode !== "add" && key === "password" && !val) return;

      formData.append(key, val);
    });

    // Xử lý Avatar file
    if (avatarFileRef.current) {
      // Có file mới
      formData.append("avatar", avatarFileRef.current);
    } else if (values.avatar === null) {
      // Đã xóa ảnh (null) -> Gửi string rỗng để backend update thành ''
      formData.append("avatar", "");
    }
    // Nếu values.avatar là URL cũ -> Không append gì -> Backend không update trường avatar

    onSave(formData, (fields) => form.setFields(fields));
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    watchFullname || "User"
  )}&background=10b981&color=fff`;

  return (
    <EntityFormShell
      title={mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
      subtitle={
        mode === "add"
          ? "Điền thông tin chi tiết để tạo tài khoản mới."
          : "Cập nhật thông tin tài khoản người dùng."
      }
      onBack={onCancel}
      onCancel={onCancel}
      onSubmit={() => form.submit()}
      submitText={mode === "add" ? "Tạo người dùng" : "Lưu thay đổi"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14"
        requiredMark={false}
      >
        {/* Hidden field để lưu URL avatar */}
        <Form.Item name="avatar" hidden>
          <Input />
        </Form.Item>

        {/* --- CỘT TRÁI: AVATAR --- */}
        <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
          <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <img
                src={avatarUrl || fallbackAvatar}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:border-emerald-100 transition-colors"
              />
              <Upload
                showUploadList={false}
                accept={allowedExts.join(",")}
                beforeUpload={beforeUploadAvatar}
                onChange={handleAvatarChange}
              >
                <div className="w-32 h-32 absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <CameraOutlined className="text-2xl" />
                </div>
              </Upload>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Ảnh đại diện</h3>
            <p className="text-xs text-slate-500 mb-5">JPG, PNG, GIF. Tối đa 2MB.</p>

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

        {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* Nhóm 1: Tài khoản */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
              Thông tin tài khoản
            </h3>
            <FormField label="Họ và tên" name="fullname" required placeholder="Nguyễn Văn A" />
            <FormField
              label="Tên đăng nhập"
              name="username"
              required={mode === "add"}
              disabled={mode !== "add"}
              placeholder="user123"
            />
            {mode === "add" && (
              <FormField label="Mật khẩu" name="password" type="password" required placeholder="••••••••" />
            )}
            <FormField label="Email" name="email" required placeholder="email@example.com" />
            <FormField label="Số điện thoại" name="phone" placeholder="0901234567" />
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

          {/* Nhóm 2: Cá nhân & Địa chỉ */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
              Thông tin cá nhân
            </h3>
            <FormField label="Ngày sinh" name="dob" type="date" placeholder="Chọn ngày sinh" />
            <FormField label="CMND/CCCD" name="id_card" placeholder="079..." />
            
            <FormField
              label="Tỉnh/Thành phố"
              name="province"
              type="select"
              placeholder="Chọn Tỉnh/Thành phố"
              onChange={(value) => {
                form.setFieldsValue({ ward: undefined });
                if (typeof onProvinceChange === "function") onProvinceChange(value);
              }}
              options={provinces.map((p) => ({
                label: p.province_name,
                value: p.province_code,
              }))}
            />

            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.province !== curr.province}>
              {({ getFieldValue }) => (
                <FormField
                  label="Phường/Xã"
                  name="ward"
                  type="select"
                  placeholder="Chọn Phường/Xã"
                  disabled={!getFieldValue("province")}
                  options={wards.map((w) => ({
                    label: w.province_name,
                    value: w.province_code,
                  }))}
                />
              )}
            </Form.Item>

            <FormField label="Địa chỉ chi tiết" name="address" placeholder="Số nhà, tên đường..." />
          </div>
        </div>
      </Form>
    </EntityFormShell>
  );
}