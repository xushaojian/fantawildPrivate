import React from 'react';
import { Card, WhiteSpace , Toast } from 'antd-mobile';
import TweenOne from 'rc-tween-one';
import { getJSON } from 'jquery';
import Salt_router from 'salt-router';
import './ExpFieldMsg.css';
import CONFIG from './../config'
import * as dd from "dingtalk-jsapi"

export default class ExpFieldMsg extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                SingleData: {},
            };
        }

        componentWillMount() {
            dd.biz.navigation.setTitle({
                title : '故障场次',//控制标题文本，空字符串表示显示默认文本
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
            this.getSingleAnalysis(this.props.match.params.performno);
        }

        //单场次信息
        getSingleAnalysis(performNo) {
            getJSON(`${CONFIG.SINGLEANALYSIS}?performNo=${performNo}`).then(
                result => {
                    this.setState({
                        SingleData: result.Data
                    });
                    Toast.hide();
                },
                error => {
                    Toast.offline('网络错误 !!!', 2);
                },
            )
        }

        //历史出现情况
        history() {
            let myItem = '';
            if (this.state.SingleData.list != null && this.state.SingleData.list.length != 0) {
                this.state.SingleData.list.map(function (item, i) {
                    myItem += item + ' ; ';
                })
            } else {
                myItem = '无'
            }
            return myItem;
        }


    render() {
        let that = this;
        return (<TweenOne animation={{ type:'from',opacity: 0,duration:700 }}><div style={{backgroundColor:'#f4f4f4'}}>
        <Card full>
            <Card.Header
            title="场次基本信息"
            extra={ 
            <div onClick={() => {
                CONFIG.WEBVIEVID += 1;
                Salt_router.push({
                            id: 'expfielddetails'+(new Date()).getTime(),
                            url: `#/expfielddetails/${that.props.match.params.performno}`,
                            anim: 1,
                            needPost: false,
                            param: {}
                        }).then({

                        }).catch({

                        })
            }} style={{color:'#108EE9'}}>故障详情</div>}
            style={{backgroundColor:'#F8F8FF'}}
            />
            <Card.Body>
            <div style={{marginBottom:'5px'}}>运行日期：{this.state.SingleData.RunDate}</div>
            <div style={{marginBottom:'5px'}}>场次编号：{this.state.SingleData.FieldNumber}</div>
            <div style={{marginBottom:'5px'}}>曲线方案：{this.state.SingleData.SchemeName}</div>
            <div style={{marginBottom:'5px'}}>曲线类型：测试曲线</div>
            <div style={{marginBottom:'5px'}}>运行时段：{this.state.SingleData.TimeInterval}</div>
            <div style={{marginBottom:'5px'}}>总控记录文件名：{this.state.SingleData.ZkRecordCurveName}</div>
            <div style={{marginBottom:'5px'}}>PLC记录文件 名：{this.state.SingleData.CurveName}</div>
            </Card.Body>
        </Card>
        <WhiteSpace />
        <Card full>
        <Card.Header
        title="场次故障描述"
        style={{backgroundColor:'#F8F8FF'}}
        />
        <Card.Body>
        <div>{this.state.SingleData.Remark}</div>
        </Card.Body>
        </Card>
        <WhiteSpace />
        <Card full>
        <Card.Header
        title="场次故障源情况"
        style={{backgroundColor:'#F8F8FF'}}
        />
        <Card.Body>
        {/* <div>可能故障源：This is content of `Card`</div><br /> */}
        <div>历史出现情况：{ this.history() }</div>
        </Card.Body>
        </Card>
        </div></TweenOne>
        );
    }
}
