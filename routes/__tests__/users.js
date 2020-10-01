const supertest = require("supertest");

const app = require("../../app");
const Teacher = require("../../models/user");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Teacher.deleteMany({ username: { $ne: "yego" } });
});

describe("/users", function () {
  describe("POST /signin", function () {
    it("should return authenticated user", async (done) => {
      try {
        const resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "devyego@gmail.com",
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
          fullName: "john lu",
          username: "johnlu",
          email: "johnlu@mail.com",
          gender: "male",
          birthday: date,
          password: "test-pass",
        });

        expect(resp.status).toBe(201);
        expect(resp.body.data.token).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
