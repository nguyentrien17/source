import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spin } from "antd";

interface Props {
  allowedRoles?: Array<'admin' | 'landlord' | 'tenant'>;
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. TRẠNG THÁI ĐANG TẢI:
  // Khi mới F5 trang, AuthProvider cần vài ms để check localStorage.
  // Nếu không có đoạn này, App sẽ tưởng user = null và đá văng ra Login ngay lập tức.
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500 font-medium">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // 2. KIỂM TRA ĐĂNG NHẬP:
  // Nếu không có user (chưa login hoặc token hết hạn) -> Chuyển hướng về /login
  if (!user) {
    // Lưu lại vị trí trang người dùng định vào (state) để sau khi login xong quay lại đúng đó
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. KIỂM TRA PHÂN QUYỀN (Role-based Access Control):
  // Nếu trang yêu cầu quyền cụ thể (ví dụ Admin) mà user không có quyền đó
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. HỢP LỆ:
  // Cho phép render các component con (chính là Outlet)
  return <Outlet />;
}