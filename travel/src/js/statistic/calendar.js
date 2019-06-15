import React,{Component} from 'react';
import { List, Calendar} from 'antd-mobile';
import { getFormat } from './../tool';
import './../../css/statistic.css'

const now = new Date();
export default class MyCalendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      config: {
        showShortcut: true
      },
    };
  }

  onConfirm = (startTime, endTime) => {
    this.setState({
        show: false,
      });
    let ssdate= getFormat(new Date(startTime)); 
    let eedate=getFormat(new Date(endTime));   
    this.props.getDate(ssdate,eedate);
  }

  onCancel = () => {
    this.setState({
      show: false,
    });
  }

  handleClick(){
    this.setState({
        show: true,
      });
  }

  render() {
    return (
      <div >
        <List.Item arrow="horizontal" onClick={this.handleClick.bind(this)} style={{color:'#000'}}>
        {(this.props.startTime!=this.props.endTime)?(this.props.startTime+' ~ '+this.props.endTime):this.props.startTime}
        </List.Item>
        <Calendar
          {...this.state.config}
          visible={this.state.show}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          defaultValue={[new Date(this.props.startTime),new Date(this.props.endTime)]}
          maxDate={new Date(+now)}
          enterDirection={"horizontal"}
          infiniteOpt={true}
        />
      </div>
    );
  }
}

