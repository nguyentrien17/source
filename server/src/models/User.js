const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'landlord', 'tenant'),
    defaultValue: 'tenant'
  },
  fullname: {
    type: DataTypes.STRING(50)
  },
  dob: {
    type: DataTypes.DATE
  },
  email: {
    type: DataTypes.STRING(50)
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  id_card: {
    type: DataTypes.STRING(50)
  },
  address: {
    type: DataTypes.STRING(255)
  },
  province: {
    type: DataTypes.STRING(50)
  },
  ward: {
    type: DataTypes.STRING(50)
  },
  avatar: {
    type: DataTypes.TEXT('long')
  },
  created_at: {
    type: DataTypes.DATE(3),
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE(3),
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE(3)
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
