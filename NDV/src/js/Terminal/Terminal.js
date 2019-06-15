import React from 'react';
import { WhiteSpace,DatePicker, List,Toast,Result ,Flex} from 'antd-mobile';
import Salt_router from 'salt-router';
import { getFormat } from '../tool'
import { getJSON } from 'jquery'
import CONFIG from '../config'

import './Terminal.css'

const Item = List.Item;
const Brief = Item.Brief;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

const divHeight = window.screen.height-160;

export default class Terminal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        date:new Date((new Date()).getTime()- 24 * 60 * 60 * 1000),
        terminalList:[]
      };
    }

    componentDidMount(){
      let yesterday = getFormat(this.state.date)
      this.getTerminalList(yesterday);
  }

  changeDate(date){
    this.setState({
      date
    })
    let selectTime = getFormat(date)
    this.getTerminalList(selectTime);
  }

   //一天故障球体
   getTerminalList(selectTime) {
     getJSON(`${CONFIG.GETLOGCOUNTLIST}?selectTime=${selectTime}`).then(
       result => {
         if(result.Code === 200 && result.Msg ==='SUCCESS'){
            this.setState({
              terminalList: result.Data
            });
         }else{
            Toast.offline('服务异常!', 2);
         }
         
       },
       error => {
         alert(JSON.stringify(error))
         Toast.hide();
         Toast.offline('查询数据时出错了 !!!', 2);
       },
     )
   }

   createItem(){
     let date = this.state.date;
      let myItem = '';
      if( this.state.terminalList != undefined && this.state.terminalList.length != 0 ){
        return  myItem = this.state.terminalList.map(function (item, i) {
                  return (<div key={i}>
                          <Item  onClick={() => {
                            let frameid = 'terminaldetails'+(new Date()).getTime();
                            Salt_router.push({
                            id: frameid,
                            url: `#/terminaldetails/${frameid}`,
                            anim: 1,
                            needPost: true,
                            param: {
                              selectTime:getFormat(date),
                              baseMsg:item
                            }
                            }).then({

                            }).catch({

                            })
                          }}
                          arrow="horizontal">
                          <div style={{marginBottom:'4px'}}>场景名称:{item.SceneName} </div>
                          <div style={{marginBottom:'4px'}}>终端名称：{item.TerminalName} </div>
                          <Brief>
                            <Flex>
                            <Flex.Item className={item.PlayUnusualCount != 0 ? "error" : "normal"}>播放异常：{item.PlayUnusualCount}</Flex.Item>
                            <Flex.Item className={item.FaultCount != 0 ? "error" : "normal"}>报错数量:{item.FaultCount}</Flex.Item>
                            <Flex.Item className={item.AlarmCount != 0 ? "error" : "normal"}>报警数量: {item.AlarmCount}</Flex.Item>
                            </Flex>
                          </Brief>
                          </Item>
                          <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
                      </div>
                  );
          })
      }else{
          return(
              <Result
                  img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                  title="没有数据"
                  style={{marginTop:'100px'}}
              />
          )
      }
   }

    render() {
      return (
        <div>
          <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
            <DatePicker
              mode="date"
              title="选择日期"
              extra="Optional"
              value={this.state.date}
              onChange={date => this.changeDate(date)} 
            >
              <List.Item arrow="horizontal">日期</List.Item>
            </DatePicker>
          </List>
          <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
          <div className='div-item' style={{height:divHeight}}>
            { this.createItem() }
          </div>
      </div>
      );
    }
  }