import React, {Component} from 'react';
import echarts from 'echarts';
// import $ from 'jquery';

// import anhui from './map/data-anhui.json';
// import aomen from './map/data-aomen.json';
// import beijing from './map/data-beijing.json';
import zhongguo from './map/data-china.json';
// import chongqing from './map/data-chongqing.json';
// import fujian from './map/data-fujian.json';
// import gansu from './map/data-gansu.json';
// import guangdong from './map/data-guangdong.json';
// import guangxi from './map/data-guangxi.json';
// import guizhou from './map/data-guizhou.json';
// import hainan from './map/data-hainan.json';
// import hebei from './map/data-hebei.json';
// import heilongjiang from './map/data-heilongjiang.json';
// import henan from './map/data-henan.json';
// import hubei from './map/data-hubei.json';
// import hunan from './map/data-hunan.json';
// import jiangsu from './map/data-jiangsu.json';
// import jiangxi from './map/data-jiangxi.json';
// import jilin from './map/data-jilin.json';
// import liaoning from './map/data-liaoning.json';
// import neimenggu from './map/data-neimenggu.json';
// import ningxia from './map/data-ningxia.json';
// import qinghai from './map/data-qinghai.json';
// import shangdong from './map/data-shangdong.json';
// import shanghai from './map/data-shanghai.json';
// import shangxi from './map/data-shangxi.json';
// import shanxi from './map/data-shanxi.json';
// import sichuan from './map/data-sichuan.json';
// import xianggang from './map/data-xianggang.json';
// import xinjiang from './map/data-xinjiang.json';
// import xizang from './map/data-xizang.json';
// import yunnan from './map/data-yunnan.json';
// import zhejiang from './map/data-zhejiang.json';
// import tianjin from './map/data-tianjin.json';



//用于匹配地区的经纬度
var geoCoordMap = {
    '海门':[121.15,31.89],
    '鄂尔多斯':[109.781327,39.608266],
    '招远':[120.38,37.35],
    '舟山':[122.207216,29.985295],
    '齐齐哈尔':[123.97,47.33],
    '盐城':[120.13,33.38],
    '赤峰':[118.87,42.28],
    '青岛':[120.33,36.07],
    '乳山':[121.52,36.89],
    '金昌':[102.188043,38.520089],
    '泉州':[118.58,24.93],
    '莱西':[120.53,36.86],
    '日照':[119.46,35.42],
    '胶南':[119.97,35.88],
    '南通':[121.05,32.08],
    '拉萨':[91.11,29.97],
    '云浮':[112.02,22.93],
    '梅州':[116.1,24.55],
    '文登':[122.05,37.2],
    '上海':[121.48,31.22],
    '攀枝花':[101.718637,26.582347],
    '威海':[122.1,37.5],
    '承德':[117.93,40.97],
    '厦门':[118.1,24.46],
    '汕尾':[115.375279,22.786211],
    '潮州':[116.63,23.68],
    '丹东':[124.37,40.13],
    '太仓':[121.1,31.45],
    '曲靖':[103.79,25.51],
    '烟台':[121.39,37.52],
    '福州':[119.3,26.08],
    '瓦房店':[121.979603,39.627114],
    '即墨':[120.45,36.38],
    '抚顺':[123.97,41.97],
    '玉溪':[102.52,24.35],
    '张家口':[114.87,40.82],
    '阳泉':[113.57,37.85],
    '莱州':[119.942327,37.177017],
    '湖州':[120.1,30.86],
    '汕头':[116.69,23.39],
    '昆山':[120.95,31.39],
    '宁波':[121.56,29.86],
    '湛江':[110.359377,21.270708],
    '揭阳':[116.35,23.55],
    '荣成':[122.41,37.16],
    '连云港':[119.16,34.59],
    '葫芦岛':[120.836932,40.711052],
    '常熟':[120.74,31.64],
    '东莞':[113.75,23.04],
    '河源':[114.68,23.73],
    '淮安':[119.15,33.5],
    '泰州':[119.9,32.49],
    '南宁':[108.33,22.84],
    '营口':[122.18,40.65],
    '惠州':[114.4,23.09],
    '江阴':[120.26,31.91],
    '蓬莱':[120.75,37.8],
    '韶关':[113.62,24.84],
    '嘉峪关':[98.28,39.77],
    '广州':[113.23,23.16],
    '延安':[109.47,36.6],
    '太原':[112.53,37.87],
    '清远':[113.01,23.7],
    '中山':[113.38,22.52],
    '昆明':[102.73,25.04],
    '寿光':[118.73,36.86],
    '盘锦':[122.070714,41.119997],
    '长治':[113.08,36.18],
    '深圳':[114.07,22.62],
    '珠海':[113.52,22.3],
    '宿迁':[118.3,33.96],
    '咸阳':[108.72,34.36],
    '铜川':[109.11,35.09],
    '平度':[119.97,36.77],
    '佛山':[113.11,23.05],
    '海口':[110.35,20.02],
    '江门':[113.06,22.61],
    '章丘':[117.53,36.72],
    '肇庆':[112.44,23.05],
    '大连':[121.62,38.92],
    '临汾':[111.5,36.08],
    '吴江':[120.63,31.16],
    '石嘴山':[106.39,39.04],
    '沈阳':[123.38,41.8],
    '苏州':[120.62,31.32],
    '茂名':[110.88,21.68],
    '嘉兴':[120.76,30.77],
    '长春':[125.35,43.88],
    '胶州':[120.03336,36.264622],
    '银川':[106.27,38.47],
    '张家港':[120.555821,31.875428],
    '三门峡':[111.19,34.76],
    '锦州':[121.15,41.13],
    '南昌':[115.89,28.68],
    '柳州':[109.4,24.33],
    '三亚':[109.511909,18.252847],
    '自贡':[104.778442,29.33903],
    '吉林':[126.57,43.87],
    '阳江':[111.95,21.85],
    '泸州':[105.39,28.91],
    '西宁':[101.74,36.56],
    '宜宾':[104.56,29.77],
    '呼和浩特':[111.65,40.82],
    '成都':[104.06,30.67],
    '大同':[113.3,40.12],
    '镇江':[119.44,32.2],
    '桂林':[110.28,25.29],
    '张家界':[110.479191,29.117096],
    '宜兴':[119.82,31.36],
    '北海':[109.12,21.49],
    '西安':[108.95,34.27],
    '金坛':[119.56,31.74],
    '东营':[118.49,37.46],
    '牡丹江':[129.58,44.6],
    '遵义':[106.9,27.7],
    '绍兴':[120.58,30.01],
    '扬州':[119.42,32.39],
    '常州':[119.95,31.79],
    '潍坊':[119.1,36.62],
    '重庆':[106.54,29.59],
    '台州':[121.420757,28.656386],
    '南京':[118.78,32.04],
    '滨州':[118.03,37.36],
    '贵阳':[106.71,26.57],
    '无锡':[120.29,31.59],
    '本溪':[123.73,41.3],
    '克拉玛依':[84.77,45.59],
    '渭南':[109.5,34.52],
    '马鞍山':[118.48,31.56],
    '宝鸡':[107.15,34.38],
    '焦作':[113.21,35.24],
    '句容':[119.16,31.95],
    '北京':[116.46,39.92],
    '徐州':[117.2,34.26],
    '衡水':[115.72,37.72],
    '包头':[110,40.58],
    '绵阳':[104.73,31.48],
    '乌鲁木齐':[87.68,43.77],
    '枣庄':[117.57,34.86],
    '杭州':[120.19,30.26],
    '淄博':[118.05,36.78],
    '鞍山':[122.85,41.12],
    '溧阳':[119.48,31.43],
    '库尔勒':[86.06,41.68],
    '安阳':[114.35,36.1],
    '开封':[114.35,34.79],
    '济南':[117,36.65],
    '德阳':[104.37,31.13],
    '温州':[120.65,28.01],
    '九江':[115.97,29.71],
    '邯郸':[114.47,36.6],
    '临安':[119.72,30.23],
    '兰州':[103.73,36.03],
    '沧州':[116.83,38.33],
    '临沂':[118.35,35.05],
    '南充':[106.110698,30.837793],
    '天津':[117.2,39.13],
    '富阳':[119.95,30.07],
    '泰安':[117.13,36.18],
    '诸暨':[120.23,29.71],
    '郑州':[113.65,34.76],
    '哈尔滨':[126.63,45.75],
    '聊城':[115.97,36.45],
    '芜湖':[118.38,31.33],
    '唐山':[118.02,39.63],
    '平顶山':[113.29,33.75],
    '邢台':[114.48,37.05],
    '德州':[116.29,37.45],
    '济宁':[116.59,35.38],
    '荆州':[112.239741,30.335165],
    '宜昌':[111.3,30.7],
    '义乌':[120.06,29.32],
    '丽水':[119.92,28.45],
    '洛阳':[112.44,34.7],
    '秦皇岛':[119.57,39.95],
    '株洲':[113.16,27.83],
    '石家庄':[114.48,38.03],
    '莱芜':[117.67,36.19],
    '常德':[111.69,29.05],
    '保定':[115.48,38.85],
    '湘潭':[112.91,27.87],
    '金华':[119.64,29.12],
    '岳阳':[113.09,29.37],
    '长沙':[113,28.21],
    '衢州':[118.88,28.97],
    '廊坊':[116.7,39.53],
    '菏泽':[115.480656,35.23375],
    '合肥':[117.27,31.86],
    '武汉':[114.31,30.52],
    '大庆':[125.03,46.58]
};

//地图上的点
//方特
var mainData = [
    {
        name: "沈阳方特欢乐世界",
        value: [123.38,41.8,5],
        desc:"位于沈阳市沈北新区的沈阳方特欢乐世界，是东北地区第四代主题公园之一。<br />采用高超的技术，打造出飞越极限、星际航班等大型室内项目，突破传统，带你互动探索未来科幻的神奇。",
        peripheral: [ 
        {
            name: "周边景点一",
            value:[117.2,39.13,4],
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[118.2,39.13,7],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[120.2,39.13,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点四",
            value:[115.2,39.13,9],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点五",
            value:[113.2,37.13,9],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },
    ]
    },
    {
        name: "天津方特欢乐世界",
        value: [117.2,39.13,3],
        desc:"天津方特欢乐世界坐落于天津滨海新区中新生态城生态岛内，是京津冀地区第四代高科技主题公园。",
        peripheral: [
            {
            name: "周边景点一",
            value:[114.2,39.13,6],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[120.2,39.13,7],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[117.2,39.13,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "大同方特欢乐世界",
        value: [113.3,40.12,3],
        desc:"大同华强文化产业基地位于山西省大同市御东新区，其通过结合当地<br />特色的文化创意产业设想，致力于建设国内优秀的科技文化产业基地。",
        peripheral: [
            {
            name: "周边景点一",
            value:[110.3,40.12,5],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[117.3,40.12,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[113.3,50.12,6],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "嘉峪关方特欢乐世界",
        value: [98.28,39.77,3],
        desc:"嘉峪关方特欢乐世界，大西北知名主题乐园。丝路之旅、石榴树的传说<br />真实再现丝绸之路的恢弘，浓郁的西域文化特色与高科技欢乐项目的完美结合，带你领略历史文化的风采。",
        peripheral: [
            {
            name: "周边景点一",
            value:[100.28,39.77,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[95.28,39.77,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[98.28,35.77,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "青岛方特梦幻王国",
        value: [120.33,36.07,3],
        desc:"青岛方特梦幻王国位于青岛市城阳区红岛海滨。崂山道士、齐鲁飞翔、<br />秦岭历险、水漫金山……来吧，方特将带你进入梦幻乐园、体验科幻神奇！",
        peripheral: [
            {
            name: "周边景点一",
            value:[120.33,40.07,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[116.33,36.07,8],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[123.33,36.07,3],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "济南方特东方神画",
        value: [117,36.65,3],
        desc:"济南方特东方神画，汇聚中国非遗文化精粹，用高科技手段将精妙的古<br />老传说和文化经典完美再现，缔造一个有故事的公园。上天入地，穿越古今，追溯东方文明！",
        peripheral: [
            {
            name: "周边景点一",
            value:[117,40.65,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[121,36.65,6],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[114,36.65,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "泰安方特欢乐世界",
        value: [117.13,36.18,3],
        desc:"泰安方特欢乐世界，位于泰安市泰山区东部新区，属第四代大型高科技科幻主题公园。<br />畅快刺激的户外娱乐设施，逼真有趣的室内项目，独特的异域狂欢表演……打造专属的欢乐世界。",
        peripheral: [
            {
            name: "周边景点一",
            value:[117.13,40.18,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[114.13,36.18,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[122.13,36.18,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "芜湖方特旅游区",
        value: [118.38,31.33,3],
        desc:"是集方特欢乐世界、方特梦幻王国、方特水上乐园、方特东方神画四座主题乐园以及主题演艺、<br />度假酒店（方特酒店、宽席内府酒楼）等相关配套设施在内的综合性休闲旅游区。2016年8月被评为国家5A级旅游景区。",
        peripheral: [
            {
            name: "周边景点一",
            value:[115.38,31.33,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[122.38,31.33,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[118.38,35.33,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "宁波方特东方神画",
        value: [121.56,29.86,3],
        desc:"是一个充满传奇故事的大型高科技主题乐园，由民间传说、民间戏曲、经典爱情传奇、<br />神秘文化、杂技与竞技、民间节庆、民间手工艺、综合项目等八大项目区组成。",
        peripheral: [
            {
            name: "周边景点一",
            value:[118.56,29.86,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[125.56,29.86,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[121.56,25.86,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "重庆方特科幻公园",
        value: [106.54,29.59,3],
        desc:"重庆方特科幻公园位于在重庆市江北区北滨路，是重庆市科普教育基地之一。<br />恐龙危机、飞越极限、生命之源……大型室内项目，不受天气影响，满足各类人群的度假需求。",
        peripheral: [
            {
            name: "周边景点一",
            value:[100.54,29.59,15],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[110.54,29.59,10],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[106.54,33.59,8],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "厦门方特旅游区",
        value: [118.1,24.46,3],
        desc:"高科技项目体验、绚烂城堡烟火秀、大型主题演艺……玩转多样欢乐，开启全家欢乐之旅。",
        peripheral: [
            {
            name: "周边景点一",
            value:[120.1,24.46,0],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[122.1,24.46,0],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[118.1,26.46,0],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "株洲方特旅游度假区",
        value: [113.16,27.83,3],
        desc:"株洲方特旅游度假区位于株洲云龙示范区，是集方特欢乐世界、方特梦幻王国两大主题乐园以及酒店餐饮、休闲娱乐于一<br />体的综合性休闲旅游区。园区由数十个有自主知识产权的大型娱乐项目区及二百多项景观项目组成，受到游客热捧。",
        peripheral: [
            {
            name: "周边景点一",
            value:[110.16,27.83,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[116.16,27.83,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[110.16,30.83,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "汕头方特欢乐世界",
        value: [116.69,23.39,3],
        desc:"汕头方特欢乐世界位于汕头海湾大桥北岸，是粤东地区的高科技主题公园。<br />有着“科普教育基地”之称的方特，打造一个能给游客带去惊险刺激感受又能寓教于乐的奇特的幻想世界。",
        peripheral: [
            {
            name: "周边景点一",
            value:[113.69,23.39,5],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点一",
            value:[116.69,25.39,6],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点一",
            value:[119.69,23.39,7],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    },
    {
        name: "南宁方特东盟神画",
        value: [108.33,22.84,3],
        desc:"游方特东盟神画，体验奇妙的东南亚文化盛宴，感受顶尖高科技的神奇、<br />畅玩惊险刺激的游乐项目、品尝东南亚正宗美食，让你不出国门，一天玩遍奇幻东盟。",
        peripheral: [
            {
            name: "周边景点一",
            value:[106.33,22.84,5],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点二",
            value:[108.33,24.84,4],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        },{
            name: "周边景点三",
            value:[110.33,22.84,6],
            color:'red',
            desc:"XXXXXXXXXXXXXX"
        }
    ]
    }
];

var categoryDataInit = [];
var barDataInit = [];

for(let i in mainData){
    categoryDataInit.push(mainData[i].name)
    barDataInit.push(mainData[i]['value'][2])
}

class MyApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.createECharts(mainData,categoryDataInit,barDataInit);
    }

    /**
     * 
     * @param [{}] data 地图点数据
     * @param [] categoryData 条形图Y轴数据
     * @param [{}] barData X轴值
     * 
     */
    createECharts(data,categoryData,barData) {
            let that = this;
            // myChart.clear
            //注册可用的地图，必须在包括 geo 组件或者 map 图表类型的时候才能使用。

            echarts.registerMap('china', zhongguo);
            let myChart = echarts.init(document.getElementById('mainMap'));
           
            myChart.setOption({
                backgroundColor: '#404a59',
                title:[{
                    text: '全国公园分布关系',
                    textStyle:{
                        color:'#ffffff'
                    }
                }],
                tooltip: {
                    show: true,
                    trigger:'item',
                    alwaysShowContent:false,
                    backgroundColor:'rgba(50,50,50,0.7)',
                    hideDelay:100,
                    triggerOn:'mousemove',
                    enterable:true,
                    formatter:function(params){
                        if(params.componentSubType === "bar"){
                            return `名称：${params.name} <br />周边数量：${params.value} <br />`
                        }else if(params.componentSubType === "effectScatter"){
                            return `名称：${params.data.name} <br />周边数量：${params.data.value[2]} <br /> 描述：${params.data.desc} `
                        }
                    }
                },
                geo: {
                    type: 'map',
                    map: 'china',
                    roam: true,
                    zoom: 1.2,
                    center: [118, 33],
                    tooltip: {
                        show: true,       
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle:{color:"#ffffff"}
                        },
                        emphasis: {
                            show: false,
                            textStyle:{color:"#ff0000"}
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(147, 235, 248, 0)' 
                                }, {
                                    offset: 1,
                                    color: 'rgba(147, 235, 248, .2)'
                                }],
                                globalCoord: false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        // emphasis: {
                        //     show: false,
                        //     areaColor: '#389BB7',
                        //     borderWidth: 0
                        // }
                    }
                },
                grid: {
                    right: 20,
                    top: 100,
                    bottom: 40,
                    width: '20%'
                },
                xAxis: {
                    type: 'value',
                    scale: false,
                    position: 'top',
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 2,
                        textStyle: {
                            color: '#aaa'
                        }
                    },
                },
                yAxis: {
                    type: 'category',
                    nameGap: 16,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#ddd'
                        }
                    },
                    data: categoryData
                },
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: data,
                    symbolSize: function (val) {
                        return val[2]*3;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }, {
                    zlevel: 2,
                    type: 'bar',
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    },
                    data: barData
                }]
            })  
            
            myChart.on('click', function (params) {
                //只有点击地图上的数据点才允许触发
                if(params.componentSubType==="effectScatter"){
                    let categoryDataSub = [];
                    let barDataSub = [];
                    let centerPoint = [];
                    centerPoint.push(params.data.value[0])
                    centerPoint.push(params.data.value[1])

                    for(let i in params.data.peripheral){
                        categoryDataSub.push(params.data.peripheral[i].name)
                        barDataSub.push(params.data.peripheral[i]['value'][2])
                    }
                    that.createEChartsSub([params.data],params.data.peripheral,categoryDataSub,barDataSub,centerPoint)
                }
            });
    }

    /**
     * 
     * @param [{}] data 地图点数据
     * @param [] categoryData 条形图Y轴数据
     * @param [{}] barData X轴值
     * 
     */
    createEChartsSub(data,dataOther,categoryData,barData,centerPoint) {
        let that = this;

        echarts.registerMap('china', zhongguo);
        let myChartSub = echarts.init(document.getElementById('mainMap'));
        
        myChartSub.setOption({
            backgroundColor: '#404a59',
            title:[{
                text: data[0].name+ '周边',
                textStyle:{
                    color:'#ffffff'
                }
            }],
            tooltip: {
                show: true,
                trigger:'item',
                alwaysShowContent:false,
                backgroundColor:'rgba(50,50,50,0.7)',
                hideDelay:100,
                triggerOn:'mousemove',
                enterable:true,
                formatter:function(params){
                    if(params.componentSubType === "bar"){
                        return `名称：${params.name} <br />距离（km）：${params.value} <br />`
                    }else if(params.componentSubType === "effectScatter"){
                        return `名称：${params.data.name} <br />距离（km）：${params.data.value[2]} <br />`
                    }
                }
            },
            graphic: [
            {
                id: "back",
                type: 'group',
                right: 10,
                top: 20,
                zlevel: 10,
                
                children: [ {
                    type: 'text',
                    left: 0,
                    top: 'middle',
                    invisible:false,//设置返回按钮是否可见
                    style: {
                        text: '返回',
                        textAlign: 'center',
                        fill: "#FFA550",
                        font:  '18px "Microsoft YaHei", sans-serif'
                    },
                    onclick: function() {
                        // that.createECharts(mainData,categoryDataInit,barDataInit);
                        window.location.reload()
                    }
                }]
            }],
            geo: {
                type: 'map',
                map: 'china',
                roam: true,
                zoom: 4,
                center: centerPoint,
                tooltip: {
                    show: true,       
                },
                label: {
                    normal: {
                        show: true,
                        textStyle:{color:"#ffffff"}
                    },
                    emphasis: {
                        show: false,
                        textStyle:{color:"#ff0000"}
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(147, 235, 248, 0)' 
                            }, {
                                offset: 1,
                                color: 'rgba(147, 235, 248, .2)'
                            }],
                            globalCoord: false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                }
            },
            grid: {
                right: 20,
                top: 100,
                bottom: 40,
                width: '20%'
            },
            xAxis: {
                type: 'value',
                scale: false,
                position: 'top',
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 2,
                    textStyle: {
                        color: '#aaa'
                    }
                },
            },
            yAxis: {
                type: 'category',
                nameGap: 16,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#ddd'
                    }
                },
                data: categoryData
            },
            series: [{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: data,
                symbolSize:20,
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                zlevel: 1
            },{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: dataOther,
                symbolSize:20,
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color:'red',
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                zlevel: 1
            }, {
                zlevel: 2,
                type: 'bar',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: '#ddb926'
                    }
                },
                data: barData
            }]
        })

}

    render() {
        return (
            <div>
                <div id="mainMap" style={{width:'100vm',height:'100vh'}}></div>
            </div>
        );
    }
}

export default MyApp;
