const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { USER, PROFILE_PICTURE_FORMATS } = require("../util/constants");
const CustomError = require("../util/custom-error");
const sign = require("../routes/helpers/sign");

// Helper function to build filepath
const getFilePath = (filename) =>
  path.join(__dirname, "..", "uploads", "profile-pics", filename);
// Helper to check if user attributes are taken
const checkIfTaken = async (data) => {
  if (await User.findOne({ username: data.username })) {
    throw new CustomError("Username taken.");
  }

  if (await User.findOne({ email: data.email })) {
    throw new CustomError("Email in use.");
  }

  if (await User.findOne({ phone: data.phone })) {
    throw new CustomError("Phone number connected to an account.");
  }
};

async function add(data) {
  await checkIfTaken(data);

  data.gender = data.gender || null;
  data.birthday = data.birthday || null;
  return await User.create(data);
}

async function get({ username, user }) {
  const ops = {};
  if (user) {
    ops.accountType = USER.ACCOUNT_TYPES.USER;
  } else {
    ops.accountType = {
      $in: [USER.ACCOUNT_TYPES.COUNSELLOR, USER.ACCOUNT_TYPES.HEALTH_FACILITY],
    };
  }

  if (username) {
    ops.username = {
      $regex: username,
    };
  }

  return await User.find(ops).select("-password");
}

async function getPicture(filename) {
  return await new Promise((resolve, reject) => {
    fs.readFile(getFilePath(filename), (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          reject(new CustomError(err.message));
        }
        reject(err);
      }

      resolve(data);
    });
  });
}

async function findByUsername(username) {
  return await User.findOne()
    .or([{ username: username }, { email: username }])
    .select("-password");
}

async function update(_id, data) {
  await checkIfTaken(data);
  // Check it has a test file
  if (data.file) {
    if (!PROFILE_PICTURE_FORMATS.includes(data.file.mimetype)) {
      throw new CustomError(
        "file format should be one of: " + PROFILE_PICTURE_FORMATS.join(", ")
      );
    }

    const user = await User.findById(_id);

    const ext = data.file.originalname.split(".").pop();
    const fileName = `${user.username}.${ext}`;
    const filePath = getFilePath(fileName);
    await new Promise((resolve, reject) => {
      fs.writeFile(filePath, data.file.buffer, (err) => {
        if (err) {
          reject(err);
        }

        // Delete previous picture
        if (user.picture) {
          fs.unlink(getFilePath(user.picture), (error) => {
            if (error) {
              console.log("There was an error deleting the old file");
            }
          });
        }
        resolve();
      });
    });

    await User.updateOne(
      { _id },
      {
        ...data,
        picture: fileName,
      }
    );

    return {
      picture: fileName,
    };
  }

  return await User.updateOne({ _id }, data);
}

async function findById(_id) {
  return await User.findById(_id).select("-password");
}

async function authenticate(data) {
  const { username, password } = data;
  let user = await User.findOne().or([
    { username: username },
    { email: username },
  ]);

  if (!user) {
    throw new CustomError("no user found matching credentials");
  }

  if (await bcrypt.compare(password, user.password)) {
    user = user.toJSON();
    delete user.password;
    // Append a token to the user
    user.token = sign(user);
    return user;
  } else {
    throw new CustomError("invalid credentials");
  }
}

module.exports = {
  add,
  get,
  getPicture,
  findByUsername,
  update,
  findById,
  authenticate,
};
