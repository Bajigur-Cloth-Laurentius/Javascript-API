"use strict"

const { Admin, Member } = require("../models")
const { jwtVerifier } = require("../helpers/jwtGenerator")

class Auth {
  static async adminAuthenticate(req, res, next) {
    try {
      if (!req.headers.access_token) throw new Error("Invalid token")
      const credential = jwtVerifier(req.headers.access_token)
      if (!credential) throw new Error("Invalid token")
      const admin = await Admin.findOne({ where: { id: credential.id } })
      if (!admin) throw new Error("Invalid token")
      req.adminAccessId = admin.id
      req.isSuperAdmin = admin.isSuperAdmin
      next()
    } catch (error) {
      next(error)
    }
  }

  static async memberAuthenticate(req, res, next) {
    try {
      if (!req.headers.access_token) throw new Error("Invalid token")
      const credential = jwtVerifier(req.headers.access_token)
      if (!credential) throw new Error("Invalid token")
      const member = await Member.findOne({ where: { id: credential.id } })
      if (!member) throw new Error("Invalid token")
      req.memberAccessId = member.id
      next()
    } catch (error) {
      next(error)
    }
  }

  static async adminModifyAuthorize(req, res, next) {
    try {
      if (req.params.adminId != req.adminAccessId) {
        if (!req.isSuperAdmin) {
          throw new Error("Unauthorized access")
        }
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  static async memberModifyAuthorize(req, res, next) {
    try {
      if (req.params.memberId != req.memberAccessId) throw new Error("Unauthorized access")
      next()
    } catch (error) {
      next(error)
    }
  }

  static adminIsSuperAdmin(req, res, next) {
    if (req.isSuperAdmin) next()
    else throw new Error("Unauthorized access")
  }
}

module.exports = Auth