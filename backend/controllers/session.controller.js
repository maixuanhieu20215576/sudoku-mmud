const { Session } = require("../models/session.model");

const startSession = async (req, res) => {
  try {
    const { levelId } = req.body;
    const startTime = new Date();
    const status = "ongoing";
    await Session.create({ levelId, startTime, status });
    res.send({
      code: 200,
      message: "Session started successfully",
    });
  } catch (err) {
    res.send({
      code: 500,
      error: err.message,
    });
  }
};

const endSession = async (req, res) => {
  try {
    const { sessionId, status, name } = req.body;
    const endDate = new Date();

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).send({
        code: 404,
        message: "Session not found",
      });
    }

    const startTime = session.startTime;
    const totalTime = endDate - startTime;

    const updateData = { status, totalTime };
    if (name) {
      updateData.name = name;
    }

    await Session.findByIdAndUpdate(sessionId, updateData);

    res.send({
      code: 200,
      message: "Session ended successfully",
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      error: err.message,
    });
  }
};

const getHighScore = async (req, res) => {
  try {
    const highScore = await Session.find({ status: "completed" })
      .sort({ totalTime: 1 })
      .limit(1);

    res.send({
      code: 200,
      highScore,
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      error: err.message,
    });
  }
};
module.exports = {
  startSession,
  endSession,
  getHighScore,
};
