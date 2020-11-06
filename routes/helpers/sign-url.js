const jsonwebtoken = require("jsonwebtoken");

const signUrl = (userId, validity = 30) => {
  return jsonwebtoken.sign(
    {
      userId,
    },
    process.env.APP_SECRET,
    {
      expiresIn: validity,
    }
  );
};

module.exports = signUrl;
