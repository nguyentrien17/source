import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { ConfigProvider } from 'antd'
import viVN from "antd/locale/vi_VN";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/login";

//tenant
import TenantLayout from "@/layouts/TenantLayout";
import Home from "@/pages/tenant/Home";

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<TenantLayout />}>
              <Route path="/login" element={<Login />} />
              <Route index element={<Home />} />
              <Route element={<ProtectedRoute allowedRoles={['tenant']} />} >
                {/* Các route cần bảo vệ sẽ được đặt ở đây */}
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}
