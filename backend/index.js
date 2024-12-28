const express = require("express");
const router = express.Router();
const levelRoute = require("./routes/level.route");
const sessionRoute = require("./routes/session.route");

router.use("/level", levelRoute);
router.use("/session", sessionRoute);
module.exports = router;
