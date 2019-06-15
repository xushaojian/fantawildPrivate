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
}

/* 
 * 数组去重.
 */
exports.uniqArr = function (array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    return temp;
}

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
}

