const supertest = require("supertest");

const app = require("../../app");
const Subject = require("../../models/subject");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Subject.deleteMany({});
});

describe("/subjects", function () {
  describe("GET /", function () {
    const url = `${BASE_URL}/subjects`;

    it("should return a list of subjects", async (done) => {
      try {
        const resp = await request.get(url);

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("POST /", function () {
    const url = `${BASE_URL}/subjects`;

    it("should return newly created subject", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/teachers/signin`).send({
          username: "devyego@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        if (!resp.body?.data?.token) {
          throw new Error("Authentication failed.");
        }

        resp = await request
          .post(url)
          .send({
            name: "math",
            description: "logic and counting",
          })
          .set({
            Authorization: `Bearer ${resp.body.data.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data.name).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
