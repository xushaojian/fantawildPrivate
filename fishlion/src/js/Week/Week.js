import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import { getWeek , getFormat } from './../tool'
import { getJSON } from "jquery"
import Line from './../Line/Line'
import Bar from './../Bar/Bar'
import CONFIG from './../config'
import "./Week.css"

const Item = List.Item;

var anchorPointDate = getFormat(new Date());//锚点日期,初始化为今天
var week = getWeek(anchorPointDate);//返回周起始日期数组：["2018-12-10","2018-12-16"]

var screenHeight = window.screen.height;

export default class Week extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        anchorPointDate:anchorPointDate,
        startDate:week[0],
        endDate:week[1],

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


    //上一周
    onClickWeekUp(){
      //获取锚点日期对应上一周的日期
      let hs = new Date(this.state.anchorPointDate).getTime()
      let anchorPointDateNew = getFormat(new Date(hs-7*24*60*60*1000))
      let week = getWeek(anchorPointDateNew)
      this.setState({
        startDate:week[0],
        endDate:week[1],
        anchorPointDate:anchorPointDateNew
      })

      this.getFaultStatistic(week[0],week[1])
    }

    //下一周
    onClickWeekDown(){
      //获取锚点日期对应上一周的日期
      let hs = new Date(this.state.anchorPointDate).getTime()
      let anchorPointDateNew = getFormat(new Date(hs+7*24*60*60*1000))
      let week = getWeek(anchorPointDateNew)
      this.setState({
        startDate:week[0],
        endDate:week[1],
        anchorPointDate:anchorPointDateNew
      })

      this.getFaultStatistic(week[0],week[1])
    }

    //获取故障总统计
    getFaultStatistic(startDate,endDate){

      // Toast.loading('Loading...');

      getJSON(`${CONFIG.GETFAULTCOLUMN}?startTime=${startDate}&endTime=${endDate}&type=周`).then(
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

              // Toast.hide();
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