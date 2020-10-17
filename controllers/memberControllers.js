"use strict"

const { Admin, Member } = require("../models")
const { jwtSigner } = require("../helpers/jwtGenerator")
const { csvParser } = require("../helpers/csvParser")

class MemberControllers {
  static async memberGet(req, res, next) {
    try {
      const member = await Member.findOne({ where: { id: req.params.memberId } })
      res.status(200).json(member)
    } catch (error) {
      next(error)
    }
  }

  static async memberGetAll(req, res, next) {
    try {
      const members = await Member.findAll()
      res.status(200).json(members)
    } catch (error) {
      next(error)
    }
  }

  static async memberRegister(req, res, next) {
    try {
      const { name, email, password, phone } = req.body
      if (!password || password.length < 8 || password.length > 35) throw new Error("Password must be length of 8 to 35")
      const member = await Member.create({
        name,
        email,
        password,
        phone
      })
      res.status(201).json({
        access_token: jwtSigner({
          id: member.id,
        })
      })
    } catch (error) {
      next(error)
    }
  }

  static async memberBulkRegister(req, res, next) {
    try {
      const memberJSON = csvParser(req.file.buffer.toString("utf-8"), "Member")
      memberJSON.forEach(el => {
        if (!(el.hasOwnProperty("name")) ||
          !(el.hasOwnProperty("email")) ||
          !(el.hasOwnProperty("password")) ||
          !(el.hasOwnProperty("phone"))
        ) throw new Error("Invalid Member CSV file")
      })
      const members = await Member.bulkCreate(memberJSON, { individualHooks: true })
      res.status(201).json(members)
    } catch (error) {
      next(error)
    }
  }

  static async memberUpdate(req, res, next) {
    try {
      const { name, email, password, phone } = req.body
      if (!password || password.length < 8 || password.length > 35) throw new Error("Password must be length of 8 to 35")
      const member = await Member.update({
        name,
        email,
        password,
        phone
      }, { where: { id: req.params.memberId }, returning: true, individualHooks: true })
      res.status(200).json(member[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async memberRemove(req, res, next) {
    try {
      await Member.destroy({ where: { id: req.params.memberId } })
      res.status(200).json({ message: "OK" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MemberControllers