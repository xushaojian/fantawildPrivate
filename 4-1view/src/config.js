let CONFIG = {
    QuickShow:1,
    TokenName:'token',
    CurrentUserName:'user',
    GetAuthorityMenuData: `/api/Sys_Role/GetAuthorityMenu`,
    GetVideoBack:'/api/Video/GetVideoBack',
    GetProjectById:'/api/Project/GetProjectById',
    // 获取钉钉用户信息
    GetDDUserInfo:'/api/DingDing/GetUserInfo',
    GetVideoPreview:'http://10.159.11.75:8083/api/Video/GetVideoPreview',    // 绑定钉钉用户信息
    BindDDUserInfo:'/api/DingDing/BindUserInfo',
    // 钉钉登陆授权APPID
    DDAppID:'dingoa0l4s5plmwucbxe7w',
    REDIRECT_URI:'http://amping.vipgz1.idcfengye.com/#/user/dingding',
};
export default CONFIG;
