const { Level } = require("../models/level.model");

const getLevelInfo = async (req, res) => {
  const { levelNumber } = req.params;
  const levelInfo = await Level.findOne({ levelNumber });
  res.send({
    code: 200,
    levelInfo,
  });
};

const createLevel = async (req, res) => {
  try {
    const { levelNumber, levelData } = req.body;
    await Level.create({ levelNumber, levelData });
    res.send({
      code: 200,
      message: "Level created successfully",
    });
  } catch (err) {
    res.send({
      code: 500,
      error: err.message,
    });
  }
};

const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find({});
    res.send({
      code: 200,
      levels,
    });
  } catch (err) {
    res.send({
      code: 500,
      error: err.message,
    });
  }
};
module.exports = { getLevelInfo, createLevel, getAllLevels };
