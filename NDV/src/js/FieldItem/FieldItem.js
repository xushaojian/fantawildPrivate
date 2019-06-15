import React from 'react';
import { List,Result,Flex} from 'antd-mobile';
import Salt_router from 'salt-router';
import { getFieldNum } from './../tool';

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
                return <div key={i}  className={ i ===0 ? "top":null } >
                            <Item
                            arrow="horizontal"
                            wrap
                            style={{borderBottom:'1px solid #d3d3d3'}}
                            onClick={() => {
                                let playIndex = getFieldNum(item.PlayIndex);
                                let id = 'fielddetails'+(new Date()).getTime();
                                Salt_router.push({
                                        id:id,
                                        url:`#/fielddetails/${id}`, 
                                        anim:1, 
                                        needPost:true, 
                                        param: {
                                            selectTime:selectTime,
                                            sceneName:item.SceneName,
                                            playIndex:playIndex
                                        }
                                }).then({

                                }).catch({

                                })
                            }}
                            >
                                <span style={{fontSize:'16px'}}> { item.PlayIndex } </span><br />
                                <span style={{fontSize:'14px'}}>场景：{item.SceneName} </span><br />
                                <Flex>
                                    <Flex.Item>
                                    终端数：{item.TerminalNum}
                                    </Flex.Item>
                                    <Flex.Item className={item.AlarmNum==0 ? 'field-normal' : 'exp'}>
                                    报警：{item.AlarmNum}
                                    </Flex.Item>
                                    <Flex.Item className={item.FaultNum==0 ? 'field-normal' : 'exp'}>
                                    报错：{item.FaultNum}
                                    </Flex.Item>
                                </Flex>
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