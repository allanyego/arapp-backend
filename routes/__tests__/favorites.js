const supertest = require("supertest");

const app = require("../../app");
const Favorite = require("../../models/favorite");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Favorite.deleteMany({});
});

describe("/favorites", () => {
  let testProfessional = {
    _id: "5f7a417bca9c152b5d2d3244",
  };
  let testPatient;
  const url = `${BASE_URL}/favorites`;

  describe("POST /:userId", function () {
    it("should add user to favorites", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "lmary@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        testPatient = resp.body.data;

        resp = await request.post(`${url}/${testProfessional._id}`).set({
          Authorization: `Bearer ${testPatient.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.status).toBe("success");
        done();
      } catch (error) {
        done(error);
      }
    });

    it("should remove user from favorites", async (done) => {
      try {
        const resp = await request.post(`${url}/${testProfessional._id}`).set({
          Authorization: `Bearer ${testPatient.token}`,
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
    it("should return user favorites", async (done) => {
      try {
        const resp = await request.get(url).set({
          Authorization: `Bearer ${testPatient.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // TODO: test favorite presence between patient and pro
});
