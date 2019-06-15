var HOST = "https://parkrjs2.fangte.com/NNProject";
var CONFIG = {

    //NDV一天内的按场次总体运行情况
    GETLOGINFOBYPLAY: `${HOST}/api/NDV/GetLogInfoByPlay`,

    //NDV一个场次内的不同场景运行情况
    GETLOGINFOBYSCENENAME: `${HOST}/api/NDV/GetLogInfoBySceneName`,

    //NDV一天不同终端运行情况
    GETLOGCOUNTLIST: `${HOST}/api/NDV/GetLogCountList`,

    //NDV一天内一个终端的异常信息列表
    GETLOGINFOBYTERMINAL: `${HOST}/api/NDV/GetLogInfoByTerminal`,

    //NDV播放异常统计
    GETFAULTSTATISTIC: `${HOST}/api/NDV/GetFaultStatistic`,

    //NDV播放异常统计详情
    GETFAULTCOLUMN: `${HOST}/api/NDV/GetFaultColumn`,

    //NDV播放异常统计详情弹窗
    GETFAULTDETAILBYNAME: `${HOST}/api/NDV/GetFaultdetailByName`,

    

};
export default CONFIG;
