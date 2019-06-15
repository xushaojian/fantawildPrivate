var basePainterFile = require("basePainter.js");
/**
 * 折线图,X轴从显示上看为6等分，实际上为120等分
 */
var brokenLinetPainter = {
    createObj : function(canvas_id, options){
        var obj = basePainterFile.basePainter.createObj();
        obj.draw = function(){
            //获取系统信息
            var system_info = null;
            wx.getSystemInfo({
                success: function(res) {
                    system_info = res;
                }
            });
            //获取配置
            var xaxis_list = options.xaxis;
            var yaxis_list = options.yaxis;
            var time_list  = options.time;
            var isQuery = options.isQuery;

            var xaxis = xaxis_list[0];
            var yaxis = yaxis_list[0];

            var xdata = xaxis.xdata;
            var ydata = yaxis.ydata;

            var line_color = options.line_color;//曲线颜色

            var text = options.text;//标题
            var unit = options.unit;//单位
            var font_size = options.font_size;

            //声明上下文
            var context = wx.createContext();
            
            
            var canvas_top = 60;//显示区域的的top
            var canvas_left = 2;
            var canvas_width = system_info.windowWidth-4;//显示区域的宽度
            var canvas_height = 200;//显示区域的高度
            

            var yScale = [620,640,660,680,700,720,740,760,780]//首尾需为最小值，最大值
            var warmLine = [690,710];//其中的数值应包含在最大值和最小值之间
            var YHeight =0;

            var canvas_width_piece_num = 0;//X轴6等分 
            if(isQuery=='no'){
                canvas_width_piece_num = 6;
            }else{
                canvas_width_piece_num = 1;
            }           

            //画标题
            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(20);
            context.fillText(text,10, 30);
            context.closePath();

            //画单位
            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(13);
            context.fillText(unit,10, 50);
            context.closePath();

            //画边框
            // context.beginPath();
            // context.rect(canvas_left, canvas_top, canvas_width, canvas_height);//左上宽高
            // context.setLineWidth(1);
            // context.setStrokeStyle("#ccccff");
            // context.stroke();
            // context.closePath();

            var canvas_width_piece = canvas_width/canvas_width_piece_num;

            //画内网格
            context.beginPath();
            context.setStrokeStyle("#CFCFCF");
            context.setLineWidth(0.5);
            //X 轴
            // if(isQuery=='no'){
            // for(var i=1; i<canvas_width_piece_num; i++){               
            //     context.moveTo(canvas_left+i*canvas_width_piece, canvas_top+canvas_height);
            //     context.lineTo(canvas_left+i*canvas_width_piece, canvas_top);
            // }
            // }
            //Y 轴
            
            for (var i = 0; i < yScale.length; i++){               
                YHeight = canvas_top + canvas_height - (yScale[i] - yScale[0]) *( canvas_height / (yScale[yScale.length - 1] - yScale[0]))
//还要减去X轴刻度的高度
context.moveTo(canvas_left, YHeight);//起点
context.lineTo(canvas_left+canvas_width, YHeight);//终点
                
            }
            context.stroke();
            context.closePath();

            //画警戒线
            context.beginPath();
            context.setLineWidth(0.5);
            context.setStrokeStyle("#FF0000");
            for (var i = 0; i < warmLine.length; i++) {
                YHeight = canvas_top + canvas_height - (warmLine[i] - yScale[0])*(canvas_height / (yScale[yScale.length - 1] - yScale[0]))
//还要减去X轴刻度的高度                
                context.moveTo(canvas_left, YHeight);
                context.lineTo(canvas_left+canvas_width, YHeight);      
            }
            context.stroke();
            context.closePath();

            //画警戒线的刻度
            context.beginPath();
            context.setFontSize(font_size);
            context.setFillStyle(obj.color.red);
            for (var i = 0; i < warmLine.length; i++){
            YHeight = canvas_top + canvas_height - (warmLine[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))
            context.fillText(warmLine[i], canvas_left + canvas_width - font_size*2,YHeight);
            }

            context.closePath();

            //画刻度
            //X轴
            if(isQuery=='no'){
            context.beginPath();
            context.setFontSize(font_size);
            context.setFillStyle("#1C1C1C");

            for(var i=0; i<=canvas_width_piece_num; i++){
                if (i == 6){
                context.fillText(xdata[i], canvas_left+i*canvas_width_piece-font_size-15, canvas_top+canvas_height+font_size+10);
                } else if (i == 0){
                context.fillText(xdata[i], canvas_left + i * canvas_width_piece - font_size+10, canvas_top + canvas_height + font_size+10);
                }else
                {
                    context.fillText(xdata[i], canvas_left + i * canvas_width_piece - font_size, canvas_top + canvas_height + font_size+10);
                }
            }
            }else{

                context.beginPath();
                context.setFontSize(font_size);
                context.setFillStyle(obj.color.black);

                for (var i = 0; i <= canvas_width_piece_num; i++) {
                    if (i == 1) {
                        context.fillText(xdata[i], canvas_left + i * canvas_width_piece - font_size - 15, canvas_top + canvas_height + font_size + 10);
                    } else if (i == 0) {
                        context.fillText(xdata[i], canvas_left + i * canvas_width_piece - font_size + 10, canvas_top + canvas_height + font_size + 10);
                    } 
                }   
            }

            //Y轴
            for (var i = 0; i < yScale.length; i++){
                YHeight = canvas_top + canvas_height - (yScale[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))                
                context.fillText(yScale[i],canvas_left, YHeight+3);               
            }
            context.closePath();
            
            
            //根据数据画曲线
            if(isQuery=='no'){
            context.beginPath();
            context.setStrokeStyle("#0bb20c");
            context.setLineWidth(1);
            let XWidth = 0;
            let timeWidth = 0;
            let timestart = 0;
            let timeend = 0;
            let dbtimehour = 0;
            let dbtimemin = 0;
            let timestr = "";

            if (xaxis.xdata[0].substring(0, 1) == '0') {
                timestart = xaxis.xdata[0].substring(1, 2)
            } else {
                timestart = xaxis.xdata[0].substring(0, 2)
            }
            if (xaxis.xdata[xaxis.xdata.length-1].substring(0, 1) == '0') {
                timeend = xaxis.xdata[xaxis.xdata.length-1].substring(1, 2)
            } else {
                timeend = xaxis.xdata[xaxis.xdata.length-1].substring(0, 2)
            }

            let timeNum = timeend - timestart;
            //console.log("timeNum:" + timeNum);

            for(var i=0; i<ydata.length; i++){
                YHeight = canvas_top + canvas_height - (ydata[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))

                 
                timestr = time_list[0].timedata[i].substring(11, 16);//HH:mi
                if (timestr.substring(0, 1) == '0') {
                    dbtimehour = timestr.substring(1, 2)
                } else {
                    dbtimehour = timestr.substring(0, 2)
                }

                if (timestr.substring(3, 4) == '0') {
                    dbtimemin = timestr.substring(4, 5)
                } else {
                    dbtimemin = timestr.substring(3, 5)
                }
                //console.log("dbtimemin:" + dbtimemin);

                timeWidth = ((dbtimehour - timestart) * 60 - (0 - dbtimemin)) * (canvas_width / (timeNum * 60));//每分钟占用的宽度

                context.lineTo(canvas_left + timeWidth, YHeight);
                
            }
            context.stroke();
            context.closePath();
            }else{

                context.beginPath();
                context.setStrokeStyle("#0bb20c");
                context.setLineWidth(1);
                let XWidth = 0;
                let timeWidth = 0;
                let timestart = 0;
                let timeend = 0;
                let dbtimehour =0;
                let dbtimemin = 0;
                let timestr = "";

                if (xaxis.xdata[0].substring(0,1)=='0'){
                timestart = xaxis.xdata[0].substring(1, 2)   
                }else{
                timestart = xaxis.xdata[0].substring(0, 2) 
                }
                if (xaxis.xdata[1].substring(0, 1) == '0') {
                    timeend = xaxis.xdata[1].substring(1, 2)
                } else {
                    timeend = xaxis.xdata[1].substring(0, 2)
                }

                let timeNum = timeend - timestart;
                console.log("timeNum:" + timeNum);
                
                for (var i = 0; i < ydata.length; i++) {
                    YHeight = canvas_top + canvas_height - (ydata[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))

                    timestr  = time_list[0].timedata[i].substring(11, 16);//HH:mi
                    if (timestr.substring(0, 1) == '0') {
                        dbtimehour = timestr.substring(1, 2)
                    } else {
                        dbtimehour = timestr.substring(0, 2)
                    }

                    if (timestr.substring(3,4) == '0') {
                        dbtimemin = timestr.substring(4, 5)
                    } else {
                        dbtimemin = timestr.substring(3, 5)
                    }
                    console.log("dbtimemin:" + dbtimemin);

                    timeWidth = ((dbtimehour - timestart) * 60 -(0-dbtimemin)) * (canvas_width / (timeNum*60));//每分钟占用的宽度

                    context.lineTo(canvas_left + timeWidth, YHeight);
                }
                context.stroke();
                context.closePath();
            }

            //开始画图
            wx.drawCanvas({
                canvasId: canvas_id,
                actions: context.getActions()
            });

            //重新绑定事件
            var page_obj = options.page_obj;
            page_obj.onTouchStart = obj.onTouchStart;
            page_obj.onTouchMove = obj.onTouchMove;
            page_obj.onTouchEnd = obj.onTouchEnd;
            page_obj.onTouchCancel = obj.onTouchCancel;
        };
        return obj;
    }
}

module.exports.brokenLinetPainter = brokenLinetPainter;