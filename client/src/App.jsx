import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import viVN from "antd/locale/vi_VN";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import "./index.css";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/login";

// Layouts
import TenantLayout from "@/layouts/TenantLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Pages
import Home from "@/pages/tenant/Home";
import AdminDashboard from "@/pages/admin/Dashboard";
import UserManagement from "./pages/admin/user/UserManagement";
import PropertyManagement from "./pages/landlord/property/PropertyManagement";

function AppRoutes() {
  const { isLoading } = useAuth();

  // Ngăn chặn hiển thị nội dung cho đến khi check xong auth
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        <Spin size="large" />
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Public/Tenant Routes */}
      <Route path="/" element={<TenantLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Landlord Routes */}
      <Route element={<ProtectedRoute allowedRoles={["landlord"]} />}>
        <Route path="/landlord" element={<AdminLayout />}> {/* Tái sử dụng sidebar layout */}
          <Route index element={<PropertyManagement />} />
          <Route path="properties" element={<PropertyManagement />} />
          {/* Thêm các route cho phòng, hợp đồng tại đây */}
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="rooms" element={<PropertyManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}