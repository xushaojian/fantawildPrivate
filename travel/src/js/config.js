var HOST = "https://parkrjs2.fangte.com/Adjust"
var CONFIG = {
    //Map 地图数据
    GET_USER_PUNCH_ADDRESS_LIST: `${HOST}/api/user/getuserpunchaddresslist`,

    //Tree 树图数据
    GET_PARK_DEPARTMENT_TRAVEL_TREE: `${HOST}/api/User/GetParkDepartmentTravelTree`,

    //Line 出差人数走势图
    GET_LINE_TRAVEL_CHARTS: `${HOST}/api/User/GetLineTravelCharts`,

    //Line 各个部门出差人数走势图
    GET_DEPARTMENT_TRAVEL_LINE_CHARTS: `${HOST}/api/User/GetDepartmentTravelLineCharts`,

    //Pie 各个部门出差天数饼图
    GET_DEPARTMENT_TRAVEL_PIE: `${HOST}/api/User/GetDepartmentTravelPie`,

    //Item 某段时间里的出差城市列表
    GET_TRAVEL_ADDRESS: `${HOST}/api/User/GetTravelAddress`,

    //Table 各部门员工公园出差列表
    GET_DEPARTMENT_TRAVEL_LIST: `${HOST}/api/User/GetDepartmentTravelList`,
};
export default CONFIG;
