const express = require('express');
const router = express.Router();
const msgTemplate = require('../msg_template/msg_template');
const CONFIG = require('../config');
const moment = require('moment');
const business = require('../business/business');
const ddApi = require('../api/ddApi');
var logger = require('log4js').getLogger("ddRouter");
/**
 * 创建群群会话,创建成功后向群聊发送一则信息
 * groupName：群名称
 * groupMember：群成员数组，groupMember[0]为群主
 */
router.post('/CreateChat', function (req, res, next) {
	let query = req.body;
	let groupNameArray = [];
	logger.info("==========开始建群==============")
	logger.info("入参:", query.groupName, query.groupMember)

	groupNameArray.push(query.groupName);
	let chatArray = groupNameArray.concat(eval("(" + query.groupMember + ")"));

	try {
		business.createChat(chatArray, result => {
			logger.info("返回结果:", result)
			logger.info("==========建群结束==============")
			res.send(result);
			res.end();
			next();
		});
	} catch (error) {
		let result = {
			errcode: -1,
			errmsg: error
		}
		res.send(result);
		res.end();
		next();
	}
})

/**
 * 根据群名称或群id,修改群会话
 * https://oapi.dingtalk.com/chat/update?access_token=ACCESS_TOKEN
 * {
	"chatid": "chatxxxxxxxxxxxxxxxxxxx",
	"chatname":"测试群",
    "addUserNameList": ["lisi","zhangsan"],
    "delUserNamelist": ["wangwu","liliu"]
}
 */
router.post('/UpdateChat', function (req, res, next) {
	let query = req.body;
	logger.info("==========开始修改会话==============")
	logger.info("入参:", query)
	try {
		business.updateChat(query.chatid, query.chatname, JSON.parse(query.addUserNameList), JSON.parse(query.delUserNamelist), result => {
			res.send(result);
			res.end();
			next();
		})
	} catch (error) {
		let result = {
			errcode: -1,
			errmsg: error
		}
		res.send(result);
		res.end();
		next();
	}

})

/**
 * 根据群名称或群id,删除会话
 * https://oapi.dingtalk.com/chat/update?access_token=ACCESS_TOKEN
 * {
	"chatid": "chatxxxxxxxxxxxxxxxxxxx",
	"chatname":"测试群"
	}
 */
router.post('/DeleteChat', function (req, res, next) {
	let query = req.body;
	logger.info("==========开始删除会话==============")
	logger.info("入参:", query);
	try {
		business.deleteChat(query.chatid, query.chatname, result => {
			res.send(result);
			res.end();
			next();
		})
	} catch (error) {
		let result = {
			errcode: -1,
			errmsg: error
		}
		res.send(result);
		res.end();
		next();
	}

})

/**
 * 企业内部应用免登
 * 2019-03-08
 * (1)dd.getAuthCode({})
 * (2)https://oapi.dingtalk.com/user/getuserinfo?access_token=access_token&code=code
 * (3)https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
 */
router.post('/getUserInfoForCode', function (req, res, next) {

	//临时授权码
	let query = req.body;
	logger.info(query.code)

	let myResult = {
		data: {},
		code: 0,
		msg: 'success'
	};

	//注册全局access_token
	ddApi.getAccessToken(result1 => {
		if (result1.msg === 'ok' && result1.code === 0) {
			ddApi.getUserIdForCode(query.code, result2 => {
				if (result2.msg === 'ok' && result2.code === 0) {
					ddApi.getUserInfo(result2.data.userid, result3 => {
						if (result3.msg === 'ok' && result3.code === 0) {
							myResult.data = result3.data;
							res.send(myResult);
							res.end();
							next();
						} else {
							myResult.msg = result3.msg;
							myResult.code = result3.code;
							res.send(myResult);
							res.end();
							next();
						}
					})
				} else {
					myResult.msg = result2.msg;
					myResult.code = result2.code;
					res.send(myResult);
					res.end();
					next();
				}
			})
		} else {
			myResult.msg = result1.msg;
			myResult.code = result1.code;
			res.send(myResult);
			res.end();
			next();
		}
	});
})


/**
 * 获取数字签名
 * 2018-11-17
 * 入参 signedUrl = 'http://fanta.vaiwan.com:8081/'
 */
router.post('/getOAuth', function (req, res, next) {
	let query = req.body;
	logger.info(query.signedUrl)

	const signedUrl = query.signedUrl;
	const timeStamp = moment().unix().valueOf();
	const nonceStr = 'fantawild';

	let result = {
		signature: '',
		nonceStr: '',
		timeStamp: '',
		signedUrl: '',
		corpId: '',
		errcode: 0,
		errmsg: ''
	};

	ddApi.getAccessToken(tokenResult => {
		if (tokenResult.msg === 'ok' && tokenResult.code === 0) {
			ddApi.getJSapiTicket(ticketResult => {
				if (ticketResult != 'success') {
					result.errcode = 500;
					result.errmsg.ticketResult;
					res.send(result);
					res.end();
					next();
				} else {
					//签名
					const sign = business.signature({
						nonceStr: nonceStr,
						timeStamp: timeStamp,
						signedUrl: signedUrl,
						ticket: CONFIG.JSAPI_TICKET
					});

					result.signature = sign,
						result.nonceStr = nonceStr,
						result.timeStamp = timeStamp,
						result.signedUrl = signedUrl,
						result.corpId = CONFIG.CORPID,
						result.errcode = 0,
						result.errmsg = 'success'

						res.send(result);
						res.end();
						next();
					}
			})
		} else {
			result.errcode = -1;
			result.errmsg = "获取access_token失败"
			res.send(result);
			res.end();
			next();
		}
	});
});

/**
 * 公共消息消息推送
 * Amping
 * 2018-11-17
 * 入参
 * query = {"roleid":"348971147","agentid":"174708197", "title":"数据拉取报告","msg": "markdown" }
 */
router.post('/sendPublicMsg', (req, res, next) => {
	let query = req.body;
	logger.info("公共消息推送接口入参：", query)
	try {
		business.sendWorkMsg(query.roleid, query.agentid, msgTemplate.public(query), function (result) {
			res.send(result);
			res.end();
			next();
		})
	} catch (error) {
		next()
	}


});

/**
 * 研究院出差消息推送-测试
 * Amping
 * 2018-11-17
 * 入参
 * query = { "msg": "markdown" }
 * CONFIG.ROLE_ID_12
 * CONFIG.AGENTID_1 
 */
router.post('/sendTravelMsgPostTest', (req, res, next) => {
	let query = req.body;
	logger.info("研究院出差消息推送-测试接口入参：", query);
	try {
		business.sendWorkMsg(CONFIG.ROLE_ID_12, CONFIG.AGENTID_1, msgTemplate.travelActionCard(query), function (result) {
			res.send(result);
			res.end();
			next();
		})
	} catch (error) {
		next();
	}

});

/**
 * 研究院出差消息推送-正式
 * Amping
 * 2018-11-17
 * 入参
 * query = { "msg": "markdown" }
 * CONFIG.ROLE_ID_13
 * CONFIG.AGENTID_1 
 */
router.get('/sendTravelMsgPost', (req, res, next) => {
	let query = req.body;
	logger.info("研究院出差消息推送-正式接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_13, CONFIG.AGENTID_1, msgTemplate.travelActionCard(query), function (result) {
		res.send(result);
		res.end();
		next();
	})

});

/**
 * 南宁拉玛传奇消息推送-测试
 * Amping
 * 2018-11-17
 * 入参
 * query = { "peopleCount":"234","carNum":"1,2,3,4,5,6","totalField":"12","expCount":"5","date":"2018-11-17" }
 * CONFIG.ROLE_ID_12
 * CONFIG.AGENTID_4 
 */
router.post('/sendC126CarMsgPostTest', (req, res, next) => {
	let query = req.body;
	logger.info("拉玛传奇消息推送-测试接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_12, CONFIG.AGENTID_4, msgTemplate.c126MakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

/**
 * 南宁拉玛传奇消息推送-正式
 * Amping
 * 2018-11-17
 * 入参
 * query = { "peopleCount":"234","carNum":"1,2,3,4,5,6","totalField":"12","expCount":"5","date":"2018-11-17" }
 * CONFIG.ROLE_ID_14
 * CONFIG.AGENTID_4 
 */
router.post('/sendC126CarMsgPost', (req, res, next) => {
	let query = req.body;
	logger.info("拉玛传奇消息推送-正式接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_14, CONFIG.AGENTID_4, msgTemplate.c126MakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

/**
 * 寻找鱼尾狮消息推送-测试
 * Amping
 * 2018-11-17
 * 入参
 * query = {"TotalField":19,"FaultField":6,"FailureRate":"31.58%","CarNum":"5# 6# 7# 8# 9# 10# 12# ","RunDate":"2018-10-31"}
 * CONFIG.ROLE_ID_12
 * CONFIG.AGENTID_5 
 */
router.post('/sendFishLionMsgPostTest', (req, res, next) => {
	let query = req.body;
	logger.info("寻找鱼尾狮消息推送-测试接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_12, CONFIG.AGENTID_5, msgTemplate.fishLionMakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

/**
 * 寻找鱼尾狮消息提送-正式
 * Amping
 * 2018-11-17
 * 入参
 * query = {"TotalField":19,"FaultField":6,"FailureRate":"31.58%","CarNum":"5# 6# 7# 8# 9# 10# 12# ","RunDate":"2018-10-31"}
 * CONFIG.ROLE_ID_15
 * CONFIG.AGENTID_5 
 */
router.post('/sendFishLionMsgPost', (req, res, next) => {
	let query = req.body;
	logger.info("寻找鱼尾狮消息推送-正式接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_15, CONFIG.AGENTID_5, msgTemplate.fishLionMakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

/**
 * 千岛之歌消息推送-测试
 * Amping
 * 2018-11-17
 * 入参
 * query = {"Field":8,"Fault":5,"FailureRate":"62.5%","FailureList":"20181030-3;  20181030-4;  20181030-8;  20181030-2;  20181030-7;  ","AnalysisDate":"2018-11-07"}
 * CONFIG.ROLE_ID_12
 * CONFIG.AGENTID_6 
 */
router.post('/sendMqMsgPostTest', (req, res, next) => {
	let query = req.body;
	logger.info("千岛之歌消息推送-测试接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_12, CONFIG.AGENTID_6, msgTemplate.mqMakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

/**
 * 千岛之歌消息推送-正式
 * Amping
 * 2018-11-17
 * 入参
 * query = {"Field":8,"Fault":5,"FailureRate":"62.5%","FailureList":"20181030-3;  20181030-4;  20181030-8;  20181030-2;  20181030-7;  ","AnalysisDate":"2018-11-07"}
 * CONFIG.ROLE_ID_16
 * CONFIG.AGENTID_6 
 */
router.post('/sendMqMsgPost', (req, res, next) => {
	let query = req.body;
	logger.info("千岛之歌消息推送-正式接口入参：", query)
	business.sendWorkMsg(CONFIG.ROLE_ID_16, CONFIG.AGENTID_6, msgTemplate.mqMakeDown(query), function (result) {
		res.send(result);
		res.end();
		next();
	})
});

module.exports = router;