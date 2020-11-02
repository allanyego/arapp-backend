var express = require("express");

const usersRouter = require("./users");
const guidesRouter = require("./guides");
const incidentsRouter = require("./incidents");
const messagesRouter = require("./messages");
const favoritesRouter = require("./favorites");
const reviewsRouter = require("./reviews");

var router = express.Router();

router.use("/users", usersRouter);
router.use("/guides", guidesRouter);
router.use("/incidents", incidentsRouter);
router.use("/messages", messagesRouter);
router.use("/favorites", favoritesRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;
