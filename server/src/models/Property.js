const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Property = sequelize.define("Property", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  province: { type: DataTypes.STRING(100), allowNull: false },
  ward: { type: DataTypes.STRING(100), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  location: { type: DataTypes.TEXT("long"), allowNull: true },
  status: { type: DataTypes.ENUM("active", "maintenance", "inactive"), allowNull: false, defaultValue: "active" },
  description: { type: DataTypes.TEXT, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "properties",
  timestamps: false,
  underscored: true,
});

module.exports = Property;