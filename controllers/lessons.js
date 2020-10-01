const Lesson = require("../models/lesson");
const Class = require("../models/condition");

async function add(data) {
  if (await Lesson.findOne({ day: data.day, slot: data.slot })) {
    throw new Error("Slot taken.");
  }

  return await Lesson.create(data);
}

async function findById(id) {
  const lesson = await Lesson.findById(id).populate("subject", "name");
  const _class = await Class.findById(lesson.class).pupulate("stream", "name");
  return {
    ...lesson,
    class: `${_class.level} ${_class.stream.name}`,
  };
}

module.exports = {
  add,
  findById,
};
