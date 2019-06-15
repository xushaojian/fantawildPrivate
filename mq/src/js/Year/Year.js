import React from 'react';
import { Icon , Flex ,Toast , WhiteSpace , List} from 'antd-mobile';
import Salt_router from 'salt-router';
import { getJSON } from "jquery"
import Pie from './../Pie/Pie'
import Bar from './../Bar/Bar'
import MyList from './../MyList/MyList'
import CONFIG from './../config'
import "./Year.css"

const Item = List.Item;

var screenHeight = window.screen.height;

var date = new Date()
var anchorPointYear = date.getFullYear();//锚点年份,初始化为今年

export default class Week extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        anchorPointYear:anchorPointYear,
        startDate:anchorPointYear+"-01-01",
        endDate:anchorPointYear+"-12-31",
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
        Toast.show();
        getJSON(`${CONFIG.GETFAULTSTATISTIC}?startTime=${startDate}&endTime=${endDate}`).then(
          result => {
              if(result.Code == 200 && result.Msg == 'SUCCESS'){

                this.setState({
                  totalData: result.Data,
                });

                this.refs.refSetPieConfig.setPieConfig(result.Data.BrandsList,result.Data.AllPerform,result.Data.AllFault,result.Data.FaultRate);
                this.refs.refSetBarConfig.setBarConfig(result.Data.ColumnList);
                this.refs.refSetMyListData.setMyListData(result.Data.FaultList);

                Toast.hide();
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

          <div className="chart-roll" style={{ height:screenHeight-50-50-40-60 }}>

              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
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
              >场次故障</Item>
              </List> 
              <Pie ref="refSetPieConfig" />
              
              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
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
                >球体故障</Item>
              </List>
              <Bar ref="refSetBarConfig"/>

              <WhiteSpace size='sm' style={{backgroundColor:"#E8E8E8"}}/>
              <List>
                <Item arrow="horizontal" extra={React.createElement('span',{className: 'text-color-able'},  "查看详情")}
                onClick={() => {
                        Salt_router.push({
                            id: 'mylistdetail'+(new Date()).getTime(),
                            url: `#/mylistdetail/${this.state.anchorPointYear}/year`,
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