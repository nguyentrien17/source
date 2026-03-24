// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  EnvironmentOutlined,
  StarFilled,
  SafetyCertificateFilled,
  HeartOutlined,
  HeartFilled,
  ExpandOutlined
} from '@ant-design/icons';

export default function FeaturedRoomCard({ room, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all group cursor-pointer flex flex-col"
      onClick={onClick}
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
  );
}
