import React from 'react';
import { WhiteSpace,List,Toast,Carousel,Button} from 'antd-mobile';
import './BallDetails.css'
import { getJSON } from 'jquery';
import CONFIG from './../config'
import { getImgTime } from '../tool'
import * as dd from "dingtalk-jsapi"

const Item = List.Item;
const Brief = Item.Brief;
const divHeight = window.screen.height-50-20;
const dotActiveStyle={
    width:"10px",
    height:"10px",
    background: "#FFA550"
}

export default class BallDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        SingleBallList:[],
        ItemList:[],
        activeButton:0,
        imageList: [],
        imageTimeList:[],
        note:'',

      };
    }

    componentWillMount() {
        dd.biz.navigation.setTitle({
            title : '按球体统计',
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

        dd.biz.chat.chooseConversationByCorpId({
            corpId:'dingb1c4a1559ce0331e',
            success: res => {
                /*{
                    chatId: 'xxxx',
                    title:'xxx'
                }*/
                alert(res)
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
        this.getSingleBallList(this.props.match.params.selectTime,this.props.match.params.phyPositionNo);
    }

    tagChange(selected) {
        const that = this ;
        that.setState({
            activeButton:selected
        })
        that.state.SingleBallList.map(function (item,i){
            if(item.PerformNo == selected){
                that.setState({
                    ItemList:item.list
                });
            }
        })
    }

    //球体-单个
    getSingleBallList(selectTime,phyPositionNo) {
        Toast.loading('加载中...', 0)
        getJSON(`${CONFIG.GETSINGLEBALLLIST}?selectTime=${selectTime}&phyPositionNo=${phyPositionNo}`).then(
            result => {
                this.setState({
                    SingleBallList: result.Data.perList,
                    ItemList:result.Data.perList[0].list,
                    activeButton:result.Data.perList[0].PerformNo,
                    imageList:result.Data.imageList,
                    imageTimeList:result.Data.imageTimeList,
                    note:result.Data.note
                });
                Toast.hide();
            },
            error => {
                Toast.hide();
                Toast.offline('查询数据时出错了!!', 2);
            },
        )
    }

    createTag(tag,activeButton){
        const that = this;
        if(tag.length != 0){
            return  tag.map(function (item, i) {   
                return(
                    item.PerformNo==activeButton 
                    ? <Button key={i} type="primary" size="small" onClick={()=>{that.tagChange(item.PerformNo)}} style={{margin:'5px 10px'}}>第{item.PerformNo}场</Button> 
                    : <Button key={i} type="ghost" size="small" onClick={()=>{that.tagChange(item.PerformNo)}} style={{margin:'5px 10px'}}>第{item.PerformNo}场</Button>       
                )
            })
        }
    }

    createItem(fieldList){
        if( fieldList.length != 0 ){
           return  fieldList.map(function (item, i) {
                     return (<div key={i}>
                             <Item wrap onClick={() => {}}>
                                {item.CurrentTime}
                                <Brief>电气编号：{item.ElePositionNo}</Brief>
                                <Brief>故障类型：{item.FaultType}</Brief>
                                <Brief>故障代码：{item.FaultCode}</Brief>
                                <span style={{fontSize:'14px',color:'#4f4f4f'}}>故障解释：{item.FaultTranslation}</span>
                             </Item>
                             <WhiteSpace size="xs" style={{backgroundColor:'#f4f4f4'}}/>
                         </div>
                     );
             })   
      }
    }

    previewImage(val){
            dd.biz.util.previewImage({
                urls: this.state.imageList,//图片地址列表
                current: val,//当前显示的图片链接
                onSuccess : function(result) {
                  
                },
                onFail : function(err) {}
            })
    }

    render() {
        return (
        <div className='div-content' style={{height:divHeight,backgroundColor:'#F8F8FF'}}>
        <div style={{padding:'10px 10px 10px 10px',fontSize:'16px',color:'#4F4F4F'}}>{this.props.match.params.selectTime} 魔球位置编号 {this.props.match.params.phyPositionNo}</div>

        {
            this.state.imageList.length != 0 ? 
            <div>
                <Carousel autoplay={false} infinite dotActiveStyle={dotActiveStyle} style={{textAlign: 'center'}}>
                {this.state.imageList.map((val,i) => (
                    <div key={i} style={{ position:'relative', width: '100%', height: '200px' }} >
                        <img
                            src={val}
                            style={{ width: '100%', verticalAlign: 'middle' }}
                            onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                            this.setState({ imgHeight: 'auto' });
                            }}
                            onClick = {()=>{this.previewImage(val)}}
                        />
                        <div style={{position:'absolute',width:'180px',height:'30px',zIndent:'2',left:'0px',top:'10px',color:'#FFA550'}}>
                            { getImgTime( this.state.imageTimeList[i] ) }
                        </div>
                    </div> 
                ))}
                </Carousel>
                <div style={{padding:'5px 10px',fontSize:'14px',color:'#4F4F4F'}}>图片说明：{ this.state.note }</div>
            </div>
        :null
        }

        <div className="tag-container">
            { this.createTag(this.state.SingleBallList,this.state.activeButton) }
        </div>

        { this.createItem(this.state.ItemList) }
      </div>
      );
    }
  }