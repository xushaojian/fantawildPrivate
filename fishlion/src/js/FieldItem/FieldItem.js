import React from 'react';
import { List,Result} from 'antd-mobile';
import Salt_router from 'salt-router';

import './FieldItem.css'

const Item = List.Item;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

export default class FieldItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }

    render() {    
        const selectTime = this.props.selectTime;    
        if(this.props.itemData.length != 0 ){
            return this.props.itemData.map(function (item, i) {
                return <div key={i} >
                            <Item
                            arrow="horizontal"
                            wrap
                            style={{borderBottom:'1px solid #d3d3d3'}}
                            onClick={() => {
                                Salt_router.push({
                                        id:'fielddetails'+(new Date()).getTime(),
                                        url:`#/fielddetails/${selectTime}/${item.Field}`, 
                                        anim:1, 
                                        needPost:false, 
                                        param: {}
                                }).then({

                                }).catch({

                                })
                            }}
                            >
                                <span style={{fontSize:'14px'}}> 第{ item.Field }场 </span>
                                <span style={{color:"#4F4F4F",fontSize:'14px',marginLeft:'10px'}}> {item.TimeInterval} </span><br />
                                <span style={{fontSize:'14px'}}>运行时长：{item.TimeLength} </span><br />
                                <span className={item.FaultNum==0 ? 'normal' : 'exp'}> 故 障 数 ：{item.FaultNum} </span><br />
                                运行舱体：{item.CarNum}
                            </Item>  
                        </div> 
            })  
        }else{
            return <Result
                    img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                    title="没有数据"
                    />
        }
        
        
        
  }
}