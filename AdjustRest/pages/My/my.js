var util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {

    imgUrls: [
      "../Image/1001.jpg",
      "../Image/1002.jpg",
      "../Image/1003.jpg",
      "../Image/1004.jpg",
    ],
    AccountName:'',

    indicatorDots: true,
    autoplay: true,
    interval: 2000,//自动切换时间间隔
    duration: 1000,//滑动动画时长

    routers: [
      {
        name: '我的桌面',
        url: '../Desktop/Desktop',
        icon: '../Icon/Desktop_icon_48px_1073170_easyicon.net.png'
      },
      {
        name: '加班管理',
        url: '../OverTimeManage/OverTimeManage',
        icon: '../Icon/overtime_48px_1168490_easyicon.net.png'
      },
      {
        name: '调休管理',
        url: '../AdjustRestManage/AdjustRestManage',
        icon: '../Icon/tear_off_calendar_48px_1170047_easyicon.net.png'
      },
      {
        name: '年假管理',
        url: '../AnnualLeaveManage/AnnualLeaveManage',
        icon: '../Icon/birthday_46.08px_1166221_easyicon.net.png'
      },
      {
        name: '绩效管理',
        url: '../PerformanceManage/PerformanceManage',
        icon: '../Icon/Seo_Performance_48px_1174361_easyicon.net.png'
      },
      {
        name: '加班图表',
        url: '../OverTimeChart/OverTimeChart',
        icon: '../Icon/bar_chart_48.346153846154px_1202659_easyicon.net.png'
      },
      {
        name: '调休报表',
        url: '../AdjustRestReport/AdjustRestReport',
        icon: '../Icon/Product_sale_report_48px_1176969_easyicon.net.png'
      },
      {
        name: '绩效报表',
        url: '../PerformanceReport/PerformanceReport',
        icon: '../Icon/Sales_report_48px_1176973_easyicon.net.png'
      },
      {
        name: '请假加班',
        url: '../LevelAddOverTime/LevelAddOverTime',
        icon: '../Icon/leave_48px_1168481_easyicon.net.png'
      },
      {
        name: '迟到早退',
        url: '../LateAddLeaveEarly/LateAddLeaveEarly',
        icon: '../Icon/assignment_late_48px_1181659_easyicon.net.png'
      },
      {
        name: '使用帮助',
        url: '../Help/Help',
        icon: '../Icon/help_48px_1139413_easyicon.net.png'
      }, {
        name: '注销',
        url: '../Help/Help',
        icon: '../Icon/dialog_logout_48px_1173782_easyicon.net.png'
      }
    ]
  },
  onLoad: function () {
    let that = this;
    wx.getStorage({
      key: 'AccountName',
      success: function (res) {
        console.log(res.data)
        that.setData({
          AccountName: res.data,
          Date:util.getDay(0),
        })
      }
    })
    
   
  }
})
