const express = require("express");

const router = express.Router();

const schema = require("../joi-schemas/review");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/reviews");
const userController = require("../controllers/users");
const auth = require("../middleware/auth");
const isClientError = require("../util/is-client-error");
const { USER } = require("../util/constants");

router.get("/:userId?", auth, async (req, res, next) => {
  const rating = req.query.rating;
  const user = req.params.userId;

  const opts = {};
  if (user && !rating) {
    opts.forUser = user;
    opts.byUser = res.locals.userId;
  } else if (user && rating) {
    opts.forUser = user;
  } else {
    opts.forUser = res.locals.userId;
  }

  try {
    res.json(
      createResponse({
        data: await controller.get({
          ...opts,
          rating,
        }),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/:userId", auth, async function (req, res, next) {
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
    await userController.checkIfInactive(res.locals.userId);
    await userController.checkIfInactive(req.params.userId);
    res.status(201).json(
      createResponse({
        data: await controller.add({
          byUser: res.locals.userId,
          forUser: req.params.userId,
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
