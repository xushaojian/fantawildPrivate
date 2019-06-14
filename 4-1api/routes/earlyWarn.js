const express = require('express');
const router = express.Router();
const EarlyWarnMiddleware = require('../middlewares/earlyWarnMiddleware');
const EarlyWarnController = require('../controllers/earlyWarnController');

const ewm = new EarlyWarnMiddleware();
const ewc = new EarlyWarnController();

/** 
     * @author Amping
     * @copyright 华强方特研究院软件所数据分析部 2019
     */
/** 
     * Say hello.
     * @param {string} str - Anything what you want to say.
     */
router.post('/test', ewm.checkParameter.bind(ewm), ewc.getUserMsg.bind(ewc));

module.exports = router;
