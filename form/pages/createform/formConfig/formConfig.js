var app = getApp();
Page({
    data: {
        sponsor: '',//创建人
        avatar: '',//创建人的头像
        isAnonymous: false,//是否匿名
        ddReminde: false,//是否钉钉提醒
        stopReply: '',//截止回复时间
        isjoin: true,//false 不限制
        isopen: true,//false 不公开
        join: {},
        resultOpenRange: {}
    },

    onLoad() {
        let that = this;
        let formConfig = app.formConfig;
        dd.getStorage({
            key: "userInfo",
            success: function (res) {
                that.setData({
                    sponsor: res.data.name,
                    avatar: res.data.avatar,
                    isAnonymous: formConfig.isAnonymous,
                    ddReminde: formConfig.ddReminde,
                    stopReply: formConfig.stopReply,
                    isjoin: formConfig.isjoin,
                    isopen: formConfig.isopen,
                    join: formConfig.join,
                    resultOpenRange: formConfig.resultOpenRange
                })
            },
            fail: function (res) {
                dd.alert({ content: res.errorMessage });
            }
        });
    },
    //是否匿名
    isAnonymous(e) {
        this.setData({
            isAnonymous: e.detail.value
        })
    },
    //钉钉提醒
    ddReminde(e) {
        this.setData({
            ddReminde: e.detail.value
        })
    },
    //参与人
    join(e) {
        let that = this;
        let limit = e.target.dataset.limit;

        if (limit == "no") {
            that.setData({
                isjoin: false,
                join: {}
            })

        } else {
            that.setData({
                isjoin: true
            })
            let pickedUsers = [];
            for (let i in that.data.join.users) {
                pickedUsers.push(that.data.join.users[i].userId)
            }
            dd.complexChoose({
                title: "选择参与人",            //标题
                multiple: true,            //是否多选
                limitTips: "超出了",          //超过限定人数返回提示
                maxUsers: 1000,            //最大可选人数
                pickedUsers: pickedUsers,            //已选用户
                pickedDepartments: [],          //已选部门
                disabledUsers: [],            //不可选用户
                disabledDepartments: [],        //不可选部门
                requiredUsers: [],            //必选用户（不可取消选中状态）
                requiredDepartments: [],        //必选部门（不可取消选中状态）
                appId: 189905710,              //微应用的Id
                permissionType: "GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                responseUserOnly: true,        //返回人，或者返回人和部门
                startWithDepartmentId: 0,   // 0表示从企业最上层开始
                success: function (res) {
                    that.setData({
                        join: res
                    })
                },
                fail: function (err) {
                    that.setData({
                        join: {},
                        isjoin: false
                    })
                }
            })
        }
    },

    //数据公开范围
    range(e) {
        let that = this;
        if (e.target.dataset.open == "no") {
            that.setData({
                isopen: false,
                resultOpenRange: {}
            })
        } else {
            that.setData({
                isopen: true
            })
            let pickedUsers = [];
            for (let i in that.data.resultOpenRange.users) {
                pickedUsers.push(that.data.join.resultOpenRange[i].userId)
            }
            dd.complexChoose({
                title: "请选择",            //标题
                multiple: true,            //是否多选
                limitTips: "超出了",          //超过限定人数返回提示
                maxUsers: 1000,            //最大可选人数
                pickedUsers: pickedUsers,       //已选用户
                pickedDepartments: [],          //已选部门
                disabledUsers: [],            //不可选用户
                disabledDepartments: [],        //不可选部门
                requiredUsers: [],            //必选用户（不可取消选中状态）
                requiredDepartments: [],        //必选部门（不可取消选中状态）
                appId: 189905710,              //微应用的Id
                permissionType: "GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                responseUserOnly: true,        //返回人，或者返回人和部门
                startWithDepartmentId: 0,   // 0表示从企业最上层开始
                success: function (res) {
                    that.setData({
                        resultOpenRange: res
                    })
                },
                fail: function (err) {
                    that.setData({
                        resultOpenRange: {},
                        isopen: false
                    })
                }
            })
        }
    },

    //时间选择
    date(e) {
        let that = this;
        let myDate = new Date();
        let year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        let month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        let hour = myDate.getHours();       //获取当前小时数(0-23)
        let minute = myDate.getMinutes();     //获取当前分钟数(0-59)
        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day
        }
        if (hour < 10) {
            hour = "0" + hour
        }
        if (minute < 10) {
            minute = "0" + minute
        }
        let currentDate = year + "-" + month + "-" + day + " " + hour + ":" + minute;
        
        dd.datePicker({
            format: 'yyyy-MM-dd HH:mm',
            currentDate: currentDate,
            success: (res) => {
                that.setData({
                    stopReply: res.date
                })
            },
            fail: (err) => {
                dd.alert({ content: JSON.stringify(err) })
            }
        });
    },

    //确定
    sure(e) {
        app.formConfig.sponsor = this.data.sponsor;
        app.formConfig.avatar = this.data.avatar;
        app.formConfig.isAnonymous = this.data.isAnonymous;
        app.formConfig.ddReminde = this.data.ddReminde;
        app.formConfig.stopReply = this.data.stopReply;
        app.formConfig.isjoin = this.data.isjoin;
        app.formConfig.isopen = this.data.isopen;
        app.formConfig.join = this.data.join;
        app.formConfig.resultOpenRange = this.data.resultOpenRange;
        console.log(app.components)
        console.log(app.formConfig)
        dd.navigateBack({
            delta: 1
        })
    },
});
