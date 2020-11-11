const supertest = require("supertest");

const app = require("../../app");
const Guide = require("../../models/guide");

const request = supertest(app);

const BASE_URL = "/api/v1";

const testGuideData = {
  title: "how I fought trauma",
  body: `Her old collecting she considered discovered. So at parties he warrant oh staying. Square new horses and put better end. Sincerity collected happiness do is contented. Sigh ever way now many. Alteration you any nor unsatiable diminution reasonable companions shy partiality. Leaf by left deal mile oh if easy. Added woman first get led joy not early jokes. 
lorem
ipsum
honor
`,
  tags: ["trauma", "redemption"],
};

afterAll(async function () {
  await Guide.deleteMany({});
});

describe("/guides", function () {
  const url = `${BASE_URL}/guides`;
  let testGuide, testUser;

  describe("GET /", function () {
    it("should return list of guides", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "adebanji@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        if (!resp.body.data.token) {
          throw new Error("Authentication failed.");
        }

        testUser = resp.body.data;

        resp = await request.get(url).set({
          Authorization: `Bearer ${testUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("POST /", function () {
    it("should return newly created guide", async (done) => {
      try {
        const resp = await request
          .post(url)
          .send(testGuideData)
          .set({
            Authorization: `Bearer ${testUser.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data._id).toBeDefined();
        testGuide = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /:guideId", function () {
    it("should return guide by given id", async (done) => {
      try {
        const resp = await request.get(`${url}/${testGuide._id}`).set({
          Authorization: `Bearer ${testUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.body).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("PUT /:guideId", function () {
    it("should set guide post to inactive without error", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "admin@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        const testAdmin = resp.body.data;

        resp = await request
          .put(`${url}/${testGuide._id}`)
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
