import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/login";

//tenant
import TenantLayout from "@/layouts/TenantLayout";
import Home from "@/pages/tenant/Home";

//admin
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import UserManagement from "./pages/admin/user/UserManagement";

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<TenantLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute allowedRoles={["tenant"]} />}>
                {/* Các route cần bảo vệ sẽ được đặt ở đây */}
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                {/* Các route admin khác sẽ được đặt ở đây */}
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
