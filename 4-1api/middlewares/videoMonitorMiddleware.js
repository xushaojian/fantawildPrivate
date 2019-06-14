const logger = require('log4js').getLogger('videoMonitorMiddleware');
const BaseController = require('../controllers/baseController'); 
class VideoMonitorMiddleware extends BaseController {
    constructor() {
        super();
    }

    /**
     *自定义验证规则
     * @param req
     * @param res
     * @param {*} next
     */
    checkParameter(req, res, next) {
        logger.info('入参:',req.body);
        const workid = req.body.workid;
        const ddid = req.body.ddid;
        if (!workid || workid === '' || !ddid || ddid === '') {
            res.status(201).json(this.getResult(-1, '请检验您的信息是否全部填写！', {}));
            res.end();
        }else{
            next();
        }
    }
}

module.exports = VideoMonitorMiddleware;