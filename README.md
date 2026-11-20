# Rent A Room

Ứng dụng web quản lý và tìm kiếm phòng trọ. Có ba vai trò: **admin**, **landlord** (chủ trọ) và **tenant** (người thuê).

## Tính năng

- **Tenant:** trang chủ với phòng nổi bật, lọc theo danh mục, đăng nhập.
- **Landlord:** quản lý bất động sản (chọn vị trí trên bản đồ) và quản lý phòng.
- **Admin:** dashboard, quản lý người dùng và phòng.
- Đăng nhập bằng JWT, phân quyền theo vai trò (`ProtectedRoute` ở client, `authorize` ở server).
- Bảo mật: helmet, CORS, CSRF, giới hạn tần suất (rate limit, hỗ trợ Redis), khóa đăng nhập khi sai nhiều lần, kiểm tra dữ liệu bằng Joi.
- Upload ảnh (avatar) bằng multer.

## Công nghệ

| Phần | Công nghệ |
|---|---|
| Client | React 19, Vite, React Router 7, Ant Design 6, Tailwind CSS 4, Leaflet, Framer Motion, Axios |
| Server | Node.js, Express 4, Sequelize, MySQL, Redis (tùy chọn), JWT, Joi |

## Cấu trúc

```
├── client/   # giao diện React + Vite
│   └── src/  # pages (admin, landlord, tenant), layouts, components, contexts, utils
└── server/   # API Express
    └── src/  # routes, controllers, services, models, middlewares, validations, utils
```

## Chạy trên máy

Yêu cầu: Node.js 18+, MySQL. Redis là tùy chọn.

### 1. Server

```bash
cd server
npm install
cp .env.example .env     # rồi sửa các giá trị bên dưới
npm run dev              # mặc định cổng 5000
```

Các biến môi trường chính trong `.env`:

| Biến | Ý nghĩa |
|---|---|
| `PORT` | Cổng server (mặc định 5000) |
| `CORS_ORIGIN` | Origin của client, ví dụ `http://localhost:5173` |
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` | Kết nối MySQL (tạo sẵn database `rent_a_room`) |
| `JWT_SECRET` | Chuỗi bí mật dài, ngẫu nhiên để ký JWT |
| `REDIS_URL` | Redis cho rate limit khi chạy nhiều instance (để trống nếu không dùng) |
| `MAX_LOGIN_ATTEMPTS`, `LOGIN_ATTEMPT_WINDOW_MINUTES`, `LOGIN_LOCK_MINUTES` | Chống brute-force |
| `TRUST_PROXY` | Đặt `1` khi chạy sau reverse proxy |
| `CSP_*` | Tinh chỉnh Content Security Policy cho production |

### 2. Client

```bash
cd client
npm install
npm run dev              # mặc định http://localhost:5173
```

Các lệnh khác: `npm run build`, `npm run preview`, `npm run lint`.

## Phân quyền và đường dẫn

| Vai trò | Đường dẫn |
|---|---|
| tenant | `/`, `/login` |
| landlord | `/landlord/properties`, ... |
| admin | `/admin/users`, `/admin/rooms`, ... |
