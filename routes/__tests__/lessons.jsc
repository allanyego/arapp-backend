const supertest = require("supertest");

const app = require("../../app");

const request = supertest(app);

const BASE_URL = "/api/v1";

describe("/lessons", function () {
  const url = `${BASE_URL}/subjects`;

  describe("GET /", function () {
    it("should return list of lessons", async (done) => {
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
});
