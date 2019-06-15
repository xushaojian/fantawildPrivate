import F2 from '@antv/my-f2/lib/index';

const app = getApp();
let chart = null;

function drawChart(canvas, width, height) {
    var data = [{
        name: '其他消费',
        y: 6371664,
        const: 'const'
    }, {
        name: '生活用品',
        y: 7216301,
        const: 'const'
    }, {
        name: '通讯物流',
        y: 1500621,
        const: 'const'
    }, {
        name: '交通出行',
        y: 586622,
        const: 'const'
    }, {
        name: '饮食',
        y: 900000,
        const: 'const'
    }];

    chart = new F2.Chart({
        el: canvas,
        width,
        height
    });

    chart.source(data);
    chart.coord('polar', {
        transposed: true,
        radius: 0.75
    });
    chart.legend(false);
    chart.tooltip(false);
    chart.axis(false);
    chart.pieLabel({
        sidePadding: 10,
        label1: function label1(data, color) {
            return {
                text: data.name,
                fill: color
            };
        },
        label2: function label2(data) {
            return {
                text: '￥' + String(Math.floor(data.y * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
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
            duration: 1200,
            easing: 'bounceOut'
          }
        });
    chart.render();
    return chart;
}

Page({
    data: {

    },
    onReady() {
        
        my.createSelectorQuery().select('#pie').boundingClientRect().exec((res) => {
                const pixelRatio = my.getSystemInfoSync().pixelRatio;
                const canvasWidth = res[0].width;
                const canvasHeight = res[0].height;

                this.setData({
                    width: canvasWidth * pixelRatio,
                    height: canvasHeight * pixelRatio
                });

                const myCtx = my.createCanvasContext('pie');

                myCtx.scale(pixelRatio, pixelRatio);
                const canvas = new F2.Renderer(myCtx);
                drawChart(canvas, res[0].width, res[0].height);
            });

    },

    

});