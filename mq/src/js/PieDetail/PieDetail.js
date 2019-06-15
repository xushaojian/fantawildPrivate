import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import { Icon , Flex ,Toast , List } from 'antd-mobile';
import { getJSON } from "jquery"
import * as dd from "dingtalk-jsapi"
import { getWeek , getFormat , getDateSegment ,sum } from './../tool'
import CONFIG from './../config'

class PieDetail extends Component {
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
      field:0,
      fault:0,
      normal:0,
      failureRate:0
    }
}

componentDidMount() {
    dd.biz.navigation.setTitle({
        title: '场次故障统计', 
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
            this.getGetFaultColumn(arr[0], arr[1], "周")
            break;
        case 'month':
            arr = getDateSegment(this.state.anchorPointDate, "month");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getGetFaultColumn(arr[0], arr[1], "月")
            break;
        case 'year':
            arr = getDateSegment(this.state.anchorPointDate, "year");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getGetFaultColumn(arr[0], arr[1], "年")
            break;
    }
}

//根据传入的参数判断应该使用那种日期控件
choiceDateComponent(type){    
    if(type == "week"){
    return <Flex style={{height:"40px"}}>
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
    return <Flex style={{height:"40px"}}>
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
    return <Flex style={{height:"40px"}}>
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
    this.getGetFaultColumn(week[0], week[1], "周")
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
    this.getGetFaultColumn(week[0], week[1], "周")
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
    this.getGetFaultColumn(yearUP + "-" + monthUP + "-01", getFormat(tempUP), "月")
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
    this.getGetFaultColumn(yearDown + "-" + monthDown + "-01", getFormat(tempDown), "月")
}

//上一年
onClickYearUp() {
    let anchorPointYearUp =parseInt( this.state.anchorPointYear )- 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getGetFaultColumn(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31", "年")
}

//下一年
onClickYearDown() {
    let anchorPointYearUp =parseInt( this.state.anchorPointYear ) + 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getGetFaultColumn(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31", "年")
}

//获取场次故障统计
getGetFaultColumn(startDate, endDate, type) {
    getJSON(`${CONFIG.GETFAULTCOLUMN}?startTime=${startDate}&endTime=${endDate}&type=${type}`).then(
        result => {
            if (result.Code == 200 && result.Msg == 'SUCCESS') {

                //计算总运行场次，总故障场次，故障率
                let fault = sum(result.Data.yfaultdata);
                let normal = sum(result.Data.ynormaldata);
                let field = fault + normal;
                let failureRate;
                if (field != 0) {
                    failureRate = Number(fault / field * 100).toFixed(1) + "%";
                } else {
                    failureRate = 0
                }

                let option = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: result.Data.xdata
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: null
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                '总场次: ' + this.point.stackTotal;
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: [{
                        name: '正常场次',
                        data: result.Data.ynormaldata,
                        stack: 'male' // stack 值相同的为同一组
                    }, {
                        name: '异常场次',
                        data: result.Data.yfaultdata,
                        stack: 'male'
                    }]
                }
                this.setState({
                    config: option,
                    fault,
                    normal,
                    field,
                    failureRate
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

render() {
    return  <div>
            {this.choiceDateComponent(this.state.type)}
            <Flex direction='row' style={{ paddingTop: '10px',paddingBottom: '10px' ,backgroundColor:'#F8F8FF' }}>
                <Flex direction='column' justify='center' style={{ width: '25%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>总运行场次</span>
                <span>{this.state.field}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '25%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>总正常场次</span>
                <span>{this.state.normal}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '25%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>总故障场次</span>
                <span>{this.state.fault}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '25%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>故障率</span>
                <span>{this.state.failureRate}</span>
                </Flex>
            </Flex>
            <ReactHighcharts config = { this.state.config } />
        </div>
    }
}

export default PieDetail;