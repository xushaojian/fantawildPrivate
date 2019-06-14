const express = require('express');
const router = express.Router();
const VideoMonitorMiddleware = require('../middlewares/videoMonitorMiddleware');
const VideoMonitorController = require('../controllers/videoMonitorController');

const vmm = new VideoMonitorMiddleware();
const vmc = new VideoMonitorController();

router.post('/test', vmc.getUserMsg.bind(vmc));

module.exports = router;
