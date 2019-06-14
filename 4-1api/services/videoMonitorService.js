const logger = require('log4js').getLogger('videoMonitorService');
const BaseController = require('../controllers/baseController');
const dbTool = require('../tools/dbTool');
const Promise = require('bluebird');

/**
 * 数据处理层
 * 主要对数据库进行一系列的操作
 */
class VideoMonitorService extends BaseController {

    constructor() {
        super();
        this.baseController = new BaseController();
    }

    //查找用户信息
    getUserData(workid, ddid) {
        let that = this;
        //then 方法接收两个函数作为参数，第一个参数是 Promise 执行成功时的回调，第二个参数是 Promise 执行失败时的回调，两个函数只会有一个被调用。
        return new Promise((resolve, reject) => {
            try {
                dbTool.executeSql(`select * from [dbo].[user] where work_id = '${workid}' and dd_id = '${ddid}'`, function (err, result) {
                    if (err) {
                        logger.error(err);
                        resolve(that.baseController.getResult(-1, 'error', err));
                    } else {
                        resolve(that.baseController.getResult(0, 'success', result.recordset));
                    }
                });
            } catch (exp) {
                logger.error(exp);
                reject(that.baseController.getResult(-1, 'expction', exp));
            }
        });
    }
}

module.exports = VideoMonitorService;
