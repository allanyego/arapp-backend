var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const schema = require("../joi-schemas/guide");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/guides");
const isClientError = require("../util/is-client-error");
const { USER } = require("../util/constants");

router.get("/", async function (req, res, next) {
  try {
    res.json(
      createResponse({
        data: await controller.find(),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:guideId", async function (req, res, next) {
  try {
    res.json(
      createResponse({
        data: await controller.findById(req.params.guideId),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/votes/:postId", auth, async function (req, res, next) {
  try {
    res.json(
      createResponse({
        data: await controller.getVotes(req.params.postId, res.locals.userId),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async function (req, res, next) {
  try {
    await schema.newSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(
      createResponse({
        error: error.message,
      })
    );
  }

  try {
    res.status(201).json(
      createResponse({
        data: await controller.create(req.body),
      })
    );
  } catch (error) {
    if (isClientError(error)) {
      return res.json(
        createResponse({
          error: error.message,
        })
      );
    }

    next(error);
  }
});

router.post("/votes/:postId", auth, async function (req, res, next) {
  try {
    await schema.voteSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(
      createResponse({
        error: error.message,
      })
    );
  }

  try {
    res.status(200).json(
      createResponse({
        data: await controller.vote({
          post: req.params.postId,
          user: res.locals.userId,
          ...req.body,
        }),
      })
    );
  } catch (error) {
    if (isClientError(error)) {
      return res.json(
        createResponse({
          error: error.message,
        })
      );
    }

    next(error);
  }
});

module.exports = router;
