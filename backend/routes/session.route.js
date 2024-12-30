const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

router.post('/start-session', sessionController.startSession);
router.post('/end-session', sessionController.endSession);
router.post('/get-high-score', sessionController.getHighScore);
router.get('/pause-session/:sessionId', sessionController.pauseSession);
router.get('/start-session/:sessionId', sessionController.continueSession);
module.exports = router;
