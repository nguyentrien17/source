// src/components/home/LandlordCTA.jsx
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import AppButton from '@/components/ui/AppButton';

export default function LandlordCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-emerald-50 py-16 mt-12 border-y border-emerald-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Bạn là chủ nhà?</h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
          Đăng tin cho thuê phòng trọ, căn hộ của bạn trên SmartRent để tiếp cận hàng ngàn khách thuê tiềm năng mỗi ngày. Hoàn toàn miễn phí!
        </p>
        <AppButton
          variant="blue"
          className="hover:bg-emerald-600 transition-colors"
          onClick={() => navigate('/landlord/rooms/new')}
        >
          Đăng tin cho thuê ngay <ArrowRightOutlined />
        </AppButton>
      </div>
    </section>
  );
}