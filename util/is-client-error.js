const ValidatorError = require("mongoose").Error.ValidatorError;

const CustomError = require("./custom-error");

function isClientError(error) {
  return error instanceof CustomError || error instanceof ValidatorError;
}

module.exports = isClientError;
