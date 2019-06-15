import React from 'react';
import { List,WhiteSpace,Result } from 'antd-mobile';
import Salt_router from 'salt-router';
import { getField } from './../tool';

import './ExpField.css';

const Item = List.Item;
const Brief = Item.Brief;

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

// 状态栏 15px
// 双Tab  30+30
// 导航栏 50px
// 底部TabBar 50px
const divHeight = window.screen.height-35-35-62-50-50-15-6;

export default class ExpField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }

  render() {
    let myItem = '';
    if(this.props.FailureList != undefined && this.props.FailureList.length != 0){
        myItem = this.props.FailureList.map(function (item, i) {
            return (
                <div key={i}>
                    <Item
                    arrow="horizontal"
                    onClick={() => {
                        Salt_router.push({
                            id: 'expfieldmsg'+(new Date()).getTime(),
                            url: `#/expfieldmsg/${item.PerformNo}`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
                    }}
                    >
                        {getField(item.PerformNo)} <span style={{color:"#828282",fontSize:'15px',marginLeft:'10px'}}> {item.PerformTime} </span>
                        <Brief style={{color:'#363636',fontSize:'14px'}}>
                            曲线方案：{item.SchemeName} <br /> 
                            故障描述：{item.Remark}<br />
                            可能故障源：{item.FaultSource}
                        </Brief>
                    </Item>
                    <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
                </div> 
            );
        })
    }else if(this.props.FailureList != undefined && this.props.Field != undefined && this.props.Field != 0 &&this.props.FailureList.length == 0){
        return(
            <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title="无异常"
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
        return(
            null
        )
    }

    return (<div className="exp-field" style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
      <List className="my-list">
      <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
        { myItem }
      </List>
    </div>);
  }
}
