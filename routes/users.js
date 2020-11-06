var express = require("express");
const bcrypt = require("bcrypt");

var router = express.Router();

const schema = require("../joi-schemas/user");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/users");
const sign = require("./helpers/sign");
const auth = require("../middleware/auth");
const isClientError = require("../util/is-client-error");
const multer = require("../middleware/multer");

router.get("/", async function (req, res, next) {
  // If request contains `user` query param,
  // the client is asking for USER account type
  const { username, user } = req.query;

  try {
    res.json(
      createResponse({
        data: await controller.get({
          username,
          user,
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
    setTimeout(async () => {
      res.send(await controller.getPicture(filename));
    }, 10000);
  } catch (error) {
    if (isClientError(error)) {
      return res.sendStatus(404);
    }

    next(error);
  }
});

router.get("/:userId", async function (req, res, next) {
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

  const hashedPassword = await bcrypt.hash(req.body.password, 3);

  try {
    let newUser = await controller.add({
      ...req.body,
      password: hashedPassword,
    });

    newUser = newUser.toJSON();
    delete newUser.password;
    newUser.token = sign(newUser);

    res.status(201).json(
      createResponse({
        data: newUser,
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

router.put("/:userId", auth, multer("single", "picture"), async function (
  req,
  res,
  next
) {
  if (res.locals.userId !== req.params.userId) {
    return res.status(401).json(
      createResponse({
        error: "Unauthorized operation.",
      })
    );
  }

  try {
    await schema.editSchema.validateAsync(req.body);
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
        data: await controller.update(req.params.userId, {
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
