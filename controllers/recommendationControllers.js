"use strict"

const { Member, History, ProductDetail, Product } = require("../models")
const { Op } = require("sequelize")
const { csvParser } = require("../helpers/csvParser")

class RecommendationControllers {
  static async getRecommendation(req, res, next) {
    try {
      const MemberId = req.memberAccessId
      const history = await History.findAll({ where: { MemberId }, include: { model: ProductDetail, include: Product } })
      if (!history.length) {
        const recommendation = await ProductDetail.findAll({ order: [["sold", "DESC"]], include: Product })
        res.status(200).json({ recommended: "None", recommendation })
      } else {
        const rank = {}
        history.forEach(hist => {
          hist.ProductDetail.tags.split(",").forEach(tag => {
            if (rank[tag] === undefined) rank[tag] = 1
            else rank[tag]++
          })
        })
        let tagSort = []
        for (const tag in rank) {
          tagSort.push([tag, rank[tag]])
        }
        tagSort.sort((a, b) => { return b[1] - a[1] })
        const recommendedTag = tagSort[Math.floor(Math.random() * 3)][0]
        const recommendation = await ProductDetail.findAll({ where: { tags: { [Op.like]: `%${recommendedTag}%` } }, order: [["sold", "DESC"]], include: Product })
        res.status(200).json({ recommended: recommendedTag, recommendation })
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async historyBulkRegister(req, res, next) {
    try {
      const historyJSON = csvParser(req.file.buffer.toString("utf-8"), "History")
      historyJSON.forEach(el => {
        if (!(el.hasOwnProperty("name")) ||
          !(el.hasOwnProperty("sku")) ||
          !(el.hasOwnProperty("amount"))
        ) throw new Error("Invalid History CSV file")
      })
      const member = await Member.findAll()
      const productDetail = await ProductDetail.findAll()
      const history = historyJSON.map(el => {
        let hist = {}
        hist.MemberId = member.filter(mem => { return mem.name === el.name })[0].id
        hist.ProductDetailId = productDetail.filter(prod => { return prod.sku === el.sku })[0].id
        hist.amount = Number(el.amount)
        return hist
      })
      const histories = await History.bulkCreate(history, { individualHooks: true })
      res.status(201).json(histories)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = RecommendationControllers