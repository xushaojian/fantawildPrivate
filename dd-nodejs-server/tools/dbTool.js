//导入mssql模块
var mssql = require("mssql");
var logger = require('log4js').getLogger("dbTool");
var CONFIG = require("../config");
var sql = {};
var config = {};



/**
 * 执行sql文本
 */
sql.executeSql =  function (sql, callBack) {
	logger.info(sql)
	if(process.env.NODE_ENV === "development"){
		config = CONFIG.DEVELOPMENT.DB
	}else{
		config = CONFIG.PRODUCTION.DB
	}
	var connection = new mssql.ConnectionPool(config, (err) => {
		if (err) {
			logger.error(err);
			callBack(err, null);
			return;
		}
		var ps = new mssql.PreparedStatement(connection);
		//从连接池中获取单个连接
		ps.prepare(sql, (err) => {
			if (err) {
				logger.error(err);
				callBack(err, null);
				return;
			}
			//执行准备好的语句。
			//执行(值，[回调])
			ps.execute('', (err, result) => {
				if (err) {
					logger.error(err);
					callBack(err, null);
					return;
				}
				//释放链接
				ps.unprepare(err => {
					if (err) {
						logger.error(err);
						callBack(err, null);
						return;
					}
					callBack(err, result);
				});
			});
		});

	});
};



module.exports = sql;