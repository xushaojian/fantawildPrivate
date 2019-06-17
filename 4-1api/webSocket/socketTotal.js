const logger = require('log4js').getLogger('socketTotal');
const BaseController = require('../controllers/baseController');
class SocketTotal  {
    getUserMsg(req, res ,next) {
        const workid = req.body.workid;
        const ddid = req.body.ddid;
        const base = new BaseController();
        dataCollectService.getUserData(workid, ddid).then(data => {
            res.status(200).json(data);
            res.end();
            next();
        }).catch(err => {
            logger.error(err);
            res.status(400).json(base.getResult( -1 , 'exception' , err));
            res.end();
            next();
        });
    }
}

module.exports = SocketTotal;
