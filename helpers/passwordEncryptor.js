"use strict"

const bcrypt = require("bcryptjs")

function encryptor(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

function decryptor(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {encryptor,decryptor}