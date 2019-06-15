import React from 'react';
import { Icon,Toast,WingBlank, WhiteSpace,Result } from 'antd-mobile';
import CONFIG from './../../config'
import * as dd from "dingtalk-jsapi"
import TweenOne from 'rc-tween-one';
import { getJSON } from 'jquery'
import './CircleDetails.css'

import imgC126 from './c126.png'

const PlaceHolder = ({ className = '', ...restProps }) => (
    <div className={`${className} placeholder`} {...restProps}>小车运行效果图示</div>
  );

export default class CircleDetails extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                Arrive_StartStation_Time1: '',
                Car_start_TimeStamp: '',
                ShowStartTime: '',
                ShowEndTime: '',
                Arrive_VirtualStation_Time: '',
                Arrive_PhisicalOffStation_Time: '',
                Arrive_StartStation_Time2: '',
                list: []
            };
        }

        componentWillMount() {
                dd.biz.navigation.setTitle({
                    title : '每圈详情',//控制标题文本，空字符串表示显示默认文本
                    onSuccess : function(result) {},
                    onFail : function(err) {}
                });

                dd.biz.navigation.setRight({
                  show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
                  control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
                  text: '',//控制显示文本，空字符串表示显示默认文本
                  onSuccess : function(result) {},
                  onFail : function(err) {}
              });
        }

        componentDidMount() {
            this.getGetSingeRunRecord(this.props.match.params.selectTime, this.props.match.params.carId, this.props.match.params.alarmNum, this.props.match.params.roundId);
        }

        //单场故障详情
        getGetSingeRunRecord(selectTime, carId, alarmNum, roundId) {
            getJSON(`${CONFIG.GETSINGERUNRECORD}?selectTime=${selectTime}&carId=${carId}&alarmNum=${alarmNum}&roundId=${roundId}`).then(
                result => {
                    if (result.Code == 200) {
                        this.setState({
                            Arrive_StartStation_Time1: result.Data.Arrive_StartStation_Time1,
                            Car_start_TimeStamp: result.Data.Car_start_TimeStamp,
                            ShowStartTime: result.Data.ShowStartTime,
                            ShowEndTime: result.Data.ShowEndTime,
                            Arrive_VirtualStation_Time: result.Data.Arrive_VirtualStation_Time,
                            Arrive_PhisicalOffStation_Time: result.Data.Arrive_PhisicalOffStation_Time,
                            Arrive_StartStation_Time2: result.Data.Arrive_StartStation_Time2,
                            list: result.Data.list
                        })
                    }
                },
                error => {
                    Toast.offline('网络错误 !!!', 2);
                },
            )
        }

        createItem(list){
            if(list != null && list.length != 0 ){
                return list.map(function(item,i){
                    return <div key={i} style={{marginTop:'15px'}}>
                                <div style={{fontSize:'14px',fontWeight:'bold',margin:'6px 15px'}}>{item.TimeStamp}</div>
                                <div className="item">部件：{item.Component}</div>
                                <div className="item">故障位置：{item.Position}</div>
                                <div className="item">告警描述：{item.AlarmDescription}</div>
                                <WhiteSpace size="xs" style={{backgroundColor:'#F8F8FF'}}/>
                            </div>
                })
            }else{
                return <Result
                            img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
                                title="无故障信息"
                                style={{marginTop:'20px'}}
                            />
            }
        }
  
    render() {
      return (
        <TweenOne animation={{ type:'from',opacity: 0,duration:700 }}><div>
        <img src={imgC126} width='100%'/>
        <WingBlank size="sm"><PlaceHolder /></WingBlank>
        <WhiteSpace size="xs" style={{backgroundColor:'#F8F8FF'}}/>
        <div>
            <div style={{fontSize:'16px',fontWeight:'bold',margin:'6px 15px'}}>运行信息</div>
            <div className="item">到发车点：{this.state.Arrive_StartStation_Time1}</div>
            <div className="item">小车启动：{this.state.Car_start_TimeStamp}</div>
            <div className="item">表演开始：{this.state.ShowStartTime}</div>
            <div className="item">表演结束：{this.state.ShowEndTime}</div>
            <div className="item">到达虚拟站点：{this.state.Arrive_VirtualStation_Time}</div>
            <div className="item">到达下车站点：{this.state.Arrive_PhisicalOffStation_Time}</div>
            <div className="item">重回发车站点：{this.state.Arrive_StartStation_Time2}</div>
        </div>
        <WhiteSpace size="xs" style={{backgroundColor:'#F8F8FF'}}/>
        <div style={{fontSize:'16px',fontWeight:'bold',margin:'6px 15px'}}>故障信息</div>
        {this.createItem(this.state.list)}

      </div></TweenOne>
      );
    }
  }