const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session.controller");

router.post("/start-session", sessionController.startSession);
router.post("/end-session", sessionController.endSession);
router.get("/get-high-score", sessionController.getHighScore);

module.exports = router;
