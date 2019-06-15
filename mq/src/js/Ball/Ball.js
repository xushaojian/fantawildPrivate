import React from 'react';
import { WhiteSpace,DatePicker, List,Toast,Result ,Flex} from 'antd-mobile';
import Salt_router from 'salt-router';
import { getFormat,getField } from './../tool'
import { getJSON } from 'jquery'
import CONFIG from './../config'

import './Ball.css'

const Item = List.Item;
const Brief = Item.Brief;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

const divHeight = window.screen.height-160;

export default class Ball extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        date:new Date((new Date()).getTime()- 24 * 60 * 60 * 1000)
       
      };
    }

    componentDidMount(){
      let yesterday = getFormat(this.state.date)
      this.getBallList(yesterday);
  }

  changeDate(date){
    this.setState({
      date
    })
    let selectTime = getFormat(date)
    this.getBallList(selectTime);
  }

   //一天故障球体
   getBallList(selectTime) {
     Toast.loading('加载中...', 0)
     getJSON(`${CONFIG.GETALLBALLLIST}?selectTime=${selectTime}`).then(
       result => {
         console.log(JSON.stringify(result.Data))
         this.setState({
           allBallList: result.Data
         });
         Toast.hide();
       },
       error => {
         Toast.hide();
         Toast.offline('查询数据时出错了 !!!', 2);
       },
     )
   }

   createItem(){
     let date = this.state.date;
      let myItem = '';
      if( this.state.allBallList != undefined && this.state.allBallList.length != 0 ){
        return  myItem = this.state.allBallList.map(function (item, i) {
                  return (<div key={i}>
                          <Item  onClick={() => {
                            Salt_router.push({
                            id: 'balldetails'+(new Date()).getTime(),
                            url: `#/balldetails/${getFormat(date)}/${item.PhyPositionNo}`,
                            anim: 1,
                            needPost: false,
                            param: {}
                            }).then({

                            }).catch({

                            })

                          }}
                          arrow="horizontal">
                          魔球位置编号:{item.PhyPositionNo} 
                          {
                            item.List.map(function (subitem,x){
                              return (<Brief key={x}>
                                        <Flex>
                                        <Flex.Item style={{fontSize:'14px',color:'#4f4f4f',textAlign:'left'}}>{subitem.CurrentTime}</Flex.Item>
                                        <Flex.Item style={{fontSize:'14px',color:'#4f4f4f',textAlign:'right'}}>{getField(subitem.PerformNo)}</Flex.Item>
                                        <Flex.Item style={{fontSize:'14px',color:'#4f4f4f',textAlign:'center'}}>故障数 {subitem.FaultCodeCnt}</Flex.Item>
                                        </Flex>
                                      </Brief>
                                    )
                            })
                          }
                          </Item>
                          <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
                      </div>
                  );
          })
      }else if(this.state.allBallList != undefined &&this.state.allBallList.length == 0){
          return(
              <Result
                  img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                  title="没有数据"
                  style={{marginTop:'100px'}}
              />
          )
      }else{
          return null;
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
            {this.createItem()}
          </div>
      </div>
      );
    }
  }