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

  let tempUser;

  describe("POST /", function () {
    it("should return newly created user", async (done) => {
      try {
        const date = new Date();
        date.setFullYear(1995);

        const resp = await request.post(`${BASE_URL}/users`).send({
          fullName: "john lu",
          username: "johnlu",
          email: "johnlu@mail.com",
          gender: "male",
          birthday: date,
          password: "test-pass",
          phone: "254747391124",
          accountType: USER.ACCOUNT_TYPES.COUNSELLOR,
        });

        expect(resp.status).toBe(201);
        expect(resp.body.data.token).toBeDefined();
        tempUser = resp.body.data;
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

        const resp = await request.get(`${BASE_URL}/users/${tempUser._id}`);

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
        const date = new Date();
        date.setFullYear(1995);

        const resp = await request
          .put(`${BASE_URL}/users/${tempUser._id}`)
          .send({
            accountType: USER.ACCOUNT_TYPES.COUNSELLOR,
          })
          .set({
            Authorization: `Bearer ${tempUser.token}`,
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
        const resp = await request.get(`${BASE_URL}/users`);

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBe(2);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET ?username='test_'", function () {
    it("should return users matching quert", async (done) => {
      try {
        const resp = await request.get(`${BASE_URL}/users?username=test_`);

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBe(1);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
