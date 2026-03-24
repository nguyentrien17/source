const Province = require("../models/Province");

async function getProvinces(parent) {
  let where = {};
  if (parent === undefined || parent === null || parent === "null") {
    // Database lưu province_parent là chuỗi 'null' cho tỉnh/thành phố
    where = { province_parent: 'null' };
  } else {
    where = { province_parent: parent };
  }

  const res = await Province.findAll({ where });
  return res;
}

module.exports = {
  getProvinces,
};
