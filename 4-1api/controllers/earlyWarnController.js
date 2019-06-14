const logger = require('log4js').getLogger('earlyWarnController');
const BaseController = require('./baseController');
const EarlyWarnService = require('../services/earlyWarnService');

/**
 * @name 监测预警
 */
class EarlyWarnController extends BaseController {
    constructor() {
        super();
        this.earlyWarnService = new EarlyWarnService();   
    }

    /**
   * 获取用户信息
   * @param req
   * @param res
   */
    getUserMsg(req, res ,next) {
        let that = this;
        const workid = req.body.workid;
        const ddid = req.body.ddid;
            
        this.earlyWarnService.getUserData(workid, ddid).then(data => {
            res.status(200).json(data);
            res.end();
            next();
        }).catch(err => {
            logger.error(err);
            res.status(400).json(that.getResult( -1 , 'exception' , err));
            res.end();
            next();
        });
    }
}

module.exports = EarlyWarnController;
