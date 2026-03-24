// src/components/home/HeroSection.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchOutlined, EnvironmentOutlined, HomeOutlined, 
  DownOutlined, FilterOutlined 
} from '@ant-design/icons';

export default function HeroSection() {
  const navigate = useNavigate();

  // 1. CẤU HÌNH HIỆU ỨNG (VARIANTS)
  // Khung chứa tổng (Container) sẽ tự động kích hoạt các phần tử con bên trong chạy lần lượt
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Thời gian chờ giữa các phần tử (Chữ -> Mô tả -> Form tìm kiếm)
        delayChildren: 0.1,    // Đợi 0.1s sau khi load trang mới bắt đầu chạy
      }
    }
  };

  // Hiệu ứng cho từng phần tử con (Items)
  const itemVariants = {
    hidden: { opacity: 0, y: 40 }, // Bắt đầu ở dưới sâu hơn một chút (40px thay vì 20px)
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",       // Hiệu ứng lò xo tạo độ nảy nhẹ nhàng
        stiffness: 70,        // Độ cứng của lò xo (Càng thấp càng mềm)
        damping: 15,          // Lực cản (Chống rung lắc quá mạnh)
        mass: 1               // Khối lượng
      }
    }
  };

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-emerald-900 rounded-b-[40px] mx-2 shadow-xl">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Room background" 
          className="w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 to-emerald-900/95"></div>
      </div>

      {/* 2. ÁP DỤNG VARIANTS VÀO CONTAINER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        
        {/* 3. ÁP DỤNG VARIANTS VÀO TỪNG PHẦN TỬ CON */}
        {/* Chú ý: Không cần viết lại initial/animate ở đây nữa, nó tự động thừa kế từ Container */}
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
        >
          Tìm phòng trọ ưng ý, <br className="hidden md:block" />
          <span className="text-emerald-400">nhanh chóng & an toàn</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto"
        >
          Hơn 10,000+ phòng trọ, căn hộ mini, nhà nguyên căn được xác thực mỗi ngày.
        </motion.p>

        {/* Search Bar Floating */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center max-w-4xl mx-auto gap-2 sm:gap-0"
        >
          <div className="flex-1 flex items-center px-4 py-3 sm:py-0 w-full hover:bg-slate-50 rounded-xl sm:rounded-l-full transition-colors cursor-pointer border-b sm:border-b-0 sm:border-r border-slate-200">
            <EnvironmentOutlined className="text-emerald-600 text-lg shrink-0" />
            <div className="ml-3 text-left flex-1">
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Khu vực</p>
              <p className="text-sm text-slate-500 truncate">Bạn muốn tìm ở đâu?</p>
            </div>
          </div>

          <div className="flex-1 flex items-center px-4 py-3 sm:py-0 w-full hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-b sm:border-b-0 sm:border-r border-slate-200">
            <HomeOutlined className="text-emerald-600 text-lg shrink-0" />
            <div className="ml-3 text-left flex-1">
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Loại phòng</p>
              <p className="text-sm text-slate-500 truncate">Tất cả</p>
            </div>
            <DownOutlined className="text-slate-400 text-xs" />
          </div>

          <div className="flex-1 flex items-center px-4 py-3 sm:py-0 w-full hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
            <FilterOutlined className="text-emerald-600 text-lg shrink-0" />
            <div className="ml-3 text-left flex-1">
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Mức giá</p>
              <p className="text-sm text-slate-500 truncate">Chọn mức giá</p>
            </div>
            <DownOutlined className="text-slate-400 text-xs" />
          </div>

          <button 
            onClick={() => navigate('/search')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white p-4 sm:px-8 sm:py-4 rounded-xl sm:rounded-full font-semibold transition-colors flex items-center justify-center shrink-0 mt-2 sm:mt-0"
          >
            <SearchOutlined className="mr-2 text-lg" /> Tìm kiếm
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}