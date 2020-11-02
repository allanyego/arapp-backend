const Thread = require("../models/thread");
const Message = require("../models/message");
const CustomError = require("../util/custom-error");

async function add(data) {
  let thread, lastMessage;

  if (data.thread) {
    thread = await Thread.findById(data.thread);
    if (!thread) {
      return new CustomError("no thread by that identifier found");
    }

    lastMessage = await Message.create(data);
    // If it's a public thread
    if (!thread.participants || thread.name) {
      return lastMessage;
    }

    thread.lastMessage = lastMessage._id;
    return await thread.save();
  }

  thread = await Thread.findOne({
    participants: {
      $all: [data.sender, data.recipient],
    },
  });

  if (!thread) {
    thread = await Thread.create({
      participants: [data.sender, data.recipient],
    });
  }

  lastMessage = await Message.create({
    ...data,
    thread: thread._id,
  });

  thread.lastMessage = lastMessage._id;
  await thread.save();

  return thread;
}

<<<<<<< HEAD
async function addPublicThread(data) {
  if (await Thread.findOne({ name: data.name })) {
    throw new CustomError("thread by name exists");
  }

  return await Thread.create(data);
}

const pop = "_id fullName";
async function get(thread, userId) {
  if (!userId) {
    return getPublicThreadMessages(thread);
  }

=======
async function get(thread, userId) {
  const pop = "_id fullName";
>>>>>>> 927d62f01ebef1fe194951bdcf3d4e064c7e65ec
  return await Message.find({
    thread,
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .populate("sender", pop)
    .populate("recipient", pop);
}

async function getUserThreads(userId) {
  return await Thread.find({
    participants: {
      $all: [userId],
    },
  })
    .populate("lastMessage", "body createdAt")
    .populate("participants", "_id fullName");
}

<<<<<<< HEAD
async function getPublicThreads() {
  return await Thread.find({
    participants: {
      $eq: null,
    },
  }).populate("lastMessage");
}

async function getPublicThreadMessages(thread) {
  return await Message.find({
    thread,
  }).populate("sender", pop);
}

=======
>>>>>>> 927d62f01ebef1fe194951bdcf3d4e064c7e65ec
module.exports = {
  add,
  get,
  getUserThreads,
<<<<<<< HEAD
  addPublicThread,
  getPublicThreads,
  getPublicThreadMessages,
=======
>>>>>>> 927d62f01ebef1fe194951bdcf3d4e064c7e65ec
};
