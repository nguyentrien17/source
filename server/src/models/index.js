const User = require('./User');
const Province = require('./Province');

// User thuộc về Province qua province (id của province)
User.belongsTo(Province, {
  foreignKey: 'province',
  targetKey: 'id',
  as: 'provinceInfo'
});

User.belongsTo(Province, {
  foreignKey: 'ward',
  targetKey: 'id',
  as: 'wardInfo'
});

module.exports = {
  User,
  Province
};
