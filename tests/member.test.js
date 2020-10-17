"use strict";

const app = require("../app.js");
const request = require("supertest");
const { Admin, Member } = require("../models");
const { jwtVerifier } = require("../helpers/jwtGenerator")
const { decryptor } = require("../helpers/passwordEncryptor")

let member
let admin
let access_token

describe("MEMBER LOGIN TEST SUITE", () => {
  beforeAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          phone: "0812345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        member = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  afterAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  //Login for Member
  describe("/member/login", () => {
    test("Success, Member Login", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("access_token")
          expect(jwtVerifier(res.body.access_token)).toHaveProperty("id")
          done();
        })
    })

    test("Fail, Member Login - Wrong Email", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "johnd@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Username/password didn't match")
          done();
        })
    })

    test("Fail, Member Login - Wrong Password", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "john@mail.com",
          password: "11345678"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Username/password didn't match")
          done();
        })
    })

    test("Fail, Member Login - Invalid Requests", (done) => {
      request(app)
        .post("/member/login")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(500)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Internal error")
          done();
        })
    })

  })
})

//Register for Member
describe("MEMBER REGISTER TEST SUITE", () => {
  beforeAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          phone: "0812345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        member = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  afterAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  describe("/member/register", () => {
    test("Success, Member Register", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("access_token")
          expect(jwtVerifier(res.body.access_token)).toHaveProperty("id")
          Member.destroy({ where: { email: "johnlennon@mail.com" } })
            .then(_ => done())
        })
    })

    test("Fail, Member Register - Empty name", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "",
          email: "johnlennon@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the name")
          done()
        })
    })

    test("Fail, Member Register - Invalid name Format", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon8",
          email: "johnlennon@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the name with the right format without symbols and numbers")
          done()
        })
    })

    test("Fail, Member Register - Empty email", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon",
          email: "",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the email")
          done()
        })
    })

    test("Fail, Member Register - Invalid email format", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the right email format")
          done()
        })
    })

    test("Fail, Member Register - Invalid Password Length", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Password must be length of 8 to 35")
          done()
        })
    })

    test("Fail, Member Register - Empty Phone", (done) => {
      request(app)
        .post("/member/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345678",
          phone: ""
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Phone must be specified")
          done()
        })
    })

  })
})


//Update Data for Member
describe("MEMBER UPDATE TEST SUITE", () => {
  beforeAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          phone: "0812345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        member = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  describe("/member/<id>", () => {
    test("Success, Member Update", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .put(`/member/${member.id}`)
            .set("access_token", access_token)
            .send({
              name: "  John Doe  ",
              email: "johndoe@mail.com",
              password: "12345678",
              phone: "0823456789"
            })
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Object)

              expect(res.body).toHaveProperty("name", "John Doe")
              expect(res.body).toHaveProperty("email", "johndoe@mail.com")
              expect(decryptor("12345678", res.body.password)).toBe(true)
              expect(res.body).toHaveProperty("phone", "0823456789")
              done()
            })
        })
    })

    test("Fail, Member Update - Empty name", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "",
          email: "johndoe@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the name")
          done()
        })
    })

    test("Fail, Member Update - Invalid name Format", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John269",
          email: "johndoe@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the name with the right format without symbols and numbers")
          done()
        })
    })

    test("Fail, Member Update - Empty email", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John Doe",
          email: "",
          password: "12345678",
          phone: "0823456789"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the email")
          done()
        })
    })

    test("Fail, Member Update - Invalid email format", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John Doe",
          email: "johnatmaildotco",
          password: "12345678",
          phone: "0823456789"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the right email format")
          done()
        })
    })

    test("Fail, Member Update - Invalid password length", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "122",
          phone: "0823456789"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Password must be length of 8 to 35")
          done()
        })
    })

    test("Fail, Member Update - Empty phone", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          phone: ""
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Phone must be specified")
          done()
        })
    })

    test("Fail, Member Update - Invalid access token", (done) => {
      request(app)
        .put(`/member/${member.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          phone: "0823456789"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(401)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Access denied")
          done()
        })
    })
  })
})

//Get Member Data for Admin (All)
describe("MEMBER GET ALL TEST SUITE", () => {
  beforeAll((done) => {
    Admin.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.destroy({
          truncate: true,
          cascade: true,
        })
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
      .then(_ => {
        return Member.create({
          name: "Jill",
          email: "jill@mail.com",
          password: "12345678",
          phone: "0812345678",
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

  describe("/member/", () => {
    test("Success, Member Get All", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .get(`/member/`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body[0]).toBeInstanceOf(Object)
              expect(res.body[0]).toHaveProperty("name", "Jill")
              expect(res.body[0]).toHaveProperty("email", "jill@mail.com")
              expect(decryptor("12345678", res.body[0].password)).toBe(true)
              expect(res.body[0]).toHaveProperty("phone", "0812345678")
              done()
            })
        })
    })

    test("Fail, Member Get All - Not SuperAdmin", (done) => {
      request(app)
        .post(`/admin/register`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          role: "Staff"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .get(`/member/`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(401)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("message", "Unauthorized access")
              done()
            })
        })
    })

    test("Fail, Member Get All - Invalid access token", (done) => {
      request(app)
        .get(`/member/`)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(401)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Access denied")
          done()
        })
    })
  })
})

//Get Member Data
describe("MEMBER GET TEST SUITE", () => {
  beforeAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          phone: "0812345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        member = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  describe("/member/<id>", () => {
    test("Success, Member Get", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .get(`/member/${member.id}`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("name", "John")
              expect(res.body).toHaveProperty("email", "john@mail.com")
              expect(decryptor("12345678", res.body.password)).toBe(true)
              expect(res.body).toHaveProperty("phone", "0812345678")
              done()
            })
        })
    })

    test("Fail, Admin Get - Invalid access token", (done) => {
      request(app)
        .get(`/admin/${member.id}`)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(401)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Access denied")
          done()
        })
    })
  })
})


//Bulk Register Member for Admin
describe("ADMIN BULK REGISTER TEST SUITE", () => {
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

  describe("/admin/register/members", () => {
    test("Success, Member Bulk Register", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .post(`/admin/register/members`)
            .set("access_token", access_token)
            .attach("members", "./tests/csvs/Members.csv")
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(201)
              expect(res.body).toBeInstanceOf(Array)

              expect(res.body[0]).toBeInstanceOf(Object)
              expect(res.body[0]).toHaveProperty("name", "Bambang")
              expect(res.body[0]).toHaveProperty("email", "bambang@mail.com")
              expect(res.body[0]).toHaveProperty("password")
              expect(res.body[0]).toHaveProperty("phone", "0811111111")

              expect(res.body[1]).toBeInstanceOf(Object)
              expect(res.body[1]).toHaveProperty("name", "Budi")
              expect(res.body[1]).toHaveProperty("email", "budi@mail.com")
              expect(res.body[1]).toHaveProperty("password")
              expect(res.body[1]).toHaveProperty("phone", "0822222222")

              expect(res.body[2]).toBeInstanceOf(Object)
              expect(res.body[2]).toHaveProperty("name", "Iman")
              expect(res.body[2]).toHaveProperty("email", "iman@mail.com")
              expect(res.body[2]).toHaveProperty("password")
              expect(res.body[2]).toHaveProperty("phone", "0833333333")

              expect(res.body[3]).toBeInstanceOf(Object)
              expect(res.body[3]).toHaveProperty("name", "Yena")
              expect(res.body[3]).toHaveProperty("email", "yena@mail.com")
              expect(res.body[3]).toHaveProperty("password")
              expect(res.body[3]).toHaveProperty("phone", "0844444444")
              done()
            })
        })
    })

    test("Fail, Member Bulk Register - Invalid Member CSV file", (done) => {
      request(app)
        .post(`/admin/register/members`)
        .set("access_token", access_token)
        .attach("members", "./tests/csvs/test.csv")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Invalid Member CSV file")
          done()
        })
    })

    test("Fail, Member Bulk Register - Invalid Token", (done) => {
      request(app)
        .post(`/admin/register/members`)
        .attach("members", "./tests/csvs/Members.csv")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(401)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Access denied")
          done()
        })
    })

    test("Fail, Admin Bulk Register - Unauthorized access", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John",
          email: "john@bajigur.com",
          password: "12345678",
          role: "Staff"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .post(`/admin/register/members`)
            .set("access_token", access_token)
            .attach("members", "./tests/csvs/Members.csv")
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(401)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("message", "Unauthorized access")
              done()
            })
        })
    })
  })
})

//Remove Data for Member
describe("MEMBER REMOVE TEST SUITE", () => {
  beforeAll((done) => {
    Member.destroy({
      truncate: true,
      cascade: true,
    })
      .then(_ => {
        return Member.create({
          name: "John",
          email: "john@mail.com",
          password: "12345678",
          phone: "0812345678",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      .then((res) => {
        member = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  describe("/member/<id>", () => {
    test("Success, member Remove", (done) => {
      request(app)
        .post("/member/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .delete(`/member/${member.id}`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("message", "OK")
              done()
            })
        })
    })
  })
})
