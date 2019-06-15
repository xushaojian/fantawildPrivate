var express = require('express');
var dbtool = require('../tools/dbTool');
var logger = require('log4js').getLogger("formAppRouter");
var formAppRouter = express.Router();

/* 
 * POST.
 * 根据钉钉ID获取用户创建的表单
 * http://127.0.0.1:8888/formAppRouter/getFormForDDID
 */
formAppRouter.post('/getFormForDDID', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	}
	dbtool.executeSql(`select * from form where dd_id = '${req.body.ddid}'`, function (err, result) {
		if (err) {
			myResult.code = -1;
			myResult.msg = JSON.stringify(err);
			logger.error(err);
		} else {
			myResult.data = result.recordset;
		}
		res.send(myResult)
		res.end();
		next();
	})
});

/* 
 * POST.
 * 根据表单ID 获取表单基本信息
 * http://127.0.0.1:8888/formAppRouter/getFormForFormID
 */
formAppRouter.post('/getFormForFormID', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	}
	dbtool.executeSql(`select * from form where form_id = '${req.body.formid}'`, function (err, result) {
		if (err) {
			myResult.code = -1;
			myResult.msg = JSON.stringify(err);
			logger.error(err);
		} else {
			myResult.data = result.recordset[0];
		}
		res.send(myResult);
		res.end();
		next();
	})
});

/* 
 * POST.
 * 根据表单ID查询表单的回复数据
 * http://127.0.0.1:8888/formAppRouter/getDataForFormId
 */
formAppRouter.post('/getDataForFormId', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	}
	let sqlText = `select * from form_result where form_id = '${req.body.formid}'`
	dbtool.executeSql(sqlText, function (err, result) {
		if (err) {
			myResult.code = -1;
			myResult.msg = JSON.stringify(err);
			logger.error(err);
		} else {
			myResult.data = result.recordset;
		}
		res.send(myResult);
		res.end();
		next();
	})
});

/* 
 * POST.
 * 根据钉钉ID获取用户参与的的表单
 * http://127.0.0.1:8888/formAppRouter/getFormJoinForDDID
 */
formAppRouter.post('/getFormJoinForDDID', function (req, res, next) {
	let mySesult = {
		data: {
			joinData: []
		},
		code: 0,
		msg: 'success'
	}
	dbtool.executeSql(`select * from form`, function (err, result) {
		if (err) {
			mySesult.code = -1;
			mySesult.msg = JSON.stringify(err);
			logger.error(err);
		} else {
			let joinArr = [];
			let temp;

			for (let i = 0; i < result.recordset.length; i++) {
				if (result.recordset[i].form_config === null) {
					break;
				}

				temp = JSON.parse(result.recordset[i].form_config);
				if(temp.isjoin === false){//表示该表单所有人都参与
					joinArr.push(result.recordset[i]);
				}else{
					for (let y in temp.join.users) {
						if (temp.join.users[y].userId == req.body.ddid) {
							joinArr.push(result.recordset[i]);
							break;
						}
					}
				}
			}
			mySesult.data.joinData = joinArr;
		}
		res.send(mySesult);
		res.end();
		next();
	})

});

/* 
 * POST.
 * 停止回复
 * http://127.0.0.1:8888/formAppRouter/stopReply
 * 参数:formid 表单id
 */
formAppRouter.post('/stopReply', function (req, res, next) {
	let mySesult = {
		data: {},
		code: 0,
		msg: 'success'
	};
	dbtool.executeSql(`UPDATE form SET form_config = '${req.body.formconfig}' WHERE form_id = '${req.body.formid}'`, function (err, result) {
		if (err) {
			mySesult.code = -1;
			mySesult.msg = JSON.stringify(err);
			logger.error(err);
		}
		res.send(mySesult);
		res.end();
		next();
	})

});

/* 
 * POST.
 * 删除表单
 * http://127.0.0.1:8888/formAppRouter/deleteForm
 * 参数:formid 表单id
 */
formAppRouter.post('/deleteForm', function (req, res, next) {
	let mySesult = {
		data: {},
		code: 0,
		msg: 'success'
	};
	//删除表单
	dbtool.executeSql(`DELETE FROM form WHERE form_id = '${req.body.formid}'`, function (err1, result1) {
		if (err1) {
			mySesult.code = -1;
			mySesult.msg = JSON.stringify(err1);
			logger.error(err1);
			res.send(mySesult);
			res.end();
			next();
		}else{
			//删除表单的数据
			dbtool.executeSql(`DELETE FROM form_result WHERE form_id = '${req.body.formid}'`, function (err2, result2) {
				if(err2){
					mySesult.code = -1;
					mySesult.msg = JSON.stringify(err2);
					logger.error(err2);
				}
				res.send(mySesult);
				res.end();
				next();
			})
		}
	})
});

/* 
 * POST.
 * 重命名
 * http://127.0.0.1:8888/formAppRouter/rename
 * 参数:
 * formid 表单id
 * formname 表单名称
 */
formAppRouter.post('/rename', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	}
	dbtool.executeSql(`UPDATE form SET form_name = '${req.body.formname}' WHERE form_id = '${req.body.formid}'`, function (err, result) {
		if (err) {
			myResult.code = -1;
			myResult.msg = JSON.stringify(err);
			logger.error(err);
		}
		res.send(myResult);
		res.end();
		next();
	})
});

/* 
 * POST.
 * 新建表单
 * http://127.0.0.1:8888/formAppRouter/createForm
 */
formAppRouter.post('/createForm', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	}
	dbtool.executeSql(`INSERT INTO form VALUES ('${req.body.formid}', '${req.body.formname}','${req.body.ddid}','1','${req.body.createtime}','${req.body.conponents}','${req.body.formConfig}',0)`, function (err, result) {
		if (err) {
			myResult.code = -1;
			myResult.msg = JSON.stringify(err);
			logger.error(err);
		}
		res.send(myResult);
		res.end();
		next();
	})
});

/* 
 * POST.
 * 保存或更新用户填写的表单结果并更新回复人数
 * http://127.0.0.1:8888/formAppRouter/saveResult
 */
formAppRouter.post('/saveResult', function (req, res, next) {
	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	};
	//(1)根据formid和username判断数据是否存在 
	dbtool.executeSql(`SELECT * from form_result where form_id = '${req.body.formid}' and user_name = '${req.body.username}'`, function (err1, result1) {
		if(err1){
			myResult.code = -1 ;
			myResult.msg = JSON.stringify(err1);
			logger.error(err1);
			res.send(myResult);
			res.end();
			next();
		}else{
			if(result1.rowsAffected[0] != 0){//更新数据,不用更新回复数
				dbtool.executeSql(`update form_result set time = '${req.body.time}' , result = '${req.body.result}'  where form_id ='${req.body.formid}' and user_name ='${req.body.username}'`, function (err2, result2) {
					if(err2){
						myResult.code = -1 ;
						myResult.msg = JSON.stringify(err2)
						logger.error(err2);
					}
					res.send(myResult);
					res.end();
					next();
				})
			}else{//插入数据,回复数加一
				dbtool.executeSql(`INSERT INTO form_result VALUES ('${req.body.formid}', '${req.body.username}','${req.body.time}','${req.body.result}')`, function (err3, result3) {
					if (err3) {
						myResult.code = -1;
						myResult.msg = JSON.stringify(err3);
						logger.error(err3);
						res.send(myResult);
						res.end();
						next();
					}else{//插入成功,回复人数+1
						dbtool.executeSql(`select responses_num from form where form_id ='${req.body.formid}'`, function (err4, result4) {
							if(err4){
								myResult.code = -1;
								myResult.msg = JSON.stringify(err4);
								logger.error(err4);
								res.send(myResult);
								res.end();
								next();
							}else{
								let responses_num = result4.recordset[0].responses_num;
								responses_num++;
								dbtool.executeSql(`update form set responses_num = '${responses_num}' where form_id ='${req.body.formid}'`, function (err5, result5) {
									if(err5){
										myResult.code = -1;
										myResult.msg = JSON.stringify(err5);
										logger.error(err5);
									}
									res.send(myResult);
									res.end();
									next();
								})
							}
						})
					}
				})
			}
		}
	});
});

module.exports = formAppRouter;