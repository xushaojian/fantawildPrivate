import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import { Icon , Flex ,Toast , Modal } from 'antd-mobile';
import { getJSON } from "jquery"
import * as dd from "dingtalk-jsapi"
import { getWeek , getFormat , getDateSegment ,sum } from './../tool'
import CONFIG from './../config'

import './BarDetail.css'

class BarDetail extends Component {
    constructor(props) {
    super(props);
    this.state = {
      config:{},
      type:this.props.match.params.type,
      anchorPointDate:this.props.match.params.anchorpoint,//周
      anchorPointMonth:this.props.match.params.anchorpoint,//月
      anchorPointYear:this.props.match.params.anchorpoint,//年
      startDate:"xxxx-xx-xx",
      endDate:"xxxx-xx-xx",

      faultTerminalNum:0,//异常终端数
      terminalPlayExpNum:0,//终端播放异常总数

      modal: false,
      terminalName:0,
      value:0,
      ballData:[],
    }
}

componentDidMount() {
    dd.biz.navigation.setTitle({
        title: '播放异常次数统计', 
        onSuccess: function (result) {},
        onFail: function (err) {}
    });

    dd.biz.navigation.setRight({
        show: false, 
        control: false, 
        text: '',
        onSuccess: function (result) {},
        onFail: function (err) {}
    });

    let arr;
    let type = this.state.type
    switch (type) {
        case 'week':
            arr = getDateSegment(this.state.anchorPointDate, "week");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getFaultStatistic(arr[0], arr[1])
            break;
        case 'month':
            arr = getDateSegment(this.state.anchorPointDate, "month");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getFaultStatistic(arr[0], arr[1])
            break;
        case 'year':
            arr = getDateSegment(this.state.anchorPointDate, "year");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getFaultStatistic(arr[0], arr[1])
            break;
    }
}

//根据传入的参数判断应该使用那种日期控件
choiceDateComponent(type){    
    if(type == "week"){

    return <Flex style={{height:"40px",margin:'10px',borderRadius:'10px',backgroundColor:'#FAEBD7'}}>
            <Flex.Item style={{color:"#108EE9",textAlign:"left"}} onClick={() => this.onClickWeekUp()} >
            <Icon size="md" type="left" style={{verticalAlign:"middle"}}/>
            <span style={{verticalAlign:"middle"}}>上一周</span>
            </Flex.Item>
            <Flex.Item className="start">{this.state.startDate}</Flex.Item>
            ~
            <Flex.Item className="end">{this.state.endDate}</Flex.Item>
            <Flex.Item style={{color:"#108EE9",textAlign:"right"}} onClick={() => this.onClickWeekDown()}>
            <span style={{ verticalAlign:"middle" }}>下一周</span>
            <Icon size="md" type="right" style={{ verticalAlign:"middle" }}/>
            </Flex.Item>
        </Flex>

    }else if(type == "month"){

    return <Flex style={{height:"40px",margin:'10px',borderRadius:'10px',backgroundColor:'#FAEBD7'}}>
            <Flex.Item align="start" style={{color:"#108EE9"}} onClick={() => this.onClickMonthUp()} >
            <Icon size="md" type="left" style={{verticalAlign:"middle"}}/>
            <span style={{verticalAlign:"middle"}}>上一月</span>
            </Flex.Item>
            <Flex.Item align="center">{this.state.anchorPointMonth}</Flex.Item>
            <Flex.Item align="end" style={{color:"#108EE9"}} onClick={() => this.onClickMonthDown()}>
            <span style={{ verticalAlign:"middle" }}>下一月</span>
            <Icon size="md" type="right" style={{ verticalAlign:"middle" }}/>
            </Flex.Item>
        </Flex>

    }else if(type == "year"){

    return <Flex style={{height:"40px",margin:'10px',borderRadius:'10px',backgroundColor:'#FAEBD7'}}>
            <Flex.Item align="start" style={{color:"#108EE9"}} onClick={() => this.onClickYearUp()} >
            <Icon size="md" type="left" style={{verticalAlign:"middle"}}/>
            <span style={{verticalAlign:"middle"}}>上一年</span>
            </Flex.Item>
            <Flex.Item align="center">{this.state.anchorPointYear}</Flex.Item>
            <Flex.Item align="end" style={{color:"#108EE9"}} onClick={() => this.onClickYearDown()}>
            <span style={{ verticalAlign:"middle" }}>下一年</span>
            <Icon size="md" type="right" style={{ verticalAlign:"middle" }}/>
            </Flex.Item>
        </Flex>

    }
}

//上一周
onClickWeekUp() {
    //获取锚点日期对应上一周的日期
    let hs = new Date(this.state.anchorPointDate).getTime()
    let anchorPointDateNew = getFormat(new Date(hs - 7 * 24 * 60 * 60 * 1000))
    let week = getWeek(anchorPointDateNew)
    this.setState({
        startDate: week[0],
        endDate: week[1],
        anchorPointDate: anchorPointDateNew
    })
    this.getFaultStatistic(week[0], week[1])
}

//下一周
onClickWeekDown() {
    //获取锚点日期对应上一周的日期
    let hs = new Date(this.state.anchorPointDate).getTime()
    let anchorPointDateNew = getFormat(new Date(hs + 7 * 24 * 60 * 60 * 1000))
    let week = getWeek(anchorPointDateNew)
    this.setState({
        startDate: week[0],
        endDate: week[1],
        anchorPointDate: anchorPointDateNew
    })
    this.getFaultStatistic(week[0], week[1])
}

//上一月 , 字符串类型的整数可以直接做减法
onClickMonthUp() {
    let yearUP = "";
    let monthUP = "";
    let arrUP = this.state.anchorPointMonth.split("-") //["2019","01"]

    if (arrUP[1].substring(0, 1) == "0") { // 1-9 月,前面的 0 不能参与运算
        if ((arrUP[1].substring(1, 2) - 1) == 0) { // 01 月 ，年份要减 1 月份 = 12
            yearUP = arrUP[0] - 1
            monthUP = "12"
        } else { // 02 - 09 月
            yearUP = arrUP[0]
            monthUP = "0" + (arrUP[1].substring(1, 2) - 1)
        }
    } else { //10 - 12月
        yearUP = arrUP[0]
        monthUP = arrUP[1] - 1
        if (monthUP == 9) {
            monthUP = "09"
        }
    }
    var tempUP = new Date(yearUP, monthUP, 0)
    this.setState({
        startDate: yearUP + "-" + monthUP + "-01",
        endDate: getFormat(tempUP),
        anchorPointMonth: yearUP + "-" + monthUP
    })
    this.getFaultStatistic(yearUP + "-" + monthUP + "-01", getFormat(tempUP))
}

//下一月, 字符串类型的整数不可以直接做加法
onClickMonthDown() {
    let yearDown = "";
    let monthDown = "";
    let arrDown = this.state.anchorPointMonth.split("-") //["2019","01"]

    //1-8 月 ,前面的 0 不能参与运算
    if (arrDown[1].substring(0, 1) == "0" && arrDown[1].substring(1, 2) < 9) {
        yearDown = arrDown[0]
        monthDown = "0" + (parseInt(arrDown[1].substring(1, 2)) + 1)
    }
    //10,11 月 
    if (arrDown[1].substring(0, 1) == "1" && arrDown[1].substring(1, 2) < 2) {
        yearDown = arrDown[0]
        monthDown = parseInt(arrDown[1].substring(0, 2)) + 1
    }
    // 09 月 变 10月
    if (arrDown[1] == "09") {
        yearDown = arrDown[0]
        monthDown = "10"
    }
    // 12 月 ,年份+1 , 月份变 "01"
    if (arrDown[1] == "12") {
        yearDown = parseInt(arrDown[0]) + 1
        monthDown = "01"
    }

    var tempDown = new Date(yearDown, monthDown, 0)
    this.setState({
        startDate: yearDown + "-" + monthDown + "-01",
        endDate: getFormat(tempDown),
        anchorPointMonth: yearDown + "-" + monthDown
    })
    this.getFaultStatistic(yearDown + "-" + monthDown + "-01", getFormat(tempDown))
}

//上一年
onClickYearUp() {
    let anchorPointYearUp = this.state.anchorPointYear - 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getFaultStatistic(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31")
}

//下一年
onClickYearDown() {
    let anchorPointYearUp = this.state.anchorPointYear + 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getFaultStatistic(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31")
}

//点击图表项弹窗
onClickChartItem(terminalName,value){
    getJSON(`${CONFIG.GETFAULTDETAILBYNAME}?startTime=${this.state.startDate}&endTime=${this.state.endDate}&terminalName=${terminalName}`).then(
      result => {
          if (result.Code == 200 && result.Msg == 'SUCCESS') {
              this.setState({
                ballData:result.Data,
                terminalName,
                value,
                modal: true,
              });            
          } else {
              Toast.info('服务器异常!!!', 3, null, false);
          }
      },
      error => {
          Toast.offline('网络错误 !!!', 3);
      },
  )
}

onClose () {
  this.setState({
    modal: false,
  });
}

//获取NDV播放异常统计
getFaultStatistic(startDate, endDate) {
  let that = this
    getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
        result => {
            if (result.Code == 200 && result.Msg == 'SUCCESS') {
                if(result.Data.ColumnList.ydata.length != 0){
                   
                  let columnList = result.Data.ColumnList;

                  //计算 异常终端数，终端播放异常总数

                  let faultTerminalNum = columnList.xdata.length;
                  let terminalPlayExpNum = sum(columnList.ydata);

                  //根据ydata的长度计算图形的高度，ydata.length=2 / ydata.length = 1 时 chartHeight = 100 ,大于2部分每加1 chartHeight 需加50
                  let chartHeight = 100;

                  if(columnList.ydata.length > 2 && columnList.ydata.length < 8){
                    chartHeight = columnList.ydata.length * 40
                  }else if(columnList.ydata.length > 7){
                    chartHeight = columnList.ydata.length * 25
                  }

                  let option = {
                    chart: {
                      height: chartHeight,
                      type: 'bar'
                    },
                    legend: {
                      enabled: false
                    },
                    title: {
                      text: null
                    },
                    credits: {
                      enabled: false
                    },
                    tooltip: {
                      enabled: false
                    },
                    plotOptions: {
                      series: {
                          color: '#FFA550',
                          dataLabels: {
                              enabled: true,
                              align: 'right',
                              color: '#FFFFFF',
                              x: 0
                          },
                          events: {
                            click: function (event) {
                                //alert(event.point.options.y)
                              that.onClickChartItem(event.point.category,event.point.options.y)
                            }
                        } 
                      }
                  },
                    xAxis: {
                      lineColor: '#B5B5B5',
                      lineWidth: 1,
                      tickLength: 0,
                      labels: {
                        style: {
                          color: '#108ee9'
                        }
                      },
                      categories: columnList.xdata,
                    },
                    yAxis: {
                      allowDecimals: false,
                      lineColor: '#B5B5B5',
                      lineWidth: 1,
                      gridLineColor: '#ffffff',
                      title: {
                        text: null
                      },
                      labels: {
                        style: {
                          color: '#108ee9'
                        }
                      },
                    },
                    series: [{
                      data: columnList.ydata,
                    }]
                  }
  
                  this.setState({
                      config: option,
                      faultTerminalNum,
                      terminalPlayExpNum
                  });

                }else{
                    this.setState({
                        config: {},
                        faultTerminalNum:0,
                        terminalPlayExpNum:0
                    });
                }

            } else {
                Toast.info('服务器异常!!!', 3, null, false);
            }
        },
        error => {
            Toast.offline('网络错误 !!!', 3);
        },
    )
}

render() {
    return  <div>
            {this.choiceDateComponent(this.state.type)}
            <Flex direction='row' style={{height:'70px',margin:'10px',borderRadius:'10px',backgroundColor:'#FAEBD7'}}>
                <Flex direction='column' justify='center' style={{ width: '50%' }}>
                <span style={{ paddingBottom: '10px'}}>异常终端数</span>
                <span>{this.state.faultTerminalNum}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '50%' }}>
                <span style={{ paddingBottom: '10px'}}>终端播放异常次数</span>
                <span>{this.state.terminalPlayExpNum}</span>
                </Flex>
            </Flex>
            <div style={{padding:'5px 5px 5px 10px',fontSize:'14px',color:'#4F4F4F'}}>点击图表项可查看具体场次</div>
            {
              JSON.stringify(this.state.config) != "{}" ? 
              <ReactHighcharts config = { this.state.config } />:
              null
            }
            
            <Modal
            visible={ this.state.modal }
            transparent
            title = {React.createElement('span',{className: 'title'}, "终端 "+this.state.terminalName+" 共 "+this.state.value+" 异常") }
            footer={[{ text: '关闭', onPress: () => { this.onClose() } }]}
          >
            <div style={{ height: 130, overflow: 'scroll' }}>
              { 
                this.state.ballData.map((item,index)=>{
                  return <div key={index}>{item.LogDate}</div>
                })
              }
            </div>
          </Modal>
        </div>
    }
}

export default BarDetail;