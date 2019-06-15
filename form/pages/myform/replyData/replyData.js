const app = getApp();
Page({
    data: {
        form:{},
        data:{},
        list:[
            // {time:'time1',name:'name1',result:[{title:'title1',value:'value1'},{title:'title1',value:'value1'}]},
            // {time:'time1',name:'name1',result:[{title:'title1',value:'value1'},{title:'title1',value:'value1'}]},
        ],
    },

    onLoad(query) {
        dd.showLoading({
            content:'加载中...'
        })
        let that = this;
        let sysInfo = app.globalData.sysInfo;
        this.setData({
            width: sysInfo.screenWidth,
            height: sysInfo.screenHeight,
        })

        //根据表单ID查询表单的回复数据
        dd.httpRequest({
            url: `${app.globalData.baseHost}/formAppRouter/getDataForFormId`,
            method: 'POST',
            data: { formid: query.formid },
            dataType: 'json',
            success: function (res) {
                let data = res.data.data;
                for(let i in data){
                    data[i].result = JSON.parse(data[i].result)
                }
                that.setData({
                    list:data
                })
                dd.hideLoading()
            },
            fail: function (res) {
                dd.hideLoading()
                dd.alert({ content: JSON.stringify(res) })
            }
        });
    },
});
