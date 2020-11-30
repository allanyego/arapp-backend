const express = require("express");

const router = express.Router();

const schema = require("../joi-schemas/appointment");
const createResponse = require("./helpers/create-response");
const controller = require("../controllers/appointments");
const userController = require("../controllers/users");
const auth = require("../middleware/auth");
const isClientError = require("../util/is-client-error");

router.get("/:userId", auth, async (req, res, next) => {
  if (res.locals.userId !== req.params.userId) {
    return res.status(401).json(
      createResponse({
        error: "Unauthorized access.",
      })
    );
  }

  try {
    res.json(
      createResponse({
        data: await controller.findByUser(res.locals.userId),
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
        data: await controller.create({
          user: res.locals.userId,
          serviceProvider: req.params.userId,
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

router.put("/:appointmentId", auth, async function (req, res, next) {
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
    const appointment = await controller.findById(req.params.appointmentId);
    if (!appointment) {
      return res.json(
        createResponse({
          error: "No matching appointment found.",
        })
      );
    }

    if (String(appointment.serviceProvider._id) !== res.locals.userId) {
      return res.status(401).json(
        createResponse({
          error: "Unauthorized operation.",
        })
      );
    }

    appointment.status = req.body.status || appointment.status;
    await appointment.save();

    res.json(
      createResponse({
        data: "Appointment updated.",
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
