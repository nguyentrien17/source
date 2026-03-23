import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
// Thay đổi import sang Ant Design Icons
import { LockOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        // Sử dụng LockOutlined với màu đỏ để cảnh báo
        icon={
          <LockOutlined 
            style={{ fontSize: '80px', color: '#ef4444' }} 
            className="mb-4" 
          />
        }
        title={
          <span className="text-2xl font-bold text-slate-800">
            Truy cập bị từ chối!
          </span>
        }
        subTitle={
          <div className="text-slate-500 text-lg">
            Rất tiếc, bạn không có quyền truy cập vào trang này. <br />
            Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.
          </div>
        }
        extra={[
          <Button 
            type="primary" 
            key="home" 
            size="large"
            icon={<HomeOutlined />}
            className="rounded-full bg-blue-600 px-8 h-12 flex items-center justify-center mx-auto sm:inline-flex"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>,
          <Button 
            key="back" 
            size="large"
            icon={<ArrowLeftOutlined />}
            className="rounded-full border-slate-300 px-8 h-12 flex items-center justify-center mt-4 sm:mt-0 sm:ml-4 sm:inline-flex"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>,
        ]}
      />
    </div>
  );
}