const Guide = require("../models/guide");
const Vote = require("../models/vote");
const throwError = require("./helpers/throw-error");

// Helper to check entity existence
async function checkIfExists(title) {
  if (await Guide.findOne({ title })) {
    throwError("A guide by that name already exists.");
  }
}

async function create(data) {
  data.title = data.title.toLowerCase();
  await checkIfExists(data.title);

  return await Guide.create(data);
}

async function find({ search = null, includeInactive = false }) {
  const opts = {};
  if (search) {
    opts.title = {
      $regex: search,
    };
  }

  if (!includeInactive) {
    opts.active = true;
  }

  return await Guide.find(opts);
}

async function findById(_id) {
  return await Guide.findById(_id);
}

async function vote({ post, user, isUpvote = true }) {
  const _post = await Guide.findById(post);
  if (!_post) {
    throwError("no matching guide post found");
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

// TODO check owner
async function updateGuide(id, data) {
  const guide = await Guide.findById(id);

  !guide && throwError("No matching guide found.");

  if (data.title) {
    data.title = data.title.toLowerCase();
    await checkIfExists(data.title);
  }

  await guide.updateOne(data);
  return guide;
}

module.exports = {
  create,
  find,
  findById,
  vote,
  getVotes,
  updateGuide,
};
