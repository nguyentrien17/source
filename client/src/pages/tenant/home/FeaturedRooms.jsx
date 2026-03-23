// src/components/home/FeaturedRooms.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import FeaturedRoomCard from '@/components/home/FeaturedRoomCard';

export default function FeaturedRooms({ rooms }) {
  const navigate = useNavigate();

  return (
    <>
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
        {rooms.map((room) => (
          <FeaturedRoomCard 
            key={room.id}
            room={room}
            onClick={() => navigate(`/room/${room.id}`)}
          />
        ))}
      </div>
    </>
  );
}