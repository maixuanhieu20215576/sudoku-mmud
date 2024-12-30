const express = require('express');
const router = express.Router();
const levelController = require('../controllers/level.controller');

router.get('/get-level-info/:levelNumber', levelController.getLevelInfo);
router.post('/create-level', levelController.createLevel);
router.get('/get-all-levels', levelController.getAllLevels);
module.exports = router;
