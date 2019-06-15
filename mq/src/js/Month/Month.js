import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import Salt_router from 'salt-router';
import { getFormat , getCurrMonth } from './../tool'
import CONFIG from './../config'
import { getJSON } from "jquery"
import Pie from './../Pie/Pie'
import Bar from './../Bar/Bar'
import MyList from './../MyList/MyList'
import "./Month.css"

const Item = List.Item;

var screenHeight = window.screen.height;

var anchorPointMonth = getCurrMonth();//锚点月份,初始化当前月 "2019-01"
var arr = anchorPointMonth.split("-")
var temp = new Date(arr[0], arr[1], 0)
var monthFirstDay = anchorPointMonth+"-01";
var monthLastDay = getFormat(temp);

export default class Week extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        anchorPointMonth:anchorPointMonth,
        startDate:monthFirstDay,
        endDate:monthLastDay
      };
    }

    componentWillMount(){
      this.getFaultStatistic(this.state.startDate,this.state.endDate)
    }

    //上一月 , 字符串类型的整数可以直接做减法
    onClickMonthUp(){
      let yearUP = "" ;
      let monthUP = "" ;
      let arrUP = this.state.anchorPointMonth.split("-")//["2019","01"]

      if(arrUP[1].substring(0,1) == "0"){ // 1-9 月,前面的 0 不能参与运算
        if((arrUP[1].substring(1,2) - 1 ) == 0 ){// 01 月 ，年份要减 1 月份 = 12
          yearUP = arrUP[0]-1
          monthUP = "12"
        }else{ // 02 - 09 月
          yearUP = arrUP[0]
          monthUP = "0"+ (arrUP[1].substring(1,2) - 1)
        }
      }else{ //10 - 12月
        yearUP = arrUP[0]
        monthUP = arrUP[1] - 1
        if(monthUP == 9){
          monthUP = "09"
        }
      }
      var tempUP = new Date(yearUP, monthUP, 0)
      this.setState({
        startDate:yearUP + "-" + monthUP + "-01",
        endDate:getFormat(tempUP),
        anchorPointMonth:yearUP+"-"+monthUP
      })
      this.getFaultStatistic(yearUP + "-" + monthUP + "-01",getFormat(tempUP))
    }

    //下一月, 字符串类型的整数不可以直接做加法
    onClickMonthDown(){
      let yearDown = "" ;
      let monthDown = "" ;
      let arrDown = this.state.anchorPointMonth.split("-")//["2019","01"]

      //1-8 月 ,前面的 0 不能参与运算
      if(arrDown[1].substring(0,1) == "0" && arrDown[1].substring(1,2) < 9 ){
        yearDown = arrDown[0]
        monthDown = "0"+ (parseInt( arrDown[1].substring(1,2) ) + 1 )
      }
      //10,11 月 
      if(arrDown[1].substring(0,1) == "1" && arrDown[1].substring(1,2) < 2 ){
        yearDown = arrDown[0]
        monthDown =parseInt(arrDown[1].substring(0,2)) + 1
      }
      // 09 月 变 10月
      if(arrDown[1] == "09"){ 
        yearDown = arrDown[0]
        monthDown = "10"
      }
      // 12 月 ,年份+1 , 月份变 "01"
      if(arrDown[1] == "12"){ 
        yearDown = parseInt(arrDown[0])+1
        monthDown = "01"
      }

      var tempDown = new Date(yearDown, monthDown, 0)
      this.setState({
        startDate:yearDown + "-" + monthDown + "-01",
        endDate:getFormat(tempDown),
        anchorPointMonth:yearDown+"-"+monthDown
      })
      this.getFaultStatistic(yearDown + "-" + monthDown + "-01",getFormat(tempDown))
    }

    //获取故障总统计
    getFaultStatistic(startDate,endDate){
        getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
          result => {
              if(result.Code == 200 && result.Msg == 'SUCCESS'){
                this.refs.refSetPieConfig.setPieConfig(result.Data.BrandsList,result.Data.AllPerform,result.Data.AllFault,result.Data.FaultRate);
                this.refs.refSetBarConfig.setBarConfig(result.Data.ColumnList);
                this.refs.refSetMyListData.setMyListData(result.Data.FaultList);
              }else{
                Toast.info('服务器异常!!!', 3, null, false);
              }  
          },
          error => {
              Toast.offline('网络错误 !!!', 3);
          },
      )
    }

    render() {
      return (
        <div>
          <Flex style={{height:"40px"}}>

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

          <div className="chart-roll" style={{ height:screenHeight-50-50-40-60 }}>

              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
              <List>
              <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
              onClick={() => {
                        Salt_router.push({
                            id: 'piedetail'+(new Date()).getTime(),
                            url: `#/piedetail/${this.state.anchorPointMonth}/month`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
              >场次故障</Item>
              </List> 
              <Pie ref="refSetPieConfig" />
              
              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
              <List>
                <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
                onClick={() => {
                        Salt_router.push({
                            id: 'bardetail'+(new Date()).getTime(),
                            url: `#/bardetail/${this.state.anchorPointMonth}/month`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
                >球体故障</Item>
              </List>
              <Bar ref="refSetBarConfig"/>

              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
              <List>
                <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
                onClick={() => {
                        Salt_router.push({
                            id: 'mylistdetail'+(new Date()).getTime(),
                            url: `#/mylistdetail/${this.state.anchorPointMonth}/month`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
                >高频故障代码</Item>
              </List>
              <MyList ref="refSetMyListData"/>

            </div>

        </div>
      );
    }
  }