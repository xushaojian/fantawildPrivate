import React from 'react';
import { List ,WhiteSpace,Result } from 'antd-mobile';
import './ExpBall.css';

const Item = List.Item;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const divHeight = window.screen.height-35-35-62-50-50-15-6;

export default class ExpField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }

  render() {
    let myItem = '';
    if(this.props.BallList != undefined && this.props.BallList.length != 0){
        myItem = this.props.BallList.map(function (item, i) {
            return (<div>
                <Item
                multipleLine
                onClick={() => {}}
                key={i}
                wrap
              >
                { item.PhyPositionNo }
                <br/><div style={{color:'#4F4F4F',fontSize:'15px'}}>{ item.Detailed }</div>
              </Item>
              <WhiteSpace size="xs" style={{ backgroundColor:'#f4f4f4' }}/>
              </div>           
            );
        })
    }else if(this.props.BallList != undefined && this.props.Field != undefined && this.props.Field != 0 && this.props.BallList.length == 0){
      return(
          <Result
              img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
              title="无故障"
              style={{marginTop:'100px'}}
          />
      )
    }else if(this.props.Field != undefined && this.props.Field == 0){
      return(
          <Result
              img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
              title="无数据"
              style={{marginTop:'100px'}}
          />
      )
    }else{
      return null;
    }

    return (<div className="exp-ball" style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
            <List renderHeader={() => '故障源(球)重复出现情况(尾数为当天场次)'} className="my-list">
                {myItem}   
            </List> 
            </div>);
  }
}
