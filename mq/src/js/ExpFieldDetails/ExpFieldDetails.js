import React from 'react';
import { Card,Checkbox,Flex,Toast,Result } from 'antd-mobile';
import TweenOne from 'rc-tween-one';
import './ExpFieldDetails.css';
import { getJSON } from 'jquery';
import CONFIG from './../config'
import * as dd from "dingtalk-jsapi"

const AgreeItem = Checkbox.AgreeItem;
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const divHeight = window.screen.height-100;

export default class ExpFieldDetails extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                DetailsData: []
            };
        }

        //改变当选按钮时出发的事件
        onChange = () => {
            console.log(1);
        }

        componentWillMount() {

            dd.biz.navigation.setTitle({
                title: '故障场次详情', //控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {},
                onFail: function (err) {}
            });

            dd.biz.navigation.setRight({
                show: false, //控制按钮显示， true 显示， false 隐藏， 默认true
                control: false, //是否控制点击事件，true 控制，false 不控制， 默认false
                text: '', //控制显示文本，空字符串表示显示默认文本
                onSuccess: function (result) {},
                onFail: function (err) {}
            });

            dd.chooseChat({
                success: res => {
                    /*{
                        chatId: 'xxxx',
                        title:'xxx'
                    }*/
                    alert(res.chatId)
                },
                fail: err =>{
                    dd.alert({
                        content:JSON.stringify(err)
                    })
                }
            })
        }

        componentDidMount() {
            this.getAnalysisDetailList(this.props.match.params.performno);
        }

        //单场故障详情
        getAnalysisDetailList(performNo) {
            Toast.loading('加载中...', 0)
            getJSON(`${CONFIG.GETANALYSISDETAILLIST}?performNo=${performNo}`).then(
                result => {
                    this.setState({
                        DetailsData: result.Data
                    });
                    Toast.hide();
                },
                error => {
                    Toast.hide();
                    Toast.offline('网络错误 !!!', 2);
                },
            )
        }

    render() {
        let myItem = '';
        if(this.state.DetailsData.length != 0){
            myItem = this.state.DetailsData.map(function (item, i) {
                return (<div key={i}>
                    
                    <Card full>
                        <Card.Body>
                        <div style={{fontSize:'16px',fontWeight:'bold'}}>{item.CurrentTime}</div>
                        <div>位置编号：{item.PhyPositionNo}</div>
                        <div>电气编号：{item.PhyPositionNo}</div>
                        <div>故障类型：{item.FaultType}</div>
                        <div>故障代码：{item.FaultCode}</div>
                        <div>故障解释：{item.FaultTranslation}</div>
                        </Card.Body>
                    </Card>
                </div>                   
                );
            })
        }else if(this.state.DetailsData.length == 0){
            return(
                <Result
                    img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                    title="无详情信息"
                />
            )
        }

        return (<TweenOne animation={{ type:'from',opacity: 0,duration:700 }}><div>
                <Flex style={{paddingLeft:'15px',paddingRight:'10px',height:'40px',backgroundColor:'#F8F8FF'}}>
                    <Flex.Item style={{width:'50%',textAlign:'left'}}>共{this.state.DetailsData.length}条故障信息</Flex.Item>
                    <Flex.Item>
                    <AgreeItem  onChange={() => this.onChange(1)} ><span style={{fontSize:'12px'}}>只看可能故障源</span></AgreeItem>
                    </Flex.Item>
                    
                </Flex>
               
                <div className='exp-field-details' style={{height:divHeight,backgroundColor:'#f4f4f4'}}>
                    { myItem }   
                </div>
        </div></TweenOne>
        );
    }
}
