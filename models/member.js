'use strict';

const { encryptor } = require("../helpers/passwordEncryptor")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      Member.belongsToMany(models.ProductDetail, { through: models.History })
    }
  };
  Member.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Please fill in the name"
        },
        is: {
          args: /^[a-z ]+$/i,
          msg: "Please fill the name with the right format without symbols and numbers"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Please fill in the email"
        },
        isEmail: {
          args: true,
          msg: "Please fill the right email format"
        }
      }
    },
    password: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Phone must be specified"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Member',
  });
  Member.beforeCreate((instance, options) => {
    instance.name = instance.name.trim()
    if (!instance.password) instance.password = "bajigur"
    instance.password = encryptor(instance.password)
  })
  Member.beforeUpdate((instance, options) => {
    instance.name = instance.name.trim()
    instance.password = encryptor(instance.password)
  })
  return Member;
};