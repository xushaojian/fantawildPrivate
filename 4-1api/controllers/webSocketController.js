const logger = require('log4js').getLogger('webSocketController');
const BaseController = require('./baseController');
const SystemSetupService = require('../services/systemSetupService');

/**
 * @name webSocketController
 */
class WebSocketController extends BaseController {
    constructor() {
        super();
        this.systemSetupService = new SystemSetupService();   
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
            
        this.systemSetupService.getUserData(workid, ddid).then(data => {
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

module.exports = WebSocketController;
