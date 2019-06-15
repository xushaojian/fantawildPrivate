const crypto = require('crypto');
const url = require('url');
const ddApi = require('../api/ddApi');
const commonTool = require('../tools/commonTool');
const dbTool = require('../tools/dbTool');
const moment = require('moment');
const msg_template = require('../msg_template/msg_template');
var logger = require('log4js').getLogger("business");

/**
 * 发送钉钉工作通知消息
 * 2017-11-18
 * 入参：
 * ROLE_ID：角色ID（在钉钉后台通讯录中的分组）
 * AGENTID：微应用ID （表示用那个微应用的身份给用户推送消息）
 * msg:消息模板
 */
exports.sendWorkMsg = function (ROLE_ID, AGENTID, msg, callBack) {
	//单次发送最多20人一次，超出则循环
	let userlist = [];
	let userString = '';

	let myResult = {
		data: {},
		code: 0,
		msg: "success"
	};

	ddApi.getAccessToken(function (tokenResult) {
		if (tokenResult.msg === 'ok' && tokenResult.code === 0) {
			ddApi.getSimpleList(ROLE_ID, 100, 0, function (listResult) {
				if (listResult instanceof Array) { //如果是数组则表示获取成功
					let colomns = 20;
					for (var i = 0; i < listResult.length; i += colomns) {

						userlist.push(listResult.slice(i, i + colomns));

						for (let z = 0; z < userlist[0].length; z++) {
							userString += userlist[0][z].userid + ','
						}
						console.log("消息体")
						console.log(msg)
						ddApi.sendMsg(AGENTID, userString, msg, function (msgResult) {
							if (msgResult.errcode === 0) {
								myResult.code = 0;
								myResult.msg = 'success'
							} else {
								myResult.code = -1;
								myResult.msg = 'fail'
							}
							//每次循环完后重置变量
							userlist = [];
							userString = '';

							//只对最后一次返回结果
							if (listResult.length - i < 20) {
								callBack(myResult)
							}
						})
					}
				} else {
					myResult.code = -1;
					myResult.msg = listResult;
					callBack(myResult)
				}
			})
		} else {
			callBack(tokenResult)
		}
	});
}

/**
 * 根据jsapiTicket生成签名，返回给前端
 * 前端微应用在调用钉钉的jsapi时,部分jsapi需要又权限
 */
exports.signature = function (params) {
	const origUrl = params.signedUrl;
	let origUrlObj = url.parse(origUrl);
	delete origUrlObj['hash'];
	const newUrl = url.format(origUrlObj);
	const plain = 'jsapi_ticket=' + params.ticket + '&noncestr=' + params.nonceStr + '&timestamp=' + params.timeStamp + '&url=' + newUrl;
	const sha1 = crypto.createHash('sha1');
	sha1.update(plain, 'utf8');
	const signature = sha1.digest('hex');
	return signature;
}

/**
 * 创建会话
 * groupArray 代表建一个群需要的所有东西，其中 groupArray[0] 为群名称  groupArray[1] 为群主 其他为群成员
 */
exports.createChat = function (groupArray, callBack) {
	//初始化返回值
	let record = {
		name: '', //群名称
		chatid: '', //群ID
		errcode: 0, //是否创建成功,0 表示成功，其他为失败
		errmsg: ''//失败原因
	}
	let nameArray = [];//群名称+群成员数组
	let useridArray = [];//群成员的钉钉id

	//groupArray = [ '拓展一号车','徐绍俭','李温温',null,'xxxx',undefined,undefined,undefined ]
	//处理一下groupArray,把没用的东西去掉,trim 一下避免空格
	for (let i in groupArray) {
		if (groupArray[i] != null && groupArray != undefined) {
			nameArray.push(groupArray[i].trim())
		}
	}

	//获取access_token
	ddApi.getAccessToken(function (tokenResult) {

		if (tokenResult.msg === 'ok' && tokenResult.code === 0) {
			ddApi.getAllEmployeeInfo(allUserList => {
				//根据传入的数组，去找userid
				//nameArray[0]为群名称
				for (let i = 1; i < nameArray.length; i++) {
					for (let y = 0; y < allUserList.length; y++) {
						if (nameArray[i] == allUserList[y].name) {
							useridArray.push(allUserList[y].userid);
						}
					}
				}
				//由于钉钉接口的限制，需要对 useridArray 进行分组 每组不超过40人
				//钉钉限制：创建会话最多只能传入40人，超出部分用 修改会话 接口进行修改 ,
				let useridGroupArray = commonTool.sliceArr(useridArray, 40);
				logger.info("群成员钉钉id:", useridGroupArray);

				for (let i = 0; i < useridGroupArray.length; i++) {
					if (i == 0) {

						//判断群名称是否存在
						dbTool.executeSql('select chatName from chat', function (err, chatNameSet) {
							let nameIsExistence = false;
							for (let y in chatNameSet.recordset) {
								if (chatNameSet.recordset[y].chatName === (groupArray[0])) {
									nameIsExistence = true;
								}
							}
							if (nameIsExistence) { //如果群名已经存在
								record.name = groupArray[0];
								record.chatid = "";
								record.errcode = -1;
								record.errmsg = '创建失败,已存在相同的群名称';
								callBack(record);
							} else {
								ddApi.createChat(groupArray[0], useridArray[0], useridGroupArray[0], createChatResult => {
									if (createChatResult.errcode === 0 && createChatResult.errmsg === 'ok') {
										record.name = groupArray[0];
										record.chatid = createChatResult.chatid;
										record.errcode = 0;
										record.errmsg = 'ok';

										dbTool.executeSql(`INSERT INTO chat VALUES ( '${record.chatid}', '${record.name}','${nameArray.splice(1)}','${useridArray}', '${moment().format('YYYY-MM-DD HH:mm:ss')}', '${record.errmsg}')`, function (err, insertResult) {
											if (useridGroupArray.length === 1) {
												ddApi.sendGroupMsg(record.chatid, msg_template.sendCreateGroupSuccessMsg(groupArray[1]))
												callBack(record);
											}
										});
									} else {
										record.name = groupArray[0];
										record.chatid = "";
										record.errcode = -1;
										record.errmsg = createChatResult.errmsg;
										callBack(record);
									}
								});
							}
						});
					} else {
						ddApi.updateChat(createChatResult.chatid, useridGroupArray[i], result => {
							if (i === useridGroupArray.length - 1) {
								ddApi.sendGroupMsg(record.chatid, msg_template.sendCreateGroupSuccessMsg(groupArray[1]))
								callBack(record);
							}
						})
					}
				}
			})
		} else {
			record.name = groupArray[0];
			record.chatid = "";
			record.errcode = -1;
			record.errmsg = "获取access_token时出错,请联系管理员";
			return record;
		}
	})
}

exports.deleteChat = function (chatid, chatname ,callBack) {
	let result = {
		errcode:0,
		errmsg:'ok'
	}
	dbTool.executeSql(`select * from chat where chatId = '${chatid}' or chatName = '${chatname}'`, (err1, result1) => {

		if (result1.rowsAffected != null && result1.rowsAffected[0] != 0) {
			let chatMembersIdArray = result1.recordset[0].chatMembersId.split(',');
			chatid = result1.recordset[0].chatId;
			ddApi.getAccessToken(function (tokenResult) {
				if (tokenResult.msg === 'ok' && tokenResult.code === 0) {
					ddApi.updateChat(chatid, [], chatMembersIdArray, result2 => {
						if(result2.errmsg === 'ok' && result2.errcode ===0){
							dbTool.executeSql(`delete from chat where chatid = '${chatid}'`,(err3, result3) => {
								callBack(result);
							})
						}else{
							callBack(result2)
						}
					})
				}else{
					result.errcode = -1 ;
					result.errmsg = '获取token失败'
					callBack(result);
				}
			})
		} else {
			result.errcode = -1 ;
			result.errmsg = '该群不存在'
			callBack(result);
		}
	})
}

exports.updateChat = function (chatid, chatname ,addUserNameList,delUserNamelist,callBack) {
	let result = {
		errcode:0,
		errmsg:'ok'
	}

	dbTool.executeSql(`select * from chat where chatId = '${chatid}' or chatName = '${chatname}'`, (err1, result1) => {
		if (result1.rowsAffected != null &&result1.rowsAffected[0] != 0) {
			chatid = result1.recordset[0].chatId;
			ddApi.getAccessToken(function (tokenResult) {
				if (tokenResult.msg === 'ok' && tokenResult.code === 0) {
					ddApi.getAllEmployeeInfo(allEmployeeInfo => {
						let addUseridList = [];
						let delUseridList = [];
						for(let a in allEmployeeInfo){
							for(let b in addUserNameList){
								if(allEmployeeInfo[a].name === addUserNameList[b]){
									addUseridList.push(allEmployeeInfo[a].userid)
								}
							}

							for(let b in delUserNamelist){
								if(allEmployeeInfo[a].name === delUserNamelist[b]){
									delUseridList.push(allEmployeeInfo[a].userid)
								}
							}
						}

						ddApi.updateChat(chatid, addUseridList, delUseridList, result2 => {
							if(result2.errmsg === 'ok' && result2.errcode ===0){
								ddApi.getChat(chatid, result3 => {
									let chatMembersName = [];
									for(let t in allEmployeeInfo){
										for(let y in result3.chat_info.useridlist){
											if(allEmployeeInfo[t].userid === result3.chat_info.useridlist[y]){
												chatMembersName.push(allEmployeeInfo[t].name)
											}
										}
									}
									dbTool.executeSql(`update chat set chatMembersName = '${chatMembersName}' , chatMembersId = '${result3.chat_info.useridlist}' where chatid = '${chatid}'`,(err4, result4) => {
										callBack(result);
									})
								})
							}else{
								callBack(result2)
							}
						})

					})
				}else{
					result.errcode = -1 ;
					result.errmsg = '获取token失败'
					callBack(result);
				}
			})
		} else {
			result.errcode = -1 ;
			result.errmsg = '该群不存在'
			callBack(result);
		}
	})
}