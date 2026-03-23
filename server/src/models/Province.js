const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Province = sequelize.define('Province', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  province_code: {
    type: DataTypes.TEXT
  },
  province_name: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  province_parent: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'province',
  timestamps: false
});

module.exports = Province;
