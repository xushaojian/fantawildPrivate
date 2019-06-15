import React from 'react';
import { Flex,Tabs, Badge ,DatePicker,Toast,Result } from 'antd-mobile';
import SubTab from './../SubTab/SubTab';
import NearTenDay from './../NearTenDay/NearTenDay';
import TweenOne from 'rc-tween-one';
import CONFIG from './../config'
import { getFormat } from './../tool'
import { getJSON } from 'jquery'
import './../../css/iconfont.css';
import './MainTab.css'

const tabs = [
  { title: <Badge >总体运行情况</Badge> },
  { title: <Badge >近10天运行情况</Badge> }
];

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

export default class MainTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        date:new Date((new Date()).getTime()- 24 * 60 * 60 * 1000),
        Field:0,
        Fault:0,
        FailureRate:'0.0%',
        TotalData:{},
        TenData:[],
        Code:200,
        errMsg:''
      };
    }

    componentDidMount(){
      let yesterday = getFormat(this.state.date)
      this.getTotalityAnalysis(yesterday);
      this.getTenAnalysisList(yesterday); 
  }
  
  getTotalityAnalysis(selectTime) {
          Toast.loading('加载中...',0)
          getJSON(`${CONFIG.TOTALITYANALYSIS}?selectTime=${selectTime}`).then(
              result => {
                  if(result.Code == 200){
                    this.setState({
                      Field:result.Data.Field,
                      Fault:result.Data.Fault,
                      FailureRate:result.Data.FailureRate,
                      TotalData: result.Data,
                      Code:result.Code
                    });
                    Toast.hide() ; 
                  }else{
                    this.setState({
                      Field:0,
                      Fault:0,
                      FailureRate:'0.0%',
                      TotalData:{},
                      Code:result.Code,
                      errMsg:'远程服务错误'
                    });
                    Toast.hide() ; 
                  }  
              },
              error => {
                  Toast.hide() ;
                  this.setState({
                    Code:.999,
                    errMsg:'网络错误'
                  }) 
              },
          )
  }

  getTenAnalysisList(selectTime) {
    getJSON(`${CONFIG.TENANALYSISLIST}?selectTime=${selectTime}`).then(
        result => {
            this.setState({
              TenData: result.Data
            });
        },
        error => {
            Toast.offline('网络错误 !', 2);  
        },
    )
  }
changeDate(date) {
  this.setState({
    date
  })
  let selectTime = getFormat(date)
  this.getTotalityAnalysis(selectTime);
  this.getTenAnalysisList(selectTime);
}
  
    render() {
      return (
        <TweenOne animation={{ type:'from',opacity: 0,duration:700 }}>
        <Tabs tabs={tabs}
          initialPage={0}
        >
          <div style={{ backgroundColor: '#fff' }}>
          <Flex direction='row' style={{ paddingTop: '10px',paddingBottom: '10px' ,backgroundColor:'#F8F8FF' }}>
            <Flex direction='column' justify='center' style={{ width: '24%' }}>
              <span style={{ paddingBottom: '10px',color:'#828282'}}>总共运行</span>
              <span>{this.state.Field}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '23%' }}>
              <span style={{ paddingBottom: '10px',color:'#828282'}}>故障场次</span>
              <span>{this.state.Fault}</span>
            </Flex>
            <Flex direction='column' justify='center' style={{ width: '23%' }}>
              <span style={{ paddingBottom: '10px',color:'#828282'}}>故障率</span>
              <span>{this.state.FailureRate}</span>
            </Flex>
            <div style={{width:'30%',alignItems:'center'}}>
              <DatePicker
                mode="date"
                title="选择日期"
                value={this.state.date}
                onChange={date => this.changeDate(date)} 
              >
                <Flex direction='column' justify='center' style={{color:'#108EE9'}}>
                    <span style={{ paddingBottom: '10px',color:'#108EE9'}}>日期<span className="iconfont icon-rili" style={{color:'#108EE9',marginLeft:'5px',fontSize:'15px'}}></span></span>
                    <span>{getFormat(this.state.date)}</span> 
                </Flex>
              </DatePicker>
            </div> 
          </Flex>
            { this.state.Code == 200 ? <SubTab TotalData={ this.state.TotalData } Field={this.state.Field}/> : <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title={this.state.errMsg}
                style={{marginTop:'100px'}}
            />}
          </div>

          <div>
            <NearTenDay TenData={ this.state.TenData } />
          </div>  
        </Tabs>
       </TweenOne>
      );
    }
  }