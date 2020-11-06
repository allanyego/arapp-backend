const Guide = require("../models/guide");
const Vote = require("../models/vote");
const CustomError = require("../util/custom-error");

async function create(data) {
  if (await Guide.findOne({ title: data.name })) {
    throw new CustomError("possible duplicate");
  }

  return await Guide.create(data);
}

async function find() {
  return await Guide.find();
}

async function findById(_id) {
  return await Guide.findById(_id);
}

async function vote({ post, user, isUpvote = true }) {
  const _post = await Guide.findById(post);
  if (!_post) {
    throw new CustomError("no matching guide post found");
  }

  const _vote = await Vote.findOne({ post, user });
  if (_vote) {
    // User is unvoting
    if (_vote.isUpvote === isUpvote) {
      return await Vote.deleteOne({
        post,
        user,
      });
    }

    // User changed the vote type
    return await Vote.updateOne(
      {
        post,
        user,
      },
      {
        isUpvote,
      }
    );
  }

  return await Vote.create({
    post,
    user,
    isUpvote,
  });
}

async function getVotes(post, currentUser) {
  const votes = await Vote.find({ post });
  const userVote = votes.find((v) => String(v.user) === currentUser);
  const upVotes = votes.filter((v) => v.isUpvote).length;
  const downVotes = votes.filter((v) => !v.isUpvote).length;

  return {
    votes: upVotes - downVotes,
    userVote,
  };
}

module.exports = {
  create,
  find,
  findById,
  vote,
  getVotes,
};
