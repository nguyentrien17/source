import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { message } from 'antd'; // Để hiển thị thông báo lỗi đẹp mắt

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái loading của nút

  // Lấy các công cụ cần thiết từ React Router và Context của bạn
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang khi ấn submit
    
    if (!username || !password) {
      message.warning('Vui lòng nhập đầy đủ username và mật khẩu!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Gọi hàm login từ AuthContext của bạn
      // (Giả sử hàm login của bạn nhận username/password và trả về true/false)
      const isSuccess = await login({ username, password });
      
      if (isSuccess) {
        message.success('Đăng nhập thành công!');
        
        // --- LOGIC CHUYỂN HƯỚNG THÔNG MINH ---
        // Lấy lại trang cũ mà user định vào trước khi bị đá ra Login (ví dụ: /admin)
        // Nếu không có (user tự bấm nút Login), mặc định cho về trang chủ '/'
        const from = location.state?.from?.pathname || '/';
        
        // Điều hướng (replace: true để user bấm nút Back trên trình duyệt ko bị kẹt lại trang Login)
        navigate(from, { replace: true });
      } else {
        message.error('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      message.error(serverMessage || 'Lỗi kết nối máy chủ, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      key="login"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50"
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex border border-slate-100">
        
        {/* Left Side - Image (Giữ nguyên giao diện đẹp của bạn) */}
        <div className="hidden md:block w-1/2 relative bg-emerald-900">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Login background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/40 to-transparent"></div>
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-2">Tìm nhà dễ dàng hơn</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Đăng nhập để lưu lại các phòng trọ yêu thích, nhận thông báo khi có phòng mới phù hợp và liên hệ trực tiếp với chủ nhà một cách an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại! 👋</h2>
            <p className="text-slate-500">Vui lòng đăng nhập để tiếp tục.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tài khoản</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailOutlined className="text-slate-400 text-lg" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none" 
                  placeholder="Nhập tài khoản"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockOutlined className="text-slate-400 text-lg" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none" 
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeInvisibleOutlined className="text-lg" /> : <EyeOutlined className="text-lg" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-colors mt-6 
                ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'}`}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Social Logins - Giữ nguyên */}
          {/* ... */}
          
          <p className="mt-8 text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}