/* eslint-disable eqeqeq */
const logger = require('log4js').getLogger('driveStatusController');
const DriveStatusService = require('../services/driveStatusService');
const DriveStatusMiddleware = require('../middlewares/driveStatusMiddleware');
const Promise = require('bluebird');
const commonTool = require('../tools/commonTool');

/**
 * @name 设备运行状态
 */
class DriveStatusController {

    /**
   * 获取某个公园在最近两分钟的项目状态
   * @param parkName 公园名称
   */
    getProjectStatus(req, res ,next) {
        // const parkName = req.query.parkName;
        let projectResult = [
            {   
                code : 0,
                msg:'success',
                data:{
                    parkName:'南宁东盟神画',
                    projectName:'拉玛传奇(C126车)',
                    projectStatus:'',
                    bootUpTime:'',
                    shutdownTime:'',
                    runFieldNum:'',
                    fieldAvgTime:'',
                    updateTime:commonTool.getCurrTime()
                }
            }
        ];

        let driveStatusMiddleware = new DriveStatusMiddleware();
        let driveStatusService = new DriveStatusService();

        let currDate = commonTool.getCurrDate();//20190101
        let currTimeNMinuteBefore = commonTool.getCurrTimeNMinuteBefore(2);
        let currTime = commonTool.getCurrTime();

        currDate = '20190101';
        currTimeNMinuteBefore = '2019-01-01 08:50:00';
        currTime = '2019-01-01 08:53:00';

        let getBootUpTime = driveStatusService.getBootUpTime(currDate);
        let getRealDollyDataforTime = driveStatusService.getRealDollyDataforTime(currDate,currTimeNMinuteBefore,currTime);
        let getAllRealDollyDataItemForDate = driveStatusService.getAllRealDollyDataItemForDate(currDate);
        let getShutdownTime = driveStatusService.getShutdownTime(currDate);

        Promise.all([getBootUpTime, getRealDollyDataforTime, getAllRealDollyDataItemForDate,getShutdownTime]).then(function(results){
           
            //判断查询方法是否都执行成功了
            if(results[0].code != 0 && results[1].code != 0 && results[2].code != 0){
                projectResult[0].code = -1;
                projectResult[0].msg = '执行查询的时候出错了';

            }else if(results[0].data.length == 0){
                //查询成功,但没有开机时间返回,说明没有表或表中没有有效数据
                projectResult[0].code = 0;
                projectResult[0].msg = 'success';
                projectResult[0].data.projectStatus = '未知';

            }else if(results[1].data.length == 0){
                //查询成功,有开机时间,但没有该时间段的数据,项目状态停止
                projectResult[0].code = 0;
                projectResult[0].msg = 'success';
                projectResult[0].data.bootUpTime = results[0].data[0].collectTime;
                projectResult[0].data.shutdownTime = results[3].data[0].collectTime;
                projectResult[0].data.projectStatus = '停止';

            }else if(driveStatusMiddleware.getPulseSignalchange(results[1])){
                //查询成功,有开机时间,有该时间段的数据,但脉冲信号持续无变化,项目状态停止
                projectResult[0].code = 0;
                projectResult[0].msg = 'success';
                projectResult[0].data.bootUpTime = results[0].data[0].collectTime;
                projectResult[0].data.shutdownTime = results[3].data[0].collectTime;
                projectResult[0].data.projectStatus = '停止';

            }else{
                //脉冲信号有变化,项目已处于运营中,只要细分接待中
                //判断小车是否处于接待中: 条件:
                //item1项的 bitindex4 = 1 && ( bitindex5 = 1 || bitindex6 = 1 || bitindex14 = 1 )
                projectResult[0].data.projectStatus = '运营中';
                for(let i in results[1].data){
                    let bitValue = driveStatusMiddleware.translation(results[1].data[i].item1);
                    if(bitValue.bit14 ==1 && ( bitValue.bit4 == 1 || bitValue.bit5 == 1 || bitValue.bit6 == 1 )){
                        projectResult[0].data.projectStatus = '接待中';
                        break;
                    } 
                }

                projectResult[0].code = 0;
                projectResult[0].msg = 'success';
                projectResult[0].data.bootUpTime = results[0].data[0].collectTime;

            }
            
            res.status(200).json(projectResult);
            res.end();
            next();
            
        }).catch(function(err){
            logger.error(err);
            res.status(400).json([]);
            res.end();
            next();
        });

    }

    /**
   * 获取某个公园所有的设备状态
   * @param parkName 公园名称
   */
    getDriveStatus(req, res ,next) {
        let driveResult = {
            code: 0,
            msg: 'success',
            data: [{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '1',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '2',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '3',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '4',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '5',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '6',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            }, {
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '7',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '8',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '9',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            },{
                parkName: '南宁东盟神画',
                projectName: '拉玛传奇',
                driveName: 'C126车',
                driveNum: '10',
                driveField: '室内有轨车',
                driveStatus: '离线',
                updateTime: commonTool.getCurrTime()
            }
            ]
        };

        let driveStatusService = new DriveStatusService();

        let currDate = commonTool.getCurrDate();//20190101
        let currTimeNMinuteBefore = commonTool.getCurrTimeNMinuteBefore(2);
        let currTime = commonTool.getCurrTime();

        currDate = '20190101';
        currTimeNMinuteBefore = '2019-01-01 08:50:00';
        currTime = '2019-01-01 08:53:00';

        let getRealDollyDataforTime = driveStatusService.getRealDollyDataforTime(currDate,currTimeNMinuteBefore,currTime);
        Promise.all([getRealDollyDataforTime]).then(function(results){
            let item1 = '';//item1项的二进制表达字符串
            let item1Length = 0;//item1项的二进制表达字符串的长度
            let item1Array =[];//item1项字符串转数组

            let item1Add1 = '';
            let item1Add1Length = 0;
            let item1Add1Array =[];

            for(let i = 0 ; i < results[0].data.length -1 ; i++){
                
                //转成二进制
                item1 = Number(results[0].data[i].item1).toString(2);
                item1Add1 = Number(results[0].data[i+1].item1).toString(2);
                //如果少于32位,则在前面加0;
                item1Length = item1.length;
                item1Add1Length = item1Add1.length;
                if(item1Length < 32){
                    for(let y = 0 ; y < (32-item1Length); y++){
                        item1 = `0${item1}`;
                    }
                }
                if(item1Add1Length < 32){
                    for(let y = 0 ; y < (32-item1Add1Length); y++){
                        item1Add1 = `0${item1Add1}`;
                    }
                }
                //字符串转数组
                item1Array = item1.split('');
                item1Add1Array = item1Add1.split('');
                //数组反序
                item1Array.reverse();
                item1Add1Array.reverse();

                //对比前后item1项 bitIndex = 0 即脉冲信号 , 有变化则表示小车在运行中
                //后小车在动
                if((item1Array[0] != item1Add1Array[0] && results[0].data[i].item3 == results[0].data[i+1].item3) || item1Array[4] == 1 || item1Array[5] == 1 || item1Array[6] == 1){
                    driveResult.data[results[0].data[i].item3-1].driveStatus = '在线';
                }
            }

            res.status(200).json(driveResult);
            res.end();
            next();

        }).catch(function(err){
            logger.error(err);
            res.status(400).json({});
            res.end();
            next();
        });
    }
}

module.exports = DriveStatusController;
