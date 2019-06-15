import Jquery from 'jquery';
import './../css/jqalert.css';
import ReactStringReplace from 'react-string-replace';

//数组去重
export var unique = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) == -1) { //判断在s数组中是否存在，不存在则push到s数组中
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

//获取传入日期的 xxxx-xx-xx 格式 eg date = new Date()
export var getFormat = (date) => {
    return  date.getFullYear() + '-' + ((date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1)) + '-' + (date.getDate()<10?('0'+date.getDate()):date.getDate());
}

//获取最近30天的开始时间和结束时间
export var getTimePart = () => {
  let timePart = {startTime:'',endTime:''}
  let startTime = new Date((new Date()).getTime()- 30*24 * 60 * 60 * 1000)
  let endTime = new Date()
  timePart.startTime = getFormat(startTime);
  timePart.endTime = getFormat(endTime);
  return timePart;
}

/*alert弹出层*/
export function jqalert(param) {
  var title = param.title,
    content = param.content,
    click_bg = param.click_bg;

  if (click_bg === undefined) {
    click_bg = true;
  }

  var htm = '';
  htm += '<div class="jq-alert" id="jq-alert"><div class="live-alert">';
  htm += '<h2 class="live-title">' + title + '</h2>'; 
  htm += '<div class="live-content">' + content + '</div></div>';
  
  Jquery('body').append(htm);
  var al = Jquery('#jq-alert');
  //添加点击事件
  al.on('click', '[data-role="cancel"]', function () {
    al.remove();  
  });
  Jquery(document).delegate('.jq-alert', 'click', function (event) {
    event.stopPropagation();
  });
  
  if (click_bg === true) {
    Jquery(document).delegate('#jq-alert', 'click', function () {
      setTimeout(function () {
        al.remove();
      }, 200);
    });
  }
}

/*alert-exporting弹出层*/
export function jqalert_exporting(param) {
  var title = param.title,
    content = param.content,
    click_bg = param.click_bg;

  if (click_bg === undefined) {
    click_bg = true;
  }

  var htm = '';
  htm += '<div class="jq-alert" id="jq-alert"><div class="live-alert-exporting">';
  htm += '<h2 class="live-title">' + title + '</h2>'; 
  htm += '<div class="live-content-exporting">' + content + '</div></div>';
  
  Jquery('body').append(htm);
  var al = Jquery('#jq-alert');
  //添加点击事件
  al.on('click', '[data-role="cancel"]', function () {
    al.remove();  
  });
  Jquery(document).delegate('.jq-alert', 'click', function (event) {
    event.stopPropagation();
  });
  
  if (click_bg === true) {
    Jquery(document).delegate('#jq-alert', 'click', function () {
      setTimeout(function () {
        al.remove();
      }, 200);
    });
  }
}

// 提取字符串中的数字,目前仅适用于树图接口
export function getNum(str) {
  let num = ReactStringReplace(str, /(\d+)/g, (match, i) => (
    match
  ));
  return num[1];
}
