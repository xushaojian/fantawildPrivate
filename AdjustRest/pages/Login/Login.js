var Url = require('../../config');
Page({
  data: {
    //input
    username: '',
    password: '',
    isAgree: true,

  },

  // 获取输入账号 
  nameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  //是否记住密码
  bindAgreeChange: function (e) {
    // console.log(!!e.detail.value.length);
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'AccountName',
      success: function (res) {
        console.log(res.data)
        wx.redirectTo({//不保留该页，即不能后退
          url: '../My/my?id=1'
        })
      }
    })

  },

  // 登录 
  login: function () {
    let that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showModal({
        title: '登录错误',
        content: '用户名或密码不能为空',
        showCancel: false,
      })
    } else {

      wx.request({
        url: Url.UserLogin,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': Url.token,
        },
        data: {
          AccountName: this.data.username,
          Password: this.data.password
        },
        success: function (res) {
          console.log(res.data.RecordList[0]);
          if (res.data.RecordList.length==0){
            that.toast();
          }else{
            that.save(res.data.RecordList[0].AccountName, res.data.RecordList[0].CompanyAddress, res.data.RecordList[0].DataType, res.data.RecordList[0].GradeCode, res.data.RecordList[0].Id, res.data.RecordList[0].RealName);
          }

        }
      })


    }
  },

  //成功：保存一系列和用户相关的信息，若选择记住密码则将信息保持到本地，下次打开程序直接进入程序，若要更换账号需要在程序中先行注销
  save: function (AccountName, CompanyAddress, DataType, GradeCode, Id, RealName ) {
    if (this.data.isAgree){
      wx.setStorage({
        key: "AccountName",
        data: AccountName
      })
      wx.setStorage({
        key: "CompanyAddress",
        data: CompanyAddress
      })
      wx.setStorage({
        key: "DataType",
        data: DataType
      })
      wx.setStorage({
        key: "GradeCode",
        data: GradeCode
      })
      wx.setStorage({
        key: "Id",
        data: Id
      })
      wx.setStorage({
        key: "RealName",
        data: RealName
      })
    }

    wx.redirectTo({//不保留该页，即不能后退
      url: '../My/my?id=1'
    })
  },

  toast: function () {
    wx.showModal({
      title: '登录失败',
      content: '用户名或密码错误',
      showCancel: false,

    })
    this.setData({
      password:''
    })
  },



})
