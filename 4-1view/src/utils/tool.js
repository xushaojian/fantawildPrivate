//获取传入日期的 xxxx-xx-xx 格式 eg date = new Date()
export var getFormat = (date) => {
    if(date==null) return '';
    var d = new Date(date);
    return  d.getFullYear() + '-' + ((d.getMonth()+1)<10?('0'+(d.getMonth()+1)):(d.getMonth()+1)) + '-' + (d.getDate()<10?('0'+d.getDate()):d.getDate())+ ' ' +(d.getHours()<10?('0'+d.getHours()):d.getHours())+ ':'+(d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes())+ ':'+(d.getSeconds()<10?('0'+d.getSeconds()):d.getSeconds());
}
export var arrayMax=(arr)=>{
    var num=arr[0];
    for(var i=0;i<arr.length;i++){
        if(num<arr[i]) num=arr[i];
    }
    return num;
}
export var getOptionList=(data)=>{
    if(!data){
        return [];
    }
    let options=[];
    data.map((item,i)=>{
        options.push(<Option value={item.Id} key={item.Id}>{item.Name}</Option>)
    });
    return options;
}
export var getUserOptionList=(data)=>{
    if(!data){
        return [];
    }
    let options=[];
    data.map((item,i)=>{
        options.push(<Option value={item.MinisterUserId} key={item.MinisterUserId}>{item.MinisterUserName}</Option>)
    });
    return options;
}