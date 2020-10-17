'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    static associate(models) {
      ProductDetail.belongsTo(models.Product)
      ProductDetail.belongsToMany(models.Member, { through: models.History })
    }
  };
  ProductDetail.init({
    ProductId: DataTypes.INTEGER,
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    sold: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    tags: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductDetail',
  });
  return ProductDetail;
};