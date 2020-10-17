"use strict"

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config();
}
const express = require("express")
const cors = require("cors") 
const index = require("./routes")
const errorHandler = require("./errorHandler/errorHandler")
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/", index)
app.use(errorHandler)

module.exports = app