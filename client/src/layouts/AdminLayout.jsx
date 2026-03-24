import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined, 
  BankOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BellOutlined, 
  SearchOutlined,
  HomeFilled
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Danh sách menu điều hướng
  const menuItems = [
    { path: '/admin', icon: <DashboardOutlined size={20} />, label: 'Tổng quan' },
    { path: '/admin/rooms', icon: <BankOutlined size={20} />, label: 'Quản lý phòng' },
    { path: '/admin/users', icon: <TeamOutlined size={20} />, label: 'Người dùng' },
    { path: '/admin/settings', icon: <SettingOutlined size={20} />, label: 'Cài đặt' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/'); // Đăng xuất xong văng về trang chủ người thuê
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-emerald-900 text-emerald-100 flex flex-col shrink-0 transition-all">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-emerald-800 shrink-0">
          <div className="p-2 bg-emerald-800 rounded-xl mr-3 flex items-center justify-center">
            <HomeFilled className="text-emerald-400 text-xl" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">SmartRent</span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-800 text-white font-medium shadow-sm' : 'hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg flex items-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-emerald-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-emerald-200 hover:bg-emerald-800 hover:text-white hover:shadow-sm transition-all"
          >
            <LogoutOutlined className="mr-3 text-lg" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          {/* Search Bar */}
          <div className="flex items-center bg-slate-100 px-4 py-2.5 rounded-full w-96 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <SearchOutlined className="text-slate-400 mr-2 text-lg shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm kiếm phòng, người dùng..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <BellOutlined className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <div className="flex items-center cursor-pointer hover:bg-slate-50 p-1.5 rounded-full pr-4 transition-colors">
              <img 
                src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"} 
                alt="Admin Avatar" 
                className="w-9 h-9 rounded-full border-2 border-emerald-100 object-cover"
              />
              <div className="ml-3 hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* NƠI HIỂN THỊ CÁC TRANG CON */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}