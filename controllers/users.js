const User = require("../models/user");

async function add(data) {
  if (
    await User.findOne().or([
      { username: data.username },
      { email: data.email },
    ])
  ) {
    throw new Error("Possible duplicate.");
  }

  return await User.create(data);
}

async function get({ accountType, username }) {
  const ops = {};
  if (accountType) {
    ops.accountType = accountType;
  }
  if (username) {
    ops.username = username;
  }
  return await User.find(ops);
}

async function findByUsername(username) {
  return await User.findOne().or([{ username: username }, { email: username }]);
}

async function update(_id, data) {
  return await User.updateOne({ _id }, data);
}

async function findById(_id) {
  return await User.findById(_id);
}

module.exports = {
  add,
  get,
  findByUsername,
  update,
  findById,
};
