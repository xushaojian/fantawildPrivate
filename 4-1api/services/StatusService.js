const logger = require('log4js').getLogger('StatusService');
const Base = require('../controllers/Base');
const dbTool = require('../tools/dbTool');
const Promise = require('bluebird');

/**
 * 数据访问层
 */
class StatusService {

    //获取南宁-东盟神话-拉玛传奇(C126车)项目实时状态
    getProjectStatus(){
        let base = new Base();
        return new Promise((resolve) => {
            dbTool.executeProcedure('aa_get_project_status',[], function (err, result) {
                if (err) {
                    logger.error(err);
                    base.setResult(-1, 'error', err)
                    resolve(base.getResult());
                } else {
                    base.setResult(0, 'success', result.recordset);
                    resolve(base.getResult());
                }
            });
        });
    }
   
    //获取南宁-东盟神话-拉玛传奇(C126车)项目所有车辆实时状态
    getDeviceStatus(){
        let base = new Base();
        return new Promise((resolve) => {
            dbTool.executeProcedure('aa_get_all_device_status',[], function (err, result) {
                if (err) {
                    logger.error(err);
                    base.setResult(-1, 'error', err)
                    resolve(base.getResult());
                } else {
                    base.setResult(0, 'success', result.recordset)
                    resolve(base.getResult());
                }
            });
        });
    }

}

module.exports = StatusService;
