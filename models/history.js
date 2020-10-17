'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.Member)
      History.belongsTo(models.ProductDetail)
    }
  };
  History.init({
    MemberId: DataTypes.INTEGER,
    ProductDetailId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};