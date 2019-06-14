/* 
 * 数组分割.
 */
exports.sliceArr = function (array, size) {
    var result = [];
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
    }
    return result;
};

/* 
 * 数组去重.
 */
exports.uniqArr = function (array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) === -1) {
            temp.push(array[i]);
        }
    }
    return temp;
};

/* 
 * 判断数组中是否包含字符串
 */
exports.IncludeStr = function (array, str) {
    var temp = false; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (array[i] === str) {
            temp = true;
        }
    }
    return temp;
};

/* 
 * 获取当前日期
 * 格式 yyyyMMdd
 */
exports.getCurrDate = function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    if(month <10 ){
        month = `0${month}`;
    }

    if(day <10 ){
        day = `0${day}`;
    }

    let temp = year + month + day;
    return temp;
};

/* 
 * 获取当前时间的N分钟之前
 * 格式 yyyy-MM-dd hh:mm:ss
 */
exports.getCurrTimeNMinuteBefore = function (n) {
    let date = new Date((new Date()).getTime()-n*60*1000);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if(month <10 ){
        month = `0${month}`;
    }

    if(day <10 ){
        day = `0${day}`;
    }

    if(hour <10 ){
        hour = `0${hour}`;
    }

    if(minute <10 ){
        minute = `0${minute}`;
    }

    if(second <10 ){
        second = `0${second}`;
    }

    let temp =`${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return temp;
};

/* 
 * 获取当前时间
 * 格式 yyyy-MM-dd hh:mm:ss
 */
exports.getCurrTime = function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if(month <10 ){
        month = `0${month}`;
    }

    if(day <10 ){
        day = `0${day}`;
    }

    if(hour <10 ){
        hour = `0${hour}`;
    }

    if(minute <10 ){
        minute = `0${minute}`;
    }

    if(second <10 ){
        second = `0${second}`;
    }

    let temp =`${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return temp;
};
