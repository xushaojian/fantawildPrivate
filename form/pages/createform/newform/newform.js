var app = getApp()
Page({
    data: {
        alert: "none",//用于控制弹窗是否显示
        sponsor: '',//创建人
        avatar: '',//创建人的头像
        //用于记录页面的所有组件的属性和顺序
        components: [],
        height: 0,
        arr: {
            list: [{
                icon: '/image/title.png',
                title: '标题',
                onItemTap: 'tapCreateTitleComponent'
            }, {
                icon: '/image/Radio.png',
                title: '单选',
                onItemTap: 'tapCreateRadioComponent'
            }, {
                icon: '/image/dx.png',
                title: '多选',
                onItemTap: 'tapCreateCheckboxComponent'
            }, {
                icon: '/image/srk.png',
                title: '输入框',
                onItemTap: 'no'
            }, {
                icon: '/image/xm.png',
                title: '姓名',
                onItemTap: 'no'
            }, {
                icon: '/image/sj.png',
                title: '手机',
                onItemTap: 'no'
            }, {
                icon: '/image/dz.png',
                title: '地址',
                onItemTap: 'no'
            }, {
                icon: '/image/rq.png',
                title: '日期',
                onItemTap: 'no'
            }, {
                icon: '/image/time.png',
                title: '时间',
                onItemTap: 'no'
            }, {
                icon: '/image/xlk.png',
                title: '下拉框',
                onItemTap: 'no'
            }, {
                icon: '/image/tpdx.png',
                title: '图片单选',
                onItemTap: 'no'
            }, {
                icon: '/image/tpddx.png',
                title: '图片多选',
                onItemTap: 'no'
            }, {
                icon: '/image/yx.png',
                title: '邮箱',
                onItemTap: 'no'
            }, {
                icon: '/image/bj.png',
                title: '表单背景',
                onItemTap: 'no'
            },],
        },
    },

    //页面加载时
    onLoad() {
        dd.getStorage({
            key: "userInfo",
            success: function (res) {
                app.formConfig.sponsor = res.data.name;
                app.formConfig.avatar = res.data.avatar;
            }
        });
        
        let windowHeight = app.globalData.sysInfo.windowHeight;
        let pixelRatio = app.globalData.sysInfo.pixelRatio;
        this.setData({
            height: windowHeight
        })
    },

    //在选择onShow中加载components,是因为在返回的时候可以对页面进行更新
    onShow() {
        this.setData({
            components: app.components,
        })
    },

    //提示组件未完成
    no() {
        this.setData({
            alert: "none"
        })
        dd.showToast({
            type: 'none',
            content: '敬请期待',
            duration: 2000
        });
    },

    //显示选择组件列表
    componentList(e) {
        this.setData({
            alert: "block"
        })
    },

    //关闭选择组件列表
    closeAlert(e) {
        this.setData({
            alert: "none"
        })
    },

    //跳转到创建Title组件页面
    tapCreateTitleComponent() {
        this.setData({
            alert: "none"
        })
        dd.navigateTo({
            url: `../createTitle/createTitle?type=add`,
        });
    },

    //跳转到创建Radio组件页面
    tapCreateRadioComponent() {
        this.setData({
            alert: "none"
        })
        dd.navigateTo({
            url: `../createRadio/createRadio`,
        });
    },

    //跳转到创建CheckBox组件页面
    tapCreateCheckboxComponent() {
        this.setData({
            alert: "none"
        })
        dd.navigateTo({
            url: `../createCheckbox/createCheckbox`,
        });
    },

    //点击某一个组件时,使用边框提示在选中模式,并显示底部编辑项目
    //该事件不用更新app.js的components
    onTapComponent(e) {
        let index = e.target.dataset.index;
        let temp = this.data.components;
        for (let i = 0; i < temp.length; i++) {
            if (i === index) {
                //如果当前项已经处于选择状态,则取消选中状态
                if (temp[i].border == "view-border") {
                    temp[i].border = ""
                } else {
                    temp[i].border = "view-border"
                }
            } else {
                temp[i].border = ""
            }
        }
        this.setData({
            components: temp
        })
    },

    //修改组件 跳转并传参数到createTitle
    edit(e) {
        let index = e.target.dataset.index;
        let id = this.data.components[index].id;
        if (this.data.components[index].type === "title") {
            dd.navigateTo({
                url: `../createTitle/createTitle?type=edit&index=${index}&id=${id}`,
            });
        } else if (this.data.components[index].type === "radio") {
            dd.navigateTo({
                url: `../createRadio/createRadio?type=edit&index=${index}&id=${id}`,
            });
        } else if (this.data.components[index].type === "checkbox") {
            dd.navigateTo({
                url: `../createCheckbox/createCheckbox?type=edit&index=${index}&id=${id}`,
            });
        }
    },

    //上移 将当前数组index索引与前面一个元素互换位置
    //需要同步到app.js的components
    top(e) {
        let index = e.target.dataset.index;
        let temp = this.data.components;

        if (index > 0) {
            let componentsItemIndex = temp[index];
            let componentsItemIndexUp = temp[index - 1];

            componentsItemIndex.border = "view-border";
            componentsItemIndexUp.border = "";

            temp[index - 1] = componentsItemIndex;
            temp[index] = componentsItemIndexUp;

            this.setData({
                components: temp,
            })

            app.components = temp;

        } else {
            dd.showToast({
                type: 'fail ',
                content: '已到顶',
                duration: 2000,
                success: () => { },
            });
        }
    },

    //下移 将当前数组index索引与前面一个元素互换位置
    //需要同步到app.js的components
    down(e) {
        let index = e.target.dataset.index;
        let temp = this.data.components;

        if (index != temp.length - 1) {
            let componentsItemIndex = temp[index];
            let componentsItemIndexDown = temp[index + 1]

            componentsItemIndex.border = "view-border";
            componentsItemIndexDown.border = "";

            temp[index + 1] = componentsItemIndex;
            temp[index] = componentsItemIndexDown;

            this.setData({
                components: temp,
            })
            app.components = temp;
        } else {
            dd.showToast({
                type: 'fail ',
                content: '已到底',
                duration: 2000,
                success: () => { },
            });
        }
    },

    del(e) {
        dd.confirm({
            title: '温馨提示',
            content: '您确定删除吗?',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            success: (result) => {
                if (result.confirm) {
                    let index = e.target.dataset.index;
                    let temp = this.data.components;
                    temp.splice(index, 1);
                    this.setData({
                        components: temp
                    })
                    app.components = temp;
                }
            },
        });
    },

    //跳转表单配置
    formConfig() {
        dd.navigateTo({
            url: `../formConfig/formConfig`,
        });
    },

    //发布页面
    release() {
        dd.showLoading({
            content: '加载中...',
        });

        let that = this;
        let myDate = new Date();

        let year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        let month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate() + 1;        //获取当前日(1-31)
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

        let createtime = year + "-" + month + "-" + day + " " + hour + ":" + minute;

        let formname = '未命名';
        //如果没有标题组件则提供默认名称 = 未命名
        for (let i = 0; i < app.components.length; i++) {
            if (app.components[i].type == 'title' && app.components[i].title != '') {
                formname = app.components[i].title;
                break;
            }
        }

        dd.getStorage({
            key: 'userInfo',
            success: function (res) {
                console.log(JSON.stringify(app.components));
                console.log(JSON.stringify(app.formConfig));
                //创建表单
                dd.httpRequest({
                    url: `${app.globalData.baseHost}/formAppRouter/createForm`,
                    method: 'POST',
                    data: {
                        formid: myDate.getTime(),
                        formname: formname,
                        ddid: res.data.userid,
                        createtime: createtime,
                        conponents: JSON.stringify(app.components),
                        formConfig: JSON.stringify(app.formConfig)
                    },
                    dataType: 'json',
                    success: function (res) {
                        
                        //创建成功后重置全局 components 和 
                        //用于记录一个页面的所有组件的属性和顺序
                        let components = [{
                            id: new Date().getTime(),
                            type: "title",
                            title: "This is a title",
                            position: "center",
                            description: "This is a description.",
                            border: "view-border"
                        }];

                        let formConfig = {
                            sponsor: '',
                            avatar: '',
                            isAnonymous: false,//是否匿名
                            ddReminde: true,
                            stopReply: '',
                            isjoin: false,//false 填写用户范围 不限制
                            isopen: false,//false 数据公开范围 不公开
                            join: {},
                            resultOpenRange: {}
                        };

                        app.conponents = components;
                        app.formConfig = formConfig;

                        dd.hideLoading();
                        dd.showToast({
                            type: 'success',
                            content: '创建成功',
                            duration: 3000,
                        })

                    },
                    fail: function (res) {
                        dd.hideLoading();
                        dd.alert({ content: JSON.stringify(res) })
                    }
                });
            },
            fail: function (fail) {
                dd.alert({ content: JSON.stringify(fail) });
            }
        })
    }

});