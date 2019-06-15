import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import { getJSON } from "jquery"
import Salt_router from 'salt-router';
import Pie from './../Pie/Pie'
import Bar from './../Bar/Bar'
import CONFIG from './../config'
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

        allPerform:0,//正常播放次数
        allFault:0,//异常播放次数
        faultRate:0,//异常率

        brandsList:{},//环形图数据
        columnList:{},//横向柱状图数据
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
        
      getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
        result => {
          if (result.Code == 200 && result.Msg == 'SUCCESS') {

            this.setState({
              allPerform: result.Data.AllPerform,
              allFault: result.Data.AllFault,
              faultRate: result.Data.FaultRate,

              brandsList: result.Data.BrandsList,
              columnList: result.Data.ColumnList,
            });

            this.refs.refSetPieConfig.setPieConfig(result.Data.BrandsList,result.Data.AllPerform,
              result.Data.AllPerform-result.Data.AllFault,result.Data.AllFault,result.Data.FaultRate);
            this.refs.refSetBarConfig.setBarConfig(result.Data.ColumnList);

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
          <List>
          <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
                onClick={() => {
                        Salt_router.push({
                            id: 'piedetail'+(new Date()).getTime(),
                            url: `#/piedetail/${this.state.anchorPointYear}/year`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
                >播放异常占比图</Item>
          </List> 
          <Pie ref="refSetPieConfig"/>

          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
          <List>
          <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
                onClick={() => {
                        Salt_router.push({
                            id: 'bardetail'+(new Date()).getTime(),
                            url: `#/bardetail/${this.state.anchorPointYear}/year`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
                >终端播放异常统计</Item>
          </List>
          <Bar ref="refSetBarConfig"/>

          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
          <WhiteSpace size='lg' style={{backgroundColor:"#F8F8FF"}}/>
        </div>
      );
    }
  }