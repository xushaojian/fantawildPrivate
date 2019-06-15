var logger = require('log4js').getLogger("msg_Template");
/**
 * 公共消息模板
 */
exports.public = function (query) {
    let msg = `{
        "msgtype": "markdown",
        "markdown": {
            "title": "${query.title}",
            "text": "${query.msg}"
        }
    }`
    logger.info(msg);
    return msg;
}

/**
 * 出差消息
 */
exports.travelActionCard = function (query) {
    let msg = `{
        "msgtype": "action_card",
        "action_card": {
            "title": "今日出差人员动态",
            "markdown": "${query.msg}",
            "single_title": "查看微应用",
            "single_url": "https://parkrjs2.fangte.com/waterposmon/mobilepage/map/index.html?dd_nav_bgcolor=FFFFA550&showmenu=false"
        }
    }`
    logger.info(msg);
    return msg;
}

/**
 * c126车消息
 */
exports.c126MakeDown = function (query) {
    let msg = `{
        "msgtype": "action_card",
        "action_card": {
            "title": "运行情况",
            "markdown": " > #### **人工手填数据** \n > #### **日期：** ${query.date} \n > #### **接待人数:** ${query.peopleCount} \n > #### **发车号：** ${query.carNum} \n > #### **总车次：** ${query.totalField} \n > #### **异常运行场次：** ${query.expCount}",
            "single_title": "总控运行数据",
            "single_url": "https://parkrjs2.fangte.com/miniapp/c126/index.html?dd_nav_bgcolor=FF5E97F6"
        }
    }`
    logger.info(msg);
    return msg;
}

/**
 * 鱼尾狮消息
 * {"TotalField":19,"FaultField":6,"FailureRate":"31.58%","CarNum":"5# 6# 7# 8# 9# 10# 12# ","RunDate":"2018-10-31"}
 */
exports.fishLionMakeDown = function (query) {
    let msg = `{
        "msgtype": "action_card",
        "action_card": {
            "title": "运行情况",
            "markdown": " > #### **日期：** ${query.RunDate} \n > #### **总共运行:** ${query.TotalField} \n > #### **故障场次：** ${query.FaultField} \n > #### **故障率：** ${query.FailureRate} \n > #### **运行舱体：** ${query.CarNum}",
            "single_title": "查看微应用",
            "single_url": "https://parkrjs2.fangte.com/miniapp/fishlion/index.html?dd_nav_bgcolor=FF5E97F6"
        }
    }`
    logger.info(msg);
    return msg;
}

/**
 * 魔球消息
 */
exports.mqMakeDown = function (query) {
    let msg = `{
        "msgtype": "action_card",
        "action_card": {
            "title": "运行情况",
            "markdown": " > #### **日期：** ${query.AnalysisDate} \n > #### **总共运行:** ${query.Field} \n > #### **故障场次：** ${query.Fault} \n > #### **故障率：** ${query.FailureRate} \n > #### **故障场次：** ${query.FailureList}",
            "single_title": "查看微应用",
            "single_url": "https://parkrjs2.fangte.com/miniapp/mq?dd_nav_bgcolor=FF5E97F6"
        }
    }`
    logger.info(msg);
    return msg;
}


/**
 * 新同事简介
 */
exports.newPeopleIntroduction = function(query){
    let msg = '';
    msg = {
        "msgtype": "oa",
        "oa": {
           "head": {
               "bgcolor": "FFBBBBBB",
               "text": "新同事简介"
           },
           "body": {
               "form": [
                   {
                       "key": "部门:",
                       "value": query.department
                   },
                   {
                       "key": "姓名:",
                       "value": query.name
                   },
                   {
                       "key": "学校:",
                       "value": query.school
                   },
                   {
                       "key": "专业:",
                       "value": query.profession
                   },
                   {
                       "key": "籍贯:",
                       "value": query.nativePlace
                   },
                   {
                       "key": "爱好:",
                       "value": query.hobby
                   }
               ],
               "image": query.image,
           }
       }
   }
   logger.info(msg);
   return msg;
}

/**
 * 建群成功后向該群發送信息
 */
exports.sendCreateGroupSuccessMsg = function(admin){
     let msg ={
        "msgtype": "text",
        "text": {
            "content": `该群为程序自动创建，请群主 ${admin} 清点人数`
        }
    }
    logger.info(msg);
    return msg;
}

/**
 * 修改群聊成功后向該群發送信息
 */
exports.sendUpdateGroupSuccessMsg = function(query){
     let msg ={
        "msgtype": "action_card",
        "action_card": {
            "title": "群修改说明",
            "markdown": ` > #### **群名：** ${query.groupName} \n >
                            #### **新增：** ${query.add} \n > 
                            #### **移除: ** ${query.delete} \n >`,
        }
    }
    logger.info(msg);
    return msg;
}