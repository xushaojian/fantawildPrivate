import React, { Component } from 'react';
import { List , Result } from "antd-mobile"
import './MyList.css'

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const Item = List.Item;

class MyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    }
  }

  setMyListData(faultList){
    this.setState({
      data:faultList
    })
  }

  render() {

    return <div>
      {
        this.state.data.length != 0 ? 
        <List >
        {

          this.state.data.map((item,index)=>{
            return  <Item wrap extra={React.createElement('span',{className: 'text-color'}, item.Count + "次")} align="top" key={index}>
                      故障代码:{item.FaultCode} <br/><div style={{color:'#4F4F4F',fontSize:'14px',width:(window.screen.width-90)+"px"}}>故障解释：{item.FaultTranslation}</div>
                    </Item>
          })
        }
      </List>:
      <Result
        img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
        title="无数据"
      />
      }

    </div>
    
    
    
  }
}

export default MyList;