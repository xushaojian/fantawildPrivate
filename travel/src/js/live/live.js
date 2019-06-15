import React , { Component } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsExporting from 'highcharts/modules/exporting';
import { getJSON } from 'jquery';
import { Toast , Calendar } from 'antd-mobile';
import ChinaMap from './chinaMap'; 
import ChinaCity from './chinaCity';
import MapChart from './mapChart';
import proj4 from './proj4';
import CONFIG from './../config';
import { unique,getFormat,jqalert,jqalert_exporting } from './../tool';
import  './../../css/live.css';

HighchartsExporting(Highcharts);

Highcharts.setOptions({
  lang:{
    resetZoom: "重置大小"
  }
})

const now = new Date();
const today = getFormat(now);

class Live2 extends Component {
  //初始化state和绑定this
  constructor(props) {
    super(props);
    //this.setState 只能更改最外层属性的值。
    //this.setState是异步，所以在this.setState之后立即调用this.state是获取不到最新的数据的
    this.state = {
      startTime:today,
      endTime:today,
      show: false,//控制日历控件显示状态
      mapData:[],//地图标记数据
      tableStr:'',//export弹窗table字符串
      totalNum:0,//总人数
      config: {},//配置日历项
      mapOptions:{
        chart:{
          height:(window.innerHeight-120)+''
        },
        title: {
          text: '出差人员地区分布'
        },
        subtitle: {
          text: today,
        },
        exporting: {},
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom',
            theme: {
              fill: '#FFA550',
              'stroke-width': 4,
              stroke: 'white',
              r: 0,
              states: {
                hover: {
                  fill: '#a4edba'
                },
                select: {
                  stroke: '#039',
                  fill: '#a4edba'
                }
              }
            },
          }
        },
        //图例
        legend: {
          enabled: false,
        },
        //地图标记
        plotOptions: {
          series: {
            cursor:'pointer',
            events:{
              click:function(e){
                    //获取部门
										let departmentArrToast = [];
										// 姓名/天数 数组
										let nameArrToast = [];
										// 姓名列下标
                    let nameIndexToast = 0;
                    
										for(let x = 0 ; x < e.point.data.length ; x++){
											departmentArrToast.push(e.point.data[x].split(':')[0]);
											nameArrToast.push(e.point.data[x].split(':')[1].split(" ")[0]);
                    }
										departmentArrToast = unique(departmentArrToast);//去重

										//获取各个部门人数
										let departmentPeopleNumArrToast = [];
                    let departmentNumToast = 0 ;
                    let departmentTotalNum = 0 ;
										for(let x=0 ; x < departmentArrToast.length ; x++){
											for(let n=0 ; n < e.point.data.length ; n++){
												if(departmentArrToast[x] == e.point.data[n].split(':')[0]){
                          departmentNumToast ++ ;
                          departmentTotalNum ++ ;
												}
											}
											departmentPeopleNumArrToast.push(departmentNumToast);
											departmentNumToast = 0 ;
										}

                    let toastStr = '<table width="100%" style="font-size:14px;background-color: #FFFFFF;padding: 5px;text-align:left">';
                    let nameStr = '';
											for(let i = 0 ;i < departmentArrToast.length ;i++){
												toastStr += '<tr><td style="color:#4682B4;">'+departmentArrToast[i]+'  '+departmentPeopleNumArrToast[i]+'  人</td></tr>';
												for(let z = 0; z < departmentPeopleNumArrToast[i] ; z++){
													nameStr += nameArrToast[nameIndexToast]+'&nbsp;&nbsp;&nbsp';
													nameIndexToast++;
												}
												toastStr += '<tr><td>'+nameStr+'</td></tr>';
												nameStr = '';
											}
											toastStr+='</table>';
											jqalert({
												title: e.point.cityname + ' ' + departmentTotalNum +'人',
												content: toastStr
											})
              },
            },
            dataLabels: {
              format: '{point.cityname}' + ':' + '{point.data.length}',
            },
            marker: {
              radius: 5
            }
          }
        },
        series: [
          {
            mapData: ChinaMap,
            showInLegend: true,
          },
          {
            type: 'mappoint',
            animation: true,
            data:[]
          }]
        }
    }
  }

  componentDidMount() {
    this.getMapData(today,today,1);  
  }

  //获取出差人员地区分布 地图数据
  getMapData(beginTime,endTime,isDay){
    Toast.show('loading...',0);
    getJSON(CONFIG.GET_USER_PUNCH_ADDRESS_LIST+'?startTime='+beginTime+'&endTime='+endTime).then(
      result => {
				if(isDay==1){
						var tableStr = '<table class="table"><tr><th class="th">地区/人数</th><th class="th">部门/人数</th><th class="th">姓名</th></tr>';
				}else{
						var tableStr = '<table class="table"><tr><th class="th">地区/人数</th><th class="th">部门/人数</th><th class="th">姓名</th><th class="th">天数</th></tr>';
				}

        for(var i = 0; i < result.Data.length; i++) {
          result.Data[i].lat = ChinaCity[result.Data[i].cityname].lat;
          result.Data[i].lon = ChinaCity[result.Data[i].cityname].lon;
          //设置数据点类似人气
          if (result.Data[i].data.length <= 3) {
            result.Data[i].color = '#00FF7F';
          } else if (3 < result.Data[i].data.length && result.Data[i].data.length <= 6) {
            result.Data[i].color = '#FFA550';
          } else if (6 < result.Data[i].data.length) {
            result.Data[i].color = '#FF0000';
          }

          //获取部门
          var departmentArr = [];
          // 姓名/天数 数组
          var nameArr = [];
          // 姓名列下标
          var nameIndex = 0;

          for(var x = 0 ; x < result.Data[i].data.length ; x++){
            departmentArr.push(result.Data[i].data[x].split(':')[0]);
            nameArr.push(result.Data[i].data[x].split(':')[1]);
          }
          departmentArr = unique(departmentArr);//去重

          //获取各个部门人数
          var departmentPeopleNumArr = [];
          var departmentNum = 0 ;
          for(var x=0 ; x < departmentArr.length ; x++){
            for(var e=0 ; e < result.Data[i].data.length ; e++){
              if(departmentArr[x] == result.Data[i].data[e].split(':')[0]){
                departmentNum ++
              }
            }
            departmentPeopleNumArr.push(departmentNum);
            departmentNum = 0 ;
          }

          if(isDay==1){
            tableStr += '<tr><td class="td" rowspan="' + result.Data[i].data.length + '">' + result.Data[i].cityname + result.Data[i].data.length + '人</td><td class="td" rowspan="' + departmentPeopleNumArr[0] + '">' + result.Data[i].data[0].split(":")[0] +departmentPeopleNumArr[0]+ '人</td><td class="td">' + result.Data[i].data[0].split(":")[1].split(" ")[0] + '</td></tr>';
          }else{
            tableStr += '<tr><td class="td" rowspan="' + result.Data[i].data.length + '">' + result.Data[i].cityname + result.Data[i].data.length + '人</td><td class="td" rowspan="' + departmentPeopleNumArr[0] + '">' + result.Data[i].data[0].split(":")[0] +departmentPeopleNumArr[0]+ '人</td><td class="td">' + result.Data[i].data[0].split(":")[1].split(" ")[0] + '</td><td class="td">' + result.Data[i].data[0].split(" ")[1] + '</td></tr>';
          }

          nameIndex++;
          if(departmentPeopleNumArr[0]>1){
            for(var p = 1 ; p < departmentPeopleNumArr[0] ; p++){
              if(isDay==1){
                tableStr += '<tr><td class="td">' + result.Data[i].data[p].split(":")[1].split(" ")[0] + '</td></tr>'
              }else{
                tableStr += '<tr><td class="td">' + result.Data[i].data[p].split(":")[1].split(" ")[0] + '</td><td class="td">' + result.Data[i].data[p].split(" ")[1] + '</td></tr>'
              }
              nameIndex++;
            }
          }
          for(var y = 1; y < departmentArr.length; y++) {
              if(isDay==1){
                tableStr += '<tr><td class="td" rowspan="'+ departmentPeopleNumArr[y] +'">' + departmentArr[y]  + departmentPeopleNumArr[y] + '人</td><td class="td">' + nameArr[nameIndex].split(" ")[0] + '</td></tr>';
                nameIndex++
                for(var u = 1 ;u < departmentPeopleNumArr[y] ; u++){
                  tableStr += '<tr><td class="td">' +  nameArr[nameIndex].split(" ")[0] + '</td></tr>'
                  nameIndex++
                }
              }else{
                tableStr += '<tr><td class="td" rowspan="'+ departmentPeopleNumArr[y] +'">' + departmentArr[y]  + departmentPeopleNumArr[y] + '人</td><td class="td">' + nameArr[nameIndex].split(" ")[0] + '</td><td class="td">' + nameArr[nameIndex].split(" ")[1] + '</td></tr>';
                nameIndex++
                for(var u = 1 ;u < departmentPeopleNumArr[y] ; u++){
                  tableStr += '<tr><td class="td">' +  nameArr[nameIndex].split(" ")[0] + '</td><td class="td">' +  nameArr[nameIndex].split(" ")[1] + '</td></tr>'
                  nameIndex++
                }
              }
          }
        }
        tableStr +="</table>";
        this.setMapOptions(result.Data,beginTime,endTime,tableStr);
        Toast.hide();
      },

      error => {
        Toast.hide();
        Toast.fail('请求出错了')
      },
    )
  }

  //设置mapOptions
  //Data 出差数据数组
  setMapOptions(mapData,startTime,endTime,tableStr){
    //计算总人数
    let totalNum = 0 ;
    for(let i = 0; i < mapData.length; i++) {
      totalNum += mapData[i].data.length;
    }

    let time = '';
    if(startTime!=endTime){
      time = startTime +' ~ ' + endTime;
    }else{
      time = startTime;
    }

    let tempOptions =this.state.mapOptions;
    tempOptions.series[1].data = mapData;
    tempOptions.subtitle.text =time + ' 共 ' + totalNum + '人';

    tempOptions.exporting = {
      allowHTML: true,
      buttons: {
        contextButton: {
          symbolStroke: '#FFA550',
          onclick: function() {
            jqalert_exporting({
              title: time + ' 共 ' + totalNum + '人',
              content: tableStr
            })
          }
        }
      }
    }

    this.setState({
      mapData,
      totalNum,
      tableStr,
      mapOptions:tempOptions
    })
  }

  renderBtn(config = {}) {
    return (
      <svg className="icon calendar-btn" aria-hidden="true"  onClick={() => {
        this.setState({
          show: true,
          config,
        });
      }}>
        <use xlinkHref="#icon-rili"></use>
       </svg>
    );
  }

  //确认时回调
  onConfirm = (startTimeSure, endTimeSure) => {    
    let ssdate=getFormat(new Date(startTimeSure)); 
    let eedate=getFormat(new Date(endTimeSure));  
    this.setState({
      show: false,
      startTime:ssdate,
      endTime:eedate
    });   
    this.getMapData(ssdate,eedate,(ssdate!=eedate)?0:1);
  }

  //  取消时回调
  onCancel = () => {
    this.setState({
      show: false
    });
  } 
  
  render() {
    // 将 proj4 挂载到 window 上，这是因为 Highmaps 内部是通过 window.proj4 来访问 proj4 的
    window.proj4 = proj4;
    return (
      <div className="containerlive">    
        <MapChart options = { this.state.mapOptions } highcharts = { Highcharts }/>
        {this.renderBtn({ showShortcut: true,defaultValue: [new Date(now)] })}
        <Calendar 
        {...this.state.config}
        visible={this.state.show}
        onCancel={this.onCancel}
        onConfirm={this.onConfirm}
        maxDate={new Date(now)}  
        infiniteOpt={true}              
      />   
    </div>
  );
  }

}
export default Live2;