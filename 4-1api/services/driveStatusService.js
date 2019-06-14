const logger = require('log4js').getLogger('driveStatusService');
const BaseController = require('../controllers/baseController');
const dbTool = require('../tools/dbTool');
const commonTool = require('../tools/commonTool');
const Promise = require('bluebird');

/**
 * 数据处理层
 * 主要对数据库进行一系列的操作
 * date 格式 '20190101'
 */
class DriveStatusService {

    //获取拉玛传奇(C126车)某天的开机时间
    getBootUpTime(date) {
        let baseController = new BaseController();
        return new Promise((resolve) => {
            dbTool.executeProcedure('getBootUpTime',[{name:'date',value: date}], function (err, result) {
                if (err) {
                    logger.error(err);
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }

    //获取拉玛传奇(C126车)某天的停止时间
    getShutdownTime(date) {
        let baseController = new BaseController();
        return new Promise((resolve) => {
            dbTool.executeProcedure('getShutdownTime',[{name:'date',value: date}], function (err, result) {
                if (err) {
                    logger.error(err);
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }

    //获取拉玛传奇(C126车)某辆小车某天的所有运行数据
    getRealDollyData() {
        let currDate = commonTool.getCurrDate(); currDate = '20190101';
        let sqlText = `select * from RealDollyData01${currDate} where item3 = 1 order by collectTime`;
        let baseController = new BaseController();

        return new Promise((resolve) => {
            dbTool.executeSql(sqlText, function (err, result) {
                if (err) {
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }

    //调用存储过程获取拉玛传奇(C126车)所有小车某个时间段的运行数据
    getRealDollyDataforTime(date,startTime,endTime) {
        let baseController = new BaseController();
        return new Promise((resolve) => {
            dbTool.executeProcedure('getRealDollyDataforTime',[{name:'date',value:date},{name:'startTime',value:startTime},{name:'endTime',value:endTime}], function (err, result) {
                if (err) {
                    logger.error(err);
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }

    //调用存储过程获取某天所有小车的collectTime,item0,item3,item4项的数据,用于检测是否含有下班关机信号
    getAllRealDollyDataItemForDate(date) {
        let baseController = new BaseController();
        return new Promise((resolve) => {
            dbTool.executeProcedure('getAllRealDollyDataItemForDate',[{name:'date',value:date}], function (err, result) {
                if (err) {
                    logger.error(err);
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }

    //调用存储过程获取拉玛传奇(C126车)某辆小车全部最新的配置信息
    getAllDollyConfig() {
        let baseController = new BaseController();
        return new Promise((resolve) => {
            dbTool.executeProcedure('getAllDollyConfig',null, function (err, result) {
                if (err) {
                    logger.error(err);
                    resolve(baseController.getResult(-1, 'error', err));
                } else {
                    resolve(baseController.getResult(0, 'success', result.recordset));
                }
            });
        });
    }
}

module.exports = DriveStatusService;
