var express = require("express");
const bcrypt = require("bcrypt");

var router = express.Router();

const schema = require("../joi-schemas/user");
const adminSchema = require("../joi-schemas/admin");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/users");
const auth = require("../middleware/auth");
const isClientError = require("../util/is-client-error");
const multer = require("../middleware/multer");
const { USER } = require("../util/constants");

router.get("/", auth, async function (req, res, next) {
  // If request contains `user` query param,
  // the client is asking for USER account type
  const { username, user } = req.query;
  const isAdmin = res.locals.userAccountType === USER.ACCOUNT_TYPES.ADMIN;

  try {
    res.json(
      createResponse({
        data: await controller.find({
          username,
          user,
          includeInactive: isAdmin,
        }),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/picture/:filename", async function (req, res, next) {
  const { filename } = req.params;

  try {
    res.send(await controller.getPicture(filename));
  } catch (error) {
    if (isClientError(error)) {
      return res.sendStatus(404);
    }

    next(error);
  }
});

router.get("/:userId", auth, async function (req, res, next) {
  try {
    res.json(
      createResponse({
        data: await controller.findById(req.params.userId),
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async function (req, res, next) {
  try {
    res.json({
      data: await controller.authenticate(req.body),
    });
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

router.post("/", async function (req, res, next) {
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
    let hashedPassword;

    if (req.body.password) {
      hashedPassword = await bcrypt.hash(
        req.body.password,
        Number(process.env.SALT_ROUNDS)
      );
    }

    res.status(201).json(
      createResponse({
        data: await controller.create({
          ...req.body,
          password: hashedPassword,
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

router.post("/admin", auth, async function (req, res, next) {
  if (res.locals.userAccountType !== USER.ACCOUNT_TYPES.ADMIN) {
    return res.status(403).json(
      createResponse({
        error: "Unathorized operation",
      })
    );
  }

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
        data: await controller.add(req.body),
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

router.put("/:userId", auth, multer("single", "picture"), async function (
  req,
  res,
  next
) {
  const { userAccountType, userId } = res.locals;
  const isCurrent = userId === req.params.userId;
  const isAdmin = userAccountType === USER.ACCOUNT_TYPES.ADMIN;

  if (!isCurrent && !isAdmin) {
    return res.status(401).json(
      createResponse({
        error: "Unauthorized operation.",
      })
    );
  }

  try {
    if (isAdmin && !isCurrent) {
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
        data: await controller.updateUser(req.params.userId, {
          ...req.body,
          file: req.file || null,
        }),
      })
    );
  } catch (error) {
    if (isClientError(error)) {
      return res.status(400).json(
        createResponse({
          error: error.message,
        })
      );
    }

    next(error);
  }
});

module.exports = router;
