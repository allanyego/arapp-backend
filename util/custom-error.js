class CustomError extends Error {
  constructor(...opts) {
    super(...opts);
    this.name = "CustomError";
  }
}

module.exports = CustomError;
