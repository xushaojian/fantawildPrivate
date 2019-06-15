import React from 'react';
import { Card, WhiteSpace,List ,Result,ActivityIndicator } from 'antd-mobile';
import * as dd from "dingtalk-jsapi";
import { getJSON } from 'jquery';
import Animate from 'rc-animate';

import CONFIG from './../config';

import './FieldDetails.css';

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const Item = List.Item;
const divHeight = window.screen.height-100;

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
                title: '场次故障详情',
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

            this.getAnalysisDetailList(this.props.match.params.selectTime, this.props.match.params.field);
        }

        //单场故障详情
        getAnalysisDetailList(selectTime, field) {
            this.setState({
                showType:1
            })
            getJSON(`${CONFIG.GETFAULTRECORDLIST}?selectTime=${selectTime}&field=${field}`).then(
                result => {
                    if(result.Code == 200){
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
                        <WhiteSpace size="xs" style={{backgroundColor:"#F8F8FF"}}/>
                        <Card>
                            <Card.Body>
                            <div style={{fontSize:'16px',fontWeight:'bold'}}>{item.HappenTime}</div>
                            <div style={{marginTop:'5px'}}>故障舱ID：{item.CabinId}</div>                       
                            <div style={{marginTop:'5px'}}>故障类型：{item.FaultType}</div>
                            <div style={{marginTop:'5px'}}>故障描述：{item.FaultRemark}</div>
                            </Card.Body>
                        </Card> 
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
        <div key="1">
            <List>
                <Item style={{backgroundColor:'#F8F8FF'}}>第{this.props.match.params.field}场，共{this.state.DetailsData.length}条故障信息</Item>
            </List>

            <div className='fielddetails' style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
                { this.createItem() }
            </div>
        </div>
        </Animate>
        );
    }
}
