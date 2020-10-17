"use strict";

const app = require("../app.js");
const request = require("supertest");
const { Admin, Product, ProductDetail } = require("../models");

let admin
let access_token

describe("PRODUCT TEST SUITE", () => {
  beforeAll((done) => {
    Admin.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Admin.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          role: "Store Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        admin = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  afterAll((done) => {
    Admin.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => Product.destroy({
        truncate: true,
        cascade: true,
      }))
      .then(_ => ProductDetail.destroy({
        truncate: true,
        cascade: true,
      }))
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  //Bulk Insert Products for Admin
  describe("/product/add/bulk", () => {
    test("Success, Added bulk data", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .post("/product/bulk")
            .set("access_token", access_token)
            .attach("products", "./tests/csvs/Products.csv")
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(201)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("message", "Products successfully created")
              done();
            })
        })
    })

    test("Fail, Added bulk data - Invalid Product CSV file", (done) => {
      request(app)
        .post("/product/bulk")
        .set("access_token", access_token)
        .attach("products", "./tests/csvs/test.csv")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Invalid Product CSV file")
          done();
        })
    })

    test("Fail, Added bulk data - Invalid access token", (done) => {
      request(app)
        .post("/product/bulk")
        .attach("products", "./tests/csvs/Products.csv")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(401)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Access denied")
          done();
        })
    })
  })
})


