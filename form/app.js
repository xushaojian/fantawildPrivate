App({
    onLaunch() {

    },

    onShow() {
        let myDate = new Date();
        let year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        let month = myDate.getMonth() + 1;  //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        let hour = myDate.getHours();      //获取当前小时数(0-23)
        let minute = myDate.getMinutes();  //获取当前分钟数(0-59)
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

        //明天
        myDate.setTime(myDate.getTime()+24*60*60*1000);
        let tomorrow = myDate.getDate();

        if (tomorrow < 10) {
            tomorrow = "0" + tomorrow
        }

        let time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
        let time2 = year + "-" + month + "-" + tomorrow + " " + hour + ":" + minute;
        this.formConfig.stopReply = time2;
        this.globalData.currentTime = time;
        this.globalData.sysInfo = dd.getSystemInfoSync()
    },

    onHide() {

    },

    onError() {

    },

    //用于记录一个页面的所有组件的属性和顺序--记得同步发布成功后重置
    components: [{
        id: new Date().getTime(),
        type: "title",
        title: "This is a title",
        position: "center",
        description: "This is a description.",
        border: "view-border"
    }],

    formConfig: {
        sponsor: '',
        avatar: '',
        isAnonymous: false,//是否匿名
        ddReminde: false,
        stopReply: '',
        isjoin: false,//false 填写用户范围 不限制
        isopen: false,//false 数据公开范围 不公开
        join: {},
        resultOpenRange: {}
    },

    globalData: {
        //http://xushaojian.free.idcfengye.com
        //http://127.0.0.1:8888
        //http://amping.vipgz1.idcfengye.com
        //http://39.108.156.113:4343
        baseHost: `http://39.108.156.113:4343`,
        sysInfo: {},
        mainPageIsRefresh: true,//"我的表单" 是否重新加载-优化应用,前期先不加入
        currentTime: '', 
    }

});

