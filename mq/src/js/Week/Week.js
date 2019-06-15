import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import { getWeek , getFormat } from './../tool'
import { getJSON } from "jquery"
import Salt_router from 'salt-router';
import Pie from './../Pie/Pie'
import Bar from './../Bar/Bar'
import MyList from './../MyList/MyList'
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
        totalData:{},
        brandsList:[],
        columnListYdata:[],
        faultList:[]
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
        getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
          result => {
              if(result.Code == 200 && result.Msg == 'SUCCESS'){

                this.setState({
                  totalData: result.Data,
                  brandsList:result.Data.BrandsList,
                  columnListYdata:result.Data.ColumnList.ydata,
                  faultList:result.Data.FaultList
                });

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

           <div className="chart-roll" style={{ height:screenHeight-50-50-40-60 }}>

              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
              <List>
              <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")} 
                onClick={() => {
                        Salt_router.push({
                            id: 'piedetail'+(new Date()).getTime(),
                            url: `#/piedetail/${this.state.anchorPointDate}/week`,
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
                            url: `#/bardetail/${this.state.anchorPointDate}/week`,
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
                            url: `#/mylistdetail/${this.state.anchorPointDate}/week`,
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