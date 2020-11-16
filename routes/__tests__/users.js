const supertest = require("supertest");

const app = require("../../app");
const User = require("../../models/user");
const { USER } = require("../../util/constants");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await User.deleteMany({
    username: {
      $not: { $regex: "^test_" },
    },
  });
});

describe("/users", function () {
  let testAdmin = {
    fullName: "yego kip",
    username: "yego05",
    gender: "male",
    phone: "+254747345333",
    birthday: new Date("12/12/2000"),
    email: "allanyego05@gmail.com",
    accountType: USER.ACCOUNT_TYPES.ADMIN,
  };
  let testUser;

  describe("POST /signin", function () {
    it("should return authenticated user", async (done) => {
      try {
        const resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "amoskasim@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.token).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("POST /", function () {
    it("should return newly created user", async (done) => {
      try {
        const date = new Date();
        date.setFullYear(1995);

        const resp = await request.post(`${BASE_URL}/users`).send({
          fullName: "tom lurk",
          username: "tommy",
          email: "tomlurk@mail.com",
          gender: "",
          birthday: "",
          password: "test-pass",
          phone: "+254747391124",
          accountType: USER.ACCOUNT_TYPES.COUNSELLOR,
        });

        expect(resp.status).toBe(201);
        expect(resp.body.data.token).toBeDefined();
        testUser = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("POST /", function () {
    it("should send admin invite email to user", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "admin@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        resp = await request
          .post(`${BASE_URL}/users`)
          .send(testAdmin)
          .set({
            Authorization: `Bearer ${resp.body.data.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("POST /signin", function () {
    it("should return authenticated user with correct password state", async (done) => {
      try {
        const resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: testAdmin.email,
          password: process.env.TEST_USER_PASSWORD,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.requirePasswordChange).toBe(true);
        testAdmin = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("PUT /:userId", function () {
    it("should update user password without error", async (done) => {
      try {
        const resp = await request
          .put(`${BASE_URL}/users/${testAdmin._id}`)
          .send({
            password: process.env.TEST_USER_PASSWORD,
            newPassword: "jensen5000",
          })
          .set({
            Authorization: `Bearer ${testAdmin.token}`,
          });

        expect(resp.status).toBe(200);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /:userId", function () {
    it("should return user by id", async (done) => {
      try {
        const date = new Date();
        date.setFullYear(1995);

        const resp = await request
          .get(`${BASE_URL}/users/${testUser._id}`)
          .set({
            Authorization: `Bearer ${testUser.token}`,
          });

        expect(resp.status).toBe(200);
        expect(resp.body.data.username).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("PUT /:userId", function () {
    it("should update user details without error", async (done) => {
      try {
        const resp = await request
          .put(`${BASE_URL}/users/${testUser._id}`)
          .send({
            speciality: "mental nurse",
          })
          .set({
            Authorization: `Bearer ${testUser.token}`,
          });

        expect(resp.status).toBe(200);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /", function () {
    it("should return users other than normal users", async (done) => {
      try {
        const resp = await request.get(`${BASE_URL}/users`).set({
          Authorization: `Bearer ${testUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBe(2);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET ?username='test_'", function () {
    it("should return users matching query", async (done) => {
      try {
        const resp = await request.get(`${BASE_URL}/users?username=test_`).set({
          Authorization: `Bearer ${testUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBe(1);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("PUT /:userId", function () {
    it("should disable user without error", async (done) => {
      try {
        const resp = await request
          .put(`${BASE_URL}/users/${testUser._id}`)
          .send({
            active: false,
          })
          .set({
            Authorization: `Bearer ${testAdmin.token}`,
          });

        expect(resp.status).toBe(200);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
