import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import { getFormat ,getCurrMonth } from './../tool'
import { getJSON } from "jquery"
import Line from './../Line/Line'
import Bar from './../Bar/Bar'
import CONFIG from './../config'
import "./Month.css"

const Item = List.Item;

var anchorPointMonth = getCurrMonth();//锚点月份,初始化当前月 "2019-01"
var arr = anchorPointMonth.split("-")
var temp = new Date(arr[0], arr[1], 0)
var monthFirstDay = anchorPointMonth+"-01";
var monthLastDay = getFormat(temp);

var screenHeight = window.screen.height;

export default class Week extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        anchorPointMonth:anchorPointMonth,
        startDate:monthFirstDay,
        endDate:monthLastDay,

        allPerform:0,//正常车次
        allFault:0,//故障车次
        faultRate:0,//总故障

        columnData:{},//柱状图数据-车次故障
        timeStatistic:[],//曲线图数据-总运行时长
        faultStatistic:[],//曲线图数据-故障率
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
        getJSON(`${CONFIG.GETFAULTCOLUMN}?startTime=${startDate}&endTime=${endDate}&type=月`).then(
          result => {
              if(result.Code == 200 && result.Msg == 'SUCCESS'){

                this.setState({
                  allPerform:result.Data.AllPerform,
                  allFault:result.Data.AllFault,
                  faultRate:result.Data.FaultRate,
  
                  columnData:result.Data.Column,
                  timeStatistic:result.Data.TimeStatistic,
                  faultStatistic:result.Data.FaultStatistic,
                });
  
                this.refs.refSetBarConfig.setBarConfig(result.Data.Column);
                this.refs.refSetTimeConfig.setLineConfig(result.Data.TimeStatistic,"总运行时长");
                this.refs.refSetRateConfig.setLineConfig(result.Data.FaultStatistic,"故障率");

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
        <div className="chart-roll" style={{ height:screenHeight-50-50, backgroundColor:"#F8F8FF"}}>
          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>

          <Flex style={{marginLeft:'10px',marginRight:'10px', borderRadius:'10px',height:"40px" ,backgroundColor:'#FAEBD7'}}>
            <Flex.Item style={{color:"#108EE9",textAlign:"left"}} onClick={() => this.onClickMonthUp()} >
             <Icon size="md" type="left" style={{verticalAlign:"middle"}}/>
             <span style={{verticalAlign:"middle"}}>上一月</span>
            </Flex.Item>

            <Flex.Item align="center">{this.state.anchorPointMonth}</Flex.Item>

            <Flex.Item style={{color:"#108EE9",textAlign:"right"}} onClick={() => this.onClickMonthDown()}>
              <span style={{ verticalAlign:"middle" }}>下一月</span>
              <Icon size="md" type="right" style={{ verticalAlign:"middle" }}/>
            </Flex.Item>
          </Flex>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>

          <Flex direction='row' style={{ marginLeft:'10px',marginRight:'10px', borderRadius:'10px',paddingTop: '10px',paddingBottom: '10px' ,backgroundColor:'#FAEBD7' }}>
            <Flex direction='column' justify='center' style={{ width: '35%' }}>
              <span style={{ paddingBottom: '10px'}}>总运行场次</span>
              <span>{this.state.allPerform + this.state.allFault}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '35%' }}>
              <span style={{ paddingBottom: '10px'}}>总故障场次</span>
              <span>{this.state.allFault}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '30%' }}>
              <span style={{ paddingBottom: '10px'}}>故障率</span>
              <span>{this.state.faultRate+"%"}</span>
            </Flex>
          </Flex>


          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
          <Item >场次故障</Item>
          </List> 
          <Bar ref="refSetBarConfig"/>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
            <Item >总运行时长</Item>
          </List>
          <Line ref="refSetTimeConfig"/>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
          <Item >故障率</Item>
          </List> 
          <Line ref="refSetRateConfig"/>

          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
        </div>
      );
    }
  }