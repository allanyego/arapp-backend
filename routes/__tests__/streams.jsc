const supertest = require("supertest");

const app = require("../../app");
const Stream = require("../../models/stream");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Stream.deleteMany({});
});

describe("/streams", function () {
  describe("GET /", function () {
    const url = `${BASE_URL}/streams`;
    it("should return a list of streams", async (done) => {
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
    const url = `${BASE_URL}/streams`;

    it("should return newly created stream", async (done) => {
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
            name: "blue",
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
