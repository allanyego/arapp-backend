const supertest = require("supertest");

const app = require("../../app");
const Message = require("../../models/message");
const Thread = require("../../models/thread");

const request = supertest(app);

const BASE_URL = "/api/v1";

afterAll(async function () {
  await Message.deleteMany({});
  await Thread.deleteMany({
    name: {
      $not: {
        $regex: "^test_",
      },
    },
  });
});

describe("/messages", function () {
  const url = `${BASE_URL}/messages`;
  let testCounsellor = {
    _id: "5f7a417bca9c152b5d2d3244",
  };
  let testGroupThread = {
    _id: "5f9f9ada5bfb247cb45f5a32",
  };
  let testUser, testThread;

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

        testUser = resp.body.data;

        resp = await request
          .post(url)
          .send({
            sender: testUser._id,
            recipient: testCounsellor._id,
            body: "hi, banji",
          })
          .set({
            Authorization: `Bearer ${testUser.token}`,
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

  describe("POST /", function () {
    it("should successfully post new message to public group", async (done) => {
      try {
        let resp = await request
          .post(url)
          .send({
            sender: testUser._id,
            thread: testGroupThread._id,
            body: "hi, world",
          })
          .set({
            Authorization: `Bearer ${testUser.token}`,
          });

        expect(resp.status).toBe(201);
        expect(resp.body.data._id).toBeDefined();
        testThread = resp.body.data;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe("GET /", function () {
    it("should return a list of public threads", async (done) => {
      try {
        const resp = await request.get(url).set({
          Authorization: `Bearer ${testUser.token}`,
        });

        expect(resp.status).toBe(200);
        expect(resp.body.data.length).toBe(1);
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

  describe("GET /user-threads/:userId", function () {
    it("should return a list of user threads", async (done) => {
      try {
        const resp = await request
          .get(`${url}/user-threads/${testUser._id}`)
          .set({
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
});
