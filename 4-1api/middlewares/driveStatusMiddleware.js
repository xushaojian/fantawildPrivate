const logger = require('log4js').getLogger('driveStatusMiddleware');
const BaseController = require('../controllers/baseController');

class DriveStatusMiddleware  {
 
    checkProjectStatusParams(req, res, next) {
        logger.info('入参:',req.query);
        const parkName = req.query.parkName;
        if (!parkName || parkName === '' ) {
            let baseController = new BaseController();
            res.status(201).json(baseController.getResult(-1, '请检验您的信息是否全部填写！', {}));
            res.end();
        }else{
            next();
        }
    }

    //检测某条数据是否有下班关机信号
    checkShutdown(myData){
        let item0 = '';//item0项的二进制表达字符串
        let item0Array =[];//item0项字符串转数组
        //转成二进制
        item0 = Number(myData).toString(2);
        //字符串转数组
        item0Array = item0.split('');
        //数组反序
        item0Array.reverse();
        if(item0Array[0] === 1){
            return true;
        }else{
            return false;
        }
    }

    //获取某条数据的bit值
    translation(myData){
        let result = {
            bit0 : 0 ,//握手脉冲
            bit4 : 0 ,//小车前进中
            bit5 : 0 ,//行走运行中
            bit6 : 0 ,//小车旋转中
            bit14 : 0 ,//有效发车--有人
            bit16 : 0 ,//发空车
            bit21 : 0 ,//初始化完成
        };
        let item1 = '';//item1项的二进制表达字符串
        let item1Length = 0;//item1项的二进制表达字符串的长度
        let item1Array =[];//item1项字符串转数组
      
        //转成二进制
        item1 = Number(myData).toString(2);
        // 如果少于32位,则在前面加0;
        item1Length = item1.length;
        if(item1Length < 32){
            for(let y = 0 ; y < (32-item1Length); y++){
                item1 = `0${item1}`;
            }
        }
        //字符串转数组
        item1Array = item1.split('');
        //数组反序
        item1Array.reverse();

        result.bit0 = item1Array[0];
        result.bit4 = item1Array[4];
        result.bit5 = item1Array[5];
        result.bit6 = item1Array[6];
        result.bit14 = item1Array[14];
        result.bit16 = item1Array[16];
        result.bit21 = item1Array[21];
        return result;
    }

    //判断某段时间内,脉冲信号是否有变化
    getPulseSignalchange(myData){

        let item1 = '';//item1项的二进制表达字符串
        let item1Length = 0;//item1项的二进制表达字符串的长度
        let item1Array =[];//item1项字符串转数组

        let item1Add1 = '';
        let item1Add1Length = 0;
        let item1Add1Array =[];
                
        for(let i = 0 ; i < myData.data.length -1 ; i++){
            //转成二进制
            item1 = Number(myData.data[i].item1).toString(2);
            item1Add1 = Number(myData.data[i+1].item1).toString(2);
            // 如果少于32位,则在前面加0;
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
            if(item1Array[0] !== item1Add1Array[0] && myData.data[i].item3 === myData.data[i+1].item3){
                return false;
            }else{
                return true;
            }
        }
    }

}

module.exports = DriveStatusMiddleware;