import React from 'react';
import { Accordion,List,Toast,Steps} from 'antd-mobile';
import { getJSON } from 'jquery';
import Salt_router from 'salt-router';
import CONFIG from '../config'
import * as dd from "dingtalk-jsapi"
import './TerminalDetails.css'
import './../../css/iconfontTerminalDateils.css'

const Item = List.Item;

const Step = Steps.Step;

export default class BallDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectTime: '',
        baseMsg : {},
        unusualList:[],
        logList:[]
      };
    }

    componentWillMount() {
        dd.biz.navigation.setTitle({
            title : '终端信息',
            onSuccess : function(result) {},
            onFail : function(err) {}
        });
  
        dd.biz.navigation.setRight({
            show: false,
            control: false,
            text: '',
            onSuccess : function(result) {},
            onFail : function(err) {}
        });
    }

    componentDidMount() {
        let frameid = this.props.match.params.frameid;
        let paramsJson = Salt_router.getMessage(frameid)
        let paramsObj = JSON.parse(paramsJson)
        
        this.setState({
            selectTime:paramsObj.selectTime,
            baseMsg:paramsObj.baseMsg
        })
        this.getDateils(paramsObj.selectTime,paramsObj.baseMsg.TerminalName);
    }

    //NDV一天内一个终端的异常信息列表
    getDateils(selectTime,terminalName) {
        getJSON(`${CONFIG.GETLOGINFOBYTERMINAL}?selectTime=${selectTime}&terminalName=${terminalName}`).then(
            result => {
                if(result.Code === 200 && result.Msg ==='SUCCESS'){
                    this.setState({
                        unusualList:result.Data.unusualList,
                        logList:result.Data.logList,
                    });
                }else{
                    Toast.offline('服务出错了', 2);
                }
            },
            error => {
                Toast.offline('查询数据时出错了!!', 2);
            },
        )
    }
    

    render() {
        return (
        <div>
        <Accordion>
            <Accordion.Panel header="基本信息">
                <List className="my-list">
                    <Item extra={this.state.baseMsg.LogDate}>运行日期</Item>
                    <Item extra={this.state.baseMsg.SceneName}>场景名称</Item>
                    <Item extra={this.state.baseMsg.TerminalName}>终端名称</Item>
                    <Item extra={this.state.baseMsg.AlarmCount}>报警数量</Item>
                    <Item extra={this.state.baseMsg.FaultCount}>报错数量</Item>
                    <Item extra={this.state.baseMsg.StartCount}>软件启动次数</Item>
                    <Item extra={this.state.baseMsg.PlayCount}>播放次数</Item>
                    <Item extra={this.state.baseMsg.PlayUnusualCount}>播放异常次数</Item>
                    <Item extra={this.state.baseMsg.UnusualCount}>异常总次数</Item>
                    <Item extra={this.state.baseMsg.StopCount}>停止总次数</Item>
                </List>
            </Accordion.Panel>

            <Accordion.Panel header="播放异常" >
                <div style={{margin:'10px'}}>
                <Steps >
                    {
                        this.state.unusualList.map((item,index) =>{
                            if(item.Level==='提示'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-tishi msg" ></span>} description={ item.Text } />
                            }else if(item.Level==='警告'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-iconfontcolor100-copy alert" ></span>} description={ item.Text } />
                            }else if(item.Level==='错误'){
                                return <Step  title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-error error" ></span>} description={ item.Text } />
                            }else if(item.Level==='调试'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-tiaoshi debug" ></span>} description={ item.Text } />
                            }else{
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-zhengchang normal" ></span>} description={ item.Text } />
                            }
                        })
                    }
                </Steps>
                </div>
            </Accordion.Panel>

            <Accordion.Panel header="播放日志">
            <div style={{margin:'10px'}}>
                <Steps>
                    {
                        this.state.logList.map((item,index) =>{
                            if(item.Level==='提示'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-tishi msg" ></span>} description={ item.Text } />
                            }else if(item.Level==='警告'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-iconfontcolor100-copy alert" ></span>} description={ item.Text } />
                            }else if(item.Level==='错误'){
                                return <Step  title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-error error" ></span>} description={ item.Text } />
                            }else if(item.Level==='调试'){
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-tiaoshi debug" ></span>} description={ item.Text } />
                            }else{
                                return <Step title={'' + item.LogTime + ' 播放索引 ：'+ item.PlayIndex } icon={<span className="iconfont icon-zhengchang normal" ></span>} description={ item.Text } />
                            }                     
                        })
                    }
                </Steps>
            </div>
            </Accordion.Panel>
        </Accordion>
      </div>
      );
    }
  }