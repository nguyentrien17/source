import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
// Thay đổi import từ lucide sang antd icons
import { 
  QuestionCircleOutlined, 
  HomeOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <Result
        status="404"
        icon={
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Dùng QuestionCircleOutlined thay cho FileQuestion */}
              <QuestionCircleOutlined 
                style={{ fontSize: '100px', color: '#3b82f6', opacity: 0.2 }} 
              />
              <span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-blue-600">
                404
              </span>
            </div>
          </div>
        }
        title={
          <span className="text-3xl font-extrabold text-slate-800">
            Úp! Trang này không tồn tại
          </span>
        }
        subTitle={
          <div className="text-slate-500 text-lg max-w-md mx-auto mt-2">
            Có vẻ như đường dẫn bạn đang truy cập đã bị thay đổi hoặc không còn tồn tại trong hệ thống.
          </div>
        }
        extra={[
          <Button 
            type="primary" 
            key="home" 
            size="large"
            // Thay icon Home sang HomeOutlined
            icon={<HomeOutlined />}
            className="rounded-full bg-blue-600 h-12 px-8 flex items-center justify-center mx-auto sm:mx-0"
            onClick={() => navigate('/')}
          >
            Quay về Trang chủ
          </Button>,
          <Button 
            key="back" 
            size="large"
            // Thay icon ArrowLeft sang ArrowLeftOutlined
            icon={<ArrowLeftOutlined />}
            className="rounded-full border-slate-300 h-12 px-8 flex items-center justify-center mt-4 sm:mt-0"
            onClick={() => navigate(-1)}
          >
            Trở lại trang trước
          </Button>,
        ]}
      />
    </div>
  );
}