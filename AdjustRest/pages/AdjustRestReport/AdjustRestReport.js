var Url = require('../../config');
var util = require('../../utils/util.js');
var tcity = require('../../utils/citys.js');
Page({
  data: {
    listData: [],
    data: [],//数据
    tabTxt: ['部门', '用户', '加班', '剩余加班', '已调休'],//tab文案
    tab: [true, true, true, true, true],

    provinces: [],//顶级部门
    provincesId: [],
    province: "",

    citys: [],//二级部门
    citysId: [],
    city: "",

    countys: [],//三级部门
    countysId: [],
    county: '',

    value: [0, 0, 0],//选择值


    condition: false,
    adjustList: [],


    countryCodes: [],//用户列表
    userId: [],//用户编号列表
    countryCodeIndex: 0,
    realName: '选择或输入用户名',
    userId: '',

    scrollHeight: 300,//scroll-view高度

    startdate: '',//开始时间
    enddate: '',//结束时间

    DepartmentId: 0,//部门编号
    DepartmentName: '研究院',

    where: '1=1',//查询条件，--id=123 用户id  --DepartmentId=66  部门ID --RealName='劳永泽'
    order: 'DepartmentName desc',
    //--OverTimeHours desc
    //--RemainOverTimeHours desc
    //--AdjustHours desc

    lastClick: 0,//记录选项卡最后一次点击的是哪一个选项卡
    isClick: false,
  },

  inputRealName: function (e) {
    this.data.realName = e.detail.value;
  },


  //点击查询按钮
  query: function () {
    if (this.data.realName != '选择或输入用户名' && this.data.realName != null && this.data.realName != '' && this.data.realName != ' ') {
      this.data.where = this.data.where + " and RealName='" + this.data.realName + "'";
    }
    console.log(this.data.where);
    //获取调休报表信息
    this.getAdjustRest(this.data.startdate, this.data.enddate, this.data.where, this.data.order, "1000", "1");
  },

  // 筛选卡
  filterTab: function (e) {
    if (e.currentTarget.dataset.index == 1)
      return;

    var data = [true, true, true, true, true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })


    //点击某个筛选卡进行排序，，，，重新点击查询时
    //order: 'DepartmentName desc',
    //--OverTimeHours desc
    //--RemainOverTimeHours desc
    //--AdjustHours desc
    console.log(index);
    console.log(this.data.lastClick);
    console.log(this.data.isClick);
    //默认使用倒序
    if (this.data.lastClick == index) {//判断点击的是否是上一次点击的选项卡
      if (this.data.isClick) {
        if (index == 0) {
          this.data.order = 'DepartmentName  Desc'
        } else if (index == 2) {
          this.data.order = 'OverTimeHours Desc'
        } else if (index == 3) {
          this.data.order = 'RemainOverTimeHours Desc'
        } else if (index == 4) {
          this.data.order = 'AdjustHours Desc'
        }
      } else {
        if (index == 0) {
          this.data.order = 'DepartmentName'
        } else if (index == 2) {
          this.data.order = 'OverTimeHours'
        } else if (index == 3) {
          this.data.order = 'RemainOverTimeHours'
        } else if (index == 4) {
          this.data.order = 'AdjustHours'
        }
      }
      this.data.lastClick = index;
      this.data.isClick = !this.data.isClick;
    } else {

      if (index == 0) {
        this.data.order = 'DepartmentName'
      } else if (index == 2) {
        this.data.order = 'OverTimeHours'
      } else if (index == 3) {
        this.data.order = 'RemainOverTimeHours'
      } else if (index == 4) {
        this.data.order = 'AdjustHours'
      }
      this.data.lastClick = index;
    }
    //获取调休报表信息
    this.getAdjustRest(this.data.startdate, this.data.enddate, this.data.where, this.data.order, "1000", "1");
  },
  //选择用户名
  bindCountryCodeChange: function (e) {
    this.setData({
      realName: this.data.countryCodes[e.detail.value],
      countryCodeIndex: e.detail.value
    })
  },

  //选择开始日期
  bindStartDateChange: function (e) {
    this.setData({
      startdate: e.detail.value
    })
  },

  //选择结束日期
  bindEndDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    })
  },

  onLoad: function () {
    var that = this;

    //获取屏幕的可用窗口的高度和宽度，用于设置scroll view 在不同屏幕下的高度，使屏幕不出现滚动条
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 163 - 36,
        })
      }
    })

    //设置默认起始时间(当前月)
    let today = util.getToday();
    let monthBeing = util.getMonthBegin();

    that.setData({
      startdate: monthBeing,
      enddate: today,
    })

    //获取调休报表信息
    this.getAdjustRest(monthBeing, today, "1=1", " DepartmentName desc", "1000", "1");

    //获取部门信息,三级联动
    wx.request({
      url: Url.GetDepartment,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setDepartment(res.data.RecordList);
      }
    })
  },


  setDepartment: function (a) {
    let that = this;
    tcity.init(that, a);
    var cityData = that.data.cityData;

    const provinces = [];
    const provincesId = [];
    const citys = [];
    const citysId = [];
    const countys = [];
    const countysId = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
      provincesId.push(cityData[i].code);
    }

    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
      citysId.push(cityData[0].sub[i].code)
    }

    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
      countysId.push(cityData[0].sub[0].sub[i].code)
    }

    that.setData({
      'provinces': provinces,
      'provincesId': provincesId,
      'citys': citys,
      'citysId': citysId,
      'countys': countys,
      'countysId': countysId,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })

  },



  getAdjustRest: function (starttime, endtime, where, order, pageSize, pageIndex) {
    let that = this;
    //获取调休报表信息
    wx.request({

      url: Url.GetAdjustRest,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        starttime: starttime,
        endtime: endtime,
        where: where,
        order: order,
        pageSize: pageSize,
        pageIndex: pageIndex,
        totalCount: "0",
      },
      success: function (res) {
        console.log("调休报表信息")
        console.log(res.data.RecordList)
        that.setData({
          listData: res.data.RecordList,
        })
      }
    })
  },

  //详细信息
  longtap: function (e) {
    var i = parseInt(e.currentTarget.id);
    let that = this;

    //剔除null
    let a = (that.data.listData[i].DepartmentName == null) ? '' : that.data.listData[i].DepartmentName;
    let b = (that.data.listData[i].RealName == null) ? '' : that.data.listData[i].RealName;
    let c = (that.data.listData[i].OverTimeHours == null) ? '' : that.data.listData[i].OverTimeHours;
    let d = (that.data.listData[i].RemainOverTimeHours == null) ? '' : that.data.listData[i].RemainOverTimeHours;
    let ee = (that.data.listData[i].AdjustHours == null) ? '' : that.data.listData[i].AdjustHours;
    let f = (that.data.listData[i].OverHours == null) ? '' : that.data.listData[i].OverHours;
    let g = (that.data.listData[i].Annualleave == null) ? '' : that.data.listData[i].Annualleave;
    let h = (that.data.listData[i].RemainAnnualleave == null) ? '' : that.data.listData[i].RemainAnnualleave;
    let ii = (that.data.listData[i].UsedAnnualleave == null) ? '' : that.data.listData[i].UsedAnnualleave;
    let j = (that.data.listData[i].ShiJia == null) ? '' : that.data.listData[i].ShiJia;
    let k = (that.data.listData[i].YouXingBingJia == null) ? '' : that.data.listData[i].YouXingBingJia;
    let l = (that.data.listData[i].WuXinBingJia == null) ? '' : that.data.listData[i].WuXinBingJia;
    let m = (that.data.listData[i].ChangJia == null) ? '' : that.data.listData[i].ChangJia;

    wx.showModal({
      title: '详细信息(单位:小时)',
      showCancel: false,
      confirmText: '关闭',
      content:
      '所在部门：' + a +
      '\n用户名：' + b +
      '\n加班时间：' + c +
      '\n剩余加班：' + d +
      '\n已调休：' + ee +
      '\n过期加班：' + f +
      '\n年假：' + g +
      '\n可调年假：' + h +
      '\n已调年假：' + ii +
      '\n事假：' + j +
      '\n有薪病假：' + k +
      '\n无薪病假：' + l +
      '\n（陪）产假' + m,

    })
  },

  //部门改变
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.value;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {//如果顶级部门改变
      const citys = [];
      const countys = [];
      const citysId = [];
      const countysId = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
        citysId.push(cityData[val[0]].sub[i].code)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
        countysId.push(cityData[val[0]].sub[0].sub[i].code)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        citysId: citysId,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        countysId: countysId,

        value: [val[0], 0, 0]
      })
      this.setData({
        DepartmentName: this.data.province + "-" + this.data.city + "-" + this.data.county
      })


    }

    if (val[1] != t[1]) {//如果二级部门改变
      const countys = [];
      const countysId = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
        countysId.push(cityData[val[0]].sub[val[1]].sub[i].code)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        countysId: countysId,

        value: [val[0], val[1], 0]
      })

      this.setData({
        DepartmentName: this.data.province + "-" + this.data.city + "-" + this.data.county
      })

    }


    if (val[2] != t[2]) {//如果三级部门改变
      this.setData({
        county: this.data.countys[val[2]],

        value: val,
      })

      this.setData({
        DepartmentName: this.data.province + "-" + this.data.city + "-" + this.data.county
      })
    }
  },

  //控制三级联动是否开启
  open: function (e) {
    this.setData({
      condition: !this.data.condition
    })
  },

  openCancl: function (e) {
    this.setData({
      condition: !this.data.condition
    })
  },

  openSure: function (e) {
    let that = this;
    this.setData({
      condition: !this.data.condition
    })

    //部门ID
    if (this.data.value[2] != 0) {//三级部门
      this.data.DepartmentId = this.data.countysId[this.data.value[2]];
      this.data.where = ' DepartmentId=' + this.data.DepartmentId;

    } else if (this.data.value[1] != 0 && this.data.value[2] == 0) {//二级部门
      this.data.DepartmentId = this.data.countysId[this.data.value[1]];
      this.data.where = ' DepartmentId=' + this.data.DepartmentId;
    } else {//顶级部门
      this.data.where = ' 1=1';
      this.data.DepartmentId = 52;
    }

    console.log(this.data.DepartmentId);
    //  确定后进行加载用户名列表
    wx.request({
      url: Url.GetUser,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {

        DepartmentId: this.data.DepartmentId
      },
      success: function (res) {
        var a = new Array();
        var b = new Array();
        for (let i = 0; i < res.data.RecordList.length; i++) {
          a.push(res.data.RecordList[i].userId);
          b.push(res.data.RecordList[i].realName);
        }
        that.setData({
          countryCodes: b,
          userId: a,
        })
      }
    })


  }

})