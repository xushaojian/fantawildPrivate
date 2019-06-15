var app = getApp();
Page({
    data: {
        formid: '',
        formname: '',
        createTime:'',
        components: [],
        formConfig: {},
        responses_num: 0,
        result: [],
        userInfo: {},
        anonymousNum: '',//匿名号,随机生成,用于保存匿名结果-目的是更新数据
    },

    onLoad(query) {
        dd.showLoading({
            content:'加载中...'
        });

        let that = this;
        let formid = query.formid;

        //缓存 --> 获取 --> 成功 --> globalData.anonymousNum
        //获取 --> 失败 --> 生成 --> 缓存 --> globalData.anonymousNum
        dd.getStorage({
            key: 'anonymousNum',
            success: function (res) {
                if(res.data != null){
                    that.data.anonymousNum = res.data.anonymousNum;
                }else{
                    let anonymousNum = 'dd' + new Date().getTime();
                    for (let i = 0; i < 6; i++) {
                        anonymousNum += Math.floor(Math.random() * 10);
                    }
                    dd.setStorage({
                        key: 'anonymousNum',
                        data: {
                            anonymousNum: anonymousNum,
                        },
                        success: function () {
                            that.data.anonymousNum = anonymousNum;
                        }
                    });
                }   
            }
        });

        dd.getStorage({
            key: "userInfo",
            success: function (res) {
                that.setData({
                    userInfo: res.data,
                    formid:formid,
                })
            },
            fail: function (res) {
                dd.alert({ content: res.errorMessage });
            }
        });

        //根据表单id 获取表单信息
        dd.httpRequest({
            url: `${app.globalData.baseHost}/formAppRouter/getFormForFormID`,
            method: 'POST',
            data: { formid: formid },
            dataType: 'json',
            success: function (res) {
                let components = JSON.parse(res.data.data.components);
                let formConfig = JSON.parse(res.data.data.form_config);
                console.log(formConfig)
                let result = [];
                for(let i in components){
                    let componentsItem = {
                        id:components[i].id,
                        type:components[i].type,
                        title:components[i].title,
                        value:''
                    }
                    result.push(componentsItem);
                }
                that.setData({
                    formid: res.data.data.form_id,
                    formname: res.data.data.form_name,
                    createTime: res.data.data.create_time,
                    components: components,
                    formConfig: formConfig,
                    responses_num: res.data.data.responese_num,
                    result:result
                });
                dd.hideLoading();
            },
            fail: function (err) {
                dd.alert({ content: JSON.stringify(err) })
            },
            complete:function(){
                dd.hideLoading()
            }
        });

    },

    onShareAppMessage() {
        return {
        title: '研究院表单',
        desc: this.data.formname,
        path: `pages/myform/form/form?formid=${this.data.formid}`
        };
    },

    //单选按钮被选结果 = 单值 = 字符串保存
    radioChange(e) {
        //对应数组下标 e.currentTarget.dataset.arrIndex
        //单选项值 e.detail.value

        let arrIndex = e.currentTarget.dataset.arrIndex;
        let radioValue = e.detail.value;
        let result = this.data.result;
        result[arrIndex].value = radioValue;
        this.setData({
            result: result
        });
    },

    //复选框被选结果 = 多个值 = 用数组保存
    checkboxChange(e){
        let checkValue = e.detail.value;//复选框的值
        let arrIndex = e.currentTarget.dataset.arrIndex;//复选框再页面中的位置
        let result = this.data.result;//用于保存页面结果的变量
        result[arrIndex].value = checkValue;
        this.setData({
            result: result
        });
    },

    submit: function (e) {
        let that = this;
        dd.showLoading({
            content: '提交中...',
        });
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

        //根据表单配置信息判断是否匿名 isAnonymous = true 表示匿名
        let username = this.data.anonymousNum;
        if(!this.data.formConfig.isAnonymous){
            username = this.data.userInfo.name;
        }
        //保存表单结果
        dd.httpRequest({
            url: `${app.globalData.baseHost}/formAppRouter/saveResult`,
            method: 'POST',
            data: {
                formid: this.data.formid,
                username: username,
                time: time,
                result: JSON.stringify(this.data.result)
            },
            dataType: 'json',
            success: function (res) {
                console.log(res.data);
                if(res.data.code === 0 && res.data.msg === 'success'){
                    dd.hideLoading();
                    dd.showToast({
                        type: 'success',
                        content: '提交成功',
                        duration: 3000
                    });
                }else{
                    dd.hideLoading();
                    dd.alert({
                        title: '温馨提示',
                        content: '表单保存失败,请联系管理员或重试',
                        buttonText: '我知道了',
                    });
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({ content: JSON.stringify(res) })
            }
        });

    },
});
