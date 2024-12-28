const mongoose = require("mongoose");

const LevelSchema = mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: true,
    },
    levelData: {
      type: [[Number]],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Level = mongoose.model('Level', LevelSchema);

module.exports = { Level };
