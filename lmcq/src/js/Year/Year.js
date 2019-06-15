import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import { getJSON } from "jquery"
import Line from './../Line/Line'
import Bar from './../Bar/Bar'
import CONFIG from './../../config'
import "./Year.css"

const Item = List.Item;

var date = new Date()
var anchorPointYear = date.getFullYear();//锚点年份,初始化为今年

var screenHeight = window.screen.height;

export default class Week extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        anchorPointYear:anchorPointYear,
        startDate:anchorPointYear+"-01-01",
        endDate:anchorPointYear+"-12-31",

        allPerform:0,//正常车次
        allFault:0,//故障车次
        faultRate:0,//故障率
        columnData:{},//柱状图数据-车次故障
        allNumdata:[],//曲线图数据-总运行圈数
        faultCodeCntdata:[],//曲线图数据-总运行时长
        faultRateCntdata:[],//曲线图数据-故障率
        xdata:[]//曲线图数据X轴-小车编号
      };
    }

    componentWillMount(){
      this.getFaultStatistic(this.state.startDate,this.state.endDate)
    }


    //上一年
    onClickYearUp(){
      let anchorPointYearUp = this.state.anchorPointYear-1;
      this.setState({
        startDate:anchorPointYearUp+"-01-01",
        endDate:anchorPointYearUp+"-12-31",
        anchorPointYear:anchorPointYearUp
      })
      this.getFaultStatistic(anchorPointYearUp+"-01-01",anchorPointYearUp+"-12-31")
    }

    //下一年
    onClickYearDown(){
      let anchorPointYearUp =  this.state.anchorPointYear+1;
      this.setState({
        startDate:anchorPointYearUp+"-01-01",
        endDate:anchorPointYearUp+"-12-31",
        anchorPointYear:anchorPointYearUp
      })

      this.getFaultStatistic(anchorPointYearUp+"-01-01",anchorPointYearUp+"-12-31")
    }

    //获取故障总统计
    getFaultStatistic(startDate,endDate){
        
        getJSON(`${CONFIG.GETFAULTCOLUMN}?startTime=${startDate}&endTime=${endDate}&type=年`).then(
          result => {
              if(result.Code == 200 && result.Msg == 'SUCCESS'){
                this.setState({
                  allPerform:result.Data.AllPerform,
                  allFault:result.Data.AllFault,
                  faultRate:result.Data.FaultRate,
                  columnData:result.Data.Column,
                  allNumdata:result.Data.AllNumdata,
                  faultCodeCntdata:result.Data.FaultCodeCntdata,
                  faultRateCntdata:result.Data.FaultRateCntdata,
                  xdata:result.Data.xdata
                });

                this.refs.refSetBarConfig.setBarConfig(result.Data.Column);
                this.refs.refSetCircleConfig.setLineConfig(result.Data.AllNumdata,result.Data.xdata,"总运行圈数");
                this.refs.refSetTimeConfig.setLineConfig(result.Data.FaultCodeCntdata,result.Data.xdata,"总运行时长");
                this.refs.refSetRateConfig.setLineConfig(result.Data.FaultRateCntdata,result.Data.xdata,"故障率");

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
            <Flex.Item style={{color:"#108EE9",textAlign:"left"}} onClick={() => this.onClickYearUp()} >
             <Icon size="md" type="left" style={{verticalAlign:"middle"}}/>
             <span style={{verticalAlign:"middle"}}>上一年</span>
            </Flex.Item>

            <Flex.Item align="center">{this.state.anchorPointYear}</Flex.Item>

            <Flex.Item style={{color:"#108EE9",textAlign:"right"}} onClick={() => this.onClickYearDown()}>
              <span style={{ verticalAlign:"middle" }}>下一年</span>
              <Icon size="md" type="right" style={{ verticalAlign:"middle" }}/>
            </Flex.Item>
          </Flex>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>

          <Flex direction='row' style={{ marginLeft:'10px',marginRight:'10px', borderRadius:'10px',paddingTop: '10px',paddingBottom: '10px' ,backgroundColor:'#FAEBD7' }}>
            <Flex direction='column' justify='center' style={{ width: '35%' }}>
              <span style={{ paddingBottom: '10px'}}>总运行车次</span>
              <span>{this.state.allPerform + this.state.allFault}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '35%' }}>
              <span style={{ paddingBottom: '10px'}}>总故障车次</span>
              <span>{this.state.allFault}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '30%' }}>
              <span style={{ paddingBottom: '10px'}}>故障率</span>
              <span>{this.state.faultRate+"%"}</span>
            </Flex>
          </Flex>


          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
          <Item >车次故障</Item>
          </List> 
          <Bar ref="refSetBarConfig"/>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
            <Item >总运行圈数</Item>
          </List>
          <Line ref="refSetCircleConfig"/>

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