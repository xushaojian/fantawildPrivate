import React ,{Component} from 'react';
import { Steps,Calendar,Toast } from 'antd-mobile';
import {getJSON} from 'jquery';
import './MsgRecord.css';
import './../../css/iconfont.css';
import {getTimePart,getFormat} from './../tool';

const now = new Date();
const datePart = getTimePart();//获取最近30天的开始和结束时间
const Step = Steps.Step;
const divHeight = window.screen.height-115;

class MsgRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: datePart.startTime,
            endTime: datePart.endTime,
            show: false, //控制日历控件显示状态
            config: {}, //配置日历项
            msgList: []
        };
    }

    componentDidMount() {
        this.getMsgList();
    }

    getMsgList(startTime = this.state.startTime, endTime = this.state.endTime) { 
            Toast.loading('加载中...',0)
            getJSON(`https://parkrjs2.fangte.com/LmcqApi/api/Lmcq/LmcqList?startTime=${startTime}&endTime=${endTime}`).then(
                result => {
                    this.setState({
                        msgList: result.Data
                    });
                    Toast.hide();
                },
                error => {
                    Toast.hide() ; 
                    Toast.offline('网络错误 !!!', 2);  
                },
            )
    }

    createElement(){
        let child1,child2,child3,child4,content;
        return this.state.msgList.map((item,index)=>{
            if(item.peopleCount==0||item.peopleCount==''||item.peopleCount==null){  
                return <Step 
                        key={index}
                        title={<span className="titleNone" >{item.date}</span>}
                        status="wait"
                        icon={<span className="iconfont icon-car1" ></span>} 
                        description={<span className="titleNone" >无记录</span>} >
                    </Step>
            }else{
                child1 = React.createElement('li', {key: index+'1'}, '接待人数 : '+item.peopleCount);
                child2 = React.createElement('li', {key: index+'2'}, '运行车号 : '+item.carNum);
                child3 = React.createElement('li', {key: index+'3'}, ' 总 场 次 : '+item.totalField);
                child4 = React.createElement('li', {key: index+'4'}, '异常场次 : '+item.expCount);            
                content = React.createElement('ul',{key: index+'0'}, [child1, child2, child3, child4]);
                return <Step 
                        key={index} 
                        title={<span className="title" >{item.date}</span>} 
                        status="finish" 
                        icon={<span className="iconfont icon-car" ></span>} 
                        description={content} >
                </Step>  
            }      
        })
}


    //确认时回调
    onConfirm = (startTimeSure, endTimeSure) => {
        let ssdate = getFormat(new Date(startTimeSure));
        let eedate = getFormat(new Date(endTimeSure));
        this.setState({
            show: false,
            startTime: ssdate,
            endTime: eedate
        });
        this.getMsgList(ssdate, eedate);
    }

    //  取消时回调
    onCancel = () => {
        this.setState({
            show: false
        });
    }

	render() {
       return(
        <div>
            <div className="pl30 pt10 pr10 h100 divs" style={{height:divHeight}}>
                <Steps current={0} >{this.createElement()}</Steps>
            </div>
            <div className="dateBtn" onClick={() => {
            this.setState({
            show: true,
            config:{ showShortcut: true,defaultValue: [new Date(now)] },
            });
            }}>
                <img width="30px" height="30px" src={require('./rili.png')} />
            </div>
        
            <Calendar 
            {...this.state.config}
            visible={this.state.show}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
            maxDate={new Date(now)}                
            />   
        </div>
     );
	}

}
export default MsgRecord;