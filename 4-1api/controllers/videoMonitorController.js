const logger = require('log4js').getLogger('videoMonitorController');
const BaseController = require('./baseController');
const VideoMonitorService = require('../services/videoMonitorService');
var Ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * @name 视频监控
 */
class VideoMonitorController extends BaseController {
    constructor() {
        super();
        this.videoMonitorService = new VideoMonitorService();   
        this.trans = new Ffmpeg().setFfmpegPath(path.join(__dirname, '../files/video/ffmpeg.exe'));
    }

    getUserMsg(req, res ,next) {
        var fileBasePath =path.join(__dirname, '../files/video/');
        var outputBasePath=path.join(__dirname, '../files/video/');

        var file1=`${fileBasePath}R-20190513114852-.mp4`;
        var file2=`${fileBasePath}R-20190513115002-.mp4`;
        var file3=`${outputBasePath}R-20190513114852-20190513115002.mp4`;
        
        console.time('rf-time');
        
        this.trans.input(file1).input(file2).mergeToFile(file3, function (retcode, error) {
            if (error) {
                logger.error(error);
            } else {
                logger.error(retcode);
            }
        })
            .on('progress', function(progress) {
                console.log(`Processing: ${  progress.percent  }% done`);
            })
            .on('end',function () {
                console.timeEnd('rf-time'); //打印该rf-time标记执行时间差
                console.log('视频合并完成!');
                res.status(200).json({code:'success',json:{ video: file3}});
                res.end();
                next();
            });
       
    }
    
}

module.exports = VideoMonitorController;
