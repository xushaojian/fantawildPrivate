import React from 'react';
import { Flex , SegmentedControl,Toast,DatePicker } from 'antd-mobile';
import { getJSON } from 'jquery'
import Animate from 'rc-animate';

import FieldItem from './../FieldItem/FieldItem'
import CONFIG from './../config'
import { getFormat } from './../tool'

import './../../css/iconfont.css'
import './Field.css'

const divHeight = window.screen.height-63-50;

export default class Field extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        date:new Date((new Date()).getTime()- 24 * 60 * 60 * 1000),

        totalField:0,//总共运行
        faultField:0,//故障场次
        failureRate:'0.0%',//故障率

        totalList:[],
        faultList:[],
        itemData:[]
      };
    }

    componentDidMount(){
        let selectTime = getFormat(this.state.date)
        this.getFieldData(selectTime);
    }

    changeDate(date){
        this.setState({
          date
        })
        let selectTime = getFormat(date)
        this.getFieldData(selectTime);
      }

    getFieldData(selectTime){ 
        Toast.loading('loading...',0)

        getJSON(`${CONFIG.GETLOGINFOBYPLAY}?selectTime=${selectTime}`).then(
            result => {
               
               if(result.Code === 200 && result.Msg === "SUCCESS"){
                    this.setState({
                        totalField:result.Data.TotalField,//总共运行
                        faultField:result.Data.FaultField,//故障场次
                        failureRate:result.Data.FailureRate,//故障率

                        totalList:result.Data.TotalList,
                        faultList:result.Data.FaultList,
                        itemData:result.Data.FaultList
                    })
                    Toast.hide();
               }else{
                Toast.hide() ; 
                Toast.offline(result.Msg, 2);  
               }
    
            },
            error => {
                Toast.hide() ; 
                Toast.offline('网络错误 !!!', 2);  
            },
        )
        
    }

    onChange = (e) => {
        if(e.nativeEvent.selectedSegmentIndex == 0){
            this.setState({
                itemData:this.state.faultList
            })
        }else{
            this.setState({
                itemData:this.state.totalList
            })
        } 
    }
  
    render() {

      return (
        <Animate transitionName="fade" transitionAppear>
        <div style={{height:divHeight}} className="field">
            <div style={{backgroundColor:'#F8F8FF'}}>

                <Flex direction='row' style={{ paddingTop: '10px',paddingBottom: '10px' ,backgroundColor:'#F8F8FF' }}>
                <Flex direction='column' justify='center' style={{ width: '20%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>总共运行</span>
                <span>{this.state.totalField}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '20%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>故障场次</span>
                <span>{this.state.faultField}</span>
                </Flex>
                <Flex direction='column' justify='center' style={{ width: '20%' }}>
                <span style={{ paddingBottom: '10px',color:'#828282'}}>故障率</span>
                <span>{this.state.failureRate}</span>
                </Flex>
                <div style={{width:'40%',alignItems:'center'}}>
                <DatePicker
                    mode="date"
                    title="选择日期"
                    value={this.state.date}
                    onChange={date => this.changeDate(date)} 
                >
                    <Flex direction='column' justify='center' style={{color:'#108EE9'}}>
                        <span style={{ paddingBottom: '10px',color:'#108EE9'}}>日期<span className="iconfont icon-rili" style={{marginLeft:'5px',fontSize:'15px',color:'#108EE9'}}></span></span>
                        <span>{ getFormat(this.state.date) }</span> 
                    </Flex>
                </DatePicker>
                </div> 
            </Flex>

          </div>

          <SegmentedControl 
            values={['故障场次', '所有场次']} 
            style={{margin:'5px 70px 5px 70px'}}
            onChange={this.onChange}
            />

           <div className="field" >
               <FieldItem itemData = {this.state.itemData} selectTime={getFormat(this.state.date)}/>
           </div>
       

        </div>
        </Animate>
      );
    }
  }