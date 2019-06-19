const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/StatusController');

const sc = new StatusController();

/** 
* @author Amping
* @copyright 华强方特研究院软件所数据分析部 2019
* 参数 : parkName
* 传入公园名称 --> 获取公园下的所有项目 --> 不同的项目使用不同的逻辑分析
*/
router.get('/getProjectStatus', sc.getAllProjectStatus);
router.get('/getDriveStatus', sc.getAllDriveStatus);
module.exports = router;
