const {
  Types: { ObjectId },
} = require("mongoose");
const Review = require("../models/review");
const User = require("../models/user");
const CustomError = require("../util/custom-error");

async function add({ forUser, byUser, rating, feedback }) {
  if (await Review.findOne({ forUser, byUser })) {
    throw new CustomError("user already has a review");
  }

  let user = await User.findById(forUser);
  if (!user) {
    throw new CustomError("no matching user found");
  }

  return await Review.create({
    forUser,
    byUser,
    rating,
    feedback,
  });
}

async function get({ forUser, rating = undefined, byUser = undefined }) {
  if (byUser) {
    return await Review.findOne({
      byUser,
      forUser,
    });
  }

  if (rating) {
    return await Review.aggregate([
      { $match: { forUser: ObjectId(forUser) } },
      { $group: { _id: null, rating: { $avg: "$rating" } } },
    ]);
  }

  return await Review.find({
    forUser,
  }).populate("byUser", "_id fullName");
}

module.exports = {
  add,
  get,
};
