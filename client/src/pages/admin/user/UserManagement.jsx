import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Import hook quản lý URL
import { message } from "antd";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";
import api from "@/utils/api";
import { extractServerValidation, getServerErrorMessage, toAntdFieldErrors } from "@/utils/validation";

export default function UserManagement() {
  // --- STATE CƠ BẢN ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // --- QUẢN LÝ VIEW BẰNG URL ---
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get("view") || "list"; // Mặc định là 'list'
  const editId = searchParams.get("id"); // Lấy ID từ URL nếu đang ở chế độ sửa

  const [editingUser, setEditingUser] = useState(null);

  // --- 1. LẤY DANH SÁCH USER ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users");
      const userData = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data?.data || [];
      setUsers(userData);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sửa lại useEffect ban đầu
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- 2. LẤY DANH SÁCH TỈNH/THÀNH ---
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await api.get("/provinces");
        setProvinces(res.data.data || []);
      } catch (err) {
        setProvinces([]);
      }
    }
    fetchProvinces();
  }, []);

  // --- HÀM LẤY QUẬN HUYỆN ---
  const handleProvinceChange = async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }
    try {
      const res = await api.get(`/provinces?parent=${provinceCode}`);
      setWards(res.data.data || []);
    } catch (err) {
      setWards([]);
    }
  };

  // --- 3. PHỤC HỒI STATE KHI BỊ F5 (RELOAD TRANG) ---
  useEffect(() => {
    // Nếu URL đang đòi sửa User, nhưng data lại trống (do vừa F5)
    if (currentView === "edit" && editId && !editingUser) {
      async function fetchUserToEdit() {
        setLoading(true);
        try {
          const res = await api.get(`/auth/users/${editId}`);
          const userData = res.data.data;
          setEditingUser(userData);

          // Tự động load danh sách Quận/Huyện nếu user đã có Tỉnh
          if (userData?.province) {
            handleProvinceChange(userData.province);
          }
        } catch (err) {
          message.error("Không tìm thấy thông tin người dùng này!");
          setSearchParams({}); // Xóa URL lỗi, đá về bảng list
        } finally {
          setLoading(false);
        }
      }
      fetchUserToEdit();
    }
  }, [currentView, editId]); // Chỉ chạy khi URL thay đổi

  // --- TÌM KIẾM & LỌC ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone || "").includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- CÁC HÀM ĐIỀU HƯỚNG BẰNG URL ---
  const handleAddClick = () => {
    setEditingUser(null);
    setWards([]);
    setSearchParams({ view: "add" }); // URL sẽ thành: ?view=add
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    if (user.province) handleProvinceChange(user.province);
    setSearchParams({ view: "edit", id: user.id }); // URL sẽ thành: ?view=edit&id=...
  };

  const handleCancelClick = () => {
    setEditingUser(null);
    setSearchParams({}); // Xóa param, trở về giao diện list mặc định
  };

  // --- XÓA USER ---
  const handleDeleteConfirm = async (userId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/auth/users/${userId}`);
      if (res.data && res.data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        message.success("Đã xóa người dùng thành công!");
      } else {
        message.error(res.data.message || "Không thể xóa người dùng!");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // --- LƯU FORM ---
  const handleSaveForm = async (userData, setFormErrors) => {
    // Thêm setFormErrors
    setLoading(true);
    try {
      let res;
      if (editingUser) {
        res = await api.put(`/auth/users/${editingUser.id}`, userData);
      } else {
        res = await api.post("/auth/users", userData);
      }

      if (res.data?.success) {
        message.success("Thao tác thành công!");
        await fetchUsers();
        setSearchParams({});
      }
    } catch (err) {
      const validation = extractServerValidation(err);

      if (validation && Object.keys(validation.fieldErrors || {}).length > 0) {
        if (setFormErrors) {
          setFormErrors(toAntdFieldErrors(validation.fieldErrors));
        }
        message.error(validation.message || "Vui lòng kiểm tra lại các trường thông tin!");
        return;
      }

      message.error(getServerErrorMessage(err, "Có lỗi xảy ra!"));
    } finally {
      setLoading(false);
    }
  };

  // Render Form Thêm mới (Hoặc Form sửa KHI ĐÃ LẤY XONG DATA)
  if (currentView === "add" || (currentView === "edit" && editingUser)) {
    return (
      <UserForm
        mode={currentView}
        initialData={editingUser}
        onSave={handleSaveForm}
        onCancel={handleCancelClick}
        provinces={provinces}
        wards={wards}
        onProvinceChange={handleProvinceChange}
      />
    );
  }

  // Render Bảng (Mặc định)
  return (
    <UserTable
      users={filteredUsers}
      searchQuery={searchQuery}
      roleFilter={roleFilter}
      onSearchChange={setSearchQuery}
      onRoleFilterChange={setRoleFilter}
      onAddClick={handleAddClick}
      onEditClick={handleEditClick}
      onDeleteConfirm={handleDeleteConfirm}
      loading={loading} // Sẽ hiện xoay xoay ở bảng nếu đang tải Data (F5 edit)
    />
  );
}
