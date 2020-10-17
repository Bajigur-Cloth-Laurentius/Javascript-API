"use strict"

const { Product, ProductDetail } = require("../models")
const { csvParser, csvParserWithQuotes } = require("../helpers/csvParser")

class ProductControllers {
  static async productGetAll(req, res, next) {
    try {
      const products = await ProductDetail.findAll({ include: Product })
      res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  static async productGet(req, res, next) {
    try {
      const productId = req.params.productDetailId
      const product = await ProductDetail.findOne({ where: { id: productId }, include: Product })
      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  static async productBulkInsert(req, res, next) {
    try {
      const productJSON = csvParserWithQuotes(req.file.buffer.toString("utf-8"), "Product")
      productJSON.forEach(el => {
        if (!(el.hasOwnProperty("url_handle")) ||
          !(el.hasOwnProperty("name")) ||
          !(el.hasOwnProperty("description")) ||
          !(el.hasOwnProperty("type")) ||
          !(el.hasOwnProperty("image_url")) ||
          !(el.hasOwnProperty("price")) ||
          !(el.hasOwnProperty("color")) ||
          !(el.hasOwnProperty("size")) ||
          !(el.hasOwnProperty("stock")) ||
          !(el.hasOwnProperty("sold")) ||
          !(el.hasOwnProperty("sku")) ||
          !(el.hasOwnProperty("tags"))
        ) throw new Error("Invalid Product CSV file")
      })
      const rawProduct = productJSON.map(obj => {
        const newObj = {}
        const prop = ["url_handle", "name", "description", "type", "image_url", "price"]
        prop.forEach(el => { newObj[el] = obj[el] })
        return newObj
      })
      const uniqueProduct = []
      const uniqueUrlHandle = []
      rawProduct.forEach(prod => {
        if (!uniqueUrlHandle.includes(prod.url_handle)) {
          uniqueProduct.push(prod)
          uniqueUrlHandle.push(prod.url_handle)
        }
      })
      const products = await Product.bulkCreate(uniqueProduct)
      const productDetail = productJSON.map(obj => {
        const newObj = {}
        const prop = ["color", "size", "stock", "sold", "sku"]
        newObj.ProductId = products.filter(el => { return el.url_handle === obj.url_handle })[0].id
        prop.forEach(el => { newObj[el] = obj[el] })
        newObj.tags = obj.tags.join(",")
        return newObj
      })
      await ProductDetail.bulkCreate(productDetail)
      res.status(201).json({ message: "Products successfully created" })
    } catch (error) {
      next(error)
    }
  }

  static async productInsert(req, res, next) {
    try {
      const { url_handle, name, description, type, image_url, price, color, size, stock, sold, sku, tags } = req.body
      let product = await Product.findOne({ where: { url_handle } })
      if (!product) product = await Product.create({
        url_handle,
        name,
        description,
        type,
        image_url,
        price
      })
      const productDetail = await ProductDetail.create({
        ProductId: product.id,
        color,
        size,
        stock,
        sold,
        sku,
        tags
      })
      res.status(201).json({ message: "Product registered" })
    } catch (error) {
      next(error)
    }
  }

  static async productUpdate(req, res, next) {
    try {
      const productId = req.params.productId
      const { url_handle, name, description, type, image_url, price } = req.body
      await Product.update({
        url_handle,
        name,
        description,
        type,
        image_url,
        price
      }, { where: { id: productId } })
      res.status(200).json({ message: "Product updated" })
    } catch (error) {
      next(error)
    }
  }

  static async productDetailUpdate(req, res, next) {
    try {
      const productDetailId = req.params.productDetailId
      const { color, size, stock, sold, sku, tags } = req.body
      await Product.update({
        color,
        size,
        stock,
        sold,
        sku,
        tags
      }, { where: { id: productDetailId } })
      res.status(200).json({ message: "Product detail updated" })
    } catch (error) {
      next(error)
    }
  }

  static async productDetailStockPatch(req, res, next) {
    try {
      const productDetailId = req.params.productDetailId
      const { stock, sold } = req.body
      await Product.update({
        stock,
        sold,
      }, { where: { id: productDetailId } })
      res.status(200).json({ message: "Product detail stock patched" })
    } catch (error) {
      next(error)
    }
  }

  static async productDelete(req, res, next) {
    try {
      const productId = req.params.productId
      await Product.destroy({ where: { id: productId } })
      await ProductDetail.destroy({ where: { ProductId: productId } })
      res.status(200).json({ message: "Product deleted" })
    } catch (error) {
      next(error)
    }
  }

  static async productDetailDelete(req, res, next) {
    try {
      const productDetailId = req.params.productDetailId
      await ProductDetail.destory({ where: { id: productDetailId } })
      res.status(200).json({ message: "Product detail deleted" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ProductControllers