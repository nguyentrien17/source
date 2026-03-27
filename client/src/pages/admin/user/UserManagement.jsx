import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message, Spin } from "antd";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";
import api from "@/utils/api";
import { fetchProvinces, fetchWards } from "@/utils/location";
import { extractServerValidation, getServerErrorMessage, toAntdFieldErrors } from "@/utils/validation";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get("view") || "list";
  const editId = searchParams.get("id");

  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users");
      const userData = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data?.data || [];
      setUsers(userData);
    } catch {
      message.error("Không thể tải danh sách người dùng!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  const handleProvinceChange = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }
    const wards = await fetchWards(provinceCode);
    setWards(wards);
  }, []);

  useEffect(() => {
    if (currentView === "edit" && editId && !editingUser) {
      async function fetchUserToEdit() {
        setLoading(true);
        try {
          const res = await api.get(`/auth/users/${editId}`);
          const userData = res.data.data;
          setEditingUser(userData);

          if (userData?.province) {
            handleProvinceChange(userData.province);
          }
        } catch {
          message.error("Không tìm thấy thông tin người dùng này!");
          setSearchParams({});
        } finally {
          setLoading(false);
        }
      }
      fetchUserToEdit();
    }
  }, [currentView, editId, editingUser, handleProvinceChange, setSearchParams]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone || "").includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddClick = () => {
    setEditingUser(null);
    setWards([]);
    setSearchParams({ view: "add" });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    if (user.province) handleProvinceChange(user.province);
    setSearchParams({ view: "edit", id: user.id });
  };

  const handleCancelClick = () => {
    setEditingUser(null);
    setSearchParams({});
  };

  const handleDeleteConfirm = async (userId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/auth/users/${userId}`);
      if (res.data?.success) {
        message.success("Đã xóa người dùng!");
        fetchUsers();
      }
    } catch {
      message.error("Xóa người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (userData, setFormErrors) => {
    setLoading(true);
    try {
      let res;
      const config = userData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};

      if (editingUser) {
        res = await api.put(`/auth/users/${editingUser.id}`, userData, config);
      } else {
        res = await api.post("/auth/users", userData, config);
      }

      if (res.data?.success) {
        message.success("Thao tác thành công!");
        setEditingUser(null);
        setSearchParams({}); 
        fetchUsers(); 
        return;
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
  if (currentView === "edit" && !editingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <Spin description="Đang tải thông tin người dùng..." size="large" />
      </div>
    );
  }

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
      loading={loading}
    />
  );
}