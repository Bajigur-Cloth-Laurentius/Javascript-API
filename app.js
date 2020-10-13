"use strict"

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config();
}
const express = require("express")
const cors = require("cors") 
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.get('/', (req,res) => {
  res.send("Hello world!")
})

module.exports = app