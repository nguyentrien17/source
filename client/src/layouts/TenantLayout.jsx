import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { Dropdown, Avatar, Space } from "antd";
import { 
  HomeOutlined, 
  MenuOutlined, 
  CloseOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  HeartOutlined 
} from '@ant-design/icons';
import { useAuth } from "@/contexts/AuthContext";

export default function TenantLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Menu cho user đã đăng nhập
  const userMenuItems = [
    { key: 'profile', label: <Link to="/profile">Thông tin cá nhân</Link>, icon: <UserOutlined /> },
    { key: 'saved', label: <Link to="/saved">Đã lưu</Link>, icon: <HeartOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: logout, danger: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-emerald-600 cursor-pointer">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <HomeOutlined className="text-emerald-600 text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-emerald-600">TÌM TRỌ NHANH</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-emerald-600'}`}>Thuê phòng</Link>
            <Link to="/search" className={`text-sm font-medium transition-colors ${isActive('/search') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-emerald-600'}`}>Khám phá</Link>
            <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-emerald-600'}`}>Dự án</Link>
          </div>

          {/* Desktop Actions (Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <Space className="cursor-pointer p-1.5 pr-4 bg-emerald-50 rounded-full border border-emerald-100 hover:border-emerald-200 transition-all">
                  <Avatar src={user.avatar} icon={<UserOutlined />} className="bg-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">{user.username}</span>
                </Space>
              </Dropdown>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                  Đăng nhập
                </button>
                <button onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
                  Đăng tin miễn phí
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-slate-100 p-6 shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-emerald-600">Thuê phòng</Link>
              <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600">Khám phá</Link>
              <hr className="border-slate-100" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar src={user.avatar} icon={<UserOutlined />} className="bg-emerald-600" />
                    <span className="font-semibold text-slate-800">{user.username}</span>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-red-500 font-medium py-2">Đăng xuất</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full text-center text-base font-medium text-slate-600 py-2">Đăng nhập</button>
                  <button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} className="w-full bg-emerald-600 text-white px-5 py-3 rounded-xl text-base font-medium">Đăng tin miễn phí</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* --- MAIN CONTENT (Nơi chứa các trang con như Home, Search) --- */}
      <main className="flex-1 mt-20"> 
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <HomeOutlined className="text-xl" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">TÌM TRỌ NHANH</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Nền tảng tìm kiếm và cho thuê phòng trọ số 1 Việt Nam. Nhanh chóng, an toàn và minh bạch.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Về hệ thống</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-emerald-600">Giới thiệu</Link></li>
              <li><Link to="/policy" className="hover:text-emerald-600">Quy chế hoạt động</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-600">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Dành cho khách thuê</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/search" className="hover:text-emerald-600">Tìm phòng trọ</Link></li>
              <li><Link to="/guide" className="hover:text-emerald-600">Kinh nghiệm thuê phòng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Dành cho chủ nhà</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/landlord/rooms/new" className="hover:text-emerald-600">Đăng tin cho thuê</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-600">Bảng giá dịch vụ</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-100 text-sm text-center text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Tìm trọ nhanh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}