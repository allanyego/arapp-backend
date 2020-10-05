var express = require("express");

const usersRouter = require("./users");
const guidesRouter = require("./guides");
const incidentsRouter = require("./incidents");
const messagesRouter = require("./messages");

var router = express.Router();

router.use("/users", usersRouter);
router.use("/guides", guidesRouter);
router.use("/incidents", incidentsRouter);
router.use("/messages", messagesRouter);

module.exports = router;
