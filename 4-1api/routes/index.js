const driveStatus = require('./driveStatus');
const dataCollect = require('./dataCollect');
const videoMonitor = require('./videoMonitor');
const earlyWarn = require('./earlyWarn');
const systemSetup = require('./systemSetup');

module.exports = function RouterModule (app) {

    //定义统一的路由前缀
    app.use('/4-1Api/driveStatus', driveStatus);
    app.use('/4-1Api/dataCollect', dataCollect);
    app.use('/4-1Api/videoMonitor', videoMonitor);
    app.use('/4-1Api/earlyWarn', earlyWarn);
    app.use('/4-1Api/systemSetup', systemSetup);

};
