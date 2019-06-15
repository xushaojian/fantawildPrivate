var HOST = "https://parkrjs2.fangte.com/NNProject";
var CONFIG = {
    //一天的总体情况-Get
    TOTALITYANALYSIS: `${HOST}/api/Analysis/TotalityAnalysis`,

    //近10天总体运行情况-GET
    TENANALYSISLIST: `${HOST}/api/Analysis/TenAnalysisList`,

    //单场次信息-Get
    SINGLEANALYSIS: `${HOST}/api/Analysis/SingleAnalysis`,

    //单场故障详情-Get
    GETANALYSISDETAILLIST: `${HOST}/api/Analysis/GetAnalysisDetailList`,

    //球体一天故障-Get
    GETALLBALLLIST: `${HOST}/api/Analysis/GetAllBallList`,

    //球体单个-Get
    GETSINGLEBALLLIST: `${HOST}/api/Analysis/GetSingleBallList`,

    //总统计
    GETFAULTSTATISTIC: `${HOST}/api/Analysis/GetFaultStatistic`,

    //场次故障统计
    GETFAULTCOLUMN: `${HOST}/api/Analysis/GetFaultColumn`,

    //球体故障统计
    GETFAULTDETAILBYNO: `${HOST}/api/Analysis/GetFaultdetailByNo`,
   

};
export default CONFIG;
