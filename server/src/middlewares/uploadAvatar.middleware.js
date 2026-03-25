const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const AVATAR_DIR = path.join(__dirname, '../../uploads/avatars');

function ensureDir() {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureDir();
      cb(null, AVATAR_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ALLOWED_EXTS.has(ext) ? ext : '';
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();

  // Requirement: only accept image file extensions
  if (!ALLOWED_EXTS.has(ext)) {
    const err = new Error('Chỉ chấp nhận file ảnh: .png, .jpg, .jpeg, .webp, .gif');
    err.status = 422;
    return cb(err);
  }

  // Extra safety: ensure mimetype is image/*
  if (!String(file.mimetype || '').startsWith('image/')) {
    const err = new Error('File không hợp lệ');
    err.status = 422;
    return cb(err);
  }

  cb(null, true);
}

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = {
  uploadAvatar,
  AVATAR_DIR,
  ALLOWED_EXTS,
};
