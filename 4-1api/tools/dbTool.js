var mssql = require('mssql');
var logger = require('log4js').getLogger('dbTool');
var CONFIG = require('../config');
var sql = {};
var config = {};

/**
 * 执行sql文本
 */
sql.executeSql = function (sql, callBack) {
    logger.info(sql);
    if (process.env.NODE_ENV === 'development') {
        config = CONFIG.DEVELOPMENT.DB;
    } else {
        config = CONFIG.PRODUCTION.DB;
    }
    let connection = new mssql.ConnectionPool(config, (err) => {
        if (err) {
            logger.error(err);
            callBack(err, null);
        } else {
            let ps = new mssql.PreparedStatement(connection);
            ps.prepare(sql, (err) => {
                if (err) {
                    logger.error(err);
                    callBack(err, null);
                } else {
                    ps.execute('', (err, result) => {
                        if (err) {
                            logger.error(err);
                            callBack(err, null);
                        } else {
                            ps.unprepare();
                            callBack(err, result);
                        }
                    });
                }
            });
        }
    });
};

/**
 * 执行存储过程
 * @param string procedure 存储过程名称
 * @param [] params 存储过程参数
 * params的定义格式如：
    var params=[
        {
            name:"xxxxx",
            value:1
        },
    ];
 * 调用示例:dbTool.executeProcedure('test',params, function (err, result) {})
 */
sql.executeProcedure = function (procedure, params, callBack) {
    if (process.env.NODE_ENV === 'development') {
        config = CONFIG.DEVELOPMENT.DB;
    } else {
        config = CONFIG.PRODUCTION.DB;
    }
    let connection = new mssql.ConnectionPool(config, err => {
        if (err) {
            logger.error(err);
            callBack(err, null);
        } else {
            let request = new mssql.Request(connection);
            if (params !== null) {
                for (let p in params) {
                    request.input(params[p].name, params[p].value);
                }
            }
            request.execute(procedure, (error, result) => {
                if (error){
                    logger.error(error);
                    callBack(error);
                }else {
                    callBack(error, result);
                }
            });
        }
    });
};

module.exports = sql;