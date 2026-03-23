import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { ConfigProvider } from 'antd'
import viVN from "antd/locale/vi_VN";
import { AuthProvider } from "@/contexts/AuthContext";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

//tenant
import TenantLayout from "@/layouts/TenantLayout";
import Home from "@/pages/tenant/Home";

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TenantLayout />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}
