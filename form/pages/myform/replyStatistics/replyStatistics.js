import F2 from '@antv/my-f2/lib/index';
let app = getApp();
let chart = null;

function drawChart(canvasid, data) {
    my.createSelectorQuery().select('#canvas' + canvasid).boundingClientRect().exec((res) => {
        let pixelRatio = my.getSystemInfoSync().pixelRatio;
        let myCtx = my.createCanvasContext('canvas' + canvasid);
        let canvas = new F2.Renderer(myCtx);
        let width = 300;
        let height = 250;
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });
        chart.source(data);
        chart.coord('polar', {
            transposed: true,
            radius: 0.55
        });
        chart.legend(false);
        chart.tooltip(false);
        chart.axis(false);
        chart.pieLabel({
            sidePadding: 0,
            label1: function label1(data, color) {
                return {
                    text: data.name,
                    fill: color
                };
            },
            label2: function label2(data) {
                return {
                    text: String(Math.floor(data.y * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    fill: '#808080',
                    fontWeight: 'bold'
                };
            }
        });

        chart.interval().position('const*y').color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864']).adjust('stack').style({
            lineWidth: 1,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
        }).animate({
            appear: {
                duration: 1000,
                easing: 'bounceOut'
            }
        });
        chart.render();
    });
}

Page({
    data: {
        fromid: '',
        width: '100%',
        height: '800rpx',
        chartData: [
            // {//一个对象表示一个组件,一个组件对应一个图形
            //     id:'1555183083614',
            //     title:'软件所3月份活动投票',
            //     type:'radio',
            //     chartDataNew : [
            //             { name: '其他消费', y: 6371664, const: 'const' }, 
            //             { name: '生活用品', y: 7216301, const: 'const' }, 
            //             { name: '通讯物流', y: 1500621, const: 'const' }, 
            //             { name: '交通出行', y: 586622, const: 'const' }, 
            //             { name: '饮食', y: 900000, const: 'const' }
            //     ]
            // },{//一个对象表示一个组件
            //     id:'1555183083614',
            //     title:'软件所3月份活动投票',
            //     type:'checkbox',
            //     chartDataNew : [
            //             { name: '其他消费', y: 6371664, const: 'const' }, 
            //             { name: '生活用品', y: 7216301, const: 'const' }, 
            //             { name: '通讯物流', y: 1500621, const: 'const' }, 
            //             { name: '交通出行', y: 586622, const: 'const' }, 
            //             { name: '饮食', y: 900000, const: 'const' }
            //     ]
            // }
        ],
    },

    onLoad(query) {
        let that = this;
        this.setData({
            formid: query.formid
        })
    },
    onReady() {
        dd.showLoading({
            content: '加载中...'
        })
        let that = this;
        let formid = this.data.formid

        //根据表单ID查询表单的回复数据
        dd.httpRequest({
            url: `${app.globalData.baseHost}/formAppRouter/getFormForFormID`,
            method: 'POST',
            data: { formid: formid },
            dataType: 'json',
            success: function (res) {
                let form = res.data.data;
                form.components = JSON.parse(form.components);
                form.form_config = JSON.parse(form.form_config);
                
                dd.httpRequest({
                    url: `${app.globalData.baseHost}/formAppRouter/getDataForFormId`,
                    method: 'POST',
                    data: { formid: formid },
                    dataType: 'json',
                    success: function (res2) {
                        
                        let replyData = res2.data.data;

                        //将回复结果转换成JSON
                        for (let x in replyData) {
                            replyData[x].result = JSON.parse(replyData[x].result)
                        }

                        let chartData = [];

                        for (let i in form.components) {
                            let chartItem = {
                                    id: form.components[i].id,
                                    title: form.components[i].title,
                                    type: form.components[i].type,
                                    chartDataNew: []
                                }
                            //不对title类型统计
                            if (form.components[i].type === "title") {
                                continue;
                            }
                            //对radio类型的数据组装
                            if (form.components[i].type === "radio" ) {
                                for (let q in form.components[i].radioData) {
                                    let chartDataNewItem = {
                                        name: form.components[i].radioData[q],
                                        y: 0,
                                        const: 'const'
                                    };
                                    let sum = 0;
                                    for (let y in replyData) {
                                        for (let k in replyData[y].result) {
                                            if (replyData[y].result[k].value === form.components[i].radioData[q] && form.components[i].id === replyData[y].result[k].id) {
                                                sum++
                                            }
                                        }
                                    }
                                    chartDataNewItem.y = sum;
                                    chartItem.chartDataNew.push(chartDataNewItem);
                                }
                            }
                            //对checkbox类型的数据组装
                            if (form.components[i].type === "checkbox") {
                                for (let q in form.components[i].checkboxData) {
                                    let chartDataNewItem = {
                                        name: form.components[i].checkboxData[q],
                                        y: 0,
                                        const: 'const'
                                    };
                                    let sum = 0;
                                    for (let y in replyData) {
                                        for (let k in replyData[y].result) {
                                            for(let t in replyData[y].result[k].value){
                                                if (replyData[y].result[k].value[t] === form.components[i].checkboxData[q] && form.components[i].id === replyData[y].result[k].id) {
                                                sum++
                                                }
                                            }
                                            
                                        }
                                    }
                                    chartDataNewItem.y = sum;
                                    chartItem.chartDataNew.push(chartDataNewItem);
                                }
                            }

                            chartData.push(chartItem)
                        }

                        that.setData({
                            chartData: chartData
                        })

                        setTimeout(function () {
                            for (let t in chartData) {
                                drawChart(chartData[t].id, chartData[t].chartDataNew)
                            }
                            dd.hideLoading();
                        }, 1000);
                        
                    },
                    fail: function (res) {
                        dd.hideLoading();
                        dd.alert({ content: JSON.stringify(res) })
                    }
                });
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({ content: JSON.stringify(res) })
            }
        });
    }

})