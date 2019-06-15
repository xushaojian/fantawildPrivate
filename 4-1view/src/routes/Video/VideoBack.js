import React from 'react';
import videojs from 'video.js';
import axios from 'axios';
import {Row,Col,Form,Input,Button,Select ,DatePicker  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import "video.js/dist/video-js.css";
import { getFormat,getOptionList } from '../../utils/tool';
import CONFIG from '../../config';
import styles from './index.less';

const FormItem = Form.Item;
 
@Form.create()

export default class VideoBack extends React.PureComponent{
    constructor(props) {
        super(props);
    
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            videoName:'',
            projectList:[]
        };
    }

    componentDidMount() {
        axios({
            method:'get',
            url:CONFIG.GetProjectById,
            params:{ parkId:'1'}
        }).then((response)=>{
            this.setState({
                projectList:response.data.data.list
            })
        }).catch((exception)=>{
           console.log(exception);
        })
        this.reloadPlayer();
    }
    
    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
          this.player.dispose()
        }
    }

    // 视频加载并播放
    reloadPlayer = () => {
        const options = {
            width:"500px",
            height:"450px",
            controls:'controls',
            preload:"auto",
            autoPlay:'autoPlay',
        };

        this.player = videojs(this.videoNode, options,function onPlayerReady() {
               console.log('onPlayerReady', this)
        });
       
    }

        //搜索
    handleSearch = e => {
        e.preventDefault();
        var _this=this;
        const {  form } = this.props;
        form.validateFields((err, fieldsValue) => {
            console.log(err);
            if (err) return;
            console.log(fieldsValue);
            _this.player.src({
                src: 'http://10.159.10.4:8083/resource/outputVideo/20190530102400-20190530103800.mp4',
                type:'video/mp4',
            });
            _this.player.load();
            _this.player.play();
            _this.setState({
                videoName:'研究院7楼'
            })
            // axios({
            //     method:'get',
            //     url:CONFIG.GetVideoBack,
            //     params:{
            //         ProjectId:fieldsValue.ProjectId,
            //         StartTime:fieldsValue.StartTime.format("YYYYMMDDHHMMSS"),
            //         EndTime:fieldsValue.EndTime.format("YYYYMMDDHHMMSS"),
            //     }
            // }).then((response)=>{
            //     console.log(response);
            //     _this.player.src({
            //         src: 'http://10.159.10.4:8083/resource/outputVideo/20190530102400-20190530103800.mp4',
            //         type:'video/mp4',
            //     });
            //     _this.player.load();
            //     _this.player.play();
            //     _this.setState({
            //         videoName:'拉玛传奇'
            //     })
            // }).catch((exception)=>{
            //    console.log(exception);
            // })
             
        });
    };

    //搜索表单
    renderForm() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            const {projectList,startValue, endValue, endOpen}=this.state;
          
            return (
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="center">
                  <Col md={5} sm={24}>
                    <FormItem label="摄像头位置"  >
                        {
                            getFieldDecorator('ProjectId')(
                                <Select placeholder="请选择">
                                    {getOptionList(projectList)}
                                </Select>
                            )
                    }
                    </FormItem>
                  </Col>
                  <Col md={5} sm={24}>
                    <FormItem label="开始时间"  >
                        {
                            getFieldDecorator('StartTime')(
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="请选择"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            )
                    }
                    </FormItem>
                  </Col>
                  <Col md={5} sm={24}>
                    <FormItem label="结束时间"  >
                        {
                            getFieldDecorator('EndTime')(
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="请选择"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                              />
                            )
                    }
                    </FormItem>
                  </Col>
                  <Col md={4} sm={24}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            );
        }

    disabledStartDate = startValue => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
        
    disabledEndDate = endValue => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };
        
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
        
    onStartChange = value => {
        this.onChange('startValue', value);
    };
        
    onEndChange = value => {
        this.onChange('endValue', value);
    };
        
    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };
        
    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };
        

    render(){

        return(
            <PageHeaderLayout title="视频回放">
                <Row>
                    <Row >
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                    </Row>
                    <div className={styles.videoTitle}>
                        <p>{this.state.videoName}</p>
                    </div>
                    <div className={styles.video}>    
                        <div data-vjs-player>
                            <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered"></video>
                        </div>
                    </div>
                </Row>
            </PageHeaderLayout>
           
        );
    }
}

