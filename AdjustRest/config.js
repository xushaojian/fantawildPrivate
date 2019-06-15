
//var host = "https://parkrjs2.fangte.com/adjustrest"
var host = "http://localhost:63550"
var config = {
    host,
    //前后端数据交互token
    token:'123456',
    

    //用户登录
    UserLogin: `${host}/api/User/UserLogin`,

    //加班图表
    GetAddWork: `${host}/api/AdjustRest/GetOverTime`,
    
    //调休报表
    GetAdjustRest: `${host}/api/AdjustRest/GetAdjustRest`,

    //获取部门
    GetDepartment: `${host}/api/AdjustRest/GetDepartment`,

    //根据部门ID获取
    GetUser: `${host}/api/AdjustRest/GetUser`,

 
};
module.exports = config
