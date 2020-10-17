"use strict"

const jwt = require("jsonwebtoken")

function jwtSigner(data) {
  return jwt.sign(data, process.env.JWT_SECRET)
}

function jwtVerifier(access_token) {
  return jwt.verify(access_token, process.env.JWT_SECRET)
} 

module.exports = {jwtSigner,jwtVerifier}