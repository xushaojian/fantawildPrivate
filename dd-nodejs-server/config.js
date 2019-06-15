var CONFIG = {
    CORPID: 'dingb1c4a1559ce0331e',
    CORPSECRET: 'YWZJy5BDWNj8eveFJQhswODzM30BWxPTzNSMiiiOwiGSBremj0LdssjD0pvYtBI-',
    DDHOST: 'https://oapi.dingtalk.com',

    //通讯录角色ID
    ROLE_ID_1: '86278664', //主管理员
    ROLE_ID_2: '86278665', //子管理员
    ROLE_ID_3: '86278666', //负责人
    ROLE_ID_4: '86278667', //主管
    ROLE_ID_5: '86278669', //院长
    ROLE_ID_6: '86278670', //副院长
    ROLE_ID_7: '86278671', //所长
    ROLE_ID_8: '86278672', //副所长
    ROLE_ID_9: '86278673', //部长
    ROLE_ID_10: '86278674', //副部长
    ROLE_ID_11: '315861128', //副总工程师
    ROLE_ID_12: '348971147', // test          测试组-消息推送
    ROLE_ID_13: '348716692', // 出差推送组员   26级及以上人员组-消息推送
    ROLE_ID_14: '350913854', // C126车推送组员  
    ROLE_ID_15: '371832511', // 南宁寻找鱼尾狮推送组员
    ROLE_ID_16: '371827764', // 南宁千岛之歌推送组员

    //部门ID
    DEP_ID_1: '4524244',//华强方特研究院

    //微应用ID
    AGENTID_1: '178904292',//出差-微应用
    AGENTID_2: '174708197',//测试用-微应用
    AGENTID_3: '189905710',//活动 - E应用
    AGENTID_4: '195637481',//南宁-拉玛传奇-C126车-微应用
    AGENTID_5: '199930524',//南宁-寻找鱼尾狮-微应用
    AGENTID_6: '199542714',//南宁-千岛之歌-魔球-微应用

    ACCESS_TOKEN: '',
    GET_ACCESS_TOKEN_LASTTIME: 0, //秒数，记录最后一次获取access_token的时间，有效时间120分钟，目的减少接口的调用,避免调用次数超出 ,1500次/分

    JSAPI_TICKET: '',
    GET_JSAPI_TICKET_LASTTIME: 0,//秒数，记录最后一次获取JSapiTicket的时间，有效时间120分钟，目的减少接口的调用,避免调用次数超出 ,1500次/分

    ALL_USER_ARRAY: [],
    GET_ALL_USER_ARRAY_LASTTIME: 0,//秒数，记录最后一次获取所有员工的时间，有效时间120分钟，目的减少接口的调用,避免调用次数超出，提高效率，

    GROUPNAME: ["初始化群名称"],

    //开发环境
    DEVELOPMENT: {
        HOST: "127.0.0.1",
        PORT: 4343,
        DB: {
            user: "admin",
            password: "123456",
            server: "127.0.0.1",
            port: 1433,
            database: "dd",
            stream: false,
            connectionTimeout: 15000,
            equestTimeout: 15000,
            parseJSON: true,
            options: {
                encrypt: false
            },
            pool: {
                min: 0,
                max: 50,
                idleTimeoutMillis: 30000
            }
        }
    },

    //生产环境
    PRODUCTION: {
        HOST: "127.0.0.1",
        PORT: 4343,
        DB: {
            user: "sa",
            password: "login123?@",
            server: "ALY-YJY",
            port: 11433,
            database: "DD",
            stream: false,
            connectionTimeout: 15000,
            equestTimeout: 15000,
            parseJSON: true,
            options: {
                encrypt: false
            },
            pool: {
                min: 0,
                max: 50,
                idleTimeoutMillis: 30000
            }
        }
    }

};

module.exports = CONFIG;