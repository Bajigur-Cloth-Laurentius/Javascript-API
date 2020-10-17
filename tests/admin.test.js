"use strict";

const app = require("../app.js");
const request = require("supertest");
const { Admin } = require("../models");
const { jwtVerifier } = require("../helpers/jwtGenerator")
const { decryptor } = require("../helpers/passwordEncryptor")

let admin
let access_token

describe("ADMIN LOGIN TEST SUITE", () => {
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
          role: "Staff",
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
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  //Login for Admin
  describe("/admin/login", () => {
    test("Success, Admin Login", (done) => {
      request(app)
        .post("/admin/login")
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
          expect(jwtVerifier(res.body.access_token)).toHaveProperty("isSuperAdmin", false)
          done();
        })
    })

    test("Fail, Admin Login - Wrong Email", (done) => {
      request(app)
        .post("/admin/login")
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

    test("Fail, Admin Login - Wrong Password", (done) => {
      request(app)
        .post("/admin/login")
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

    test("Fail, Admin Login - Invalid Requests", (done) => {
      request(app)
        .post("/admin/login")
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

//Register for Admin
describe("ADMIN REGISTER TEST SUITE", () => {
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
          role: "Staff",
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
      .then(_ => done())
      .catch((err) => console.log(err));
  });

  describe("/admin/register", () => {
    test("Success, Admin Register", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345678",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("access_token")
          expect(jwtVerifier(res.body.access_token)).toHaveProperty("id")
          expect(jwtVerifier(res.body.access_token)).toHaveProperty("isSuperAdmin", true)
          Admin.destroy({ where: { email: "johnlennon@mail.com" } })
            .then(_ => done())
        })
    })

    test("Fail, Admin Register - Empty name", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "",
          email: "johnlennon@mail.com",
          password: "12345678",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the name")
          done()
        })
    })

    test("Fail, Admin Register - Invalid name Format", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon8",
          email: "johnlennon@mail.com",
          password: "12345678",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the name with the right format without symbols and numbers")
          done()
        })
    })

    test("Fail, Admin Register - Empty email", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "",
          password: "12345678",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill in the email")
          done()
        })
    })

    test("Fail, Admin Register - Invalid email format", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail",
          password: "12345678",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Please fill the right email format")
          done()
        })
    })

    test("Fail, Admin Register - Invalid Password Length", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345",
          role: "Assistant Store Manager"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Password must be length of 8 to 35")
          done()
        })
    })

    test("Fail, Admin Register - Empty role", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345678",
          role: ""
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Role must be specified")
          done()
        })
    })

    test("Fail, Admin Register - Invalid role", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          name: "John Lennon",
          email: "johnlennon@mail.com",
          password: "12345678",
          role: "Shopper"
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Invalid role specified")
          done()
        })
    })
  })
})

//Update Data for Admin
describe("ADMIN UPDATE TEST SUITE", () => {
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
          role: "Staff",
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

  describe("/admin/<id>", () => {
    test("Success, Admin Update", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .put(`/admin/${admin.id}`)
            .set("access_token", access_token)
            .send({
              name: "  John Doe  ",
              email: "johndoe@mail.com",
              password: "12345678",
              role: "Store Manager"
            })
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Object)

              expect(res.body).toHaveProperty("name", "John Doe")
              expect(res.body).toHaveProperty("email", "johndoe@mail.com")
              expect(decryptor("12345678", res.body.password)).toBe(true)
              expect(res.body).toHaveProperty("role", "Store Manager")
              expect(res.body).toHaveProperty("isSuperAdmin", true)
              done()
            })
        })
    })

    test("Fail, Admin Update - Empty name", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "",
          email: "johndoe@mail.com",
          password: "12345678",
          role: "Store Manager"
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

    test("Fail, Admin Update - Invalid name Format", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John269",
          email: "johndoe@mail.com",
          password: "12345678",
          role: "Store Manager"
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

    test("Fail, Admin Update - Empty email", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "",
          password: "12345678",
          role: "Store Manager"
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

    test("Fail, Admin Update - Invalid email format", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "johnatmaildotco",
          password: "12345678",
          role: "Store Manager"
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

    test("Fail, Admin Update - Invalid password length", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "122",
          role: "Store Manager"
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

    test("Fail, Admin Update - Empty role", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          role: ""
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Role must be specified")
          done()
        })
    })

    test("Fail, Admin Update - Invalid role", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          role: "Store Clerk"
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Invalid role specified")
          done()
        })
    })

    test("Fail, Admin Update - Invalid access token", (done) => {
      request(app)
        .put(`/admin/${admin.id}`)
        .send({
          name: "John Doe",
          email: "johndoe@mail.com",
          password: "12345678",
          role: "Store Clerk"
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

//Get Data for Admin (All)
describe("ADMIN GET ALL TEST SUITE", () => {
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

  describe("/admin/", () => {
    test("Success, Admin Get All", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .get(`/admin/`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Array)
              expect(res.body[0]).toBeInstanceOf(Object)
              expect(res.body[0]).toHaveProperty("name", "John")
              expect(res.body[0]).toHaveProperty("email", "john@mail.com")
              expect(decryptor("12345678", res.body[0].password)).toBe(true)
              expect(res.body[0]).toHaveProperty("role", "Store Manager")
              expect(res.body[0]).toHaveProperty("isSuperAdmin", true)
              done()
            })
        })
    })

    test("Fail, Admin Get All - Not SuperAdmin", (done) => {
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
            .get(`/admin/`)
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

    test("Fail, Admin Get All - Invalid access token", (done) => {
      request(app)
        .get(`/admin/`)
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

//Get Data for Admin
describe("ADMIN GET TEST SUITE", () => {
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

  describe("/admin/<id>", () => {
    test("Success, Admin Get", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .get(`/admin/${admin.id}`)
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(res.body).toBeInstanceOf(Object)
              expect(res.body).toHaveProperty("name", "John")
              expect(res.body).toHaveProperty("email", "john@mail.com")
              expect(decryptor("12345678", res.body.password)).toBe(true)
              expect(res.body).toHaveProperty("role", "Store Manager")
              expect(res.body).toHaveProperty("isSuperAdmin", true)
              done()
            })
        })
    })

    test("Fail, Admin Get - Invalid access token", (done) => {
      request(app)
        .get(`/admin/${admin.id}`)
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

//Bulk Register Admin
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

  describe("/admin/register/admins", () => {
    test("Success, Admin Bulk Register", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .post(`/admin/register/admins`)
            .set("access_token", access_token)
            .attach("admins", "./tests/csvs/Admins.csv")
            .end((err, res) => {
              if (err) done(err)
              expect(res.status).toBe(201)
              expect(res.body).toBeInstanceOf(Array)

              expect(res.body[0]).toBeInstanceOf(Object)
              expect(res.body[0]).toHaveProperty("name", "John")
              expect(res.body[0]).toHaveProperty("email", "john@bajigur.com")
              expect(res.body[0]).toHaveProperty("password")
              expect(res.body[0]).toHaveProperty("role", "Staff")
              expect(res.body[0]).toHaveProperty("isSuperAdmin", false)

              expect(res.body[1]).toBeInstanceOf(Object)
              expect(res.body[1]).toHaveProperty("name", "Jane")
              expect(res.body[1]).toHaveProperty("email", "jane@bajigur.com")
              expect(res.body[1]).toHaveProperty("password")
              expect(res.body[1]).toHaveProperty("role", "Store Manager")
              expect(res.body[1]).toHaveProperty("isSuperAdmin", true)

              expect(res.body[2]).toBeInstanceOf(Object)
              expect(res.body[2]).toHaveProperty("name", "Jill")
              expect(res.body[2]).toHaveProperty("email", "jill@bajigur.com")
              expect(res.body[2]).toHaveProperty("password")
              expect(res.body[2]).toHaveProperty("role", "Assistant Store Manager")
              expect(res.body[2]).toHaveProperty("isSuperAdmin", true)
              done()
            })
        })
    })

    test("Fail, Admin Bulk Register - Invalid Admin CSV file", (done) => {
      request(app)
        .post(`/admin/register/admins`)
        .set("access_token", access_token)
        .attach("admins", "./tests/csvs/test.csv")
        .end((err, res) => {
          if (err) done(err)
          expect(res.status).toBe(400)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty("message", "Invalid Admin CSV file")
          done()
        })
    })

    test("Fail, Admin Bulk Register - Invalid Token", (done) => {
      request(app)
        .post(`/admin/register/admins`)
        .attach("admins", "./tests/csvs/test.csv")
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
        .post("/admin/login")
        .send({
          email: "john@bajigur.com",
          password: "bajigur"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .post(`/admin/register/admins`)
            .set("access_token", access_token)
            .attach("admins", "./tests/csvs/Admins.csv")
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

//Remove for Admin
describe("ADMIN REMOVE TEST SUITE", () => {
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

  describe("/admin/<id>", () => {
    test("Success, Admin Remove", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "john@mail.com",
          password: "12345678"
        })
        .end((err, res) => {
          access_token = res.body.access_token
          request(app)
            .delete(`/admin/${admin.id}`)
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
