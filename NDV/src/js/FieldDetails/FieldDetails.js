import React from 'react';
import { List,Flex ,Result,ActivityIndicator } from 'antd-mobile';
import * as dd from "dingtalk-jsapi";
import { getJSON } from 'jquery';
import Salt_router from 'salt-router';
import Animate from 'rc-animate';
import CONFIG from './../config';
import './FieldDetails.css';

const Item = List.Item;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const divHeight = window.screen.height-50;

export default class ExpFieldDetails extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                DetailsData: [],
                resultMsg: '没有故障',
                showType:0
            };
        }

        componentDidMount() {
            dd.biz.navigation.setTitle({
                title: '终端列表',
                onSuccess: function (result) {},
                onFail: function (err) {}
            });

            dd.biz.navigation.setRight({
                show: false,
                control: false,
                text: '',
                onSuccess: function (result) {},
                onFail: function (err) {}
            });
            let parmsJson = Salt_router.getMessage(this.props.match.params.id)
            let parmsObj =JSON.parse(parmsJson)
            this.getAnalysisDetailList(parmsObj.selectTime, parmsObj.sceneName,parmsObj.playIndex);
        }

        //单场故障详情
        getAnalysisDetailList(selectTime, sceneName, playIndex) {
            this.setState({
                showType:1
            })
            getJSON(`${CONFIG.GETLOGINFOBYSCENENAME}?selectTime=${selectTime}&sceneName=${sceneName}&playIndex=${playIndex}`).then(
                result => {
                    if(result.Code === 200 && result.Msg === "SUCCESS"){
                        if(result.Data.length == 0){
                            this.setState({
                                DetailsData: [],
                                resultMsg: '没有故障',
                                showType: 3
                            })
                        }else{
                            this.setState({
                                DetailsData: result.Data,
                                resultMsg: '',
                                showType: 2
                            });
                        }
                    }else{
                        this.setState({
                            DetailsData: [],
                            resultMsg: '远程服务出错了！',
                            showType: 3
                        })
                    }   
                },
                error => {
                    alert(JSON.stringify(error))
                    this.setState({
                        resultMsg: '请求出错了'
                    })
                },
            )
        }

 createItem(){
    if(this.state.showType == 1){
        return <ActivityIndicator text="加载中..." />
    }else if(this.state.showType == 2){
        return this.state.DetailsData.map(function (item, i) {
            return <div key={i} >
                        <Item
                            arrow="empty"
                            wrap
                            style={{borderBottom:'1px solid #d3d3d3'}}
                            >
                                <span style={{fontSize:'16px'}}> { item.PlayIndex } </span><br />
                                <span style={{fontSize:'14px'}}>场景名称：{item.SceneName} </span><br />
                                <Flex>
                                    <Flex.Item  style={{flex:2}}>
                                    终端名:{item.TerminalName}
                                    </Flex.Item>
                                    <Flex.Item  align='center' style={{flex:1}} className={item.AlarmNum==0 ? 'field-normal' : 'exp'}>
                                    报警：{item.AlarmNum}
                                    </Flex.Item>
                                    <Flex.Item align='center' style={{flex:1}} className={item.FaultNum==0 ? 'field-normal' : 'exp'}>
                                    报错：{item.FaultNum}
                                    </Flex.Item>
                                </Flex>
                            </Item>  
                    </div> 
        })
    }else if(this.state.showType == 3){
        return <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title={this.state.resultMsg}
                />
    }
 }

    render() {
        return (<Animate transitionName="fade" transitionAppear>       
            <div className='fielddetails' style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
                { this.createItem() }
            </div>
        </Animate>
        );
    }
}
