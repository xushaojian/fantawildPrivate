var wxCharts = require('../../utils/wxcharts.js');
var Url = require('../../config');
Page({
    data: {
        Width:0,
        Height:0,
        thisyear:true,
        lastyear:false, 
        line: false,
        column: true,

        canvasType:'column',
        yearType:'今年',

        startDate:'',
        enDate:'',
    },

    onLoad: function (option){
        

     //获取加班图表信息
      var date = new Date();
      var year = date.getFullYear();

      this.data.startDate = year + '-01-01';
      this.data.endDate = year + '-12-31';

      this.getAddWork(this.data.startDate, this.data.endDate, this.data.canvasType)
    },

  //获取加班图表信息
    getAddWork: function (startDate,endDate,CanvasType){
      let that = this;
      wx.request({
        url: Url.GetAddWork,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data:{
          
          startDate: startDate,
          endDate: endDate,
        },
        success: function (res) {
          that.draw(res.data.RecordList[0].categories, res.data.RecordList[0].AddWorkHour, res.data.RecordList[0].AdjustRestHour, CanvasType)
        }
      })
    },


    draw: function (categories, data1, data2,CanvasType){
        let that = this;
        wx.getSystemInfo({//获取屏幕的可用窗口的高度和宽度
            success: function (res) {
                that.data.Width = res.windowWidth;
                that.data.Height = res.windowHeight;
            }
        })
        new wxCharts({
            canvasId: 'AddWork',
            type: CanvasType,//'line'  area,column
            categories: categories,
            series: [{
                name: '加班小时',
                data: data1,
                color:'Tomato',
                
            }, {
                name: '调休小时',
                data: data2,
                color: 'SkyBlue'
            }],
            yAxis: {
                format: function (val) {
                    return val;
                },
            },
            width: that.data.Width,
            height: 350
        });
    },

      thisyear:function(){
        this.setData({
          thisyear: true,
          lastyear: false,
          yearType:'今年',
        })

        //获取加班图表信息
        var date = new Date();
        var year = date.getFullYear();

        this.data.startDate = year + '-01-01';
        this.data.endDate = year + '-12-31';

        this.getAddWork(this.data.startDate, this.data.endDate, this.data.canvasType)
      },


      lastyear: function () {
        this.setData({
          thisyear: false,
          lastyear: true,
          yearType: '去年',
        })
        

        //获取加班图表信息
        var date = new Date();
        var year = date.getFullYear()-1;

        this.data.startDate = year + '-01-01';
        this.data.endDate = year + '-12-31';

        this.getAddWork(this.data.startDate, this.data.endDate, this.data.canvasType)
      },


      column: function () {
        this.setData({
          line: false,
          column: true,
          canvasType:'column',
        })

        this.getAddWork(this.data.startDate, this.data.endDate, this.data.canvasType)
      },


      line: function () {
        this.setData({
          line:true,
          column:false,
          canvasType: 'line',
        })
        this.getAddWork(this.data.startDate, this.data.endDate, this.data.canvasType)
      }


})