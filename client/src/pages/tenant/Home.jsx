import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  HomeOutlined, 
  AppstoreOutlined, 
  DownOutlined,
  FilterOutlined,
  ArrowRightOutlined,
  StarFilled,
  SafetyCertificateFilled,
  HeartOutlined,
  HeartFilled,
  ExpandOutlined
} from '@ant-design/icons';
import { Button } from 'antd'; // Tái sử dụng một vài component antd nếu cần

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: SearchOutlined },
  { id: 'phong-tro', name: 'Phòng trọ', icon: HomeOutlined },
  { id: 'can-ho', name: 'Căn hộ mini', icon: AppstoreOutlined },
  { id: 'o-ghep', name: 'Ở ghép', icon: HomeOutlined }, // Antd ko có icon Bed rõ ràng, dùng Home tạm
];

const FEATURED_ROOMS = [
  {
    id: 1, title: "Phòng trọ ban công thoáng mát, full nội thất", price: "3.5", unit: "triệu/tháng",
    location: "Bình Thạnh, TP.HCM", area: "25m²", beds: 1, baths: 1,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verified: true, rating: 4.8, isFavorite: false
  },
  {
    id: 2, title: "Căn hộ mini Studio cao cấp gần ĐH Hutech", price: "5.2", unit: "triệu/tháng",
    location: "Quận 2, TP.HCM", area: "35m²", beds: 1, baths: 1,
    image: "https://images.unsplash.com/photo-1502672260266-1c1e52d1590c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verified: true, rating: 4.9, isFavorite: true
  },
  {
    id: 3, title: "Phòng trọ giá rẻ cho sinh viên, an ninh 24/7", price: "2.0", unit: "triệu/tháng",
    location: "Thủ Đức, TP.HCM", area: "18m²", beds: 1, baths: 1,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verified: false, rating: 4.5, isFavorite: false
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Tìm phòng trọ ưng ý, <br className="hidden md:block" />
            <span className="text-emerald-400">nhanh chóng & an toàn</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto"
          >
            Hơn 10,000+ phòng trọ, căn hộ mini, nhà nguyên căn được xác thực mỗi ngày.
          </motion.p>

          {/* Search Bar Floating */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
        </div>
      </section>

      {/* --- MAIN CONTENT (Categories & Grid) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-6 py-3 rounded-full whitespace-nowrap transition-all border ${
                  isActive 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Icon className="mr-2 text-lg" />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Phòng trọ nổi bật</h2>
            <p className="text-slate-500 mt-1">Những phòng trọ được đánh giá cao và xác thực bởi SmartRent</p>
          </div>
          <button onClick={() => navigate('/search')} className="hidden sm:flex items-center text-emerald-600 font-medium hover:text-emerald-700">
            Xem tất cả <ArrowRightOutlined className="ml-2" />
          </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_ROOMS.map((room) => (
            <motion.div 
              key={room.id} whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all group cursor-pointer flex flex-col"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img 
                  src={room.image} alt={room.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {room.verified && (
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <SafetyCertificateFilled className="mr-1.5 text-sm" /> Đã xác thực
                  </div>
                )}
                
                <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
                  {room.isFavorite ? <HeartFilled className="text-red-500 text-lg" /> : <HeartOutlined className="text-lg" />}
                </button>

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20">
                  <span className="text-emerald-600 font-black text-xl">{room.price}</span>
                  <span className="text-slate-600 text-sm font-medium ml-1">{room.unit}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <EnvironmentOutlined className="mr-1.5 text-emerald-500" /> {room.location}
                  </div>
                  <div className="flex items-center text-amber-500 text-sm font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                    <StarFilled className="mr-1" /> {room.rating}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {room.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-600 text-sm font-medium">
                  <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
                    <ExpandOutlined className="mr-1.5 text-emerald-500" /> {room.area}
                  </div>
                  <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
                    {room.beds} Phòng ngủ
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- CTA FOR LANDLORDS --- */}
      <section className="bg-emerald-50 py-16 mt-12 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Bạn là chủ nhà?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
            Đăng tin cho thuê phòng trọ, căn hộ của bạn trên SmartRent để tiếp cận hàng ngàn khách thuê tiềm năng mỗi ngày. Hoàn toàn miễn phí!
          </p>
          <Button 
            type="primary" 
            size="large"
            className="bg-emerald-600 hover:!bg-emerald-700 h-14 px-10 rounded-full text-lg font-bold shadow-lg shadow-emerald-200"
            onClick={() => navigate('/landlord/rooms/new')}
          >
            Đăng tin cho thuê ngay <ArrowRightOutlined />
          </Button>
        </div>
      </section>

      {/* Global CSS để ẩn thanh cuộn ngang của phần Categories */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}