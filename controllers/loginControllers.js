"use strict"

const { Admin, Member } = require("../models")
const { decryptor } = require("../helpers/passwordEncryptor")
const { jwtSigner } = require("../helpers/jwtGenerator")

class LoginControllers {
  static async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body
      const admin = await Admin.findOne({
        where: {
          email
        }
      })
      if (!admin) throw new Error("Wrong email/password combination")
      if (decryptor(password, admin.password)) {
        res.status(200).json({
          access_token: jwtSigner({
            id: admin.id,
            isSuperAdmin: admin.isSuperAdmin
          })
        })
      }
      else throw new Error("Wrong email/password combination")
    } catch (error) {
      next(error)
    }
  }

  static async memberLogin(req, res, next) {
    try {
      const { email, password } = req.body
      const member = await Member.findOne({
        where: {
          email
        }
      })
      if (!member) throw new Error("Wrong email/password combination")
      if (decryptor(password, member.password)) {
        res.status(200).json({
          access_token: jwtSigner({
            id: member.id
          })
        })
      }
      else throw new Error("Wrong email/password combination")
    } catch (error) {
      next(error)
    }
  }
}

module.exports = LoginControllers