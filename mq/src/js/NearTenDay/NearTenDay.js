import React from 'react';
import { Flex,List , WhiteSpace ,Result} from 'antd-mobile';
import './NearTenDay.css'

const Item = List.Item;
const Brief = Item.Brief;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const divHeight = window.screen.height-30-50-50-15;

export default class NearTenDay extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }
  
    render() {
    let myItem = '';
    if(this.props.TenData != undefined && this.props.TenData.length != 0 ){
        myItem = this.props.TenData.map(function (item, i) {
            return (
                <div key={i}>
                    <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
                    <Item  onClick={() => {}}>
                    {item.Date} 
                    <Brief>
                    <Flex>
                    <Flex.Item>总场数 {item.Field}</Flex.Item>
                    <Flex.Item>故障场数 {item.Fault}</Flex.Item>
                    <Flex.Item>故障率 {item.FailureRate}</Flex.Item>
                    </Flex>
                    </Brief>
                    </Item>
                </div>
            );
        })
    }else if(this.props.TenData != undefined && this.props.TenData.length == 0){
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

      return (<div className="neartenday" style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
           {myItem}

            
      </div>
      );
    }
  }