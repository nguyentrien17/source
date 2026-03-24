import { motion } from 'framer-motion';
import { 
  BankOutlined, 
  ClockCircleFilled, 
  TeamOutlined, 
  LineChartOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  MoreOutlined
} from '@ant-design/icons';

// Dữ liệu giả lập
const STATS = [
  { title: 'Tổng số phòng', value: '1,245', trend: '+12%', icon: BankOutlined, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Chờ kiểm duyệt', value: '48', trend: '+5%', icon: ClockCircleFilled, color: 'text-amber-600', bg: 'bg-amber-100' },
  { title: 'Người dùng', value: '5,230', trend: '+18%', icon: TeamOutlined, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'Lượt truy cập', value: '12.4K', trend: '+8%', icon: LineChartOutlined, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const RECENT_LISTINGS = [
  { id: 'ROOM-001', title: 'Phòng trọ ban công thoáng mát', host: 'Nguyễn Văn A', date: '24/03/2026', status: 'pending', price: '3.5 tr' },
  { id: 'ROOM-002', title: 'Căn hộ mini Studio cao cấp', host: 'Trần Thị B', date: '24/03/2026', status: 'approved', price: '5.2 tr' },
  { id: 'ROOM-003', title: 'Nhà nguyên căn 2 lầu', host: 'Lê Văn C', date: '23/03/2026', status: 'rejected', price: '12.0 tr' },
];

export default function AdminDashboard() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-slate-500 mt-1">Theo dõi các chỉ số và hoạt động mới nhất.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`text-2xl ${stat.color}`} />
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Tin đăng chờ duyệt mới nhất</h2>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Mã tin</th>
                <th className="px-6 py-4 font-medium">Tiêu đề</th>
                <th className="px-6 py-4 font-medium">Chủ nhà</th>
                <th className="px-6 py-4 font-medium">Mức giá</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {RECENT_LISTINGS.map((listing, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{listing.id}</td>
                  <td className="px-6 py-4 text-slate-700 max-w-xs truncate">{listing.title}</td>
                  <td className="px-6 py-4 text-slate-600">{listing.host}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">{listing.price}</td>
                  <td className="px-6 py-4">
                    {listing.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><ClockCircleFilled className="mr-1" /> Chờ duyệt</span>}
                    {listing.status === 'approved' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircleFilled className="mr-1" /> Đã duyệt</span>}
                    {listing.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><CloseCircleFilled className="mr-1" /> Từ chối</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors">
                      <MoreOutlined className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}