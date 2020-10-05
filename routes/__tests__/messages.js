const supertest = require("supertest");

const app = require("../../app");
const Message = require("../../models/message");
const Thread = require("../../models/thread");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Message.deleteMany({});
  await Thread.deleteMany({});
});

describe("/messages", function () {
  const url = `${BASE_URL}/messages`;
  let tempCounsellor = {
    _id: "5f7a417bca9c152b5d2d3244",
  };
  let tempUser, testThread;

  describe("POST /", function () {
    it("should return newly created thread", async (done) => {
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
            sender: tempUser._id,
            recipient: tempCounsellor._id,
            body: "hi, banji",
          })
          .set({
            Authorization: `Bearer ${tempUser.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data.lastMessage).toBeDefined();
        testThread = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /:threadId", function () {
    it("should return a list of user messages", async (done) => {
      try {
        const resp = await request.get(`${url}/${testThread._id}`).set({
          Authorization: `Bearer ${tempUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /user-threads/:userId", function () {
    it("should return a list of user threads", async (done) => {
      try {
        const resp = await request
          .get(`${url}/user-threads/${tempUser._id}`)
          .set({
            Authorization: `Bearer ${tempUser.token}`,
          });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBeDefined();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
