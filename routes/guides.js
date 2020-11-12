var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const schema = require("../joi-schemas/guide");
const adminSchema = require("../joi-schemas/admin");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/guides");
const userController = require("../controllers/users");
const isClientError = require("../util/is-client-error");
const { USER } = require("../util/constants");

router.get("/", auth, async function (req, res, next) {
  const isAdmin = res.locals.userAccountType === USER.ACCOUNT_TYPES.ADMIN;

  try {
    res.json(
      createResponse({
        data: await controller.find({
          search: req.query.search || null,
          includeInactive: isAdmin,
        }),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:guideId", auth, async function (req, res, next) {
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
  await userController.checkIfInactive(res.locals.userId);

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
  await userController.checkIfInactive(res.locals.userId);

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

// Update guide details
router.put("/:guideId", auth, async function (req, res, next) {
  await userController.checkIfInactive(res.locals.userId);

  const accType = res.locals.userAccountType;
  const isAdmin = accType === USER.ACCOUNT_TYPES.ADMIN;

  try {
    if (isAdmin) {
      await adminSchema.adminEditSchema.validateAsync(req.body);
    } else {
      await schema.editSchema.validateAsync(req.body);
    }
  } catch (error) {
    return res.status(400).json(
      createResponse({
        error: error.message,
      })
    );
  }

  try {
    res.json(
      createResponse({
        data: await controller.updateGuide(req.params.guideId, req.body),
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
