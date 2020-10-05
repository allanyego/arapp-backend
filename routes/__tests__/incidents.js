const supertest = require("supertest");

const app = require("../../app");
const Incident = require("../../models/incident");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Incident.deleteMany({});
});

describe("/incidents", function () {
  const url = `${BASE_URL}/incidents`;
  let tempUser;

  describe("POST /", function () {
    it("should return newly created incident", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "lmary@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        if (!resp.body.data.token) {
          throw new Error("Authentication failed.");
        }

        tempUser = resp.body.data;

        resp = await request
          .post(url)
          .send({
            location: {
              latitude: "0.478880",
              longitude: "35.264100",
            },
            contact: {
              displayName: "banji",
              phone: "254791391124",
            },
            user: tempUser._id,
          })
          .set({
            Authorization: `Bearer ${tempUser.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data.contact).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    }, 10000);
  });

  describe("GET /:userId", function () {
    it("should return a list of user incidents", async (done) => {
      try {
        const resp = await request.get(`${url}/${tempUser._id}`).set({
          Authorization: `Bearer ${tempUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });

    it("should fail", async (done) => {
      const someOtherId = "5f7a417bca9c152b5d2d3244";
      try {
        const resp = await request.get(`${url}/${someOtherId}`).set({
          Authorization: `Bearer ${tempUser.token}`,
        });

        expect(resp.status).toBe(401);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
