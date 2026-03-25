const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs/promises");
const path = require("node:path");

const LOCAL_AVATAR_PREFIX = "/uploads/avatars/";

function getLocalAvatarFilename(avatarValue) {
  if (!avatarValue || typeof avatarValue !== "string") return null;
  if (!avatarValue.startsWith(LOCAL_AVATAR_PREFIX)) return null;
  const filename = path.basename(avatarValue.slice(LOCAL_AVATAR_PREFIX.length));
  return filename || null;
}

async function safeDeleteLocalAvatarByValue(avatarValue) {
  const filename = getLocalAvatarFilename(avatarValue);
  if (!filename) return;
  const absolutePath = path.resolve(
    __dirname,
    "..",
    "..",
    "uploads",
    "avatars",
    filename
  );
  try {
    await fs.unlink(absolutePath);
  } catch (err) {
    if (err && err.code === "ENOENT") return;
    throw err;
  }
}

const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
} = {}) => {
  const { Op } = require("sequelize");
  const offset = (page - 1) * limit;

  const where = { deleted_at: null };
  if (role) where.role = role;
  if (search) {
    where[Op.or] = [
      { username: { [Op.like]: `%${search}%` } },
      { fullname: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit: Number(limit),
    offset: Number(offset),
    order: [["created_at", "DESC"]],
  });

  return {
    total: count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(count / limit),
    data: rows.map((user) => {
      const { password, ...rest } = user.toJSON();
      return rest;
    }),
  };
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  const { password, ...rest } = user.toJSON();
  return rest;
};

const createUser = async (data) => {
  const { Op } = require("sequelize");
  // Kiểm tra trùng Email/Username
  const existing = await User.findOne({
    where: { [Op.or]: [{ username: data.username }] },
  });
  if (existing) throw new Error("Username đã được sử dụng");

  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  data.id = data.id || uuidv4();

  const user = await User.create(data);
  const { password, ...rest } = user.toJSON();
  return rest;
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const hasAvatarInPayload = Object.prototype.hasOwnProperty.call(data, "avatar");
  const oldAvatar = user.avatar;
  if (hasAvatarInPayload && (data.avatar === "" || data.avatar === undefined)) {
    data.avatar = null;
  }
  const nextAvatar = hasAvatarInPayload
    ? data.avatar
    : oldAvatar;

  if (data.password) data.password = await bcrypt.hash(data.password, 10);

  await User.update(data, { where: { id } });

  // Xóa file avatar cũ nếu user đổi avatar hoặc xóa avatar
  if (hasAvatarInPayload && oldAvatar && oldAvatar !== nextAvatar) {
    await safeDeleteLocalAvatarByValue(oldAvatar);
  }

  const updated = await User.findByPk(id);
  const { password: _, ...rest } = updated.toJSON();
  return rest;
};

const deleteUser = async (id) => {
  const user = await User.findOne({ where: { id, deleted_at: null } });
  if (!user) return null;
  await User.update({ deleted_at: new Date() }, { where: { id } });
  const { password, ...rest } = user.toJSON();
  return rest;
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  const { password: _, ...rest } = user.toJSON();
  return rest;
};

const checkDuplicateUsername = async (username) => {
  const user = await User.findOne({ where: { username } });
  return !!user;
};

const getUserById = async (id) => {
  const user = await User.findOne({ where: { id, deleted_at: null } });
  if (!user) return null;
  const { password, ...rest } = user.toJSON();
  return rest;
};

module.exports = {
  getAllUsers,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  checkDuplicateUsername,
  getUserById,
};
