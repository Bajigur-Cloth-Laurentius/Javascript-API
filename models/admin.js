'use strict';

const { encryptor } = require("../helpers/passwordEncryptor")

const {
  Model
} = require('sequelize');
const passwordEncryptor = require("../helpers/passwordEncryptor");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
    }
  };
  Admin.init({
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
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Role must be specified"
        },
        isIn: {
          args: [["Staff", "Store Manager", "Assistant Store Manager"]],  //Here we can add more as the role grows
          msg: "Invalid role specified"
        }
      }
    },
    isSuperAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Admin',
  });
  Admin.beforeCreate((instance, options) => {
    instance.name = instance.name.trim()
    instance.role.toLowerCase().includes("store manager") ? instance.isSuperAdmin = true : instance.isSuperAdmin = false
    if (!instance.password) instance.password = "bajigur"
    instance.password = encryptor(instance.password)
  })
  Admin.beforeUpdate((instance, options) => {
    instance.name = instance.name.trim()
    instance.role.toLowerCase().includes("store manager") ? instance.isSuperAdmin = true : instance.isSuperAdmin = false
    instance.password = encryptor(instance.password)
  })
  return Admin;
};