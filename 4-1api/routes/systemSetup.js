const express = require('express');
const router = express.Router();
const SystemSetupMiddleware = require('../middlewares/systemSetupMiddleware');
const SystemSetupController = require('../controllers/systemSetupController');

const ssm = new SystemSetupMiddleware();
const ssc = new SystemSetupController();

/** 
     * @author Amping
     * @copyright 华强方特研究院软件所数据分析部 2019
     */
/** 
     * Say hello.
     * @param {string} str - Anything what you want to say.
     */
router.post('/test', ssm.checkParameter.bind(ssm), ssc.getUserMsg.bind(ssc));

module.exports = router;
