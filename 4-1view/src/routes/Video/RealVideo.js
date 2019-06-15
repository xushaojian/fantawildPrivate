import React from 'react';
import videojs from 'video.js';
import axios from 'axios';
import {Row} from 'antd';
import "video.js/dist/video-js.css";
import CONFIG from '../../config';
import styles from './index.less';

videojs.options.flash.swf=require('videojs-swf/dist/video-js.swf');

export default class RealVideo extends React.PureComponent{
    constructor(props) {
        super(props);
    
        this.state = {
            videoName:''
        };
    }
    componentDidMount() {
        const {videoId}=this.props;
        this.reloadPlayer(videoId);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.videoId!==nextProps.videoId){
            this.reloadPlayer(nextProps.videoId);
        }
    }
    
    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
          this.player.dispose()
        }
    }

    // 视频加载并播放
    reloadPlayer = (videoId) => {
       console.log(videoId);
        axios({
            method:'get',
            url:CONFIG.GetVideoPreview,
            params:{ videoId:videoId}
        }).then((response)=>{
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
    
            this.player.src({
                src: response.data.data.playUrl,
                type:'rtmp/flv',
            });
    
            this.player.load();
            this.player.play();
            this.setState({
                videoName:response.data.data.videoName
            })
        }).catch((exception)=>{
           console.log(exception);
        })
         
    }

    render(){

        return(
            <Row>
                <div className={styles.videoTitle}>
                    <p>{this.state.videoName}</p>
                </div>
                <div className={styles.video}>    
                    <div data-vjs-player>
                        <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered"></video>
                    </div>
                </div>
            </Row>
        );
    }
}