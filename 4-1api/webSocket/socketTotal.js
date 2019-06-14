const logger = require('log4js').getLogger('socketTotal');
const BaseController = require('../controllers/baseController');

/**
 * @name 数据采集
 */
class SocketTotal extends BaseController {
    constructor() {
        super();
    }

    /** 
     * @author Amping
     * @copyright 华强方特研究院软件所数据分析部 2019
     */
    getUserMsg(req, res ,next) {
        let that = this;
        const workid = req.body.workid;
        const ddid = req.body.ddid;
            
        this.dataCollectService.getUserData(workid, ddid).then(data => {
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

module.exports = SocketTotal;
