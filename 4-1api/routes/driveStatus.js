const express = require('express');
const router = express.Router();
const DriveStatusController = require('../controllers/driveStatusController');

const dsc = new DriveStatusController();

/** 
* @author Amping
* @copyright 华强方特研究院软件所数据分析部 2019
* 参数 : parkName
* 传入公园名称 --> 获取公园下的所有项目 --> 不同的项目使用不同的逻辑分析
*/
router.get('/getProjectStatus', dsc.getProjectStatus);
router.get('/getDriveStatus', dsc.getDriveStatus);
module.exports = router;
