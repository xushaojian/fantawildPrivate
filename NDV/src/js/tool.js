//获取传入日期的 xxxx-xx-xx 格式 eg date = new Date()
export var getFormat = (date) => {
  return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
}

//获取昨天(xxxx-xx-xx)
export var getYesterday = () => {
  let yesterday = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
  yesterday = getFormat(yesterday);
  return yesterday;
}

//获取中文示意的场数 
//入参  20181024-2
//返回  第二场
export var getField = (field) => {
  let arr = field.split("-")
  return `第 ${arr[1]} 场`;
}

//获取场数 
//入参  "第13场 17:39:22-17:39:22"
//返回  13
export var getFieldNum = (playIndex) => {
  let arr = playIndex.split(" ");
  let num = parseInt(arr[0].substring(1));
  return num;
}


//获取最近30天的开始时间和结束时间
export var getTimePart = () => {
  let timePart = {
    startTime: '',
    endTime: ''
  }
  let startTime = new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000)
  let endTime = new Date()
  timePart.startTime = getFormat(startTime);
  timePart.endTime = getFormat(endTime);
  return timePart;
}

//去掉字符串的 # 号等特殊字符
export var repStr = (str) => {
  var c = str.replace(/[&\|\\\*^%$#@\-]/g, "");
  return c;
}

//去掉 圈数 两个字
export var repCircle = (str) => {
  var c = str.replace("圈数", "");
  return c;
}

//获取当前月份，返回 xxxx-xx 格式的月份
export var getCurrMonth = () => {
  let date = new Date()
  return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1));
}

//获取中文示意的日期和场数 
//入参  20181024-2
//返回  2018-10-24 第2场
export var getDateAndField = (field) => {
  let arr = field.split("-")
  arr[0] = arr[0].slice(0, 6) + "-" + arr[0].slice(6)
  arr[0] = arr[0].slice(0, 4) + "-" + arr[0].slice(4)

  return `${arr[0]} 第 ${arr[1]} 场`;
}

//格式化时间串 
//入参  20181213103905
//返回  2018-12-13 10:39:05
export var getImgTime = (imgTime) => {
  imgTime = imgTime.slice(0, 12) + ":" + imgTime.slice(12)
  imgTime = imgTime.slice(0, 10) + ":" + imgTime.slice(10)
  imgTime = imgTime.slice(0, 8) + " " + imgTime.slice(8)
  imgTime = imgTime.slice(0, 6) + "-" + imgTime.slice(6)
  imgTime = imgTime.slice(0, 4) + "-" + imgTime.slice(4)
  return imgTime;
}

//传入一个日期，获取该日期所在的周 的开始日期和结束日期
//入参： "2018-12-12"
//返回值： ["2018-12-10","2018-12-16"]
export var getWeek = (dete) => {

  var week = []; //装返回值
  var startDate = "";
  var endDate = "";
  var weekday = new Date(dete).getDay(); //获取传入的日期是星期几
  var hs = new Date(dete).getTime(); //获取传入日期的毫秒数

  if (weekday != 0) { //0表示的是星期天 , 1 - 6 表示 周一到周六
    startDate = new Date(hs - (weekday - 1) * 24 * 60 * 60 * 1000)
    endDate = new Date(hs + (7 - weekday) * 24 * 60 * 60 * 1000)

  } else {
    startDate = new Date(hs - 6 * 24 * 60 * 60 * 1000)
    endDate = new Date(hs)
  }

  week.push(getFormat(startDate))
  week.push(getFormat(endDate))

  return week;
}

//获取 周/月/年 类型 的起始日期
//入参：("2018-12-12","week")
//出参：["2018-12-10","2018-12-16"]
//入参：("2018-12","month")
//出参：["2018-12-01","2018-12-31"]
//入参：("2018","year")
//出参：["2018-01-01","2018-12-31"]
export var getDateSegment = (anchorPoint, type) => {
  let dateSegment;
  switch (type) {
    case "week":
      dateSegment = getWeek(anchorPoint);
      break;
    case "month":
      let arr = anchorPoint.split("-") //拆分年份和月份，月份前面有0也没关系
      let temp = new Date(arr[0], arr[1], 0) // 返回某年某月的最后一天 例如： 2018-12-31
      dateSegment = [anchorPoint + "-01", getFormat(temp)]
      break;
    case "year":
      dateSegment = [anchorPoint + "-01-01", anchorPoint + "-12-31"];
      break;
  }
  return dateSegment;
}

export var sum = (arr) => {
  var s = 0;
  for (var i = arr.length - 1; i >= 0; i--) {
    s += arr[i];
  }
  return s;
}