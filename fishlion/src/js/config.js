var HOST = "https://parkrjs2.fangte.com/NNProject";
var CONFIG = {

    //寻找鱼尾狮单天运行记录-GET
    GETRUNRECORDINFO: `${HOST}/api/Fish/GetRunRecordInfo`,

    //寻找鱼尾狮单场故障记录-GET
    GETFAULTRECORDLIST: `${HOST}/api/Fish/GetFaultRecordList`,

    //寻找鱼尾狮-统计-GET
    GETFAULTCOLUMN: `${HOST}/api/Fish/GetFaultColumn`,
    
};
export default CONFIG;
