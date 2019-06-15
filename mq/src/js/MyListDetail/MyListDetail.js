import React, { Component } from 'react';
import { Icon , Flex ,Toast , List ,Result } from 'antd-mobile';
import { getJSON } from "jquery"
import * as dd from "dingtalk-jsapi"
import { getWeek , getFormat , getDateSegment ,sum } from './../tool'
import CONFIG from './../config'

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const Item = List.Item;

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
      faultList:[]
    }
}

componentDidMount() {
    dd.biz.navigation.setTitle({
        title: '高频故障代码', 
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
            this.getData(arr[0], arr[1], "周")
            break;
        case 'month':
            arr = getDateSegment(this.state.anchorPointDate, "month");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getData(arr[0], arr[1], "月")
            break;
        case 'year':
            arr = getDateSegment(this.state.anchorPointDate, "year");
            this.setState({
                startDate: arr[0],
                endDate: arr[1]
            })
            this.getData(arr[0], arr[1], "年")
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

createList(){
  return <div>
  {
    this.state.faultList.length != 0 ? 
    <List >
    {
      this.state.faultList.map((item,index)=>{
        return  <Item wrap extra={React.createElement('span',{className: 'text-color'}, item.Count + "次")} align="top" key={index}>
                  故障代码:{item.FaultCode} <br/><div style={{color:'#4F4F4F',fontSize:'14px',width:(window.screen.width-90)+"px"}}>故障解释：{item.FaultTranslation}</div>
                </Item>
      })
    }
  </List>:
  <Result
    img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
    title="无数据"
  />
  }
</div>
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
    this.getData(week[0], week[1], "周")
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
    this.getData(week[0], week[1], "周")
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
    this.getData(yearUP + "-" + monthUP + "-01", getFormat(tempUP), "月")
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
    this.getData(yearDown + "-" + monthDown + "-01", getFormat(tempDown), "月")
}

//上一年
onClickYearUp() {
    let anchorPointYearUp =parseInt( this.state.anchorPointYear ) - 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getData(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31", "年")
}

//下一年
onClickYearDown() {
    let anchorPointYearUp =parseInt( this.state.anchorPointYear )+ 1;
    this.setState({
        startDate: anchorPointYearUp + "-01-01",
        endDate: anchorPointYearUp + "-12-31",
        anchorPointYear: anchorPointYearUp
    })
    this.getData(anchorPointYearUp + "-01-01", anchorPointYearUp + "-12-31", "年")
}

//获取场次故障统计
getData(startDate, endDate, type) {
    getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
        result => {
            if (result.Code == 200 && result.Msg == 'SUCCESS') {
                this.setState({
                    faultList:result.Data.FaultList 
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
            { this.choiceDateComponent(this.state.type) }
            { this.createList() }
        </div>
    }
}

export default PieDetail;