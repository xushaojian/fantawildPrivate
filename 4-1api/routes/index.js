const status = require('./status');

module.exports = function RouterModule (app) {

    //定义统一的路由前缀
    app.use('/4-1Api/status', status);
};
