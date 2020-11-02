/**
 * Creates generic response shape for the routes
 * @param {Object} param0 An object with either error or data fields
 * @returns {Object}
 */
function createResponse({ error, data }) {
  if (error) {
    return {
      status: "fail",
      error,
    };
  }

  return {
    status: "success",
    data,
  };
}

module.exports = createResponse;
