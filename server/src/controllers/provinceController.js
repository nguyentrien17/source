const provinceService = require('../services/provinceService');

exports.getProvinces = async (req, res) => {
  try {
    const { parent } = req.query;
    const provinces = await provinceService.getProvinces(parent);
    res.json(provinces);
    
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách tỉnh/xã', error: err.message });
  }
};
