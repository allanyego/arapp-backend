const jwt = require("jsonwebtoken");

const CustomError = require("../../util/custom-error");

const verifyRequest = (token) => {
  try {
    return jwt.verify(token, process.env.APP_SECRET);
  } catch (e) {
    throw new CustomError("Invalid token");
  }
};

module.exports = verifyRequest;
