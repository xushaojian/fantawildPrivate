import React from 'react'
import { Picker, List } from 'antd-mobile';
import {getJSON} from 'jquery'
import CONFIG from './../config'
class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: '所有城市',
      district: []
    };
  }

  componentDidMount() {
    this.getCity();
  }

  getCity(startTime = this.props.startTime, endTime = this.props.endTime) {
    let district = [];
    getJSON(CONFIG.GET_TRAVEL_ADDRESS + '?startTime=' + startTime + '&endTime=' + endTime).then(
      result => {
        for (let i = 0; i < result.Data.length; i++) {
          let tempObj = {
            value: 0,
            label: ''
          }
          tempObj.value = i;
          tempObj.label = result.Data[i];
          district.push(tempObj);
        }
        this.setState({
          district
        })
      },
      error => {
        this.setState({
          error: '请求出错了'
        })
      },
    )
  }

  render() {
    return (<div>
      <List style={{ backgroundColor: 'white' }} className="picker-list">
        <Picker data={this.state.district} 
        cols={1} 
        title="请选择城市"
        extra={this.state.selected}
        onOk={e => {
          this.setState({
            selected:this.state.district[e[0]].label
          })
          this.props.getCityName(this.state.district[e[0]].label);
        }}
        className="forss">
          <List.Item arrow="horizontal">城市</List.Item>
        </Picker>
      </List>
    </div>);
  }
}

export default Test