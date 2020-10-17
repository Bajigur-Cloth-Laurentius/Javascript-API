"use strict"

const { Admin, Member } = require("../models")
const { jwtSigner } = require("../helpers/jwtGenerator")
const { csvParser } = require("../helpers/csvParser")

class AdminControllers {
  static async adminGet(req, res, next) {
    try {
      const admin = await Admin.findOne({ where: { id: req.params.adminId } })
      res.status(200).json(admin)
    } catch (error) {
      next(error)
    }
  }

  static async adminGetAll(req, res, next) {
    try {
      const admins = await Admin.findAll()
      res.status(200).json(admins)
    } catch (error) {
      next(error)
    }
  }

  static async adminRegister(req, res, next) {
    try {
      const { name, email, password, role } = req.body
      if (!password || password.length < 8 || password.length > 35) throw new Error("Password must be length of 8 to 35")
      const admin = await Admin.create({
        name,
        email,
        password,
        role
      })
      res.status(201).json({
        access_token: jwtSigner({
          id: admin.id,
          isSuperAdmin: admin.isSuperAdmin
        })
      })
    } catch (error) {
      next(error)
    }
  }

  static async adminBulkRegister(req, res, next) {
    try {
      const adminJSON = csvParser(req.file.buffer.toString("utf-8"), "Admin")
      adminJSON.forEach(el => {
        if (!(el.hasOwnProperty("name")) ||
          !(el.hasOwnProperty("email")) ||
          !(el.hasOwnProperty("password")) ||
          !(el.hasOwnProperty("role"))
        ) throw new Error("Invalid Admin CSV file")
      })
      const admins = await Admin.bulkCreate(adminJSON, { individualHooks: true })
      res.status(201).json(admins)
    } catch (error) {
      next(error)
    }
  }

  static async adminUpdate(req, res, next) {
    try {
      const { name, email, password, role } = req.body
      if (!password || password.length < 8 || password.length > 35) throw new Error("Password must be length of 8 to 35")
      const admin = await Admin.update({
        name,
        email,
        password,
        role
      }, { where: { id: req.params.adminId }, returning: true, individualHooks: true })
      res.status(200).json(admin[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async adminRemove(req, res, next) {
    try {
      await Admin.destroy({ where: { id: req.params.adminId } })
      res.status(200).json({ message: "OK" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AdminControllers