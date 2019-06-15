import React, {Component} from 'react';
import './App.css';
import echarts from 'echarts';
import 'echarts/map/js/china';

import geoJson from 'echarts/map/json/china.json';

import {geoCoordMap,provienceData} from "./geo";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.initalECharts();
    }

    initalECharts() {

        const data = [
            {name: '上海', area: '华东大区', type: 'areaCenterCity'},
            {name: '深圳', area: '华南大区', type: 'areaCenterCity'},
            {name: '成都', area: '西南大区', type: 'areaCenterCity'},
            {name: '北京', area: '华北大区', type: 'areaCenterCity'},
            {name: '武汉', area: '华中大区', type: 'areaCenterCity'},
            {name: '沈阳', area: '东北大区', type: 'areaCenterCity'},
        ];

        echarts.registerMap('zhongguo', geoJson);

        for(let item of provienceData){
            if(item.area === '东北大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#E8E8E8",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '华东大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#CFCFCF",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '华北大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#B5B5B5",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '华中大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#9C9C9C",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '西南大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#828282",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '西北大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#696969",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }else if(item.area === '华南大区'){
                item.itemStyle = {
                    normal: {
                        areaColor: "#A9A9A9",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
                }else if(item.area === '南海诸岛'){
                  item.itemStyle = {
                    normal: {
                      borderColor: '#FFA550',//区域边框颜色
                      areaColor:"#FFA550",//区域颜色
                    },
                    emphasis: {
                      show: true,
                      borderColor: '#fff',
                      areaColor:"#fff",
                    }
                  }
            }else{
                item.itemStyle = {
                    normal: {
                        areaColor: "#D9D9D9",
                    },
                    emphasis: {
                        areaColor: "#FFA550",
                    }
                }
            }
        }

        const myChart = echarts.init(document.getElementById('mainMap'));
        
        myChart.setOption({
                tooltip: {
                    show: true,
                    formatter: '{b}',      //提示标签格式
                    backgroundColor:"#8B658B",//提示标签背景颜色
                    textStyle:{color:"#fff"} //提示标签字体颜色
                },
                geo: {
                    map: 'china',
                    roam: false,
                    zoom: 1.1,
                    tooltip: {
                        show: false,       
                    },
                    label: {
                        normal: {
                            show: false,//显示省份标签
                            textStyle:{color:"#c71585"}//省份标签字体颜色
                        },
                        emphasis: {//对应的鼠标悬浮效果
                            show: false,
                            textStyle:{color:"#800080"}
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: .5,//区域边框宽度
                            borderColor: '#fff',//区域边框颜色
                            areaColor:"#ffefd5",//区域颜色
                            label:{show:false}
                        },
                        emphasis: {
                            show: false,
                            borderWidth: .5,
                            borderColor: '#4b0082',
                            areaColor: "#ffdead",
                        }
                    },
                },
                series: [
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: this.convertData(data),
                        symbolSize: 15,
                        symbolRotate: 40,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: true,
                                formatter: '{b}',
                                position: 'right',
                                color:'#FFFFFF'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#FFFF00'
                            }
                        }
                    },
                    {
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        zoom: 1.1,
                        tooltip: {
                            show: true,       //不显示提示标签
                        },
                        label: {
                            normal: {
                                show: true    //显示省份标签
                            },
                            emphasis: {
                                show: true,
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: .5,      //区域边框宽度
                                borderColor: '#fff',  //区域边框颜色
                                label:{show:true}
                            },
                            emphasis: {
                                show: true,
                            }
                        },
                        data: provienceData
                    }
                ],
        })
    }

    convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].area),
                    area: data[i].area,
                    type: data[i].type,
                });
            }
        }
        return res;
    }

    render() {
        return (
            <div className="App">
                <div id="mainMap" style={{width:'100vm',height:'100vh'}}></div>
            </div>
        );
    }
}

export default App;
