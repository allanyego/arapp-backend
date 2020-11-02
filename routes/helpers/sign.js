const jsonwebtoken = require("jsonwebtoken");

const sign = (user) => {
  return jsonwebtoken.sign(
    {
      userId: user._id,
      userAccountType: user.accountType,
    },
    process.env.APP_SECRET
  );
};

module.exports = sign;
