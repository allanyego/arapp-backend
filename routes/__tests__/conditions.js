const supertest = require("supertest");

const app = require("../../app");
const Condition = require("../../models/condition");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Condition.deleteMany({});
});

describe("/conditions", function () {
  const url = `${BASE_URL}/conditions`;

  describe("GET /", function () {
    it("should return list of conditions", async (done) => {
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
    it("should return newly created condition", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "devyego@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        if (!resp.body.data.token) {
          throw new Error("Authentication failed.");
        }

        resp = await request
          .post(url)
          .send({
            name: "depression",
            symptoms: `isolation
demotivation
irritation
anxiety`,
            remedies: `cognitive therapy
social therapy
interaction
meditation`,
          })
          .set({
            Authorization: `Bearer ${resp.body.data.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data.symptoms).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
