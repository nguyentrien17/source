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

module.exports = {
  getAllProperties,
};
