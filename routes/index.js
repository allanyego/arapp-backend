var express = require("express");

const usersRouter = require("./users");
const subjectsRouter = require("./subjects");
const conditionsRouter = require("./condition");
const lessonsRouter = require("./lessons");
const streamsRouter = require("./streams");

var router = express.Router();

router.use("/users", usersRouter);
router.use("/subjects", subjectsRouter);
router.use("/conditions", conditionsRouter);
router.use("/lessons", lessonsRouter);
router.use("/streams", streamsRouter);

module.exports = router;
