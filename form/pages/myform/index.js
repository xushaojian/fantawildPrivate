var app = getApp();

Page({
    data: {
        alert: "none",//用于控制弹窗是否显示
        newFormName: "",//新表单名
        formid: "",//被点击项的formid
        listDataIndex: 0,//listData 的索引
        topTabClass1: "toptab active",
        topTabClass2: "toptab normal",
        isShowCreateView: "",
        isShowJionView: "none",
        //我创建的
        listData: [],
        //我参与的
        listDataMyJoin: [],
    },

    onLoad() {
        
    },

    onShow() {
        this.getData();
    },

    //获取当前时间
    getCurrTime(){
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
        let time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
        return time;
    },

    //获取数据
    getData() {
        let time = this.getCurrTime();
        var that = this;
        //获取authCode --> 获取用户信息 --> 获取用户创建的表单 --> 获取用户参与的表单
        dd.getAuthCode({
            success: (getAuthCode) => {
                dd.showLoading({
                    content: '加载中...'
                });

                if (getAuthCode.authCode === "200, 注意：这不是一个真实的 authCode，请登录并关联应用后再次执行") {
                    dd.hideLoading();
                    dd.alert({
                        content: "未能获取到你的免登号"
                    })
                    return;
                }

                dd.httpRequest({
                    url: `${app.globalData.baseHost}/ddRouter/getUserInfoForCode`,
                    method: 'POST',
                    data: { code: getAuthCode.authCode },
                    dataType: 'json',
                    success: function (getUserInfoForCode) {
                        //保存或更新用户信息到缓存
                        dd.setStorage({
                            key: 'userInfo',
                            data: {
                                name: getUserInfoForCode.data.data.name,
                                userid: getUserInfoForCode.data.data.userid,
                                avatar: getUserInfoForCode.data.data.avatar,
                            },
                            success:function(res){
                                app.formConfig.sponsor = getUserInfoForCode.data.data.name;
                                app.formConfig.avatar = getUserInfoForCode.data.data.avatar;
                            },
                            fail: function (fail) {
                                dd.alert({ content: JSON.stringify(fail) });
                            }
                        })

                        //获取用户创建的表单
                        dd.httpRequest({
                            url: `${app.globalData.baseHost}/formAppRouter/getFormForDDID`,
                            method: 'POST',
                            data: { ddid: getUserInfoForCode.data.data.userid },
                            dataType: 'json',
                            success: function (res) {
                                let listData = [];
                                for (let i = 0; i < res.data.data.length; i++) {
                                    let temp = JSON.parse(res.data.data[i].form_config);

                                    //表单状态 = 进行中 / 已完成 对应的图标
                                    let isFinish = '/image/ongoing.png';
                                    //如果当前时间大于表单截止时间,设置为已完成
                                    if (time >= temp.stopReply) {
                                        isFinish = '/image/done.png';
                                    }

                                    //表单创建人
                                    let sponsor = temp.sponsor;

                                    //表单截止时间
                                    let stopReply = temp.stopReply;

                                    //创建人的头像
                                    let avatar = temp.avatar;
                                    if (avatar === undefined || avatar === '') {
                                        avatar = '/image/my.png'
                                    }
                                    let item = {
                                        isFinish: isFinish,
                                        title: res.data.data[i].form_name,
                                        responsesNum: res.data.data[i].responses_num + '人回复',
                                        stopReply: stopReply,
                                        sponsor: sponsor,
                                        avatar: avatar,
                                        formid: res.data.data[i].form_id,
                                        form_config: temp
                                    }
                                    listData.push(item)
                                }
                                that.setData({
                                    listData: listData,
                                })
                            },
                            fail: function (res) {
                                dd.alert({ content: JSON.stringify(res) })
                            },
                            complete: function (res) {
                                dd.hideLoading();
                                dd.stopPullDownRefresh();
                            }
                        });

                        //获取用户参与的表单
                        dd.httpRequest({
                            url: `${app.globalData.baseHost}/formAppRouter/getFormJoinForDDID`,
                            method: 'POST',
                            data: { ddid: getUserInfoForCode.data.data.userid },
                            dataType: 'json',
                            success: function (res) {
                                let listDataMyJoin = [];
                                for (let i = 0; i < res.data.data.joinData.length; i++) {

                                    let temp = JSON.parse(res.data.data.joinData[i].form_config);
                                    //表单状态
                                    let isFinish = '/image/ongoing.png';
                                    //如果当前时间大于表单截止时间,设置为已完成
                                    if (time >= temp.stopReply) {
                                        isFinish = '/image/done.png';
                                    }
                                    //表单创建人
                                    let sponsor = temp.sponsor;
                                    //表单截止时间
                                    let stopReply = temp.stopReply;
                                    //创建人的头像
                                    let avatar = temp.avatar;
                                    if (avatar === undefined || avatar === '') {
                                        avatar = '/image/my.png'
                                    }

                                    let item = {
                                        isFinish: isFinish,
                                        title: res.data.data.joinData[i].form_name,
                                        responsesNum: res.data.data.joinData[i].responses_num + '人回复',
                                        stopReply: stopReply,
                                        sponsor: sponsor,
                                        avatar: avatar,
                                        formid: res.data.data.joinData[i].form_id,
                                        form_config: temp
                                    }
                                    listDataMyJoin.push(item)
                                }

                                that.setData({
                                    listDataMyJoin: listDataMyJoin
                                })
                            },
                            fail: function (res) {
                                dd.alert({ content: JSON.stringify(res) })
                            }
                        });
                    }

                });
            }
        })
    },

    //分享
    onShareAppMessage() {
        return {
            title: '研究院表单',
            path: 'pages/myform/index',
            // imageUrl:'@lADPDeC2t7-PFezMoMyg'
        };
    },

    //下拉刷新
    onPullDownRefresh() {
        this.getData();
    },

    //顶部tab切换,样式切换
    choiceTopTab(e) {
        if (e.target.dataset.index == "join") {
            this.setData({
                topTabClass1: "toptab normal",
                topTabClass2: "toptab active",
                isShowCreateView: "none",
                isShowJionView: ""
            })
        } else if (e.target.dataset.index == "create") {
            this.setData({
                topTabClass1: "toptab active",
                topTabClass2: "toptab normal",
                isShowCreateView: "",
                isShowJionView: "none"
            })
        }
    },

    //接收新表单名称
    inputNewFormName(e) {
        this.setData({
            newFormName: e.detail.value
        })
    },

    //关闭重命名窗口
    alertCancel() {
        this.setData({
            alert: "none"
        })
    },

    //确认重命名
    alertSure() {
        let that = this;
        if (that.data.newFormName === "") {
            dd.showToast({
                type: 'fail',
                content: '不能为空',
                duration: 3000,
            });
            return
        }

        //重命名表单
        dd.httpRequest({
            url: `${app.globalData.baseHost}/formAppRouter/rename`,
            method: 'POST',
            data: {
                formid: that.data.formid,
                formname: that.data.newFormName
            },
            dataType: 'json',
            success: function (res) {
                that.setData({
                    alert: "none",
                })
                that.getData();

                dd.showToast({
                    type: 'success',
                    content: '修改成功',
                    duration: 2000
                });
            },
            fail: function (res) {
                dd.alert({ content: JSON.stringify(res) })
            }
        });
    },

    //我创建的 点击列表项选择操作
    handleListItemTap(e) {
        let that = this;
        let listData = that.data.listData;
        let listDataIndex = e.currentTarget.dataset.index;//listData的index
        let formid = listData[listDataIndex].formid;
        let formConfig = listData[listDataIndex].form_config;
        let stopReply = listData[listDataIndex].stopReply
        dd.showActionSheet({
            items: ['参与', '停止回复', '查看回复数据', '查看回复统计', '重命名', '删除'],
            cancelButtonText: '取消',
            success: (res) => {
                //参与
                if (res.index === 0) {
                    let time = this.getCurrTime();
                    if(time >= stopReply){
                        dd.showToast({
                            type: 'fail',
                            content: '已停止回复',
                            duration: 3000,
                        })
                    }else{
                        dd.navigateTo({ url: `/pages/myform/form/form?formid=${formid}` });
                    }
                }
                //停止回复
                if (res.index === 1) {
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
                    let currentTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
                    formConfig.stopReply = currentTime;

                    //停止回复
                    dd.httpRequest({
                        url: `${app.globalData.baseHost}/formAppRouter/stopReply`,
                        method: 'POST',
                        data: {
                            formid: formid,
                            formconfig: JSON.stringify(formConfig)
                        },
                        dataType: 'json',
                        success: function (res) {
                            listData[listDataIndex].isFinish = '/image/done.png';
                            listData[listDataIndex].stopReply = currentTime;
                            that.setData({
                                listData: listData
                            })
                            dd.showToast({
                                type: 'success',
                                content: '设置成功',
                                duration: 3000
                            });
                        },
                        fail: function (res) {
                            dd.alert({ content: JSON.stringify(res) })
                        }
                    });

                }
                //查看回复数据
                if (res.index === 2) {
                    dd.navigateTo({ url: `/pages/myform/replyData/replyData?formid=${formid}` });
                }
                //查看回复统计
                if (res.index === 3) {
                    dd.navigateTo({ url: `/pages/myform/replyStatistics/replyStatistics?formid=${formid}` });
                }
                //编辑表单
                // if (res.index === 4) {
                //     dd.navigateTo({ url: `/pages/myform/QRCode/QRCode?form_id=${formid}` });
                // }
                //表单催办
                // if (res.index === 4) {
                //     dd.navigateTo({ url: `/pages/myform/deminder/deminder?formid=${formid}` });
                // }
                //重命名
                if (res.index === 4) {
                    this.setData({
                        alert: "block",
                        newFormName: "",
                        formid: formid,
                        listDataIndex: listDataIndex
                    })
                }
                //删除
                if (res.index === 5) {
                    dd.confirm({
                        title: '温馨提示',
                        content: '确定删除表单吗?',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        success: (result) => {
                            if (result.confirm) {
                                //删除表单和表单的数据
                                dd.httpRequest({
                                    url: `${app.globalData.baseHost}/formAppRouter/deleteForm`,
                                    method: 'POST',
                                    data: { formid: formid },
                                    dataType: 'json',
                                    success: function (res) {
                                        that.getData();
                                    },
                                    fail: function (res) {
                                        dd.alert({ content: JSON.stringify(res) })
                                    }
                                });
                            }
                        },
                    });
                }

            },
        });
    },

    //相关我的 点击列表项选择操作
    handleListItemTapMyJoin(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let formid = this.data.listDataMyJoin[index].formid
        let stopReply = this.data.listDataMyJoin[index].form_config.stopReply
        dd.showActionSheet({
            items: ['参与', '查看回复数据', '查看回复统计'],
            cancelButtonText: '取消',
            success: (res) => {
                //参与
                if (res.index === 0) {
                    let time = this.getCurrTime();
                    if(time >= stopReply){
                        dd.showToast({
                            type: 'fail',
                            content: '已停止回复',
                            duration: 3000,
                        })
                    }else{
                        dd.navigateTo({ url: `/pages/myform/form/form?formid=${formid}` });
                    }
                }
                //查看回复数据
                if (res.index === 1) {

                    let formConfig = that.data.listDataMyJoin[index].form_config;
                    if(!formConfig.isopen){
                        dd.navigateTo({ url: `/pages/myform/replyData/replyData?formid=${formid}` });
                    }else{

                        let isAlert = false;
                        for(let i = 0 ; i < formConfig.resultOpenRange.users.length ; i++){
                            if(formConfig.resultOpenRange.users[i].name === app.formConfig.sponsor){
                                isAlert = true;
                            }
                        }
                        if(isAlert){
                            dd.navigateTo({ url: `/pages/myform/replyData/replyData?formid=${formid}`});
                        }else{
                            dd.showToast({
                                type: 'exception ',
                                content: '抱歉!你没有权限查看',
                                duration: 3000,
                            });
                        }
                    }
                }
                //查看回复统计
                if (res.index === 2) {
                    let formConfig = that.data.listDataMyJoin[index].form_config;
                    if(!formConfig.isopen){
                        dd.navigateTo({ url: `/pages/myform/replyStatistics/replyStatistics?formid=${formid}` });
                    }else{
                        let isAlert = false;
                        for(let i = 0 ; i < formConfig.resultOpenRange.users.length ; i++){
                            if(formConfig.resultOpenRange.users[i].name === app.formConfig.sponsor){
                                isAlert = true;
                            }
                        }
                        if(isAlert){
                            dd.navigateTo({ url: `/pages/myform/replyStatistics/replyStatistics?formid=${formid}` });
                        }else{
                            dd.showToast({
                                type: 'exception ',
                                content: '抱歉!你没有权限查看',
                                duration: 3000,
                            });
                        }
                    }
                    
                }
            },
        });
    },

});
