const Vote = require("../models/vote");
const throwError = require("./helpers/throw-error");
const dbClient = require("../db/db-sql");

// Helper to check entity existence
async function checkIfExists(title) {
  const queryOpt = {
    name: "check-if-exits",
    text: "SELECT * FROM guides WHERE title=$1 LIMIT 1",
    values: [title],
  };

  const res = await dbClient.query(queryOpt);
  if (res.rows.length) {
    throwError("A post by that title already exists.");
  }
}

async function create(data) {
  data.title = data.title.toLowerCase();
  await checkIfExists(data.title);

  const queryOpt = {
    name: "create-guide",
    text:
      "INSERT INTO guides (title, body, active, links, created_at) " +
      "VALUES($1, $2, $3, $4, $5) RETURNING id",
    values: [data.title, data.body, true, data.links, new Date()],
  };
  const res = await dbClient.query(queryOpt);
  return await findById(res.rows[0].id);
}

async function find({ search = null, includeInactive = false }) {
  let hasWhere = false;
  let queryText = "SELECT * FROM guides ",
    values = [];

  if (search) {
    queryText += "WHERE title LIKE $1";
    values.push(`%${search}%`);
    hasWhere = true;
  }

  if (!includeInactive) {
    queryText += ` ${hasWhere ? "AND" : "WHERE"} active=true`;
  }

  const res = await dbClient.query(queryText, values);
  return res.rows;
}

async function findById(id) {
  const queryOpt = {
    name: "find-by-id",
    text: "SELECT * FROM guides WHERE id=$1 LIMIT 1",
    values: [id],
  };
  const res = await dbClient.query(queryOpt);
  return res.rows[0];
}

async function vote({ post, user, isUpvote = true }) {
  const _post = await findById(post);
  if (!_post) {
    throwError("No matching guide post found.");
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
  const guide = await findById(id);

  !guide && throwError("No matching guide found.");

  if (data.title) {
    data.title = data.title.toLowerCase();
    await checkIfExists(data.title);
  }

  const queryOpt = {
    name: "update-guide",
    text:
      "UPDATE guides SET title=$1, body=$2, links=$3, active=$4 WHERE id=$5",
    values: [
      data.title || guide.title,
      data.body || guide.body,
      data.links || guide.links,
      data.active || guide.active,
    ],
  };
  await dbClient.query(queryOpt);

  return findById(id);
}

module.exports = {
  create,
  find,
  findById,
  vote,
  getVotes,
  updateGuide,
};
