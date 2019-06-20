const logger = require('log4js').getLogger('StatusController');
const StatusService = require('../services/StatusService');
const Promise = require('bluebird');
const Base = require('./Base');

/**
 * @name 设备运行状态
 */
class StatusController {

    /**
   * 获取某个公园所有项目的实时状态
   * @param parkName 公园名称
   */
    getAllProjectStatus(req, res ,next) {
        // const parkName = req.query.parkName;
        let base = new Base();
        let statusService = new StatusService();
        let getProjectStatus = statusService.getProjectStatus();

        Promise.all([getProjectStatus]).then(function(results){
           
            //判断查询方法是否都执行成功了
            if(results[0].code != 0){
                base.setResult(-1 , '执行查询的时候出错了' , []);
            }else {
                base.setResult(0 , 'success' , results[0].data);
            }

            res.status(200).json(base.getResult());
            res.end();
            next();
            
        }).catch(function(err){
            logger.error(err);
            base.setResult(-1 , '异常' , err);
            res.status(400).json(base.getResult());
            res.end();
            next();
        });

    }

    /**
   * 获取某个公园所有的设备状态
   * @param parkName 公园名称
   */
    getAllDriveStatus(req, res ,next) {
        // const parkName = req.query.parkName;
        let base = new Base();
        let statusService = new StatusService();
        let getDeviceStatus = statusService.getDeviceStatus();

        Promise.all([getDeviceStatus]).then(function(results){
           
            //判断查询方法是否都执行成功了
            if(results[0].code != 0){
                base.setResult(-1 , '执行查询的时候出错了' , []);
            }else {
                base.setResult(0 , 'success' , results[0].data);
            }
            
            res.status(200).json(base.getResult());
            res.end();
            next();
            
        }).catch(function(err){
            logger.error(err);
            base.setResult(-1 , '异常' , err);
            res.status(400).json(base.getResult());
            res.end();
            next();
        });
    }
}

module.exports = StatusController;
