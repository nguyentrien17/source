const propertyService = require("../services/propertyService");

exports.getProperties = async (req, res) => {
    try {
    const { page, limit, search, province, status } = req.query;
    const result = await propertyService.getAllProperties({ page, limit, search, province, status });
    res.json({
        success: true,
        data: result,
        status: 200
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách khu trọ', status: 500 });
  }
};