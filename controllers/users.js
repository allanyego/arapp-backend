const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const tokenGen = require("generate-sms-verification-code");

const User = require("../models/user");
const mailer = require("../util/mailer");
const { USER, PROFILE_PICTURE_FORMATS } = require("../util/constants");
const throwError = require("./helpers/throw-error");
const sign = require("../routes/helpers/sign");
const isProduction = require("../util/is-production");

// Helper to normalize string properties
const normalizeUser = (data) => {
  if (data.email) {
    data.email = data.email.toLowerCase();
  }
  if (data.username) {
    data.username = data.username.toLowerCase();
  }
  if (data.fullName) {
    data.fullName = data.fullName.toLowerCase();
  }

  return data;
};
// Helper function to build filepath
const getFilePath = (filename) =>
  path.join(__dirname, "..", "uploads", "profile-pics", filename);
// Helper to check if user attributes are taken
// Helper to check if user attributes are taken
const checkIfTaken = async (data) => {
  const { username, email, phone } = data;
  if (username && (await User.findOne({ username }))) {
    throwError("Username taken.");
  }

  if (email && (await User.findOne({ email: data.email }))) {
    throwError("Email in use.");
  }

  if (phone && (await User.findOne({ phone: data.phone }))) {
    throwError("Phone number connected to an account.");
  }
};

// Helper to create a user
async function _create(data) {
  let user = await User.create(data);
  user = user.toObject();
  delete user.password;
  user.token = sign(user);
  return user;
}

// Helper to create admin user
async function createAdmin(data) {
  // Generate random password
  const password = isProduction()
    ? tokenGen(8)
    : process.env.TEST_USER_PASSWORD;
  await _create({
    ...data,
    requirePasswordChange: true,
    password: await bcrypt.hash(password, Number(process.env.SALT_ROUNDS)),
  });

  // Mail the password to user
  isProduction() &&
    (await mailer.sendMail({
      to: email,
      from: "arapp@gmail.com", // TODO: register sender
      subject: "Temporary password",
      text:
        `Welcome to ARApp's administrative team. ` +
        `Your temporary password is: ${password}. You ` +
        `will need to change this on your next sign in.`,
      html:
        `Welcome to ARApp's administrative team. ` +
        `Your temporary password is: <strong>${password}</strong>. You ` +
        `will need to change this on your next sign in.`,
    }));

  return "Successfully created user.";
}

async function create(data) {
  normalizeUser(data);

  await checkIfTaken(data);

  if (data.accountType === USER.ACCOUNT_TYPES.ADMIN) {
    return createAdmin(data);
  }

  data.gender = data.gender || null;
  data.birthday = data.birthday || null;
  return _create(data);
}

async function find({
  username,
  user = false,
  includeInactive = false,
  unset = false,
}) {
  const opts = {};
  if (unset) {
    opts.accountType = null;
  } else {
    if (user) {
      opts.accountType = USER.ACCOUNT_TYPES.USER;
    } else {
      opts.accountType = {
        $in: [
          USER.ACCOUNT_TYPES.COUNSELLOR,
          USER.ACCOUNT_TYPES.HEALTH_FACILITY,
        ],
      };
    }
  }

  if (username) {
    opts.username = {
      $regex: username,
    };
  }

  if (!includeInactive) {
    opts.active = true;
  }

  return await User.find(opts).select("-password");
}

async function findByUsername(username, includeInactive = false) {
  const opts = {};
  if (!includeInactive) {
    opts.active = true;
  }

  return await User.findOne(opts)
    .or([{ username: username }, { email: username }])
    .select("-password");
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

async function updateUser(_id, data) {
  normalizeUser(data);

  await checkIfTaken(data);

  const user = await User.findById(_id);

  if (data.password) {
    if (!data.newPassword) {
      throwError("Missing 'newPassword' field.");
    }

    if (!user) {
      throwError("No matching user found.");
    }

    // Compare old password
    if (await bcrypt.compare(data.password, user.password)) {
      data.password = await bcrypt.hash(
        data.newPassword,
        Number(process.env.SALT_ROUNDS)
      );

      await user.updateOne({
        requirePasswordChange: false,
      });
    }
  }

  const response = {};
  // Check it has a test file
  if (data.file) {
    if (!PROFILE_PICTURE_FORMATS.includes(data.file.mimetype)) {
      throwError(
        "file format should be one of: " + PROFILE_PICTURE_FORMATS.join(", ")
      );
    }

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

    response.picture = fileName;
  } else {
    await User.updateOne({ _id }, data);
  }

  return response;
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
    throwError("no user found matching credentials");
  }

  if (await bcrypt.compare(password, user.password)) {
    user = user.toJSON();
    delete user.password;
    // Append a token to the user
    user.token = sign(user);
    return user;
  } else {
    throwError("invalid credentials");
  }
}

module.exports = {
  create,
  find,
  getPicture,
  findByUsername,
  updateUser,
  findById,
  authenticate,
};
