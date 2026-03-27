/**
 * Lấy khu trọ theo id
 */
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khu trọ', status: 404 });
    }
    res.json({ success: true, data: property, status: 200 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy khu trọ', status: 500 });
  }
};
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

/**
 * Tạo mới khu trọ
 */
exports.createProperty = async (req, res) => {
  try {
    const data = req.body;
    // Xử lý location nếu có rawCoordinate (chuỗi "lat,lng")
    let propertyData = { ...data };
    if (data.rawCoordinate) {
      const [lat, lng] = data.rawCoordinate.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        propertyData.location = JSON.stringify({ lat, lng });
      }
      delete propertyData.rawCoordinate;
    }
    const property = await propertyService.addProperty(propertyData);
    res.status(201).json({ success: true, data: property, status: 201 });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ success: false, message: 'Lỗi tạo mới khu trọ', status: 500 });
  }
};