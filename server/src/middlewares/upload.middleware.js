const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Cấu hình Uploader dùng chung
 * @param {string} subFolder - Thư mục con bên trong 'uploads/images' (ví dụ: 'properties', 'users')
 * @param {number} limitSize - Dung lượng tối đa (mặc định 5MB)
 */
const createUploader = (subFolder = '', limitSize = 5 * 1024 * 1024) => {
    // Đường dẫn gốc là uploads/images
    const baseDir = path.join(__dirname, '../../uploads/images', subFolder);

    // Tự động tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, baseDir);
        },
        filename: (req, file, cb) => {
            // Định dạng tên: [timestamp]-[số ngẫu nhiên][đuôi file]
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận định dạng ảnh (jpg, jpeg, png, webp)!'), false);
        }
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: limitSize }
    });
};

module.exports = createUploader;