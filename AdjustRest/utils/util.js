function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getTopOneHour(date) {//获取前一小时的，并把分秒制0
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours()-1;
  if(hour==-1){
    hour = 23;
    day = day -1;
    if(day == 0){
      day = 30;
      month = month-1;
      if(month==0){
        month = 12;
        year = year - 1;
      }
    }
  }
  var minute = "00";
  var second ="00";
  return year + "-" + month + "-" + day + " " + hour+":00:00"
}

function getToday(){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if(month<10){
    month = '0'+month
  }
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day
  }
  return year + "-" + month + "-" + day;
}


function getMonthBegin() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month
  }
  return year + "-" + month + "-01";
}

//获取日期和星期几,获取当前星期X(0-6,0代表星期天)
function getDay(){
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var week = date.getDay()
  var str = '';
 switch(week){
   case 0:
     str = year + "-" + month + "-" + day + "星期天"
     break
   case 1:
     str = year + "-" + month + "-" + day + "  星期一"
     break
   case 2:
     str = year + "-" + month + "-" + day + "  星期二"
     break
   case 3:
     str = year + "-" + month + "-" + day + "  星期三"
     break
   case 4:
     str = year + "-" + month + "-" + day + "  星期四"
     break
   case 5:
     str = year + "-" + month + "-" + day + "  星期五"
     break
   case 6:
     str = year + "-" + month + "-" + day + "  星期六"
     break
 }
 return str
} 

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getTopOneHour: getTopOneHour,
  getToday:getToday,
  getMonthBegin: getMonthBegin,
  getDay: getDay,
}
