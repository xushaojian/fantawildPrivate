import React from 'react';
import { Flex,Button,List,Result,Badge,DatePicker,WhiteSpace,ActivityIndicator } from 'antd-mobile';
import Salt_router from 'salt-router';
import TweenOne from 'rc-tween-one';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import CONFIG from './../../config'
import { getFormat,repStr,repCircle } from './../tool'
import { getJSON } from 'jquery'
import './RunDetails.css'

const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
const Item = List.Item;
const Brief = Item.Brief;
const divHeight = window.screen.height-115;

export default class MainTab extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                date: new Date((new Date()).getTime() - 24 * 60 * 60 * 1000),
                TotalCircle: 0,
                TotalCarNum: 0,
                list: [],
                itemList: [],
                clickCarID: 0,
                animating:false,
                isDispaly:'none',
                resultTitle:'无数据'
            };
        }

        componentDidMount() {
            let yesterday = getFormat(this.state.date)
            this.getGetRunRecordInfo(yesterday);
        }

        getGetRunRecordInfo(selectTime) {
            this.setState({
                animating: true,
                isDispaly: 'none'
            });
            getJSON(`${CONFIG.GETRUNRECORDINFO}?selectTime=${selectTime}`).then(
                result => {
                    if(result.Code == 200){
                        for (let i = 0; i < result.Data.list.length; i++) {
                            if (result.Data.list[i].isRun != "false") {
                                result.Data.list[i].isActive = "true";
                                this.setState({
                                    itemList: result.Data.list[i].list,
                                    clickCarID: result.Data.list[i].CarId
                                })
                                break;
                            }
                        }
                        this.setState({
                            TotalCircle: result.Data.TotalCircle,
                            TotalCarNum: result.Data.TotalCarNum,
                            list: result.Data.list
                        });
                        this.setState({ animating: false,isDispaly:'' });
                        
                    }else{
                        this.setState({
                            TotalCircle: 0,
                            TotalCarNum: 0,
                            list: [],
                            itemList: [],
                            clickCarID: 0
                        })
                        this.setState({ animating: false,isDispaly:'' });  
                    }   
                },
                error => {
                    this.setState({
                        animating: false,
                        isDispaly: '',
                        resultTitle:'网络错误'
                    });
                },
            )
        }

        changeDate(date) {
            this.setState({
                date
            })
            let selectTime = getFormat(date)
            this.getGetRunRecordInfo(selectTime);
        }

        //点击车次按钮切换列表
        clickCars(activeIndex, itemList) {
            for (let i = 0; i < this.state.list.length; i++) {
                if (i == activeIndex) {
                    this.state.list[i].isActive = "true"
                    this.setState({
                        clickCarID: this.state.list[i].CarId
                    })
                } else {
                    this.state.list[i].isActive = "false"
                }
            }
            this.setState({
                itemList
            })
        }

        //创建车次按钮,默认选中按排序且为运行车次的第一个按钮
        createButton(datalist){
            let that = this;
            if(datalist.length != 0){
                return datalist.map(function(item,i){
                    if(item.isRun == "true"){
                        if(item.isActive == "true"){                           
                            if(item.isAlert == "true"){
                                return <Badge dot key={i} ><Button type="primary" inline size="small" style={{margin:'5px'}} onClick={()=>that.clickCars(i,item.list)}>{item.CarId}</Button></Badge>
                            }else{
                                return <Badge key={i}><Button type="primary" inline size="small" style={{margin:'5px'}} onClick={()=>that.clickCars(i,item.list)}>{item.CarId}</Button></Badge>
                            }
                        }else{                            
                            if(item.isAlert == "true"){
                                return <Badge dot key={i}><Button type="ghost" inline size="small" style={{margin:'5px'}} onClick={()=>that.clickCars(i,item.list)}>{item.CarId}</Button></Badge>
                            }else{
                                return <Badge key={i}><Button type="ghost" inline size="small" style={{margin:'5px'}} onClick={()=>that.clickCars(i,item.list)}>{item.CarId}</Button></Badge>
                            }
                        }
                    }else{
                        return <Badge key={i}><Button type="ghost" inline size="small" disabled style={{margin:'5px',backgroundColor:'#828282',color:'#FFF'}}>{item.CarId}</Button></Badge>
                    }
                })
            }                         
        }

        //创建车次按钮对应的列表项
        createItem(itemList){
                let that = this;
                if(itemList.length != 0 ){
                    return itemList.map(function (item, i) { 
                        return <TweenOne animation={{ type:'to',opacity: 1,duration:700 }}>
                                <div key={i} >
                                    { i==0 ? <WhiteSpace size='xs' style={{backgroundColor:'#F8F8FF'}}/> : null }
                                    <Item
                                    arrow="horizontal"
                                    onClick={() => {
                                        let url = ''
                                        //url接中文时有异常
                                        if(item.Circle=='非运行时间段故障'){
                                            url = `#/circledetails/${getFormat(that.state.date)}/${repStr(that.state.clickCarID)}/${item.AlarmNum}/0`
                                        }else{
                                            url = `#/circledetails/${getFormat(that.state.date)}/${repStr(that.state.clickCarID)}/${item.AlarmNum}/${repCircle(item.Circle)}`
                                        }
                                        
                                        Salt_router.push({
                                                id:'circledetails'+(new Date()).getTime(),
                                                url:url, 
                                                anim:1, 
                                                needPost:false, 
                                                param: {}
                                                }).then({

                                                }).catch({

                                                }) 
                                    }}
                                    >
                                    {item.AlarmNum==0
                                        ? 
                                        <div>
                                            <span style={{fontSize:'15px'}}>{item.Circle}</span>
                                            <span style={{color:"#828282",fontSize:'15px',marginLeft:'10px'}}> {item.TimeSlot} </span>
                                            <Brief style={{color:'#363636',fontSize:'14px'}}>
                                                运行时长：{item.RunTime} <br /> 
                                                故障数：{item.AlarmNum}
                                            </Brief>
                                        </div>
                                        : 
                                        <div>
                                            <span style={{fontSize:'15px',color:'red'}}>{item.Circle}</span>
                                            <span style={{color:"red",fontSize:'15px',marginLeft:'10px'}}> {item.TimeSlot} </span>
                                            <Brief style={{color:'red',fontSize:'14px'}}>
                                                运行时长：{item.RunTime} <br /> 
                                                故障数：{item.AlarmNum}
                                            </Brief>
                                        </div>
                                    }
                                    </Item>
                                    <WhiteSpace size="xs" style={{backgroundColor:'#F8F8FF'}}/>
                                </div> 
                            </TweenOne>
                    })  
                }else{
                    return <TweenOne animation={{ type:'from',opacity: 0,duration:1000 }} >
                            <Result
                            img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                            title={this.state.resultTitle}
                            style={{marginTop:'60px',backgroundColor:'#F8F8FF'}}
                            />
                            </TweenOne>
                }
        }
  
    render() {
      return (
          <div className="btn-container" style={{height:divHeight}} >
          <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
            <Flex direction='row' style={{marginLeft:'10px',marginRight:'10px', borderRadius:'10px' ,backgroundColor:'#FAEBD7', padding: '10px' }}>

                <Flex direction='column' justify='center' style={{ width: '33%' }}>
                    <span style={{ paddingBottom: '10px'}}>总运行圈数</span>
                    <span>{this.state.TotalCircle}</span>
                </Flex>

                <Flex direction='column' justify='center' style={{ width: '33%' }}>
                    <span style={{ paddingBottom: '10px'}}>总运行车数</span>
                    <span>{this.state.TotalCarNum}</span>
                </Flex>

                <div style={{width:'34%',alignItems:'center'}}>
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        value={this.state.date}
                        onChange={date => this.changeDate(date)} 
                    >
                        <Flex direction='column' justify='center' style={{color:'#108EE9'}}>
                            <span style={{ paddingBottom: '10px',color:'#108EE9'}}>日期<span className="iconfont icon-rili" style={{color:'#108EE9',marginLeft:'5px',fontSize:'15px'}}></span></span>
                            <Texty>{getFormat(this.state.date)}</Texty>
                        </Flex>
                    </DatePicker>
                </div> 
            </Flex>

            <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>
            <TweenOne animation={{ type:'from',opacity: 0,duration:1000 }} >
                <div  >
                    <div style={{marginLeft:'48%'}}>
                        <ActivityIndicator size='large' animating = {this.state.animating}  />
                    </div>
                    <div style={{display:this.state.isDispaly}}>
                        <div style={{marginLeft:'10px',marginRight:'10px', borderRadius:'10px' ,backgroundColor:'#FAEBD7' }}>
                         {this.createButton(this.state.list)}
                        </div>
                        <WhiteSpace size='md' style={{backgroundColor:"#F8F8FF"}}/>

                        {this.createItem(this.state.itemList)}
                    </div>
                </div>
            </TweenOne>
      </div> 
      );
    }
  }