const {
  Types: { ObjectId },
} = require("mongoose");
const Review = require("../models/review");
const User = require("../models/user");
const CustomError = require("../util/custom-error");

async function add({ forUser, byUser, rating, feedback }) {
  const _review = await Review.findOne({ forUser, byUser });
  if (_review) {
    _review.rating = rating;
    _review.feedback = feedback;
    await _review.save();
    return _review;
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
  }).populate("byUser", "_id fullName updatedAt createdAt");
}

module.exports = {
  add,
  get,
};
