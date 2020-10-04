const Thread = require("../models/thread");
const Message = require("../models/message");
const CustomError = require("../util/custom-error");

async function add(data) {
  let thread, lastMessage;

  if (data.thread) {
    thread = await Thread.findById(thread);
    if (!thread) {
      return new CustomError("no thread by that identifier found");
    }

    lastMessage = await Message.create(data);
    thread.lastMessage = lastMessage._id;

    return await thread.save();
  }

  thread = await Thread.create({
    participants: [data.sender, data.recipient],
  });

  lastMessage = await Message.create({
    ...data,
    thread: thread._id,
  });

  thread.lastMessage = lastMessage._id;
  await thread.save();

  return thread;
}

async function get(thread) {
  const pop = "_id fullName";
  return await Message.find({ thread })
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
    .populate("participants", "fullName");
}

module.exports = {
  add,
  get,
  getUserThreads,
};
