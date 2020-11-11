const Thread = require("../models/thread");
const Message = require("../models/message");
const throwError = require("./helpers/throw-error");

async function addMessage(data) {
  let thread, lastMessage;

  if (data.thread) {
    thread = await Thread.findById(data.thread);
    if (!thread) {
      throwError("no thread by that identifier found");
    }

    lastMessage = await Message.create(data);
    // If it's a public thread
    if (thread.name) {
      return lastMessage;
    }

    thread.lastMessage = lastMessage._id;
    await thread.save();
    return lastMessage;
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

  return lastMessage;
}

async function addPublicThread(data) {
  if (await Thread.findOne({ name: data.name, participants: null })) {
    throwError("thread by name exists");
  }

  return await Thread.create(data);
}

const pop = "_id fullName picture";
async function get(thread, userId) {
  if (!userId) {
    return getPublicThreadMessages(thread);
  }

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

async function getPublicThreads() {
  return await Thread.find({
    name: {
      $ne: null,
    },
  }).populate("lastMessage");
}

async function getPublicThreadMessages(thread) {
  return await Message.find({
    thread,
  }).populate("sender", pop);
}

module.exports = {
  addMessage,
  get,
  getUserThreads,
  addPublicThread,
  getPublicThreads,
  getPublicThreadMessages,
};
