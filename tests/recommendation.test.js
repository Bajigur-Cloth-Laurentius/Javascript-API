"use strict";

const app = require("../app.js");
const request = require("supertest");
const { Admin, Product, ProductDetail, History } = require("../models");

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
        admin = res
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
                request(app)
                  .post("/admin/register/members")
                  .set("access_token", access_token)
                  .attach("members", "./tests/csvs/Members.csv")
                  .end((err, res) => {
                    request(app)
                      .post("/admin/register/history")
                      .set("access_token", access_token)
                      .attach("history", "./tests/csvs/History.csv")
                      .end((err, res) => {
                        done()
                      })
                  })
              })
          })
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
      .then(_ => History.destroy({
        truncate: true,
        cascade: true,
      }))
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  //Recommendation for logged in member
  describe("/member/recommendation", () => {
    test("Success, Get recommendation", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "yena@mail.com",
          password: "bajigur"
        })
        .end((err, res) => {
          request(app)
            .get("/member/recommendation")
            .set("access_token", res.body.access_token)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty("recommended")
              expect(res.body).toHaveProperty("recommendation")
              done()
            })
        })
    })
  })
})


