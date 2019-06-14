const express = require('express');
const router = express.Router();

const DataCollectMiddleware = require('../middlewares/dataCollectMiddleware');
const DataCollectController = require('../controllers/dataCollectController');

const dcm = new DataCollectMiddleware();
const dsc = new DataCollectController();

/** 
 * @author Amping
 * @copyright 华强方特研究院软件所数据分析部 2019
 */
router.post('/test', dcm.checkParameter.bind(dcm), dsc.getUserMsg.bind(dsc));

module.exports = router;
