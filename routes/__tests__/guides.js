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

  describe("GET /", function () {
    it("should return list of guides", async (done) => {
      try {
        const resp = await (await request.get(url)).set(
          "Accept",
          "application/json"
        );

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  let tempGuide;

  describe("POST /", function () {
    it("should return newly created guide", async (done) => {
      try {
        let resp = await request.post(`${BASE_URL}/users/signin`).send({
          username: "adebanji@gmail.com",
          password: process.env.TEST_USER_PASSWORD,
        });

        if (!resp.body.data.token) {
          throw new Error("Authentication failed.");
        }

        resp = await request
          .post(url)
          .send(testGuideData)
          .set({
            Authorization: `Bearer ${resp.body.data.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data._id).toBeDefined();
        tempGuide = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /:guideId", function () {
    it("should return guide by given id", async (done) => {
      try {
        const resp = await request.get(`${url}/${tempGuide._id}`);

        expect(resp.status).toBe(200);
        expect(resp.body.data.body).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
