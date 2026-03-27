const { Op } = require("sequelize");
const Property = require("../models/Property");

/**
 * Lấy danh sách khu trọ có phân trang và lọc
 */
const getAllProperties = async ({
  page = 1,
  limit = 10,
  search = "",
  province = "",
  status = "",
} = {}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const where = {};

  if (status) {
    where.status = status;
  }

  if (province) {
    where.province = province;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Property.findAndCountAll({
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
    data: rows,
  };
};


/**
 * Thêm mới một khu trọ
 * @param {Object} propertyData - Dữ liệu khu trọ
 * @returns {Promise<Object>} - Đối tượng property vừa tạo
 */
const addProperty = async (propertyData) => {
  // Tự động set created_at, updated_at nếu chưa có
  if (!propertyData.created_at) propertyData.created_at = new Date();
  if (!propertyData.updated_at) propertyData.updated_at = new Date();
  // Nếu location là object, stringify để lưu vào TEXT
  if (propertyData.location && typeof propertyData.location === 'object') {
    propertyData.location = JSON.stringify(propertyData.location);
  }
  const property = await Property.create(propertyData);
  // Trả về location là object nếu có
  if (property.location) {
    try {
      property.location = JSON.parse(property.location);
    } catch {}
  }
  return property;
};

/**
 * Lấy khu trọ theo id
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
const getPropertyById = async (id) => {
  const property = await Property.findByPk(id);
  if (!property) return null;
  let result = property.toJSON ? property.toJSON() : { ...property };
  if (result.location) {
    try {
      const loc = JSON.parse(result.location);
      result.latitude = loc.lat;
      result.longitude = loc.lng;
    } catch {}
  }
  return result;
};

module.exports = {
  getAllProperties,
  addProperty,
  getPropertyById,
};
