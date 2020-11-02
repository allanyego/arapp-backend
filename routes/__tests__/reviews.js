const supertest = require("supertest");

const app = require("../../app");
const Review = require("../../models/review");

const request = supertest(app);
const BASE_URL = "/api/v1";
const url = `${BASE_URL}/reviews`;

afterAll(async function () {
  await Review.deleteMany({});
});

describe("/reviews", () => {
  let testProfessional = {
    _id: "5f7a417bca9c152b5d2d3244",
  };
  let testPatient;

  describe("POST /:userId", function () {
    it("should add a new review for user", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "lmary@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        testPatient = resp.body.data;

        resp = await request
          .post(`${url}/${testProfessional._id}`)
          .send({
            rating: 4,
            feedback: "I enjoyed this services",
          })
          .set({
            Authorization: `Bearer ${testPatient.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /:userId", function () {
    it("should return review by current user authenticated user", async (done) => {
      try {
        const resp = await request.get(`${url}/${testProfessional._id}`).set({
          Authorization: `Bearer ${testPatient.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.rating).toBe(4);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
