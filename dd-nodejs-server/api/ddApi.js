const request = require('request');
const rp = require('request-promise');
const util = require('util');
const CONFIG = require('../config');
const moment = require('moment');
var logger = require('log4js').getLogger("ddApi");
const requestPromise = util.promisify(request);

/* 
 * 方法名:注册全局变量 ACCESS_TOKEN
 * 钉钉接口:企业内部获取access_token.
 * 请求方式：GET（HTTPS）
 * https://oapi.dingtalk.com/gettoken?corpid=dingb1c4a1559ce0331e&corpsecret=YWZJy5BDWNj8eveFJQhswODzM30BWxPTzNSMiiiOwiGSBremj0LdssjD0pvYtBI-
 * 在调用钉钉接口前都需要先调用该函数获取access_token,该接口会先判断是否存在access_token和是否已过期（120分钟）
 * moment().unix().valueOf() 当前时间距离1970.01.01的秒数
 */
exports.getAccessToken = function (callBack) {
    let myResult = {
        data: {},
        msg: "ok",
        code: 0
    };
    let currentTime = moment().unix().valueOf();
    if (CONFIG.GET_ACCESS_TOKEN_LASTTIME == 0 || (currentTime - CONFIG.GET_ACCESS_TOKEN_LASTTIME) > 115 * 60) {
        requestPromise(`${CONFIG.DDHOST}/gettoken?corpid=${CONFIG.CORPID}&corpsecret=${CONFIG.CORPSECRET}`).then((value) => {
            let result = JSON.parse(value.body)

            if (result.errmsg === "ok" && result.errcode === 0) {
                CONFIG.GET_ACCESS_TOKEN_LASTTIME = currentTime;
                CONFIG.ACCESS_TOKEN = result.access_token;
            } else {
                logger.error(result.errmsg);
                myResult.msg = result.errmsg;
                myResult.code = result.errcode;
            }
            callBack(myResult);
        });

    } else {
        callBack(myResult);
    }
}

/*
 * 获取部门列表（递归部门的全部子部门）
 * 请求方式：GET（HTTPS）
 * https://oapi.dingtalk.com/department/list?access_token=ACCESS_TOKEN
 * 参数	参数类型	必须	说明
 * access_token	String	是	调用接口凭证
 * lang	String	否	通讯录语言（默认zh_CN，未来会支持en_US）
 * fetch_child	Boolean	否	是否递归部门的全部子部门，ISV微应用固定传递false
 * id	String	是	父部门id（如果不传，默认部门为根部门，根部门ID为1）
 * 请求成功后返回数组对象
 */
exports.getDepartmentList = function (callBack) {
    let depResult;
    requestPromise(`${CONFIG.DDHOST}/department/list?access_token=${CONFIG.ACCESS_TOKEN}&lang=zh_CN&fetch_child=true&id=${CONFIG.DEP_ID_1}`).then((value) => {
        let userResult = JSON.parse(value.body)
        if (userResult.errcode === 0) {
            depResult = userResult.department;
        } else {
            logger.error("获取部门列表时出错了,错误码:", result.errcode)
            depResult = `获取部门列表时出错了,错误码:${result.errcode}`;
        }
        callBack(depResult);
    }).catch((err) => {
        logger.error("获取部门列表时出现异常:", err);
        depResult = `获取部门列表时出现异常:${err}`;
        callBack(depResult);
    });
}


/*
 * 获取部门用户
 * 请求方式：GET（HTTPS）
 * https://oapi.dingtalk.com/user/simplelist?access_token=ACCESS_TOKEN&department_id=1
 */
exports.getDepSimpleList = function (department_id, callBack) {
    let funResult;
    requestPromise(`${CONFIG.DDHOST}/user/simplelist?access_token=${CONFIG.ACCESS_TOKEN}&department_id=${department_id}`).then((value) => {
        let userResult = JSON.parse(value.body)
        if (userResult.errcode === 0) {
            funResult = userResult.userlist
        } else {
            logger.error("获取部门用户列表时出错了,错误码:", result.errcode)
            funResult = `获取部门用户列表时出错了,错误码:${result.errcode}`;
        }
        callBack(funResult)
    }).catch((err) => {
        logger.error("获取部门用户列表时出现异常:", err);
        funResult = `获取部门用户列表时出现异常:${err}`;
        callBack(funResult)
    });
}


/*
 *获取钉钉通讯录下所有的员工信息
 *调用该函数前需要先调用获取access_token来注册全局变量ACCECC_TOKEN
 *首先获取到所有部门，再循环获取部门下的用户
 *由于通讯录不是经常变动，可以设置到缓存中去,并设置超时
 */
exports.getAllEmployeeInfo = function (callBack) {
    let allUserList = [];
    let currentTime = moment().unix().valueOf();
    if (CONFIG.GET_ALL_USER_ARRAY_LASTTIME == 0 || (currentTime - CONFIG.GET_ALL_USER_ARRAY_LASTTIME) > 115 * 60) {
        this.getDepartmentList(depList => {
            for (let i = 0; i < depList.length; i++) {
                this.getDepSimpleList(depList[i].id, depUserList => {
                    for (let x in depUserList) {
                        allUserList.push(depUserList[x]);
                    }
                });
            }
            setTimeout(function () {
                CONFIG.GET_ALL_USER_ARRAY_LASTTIME = currentTime;
                CONFIG.ALL_USER_ARRAY = allUserList;
                logger.info("通讯录总人数：" + allUserList.length);
                callBack(allUserList);
            }, 3000);
        })
    } else {
        allUserList = CONFIG.ALL_USER_ARRAY;
        logger.info("通讯录总人数：" + allUserList.length);
        callBack(allUserList);
    }
}


/*
 * 获取角色下的员工列表
 * 请求方式：GET（HTTPS）
 * https://oapi.dingtalk.com/topapi/role/simplelist?access_token=ACCESS_TOKEN
 * role_id	Number	必须	1203141	角色ID
 * size	    Number	可选	20	    分页大小，默认值：20
 * offset	Number	可选	0	    分页偏移，默认值：0
 * 请求成功后返回员数组
 */
exports.getSimpleList = function (role_id, size, offset, callBack) {
    let funResult
    requestPromise(`${CONFIG.DDHOST}/topapi/role/simplelist?access_token=${CONFIG.ACCESS_TOKEN}&role_id=${role_id}&size=${size}&offset=${offset}`).then((value) => {
        let userResult = JSON.parse(value.body)
        if (userResult.errcode == 0) {
            logger.info("消息发送到:", userResult.result.list)
            funResult = userResult.result.list
            callBack(funResult);
        } else {
            logger.info("获取角色用户列表时出错了,错误码:", result.errcode)
            funResult = `获取角色用户列表时出错了,错误码:${result.errcode}`;
            callBack(funResult);
        }
    }).catch((err) => {
        logger.info("获取角色用户列表时出现异常:", err);
        funResult = `获取角色用户列表时出现异常:${err}`;
        callBack(funResult);
    });
}


/* 
 * 发送工作通知消息.
 * POST
 * https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=ACCESS_TOKEN
 * 参数：
 * agent_id	    Number	必须	1234
 * userid_list	String	可选	zhangsan,lisi	接收者的用户userid列表，最大列表长度：20 (userid_list,dept_id_list,to_all_user必须有一个不能为空)
 * dept_id_list	Number	可选	123,456	        接收者的部门id列表，最大列表长度：20
 * to_all_user	Boolean	可选	false	        是否发送给企业全部用户
 * msg	        Json	必须	'{"msgtype":"text","text":{"content":"消息内容"}}'  实测要用序列化后的json
 */
exports.sendMsg = function (agent_id, userid_list, msg, callBack) {
    let options = {
        url: `${CONFIG.DDHOST}/topapi/message/corpconversation/asyncsend_v2`,
        form: {
            access_token: CONFIG.ACCESS_TOKEN,
            agent_id: agent_id,
            userid_list: userid_list,
            to_all_user: false,
            msg: msg
        }
    }

    request.post(options, function (error, response, body) {
        if (error) {
            logger.error(error)
            callBack(JSON.parse(error));
        } else {
            callBack(JSON.parse(body));
        }
    });
}


/* 
 * 创建群会话.
 * POST
 * https://oapi.dingtalk.com/chat/create?access_token=ACCESS_TOKEN
 */
exports.createChat = function (name, owner, useridlist, callBack) {
    let options = {
        method: 'POST',
        json: true,
        uri: `${CONFIG.DDHOST}/chat/create`,
        qs: {
            access_token: CONFIG.ACCESS_TOKEN,
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        body: {
            name: name,
            owner: owner,
            useridlist: useridlist,
            showHistoryType: "1"
        }
    };

    rp(options).then(function (repos) {
        callBack(repos)
    }).catch(function (err) {
        logger.error(err);
        callBack(err)
    });
}

/* 
 * 修改会话.
 * POST
 * https://oapi.dingtalk.com/chat/update?access_token=ACCESS_TOKEN  
 */
exports.updateChat = function (chatid, add_useridlist,del_useridlist, callBack) {
    let options = {
        method: 'POST',
        uri: `${CONFIG.DDHOST}/chat/update`,
        qs: {
            access_token: CONFIG.ACCESS_TOKEN,
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        body: {
            chatid: chatid,
            add_useridlist: add_useridlist,
            del_useridlist:del_useridlist
        },
        json: true
    };

    rp(options).then(function (repos) {
        logger.info(repos);
        callBack(repos)
    }).catch(function (err) {
        logger.error(err)
        callBack(err)
    });
}

/* 
 * 查询会话.
 * GET
 * https://oapi.dingtalk.com/chat/get?access_token=ACCESS_TOKEN 
 */
exports.getChat = function (chatid, callBack) {
    requestPromise(`${CONFIG.DDHOST}/chat/get?access_token=${CONFIG.ACCESS_TOKEN}&chatid=${chatid}`).then((value) => {
        let userResult = JSON.parse(value.body)
        callBack(userResult);
    });
}

/* 
 * 发送群消息.
 * POST
 * https://oapi.dingtalk.com/chat/send?access_token=ACCESS_TOKEN
 * 参数：
 * chatid	    String	必须	chat9f393a3c3aa966e7d80424c8fedb6b04
 * msg      	String	可选	
 */
exports.sendGroupMsg = function (chatid, msg) {
    let options = {
        method: 'POST',
        json: true,
        uri: `${CONFIG.DDHOST}/chat/send`,
        qs: {
            access_token: CONFIG.ACCESS_TOKEN,
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        body: {
            "chatid": chatid,
            "msg": msg
        }
    };

    rp(options).then(function (repos) {
        logger.info(repos)
    }).catch(function (err) {
        logger.error(err)
    });
}

/**
 * 获取工作通知消息的发送结果
 * 请求方式：POST（HTTPS）
 * 请求地址：https://oapi.dingtalk.com/topapi/message/corpconversation/getsendresult?access_token=ACCESS_TOKEN
 * 参数说明：
 * 名称	    类型	是否必须   示例值	描述
 * agent_id	Number	可选	   123	 微应用的agentid
 * task_id	Number	可选	   456	 异步任务的id
 */
exports.getSendResult = function (agent_id, task_id, callBack) {

    requestPromise(`https://oapi.dingtalk.com/topapi/message/corpconversation/getsendresult?access_token=${CONFIG.ACCESS_TOKEN}&agent_id=${agent_id}&task_id=${task_id}`).then((value) => {
        let result = JSON.parse(value.body)

        if (result.errcode == 0) {
            callBack(result);
        } else {
            logger.error(asyncResult.body);
            callBack(asyncResult.body);
        }

    }).catch(function (err) {
        logger.error(err)
        callBack(err)
    });

}

/*
 * 获取jsapi_ticket
 * 请求方式：POST（HTTPS）
 * 请求地址：https://oapi.dingtalk.com/get_jsapi_ticket?access_token=ACCESS_TOKEN
 * 说明：
 * （1）先判断本地是否保存有JSapiTicket并且没有过期（7200S=120分钟）
 * （2）不存在或已过期-->重新获取
 * （3）存在并有效
 **/
exports.getJSapiTicket = function (callBack) {
    let currentTime = moment().unix().valueOf();
    let funResult
    if (CONFIG.GET_JSAPI_TICKET_LASTTIME == 0 || (currentTime - CONFIG.GET_JSAPI_TICKET_LASTTIME) > 115 * 60) {
        requestPromise(`${CONFIG.DDHOST}/get_jsapi_ticket?access_token=${CONFIG.ACCESS_TOKEN}`).then((value) => {
            let result = JSON.parse(value.body)
            if (result.errcode == 0) {
                CONFIG.GET_JSAPI_TICKET_LASTTIME = currentTime;
                CONFIG.JSAPI_TICKET = result.ticket;
                logger.info('jsapi_ticket：', CONFIG.JSAPI_TICKET);
                logger.info('jsapi_ticket剩余时间120分钟')
                funResult = "success";
                callBack(funResult);
            } else {
                logger.error("获取jsapi_ticket时出错了,错误码:", result.errcode)
                funResult = `获取jsapi_ticket时出错了,错误码:${result.errcode}`;
                callBack(funResult);
            }

        }).catch((err) => {
            logger.error("获取jsapi_ticket时出现异常:", err);
            funResult = `获取jsapi_ticket时出现异常:${err}`;
            callBack(funResult);
        });
    } else {
        logger.info('jsapt_ticket：', CONFIG.ACCESS_TOKEN);
        logger.info('jsapt_ticket大约剩余时间(分钟)：', 120 - parseInt((currentTime - CONFIG.GET_JSAPI_TICKET_LASTTIME) / 60))
        funResult = "success";
        callBack(funResult);
    }
}


/**
 * 调用方法前需要先注册全局access_token
 * 请求方式：GET（HTTPS）
 * 根据code 获取userid : https://oapi.dingtalk.com/user/getuserinfo?access_token=access_token&code=code
 * 免登授权码 code
 */
exports.getUserIdForCode = function (code, callBack) {
    let myResult = {
        data: {},
        msg: "ok",
        code: 0,
    };
    requestPromise(`${CONFIG.DDHOST}/user/getuserinfo?access_token=${CONFIG.ACCESS_TOKEN}&code=${code}`).then((value) => {
        let result = JSON.parse(value.body);
        if (result.errmsg === 'ok' && result.errcode === 0) {
            myResult.data.userid = result.userid;
        } else {
            logger.error(result.errmsg)
            myResult.msg = result.errmsg;
            myResult.code = result.errcode;
        }
        callBack(myResult);
    }).catch((err) => {
        logger.error(err)
        myResult.msg = JSON.stringify(err);
        myResult.code = -1;
        callBack(myResult);
    });
}

/**
 * 调用方法前需要先注册全局access_token
 * 根据userid 获取用户详细信息
 * 请求方式：GET（HTTPS）
 * 请求地址：https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
 */
exports.getUserInfo = function (userid, callBack) {
    let myResult = {
        data: {},
        msg: "ok",
        code: 0,
    };
    requestPromise(`${CONFIG.DDHOST}/user/get?access_token=${CONFIG.ACCESS_TOKEN}&userid=${userid}`).then((value) => {
        let result = JSON.parse(value.body)
        if (result.errmsg === 'ok' && result.errcode === 0) {
            myResult.data = result;
        } else {
            logger.error(result.errmsg)
            myResult.msg = result.errmsg;
            myResult.code = result.errcode;
        }
        callBack(myResult);
    }).catch((err) => {
        logger.error(err)
        myResult.msg = JSON.stringify(err);
        myResult.code = -1;
        callBack(myResult);
    });
}