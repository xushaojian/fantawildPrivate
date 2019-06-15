var basePainterFile = require("basePainter.js");
//与两小时图不同的是，X轴只有开始和结束坐标，根据这三天的数据量做等分处理
var brokenLinetPainter = {
    createObj: function (canvas_id, options) {
        var obj = basePainterFile.basePainter.createObj();
        obj.draw = function () {
            //获取系统信息
            var system_info = null;
            wx.getSystemInfo({
                success: function (res) {
                    system_info = res;
                }
            });
            //获取配置
            var dataObj = options.dataObj;

            console.log(dataObj.dataObj.one);
            console.log(dataObj.dataObj.two);
            console.log(dataObj.dataObj.three);
            console.log(dataObj.dataObj.hourOne);
            console.log(dataObj.dataObj.hourTwo);
            console.log(dataObj.dataObj.hourThree);

            var daydayday = dataObj.dataObj.date;

            var one = dataObj.dataObj.one;
            var hourOne = dataObj.dataObj.hourOne;

            var two = dataObj.dataObj.two;
            var hourTwo = dataObj.dataObj.hourTwo;

            var three = dataObj.dataObj.three;
            var hourThree = dataObj.dataObj.hourThree;


            var line_color = options.line_color;
            var text = options.text;
            var unit = options.unit;
            var font_size = options.font_size;


            //声明上下文
            var context = wx.createContext();

            var canvas_left = 2;//显示区域的left
            var canvas_top = 60;//显示区域的的top
            var canvas_width = system_info.windowWidth - 2 * canvas_left;//显示区域的宽度
            var canvas_height = 200;//显示区域的高度

            var yScale = [620, 640, 660, 680, 700, 720, 740, 760, 780];//首尾需为最小值，最大值
            var xScale = [0,2,4,6,8,10,12,14,16,18,20,22,24];//X轴    
            var warmLine = [690, 710];//其中的数值应包含在最大值和最小值之间
            var YHeight = 0;


            //画标题
            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(20);
            context.fillText(text, 5, 30);
            context.closePath();
            //画单位
            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(13);
            context.fillText(unit, 10, 50);
            context.closePath();
            //画边框
            // context.beginPath();
            // context.rect(canvas_left, canvas_top, canvas_width, canvas_height);
            // context.setLineWidth(1);
            // context.setStrokeStyle("#ccccff");
            // context.stroke();
            // context.closePath();
            
            //画内网格
            context.beginPath();
            context.setStrokeStyle("#CFCFCF");
            context.setLineWidth(0.5);
            //X 轴
            
            // for (var i = 1; i < xScale.length; i++) {
            // context.moveTo(canvas_left + i * (canvas_width / (xScale.length-1)), canvas_top + canvas_height);
            // context.lineTo(canvas_left + i * (canvas_width / (xScale.length - 1)), canvas_top);
            // }
            
            //Y 轴

            for (var i = 0; i < yScale.length; i++) {
                YHeight = canvas_top + canvas_height - (yScale[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))
                //还要减去X轴刻度的高度
                context.moveTo(canvas_left, YHeight);//起点
                context.lineTo(canvas_left + canvas_width, YHeight);//终点

            }
            context.stroke();
            context.closePath();

            //画警戒线
            context.beginPath();
            context.setLineWidth(0.5);
            context.setStrokeStyle("#FF0000");
            for (var i = 0; i < warmLine.length; i++) {
                YHeight = canvas_top + canvas_height - (warmLine[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))
                //还要减去X轴刻度的高度                
                context.moveTo(canvas_left, YHeight);
                context.lineTo(canvas_left + canvas_width, YHeight);
            }
            context.stroke();
            context.closePath();

            //画警戒线的刻度
            context.beginPath();
            context.setFontSize(font_size);
            context.setFillStyle(obj.color.red);
            for (var i = 0; i < warmLine.length; i++) {
                YHeight = canvas_top + canvas_height - (warmLine[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))
                context.fillText(warmLine[i], canvas_left + canvas_width - font_size * 2, YHeight);
            }

            context.closePath();

            //画刻度
            //X轴
           
                context.beginPath();
                context.setFontSize(font_size);
                context.setFillStyle(obj.color.black);

                for (var i = 0; i < xScale.length; i++) {
                 //尾位做小量偏移
                if (i == xScale.length-1){//左偏移
                     context.fillText('' + xScale[i], canvas_left + i * (canvas_width / (xScale.length - 1))-font_size, canvas_top + canvas_height + font_size + 10);
                 }else{
                context.fillText(''+xScale[i], canvas_left + i * (canvas_width /( xScale.length - 1)), canvas_top + canvas_height + font_size + 10);

                 }
                   
                }
           

            //Y轴
            for (var i = 0; i < yScale.length; i++) {
YHeight = canvas_top + canvas_height - (yScale[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]))
            context.fillText(yScale[i], canvas_left, YHeight + 3);
            }
            context.closePath();


            //画日期
            //画标题
            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(13);
            context.fillText(daydayday[0], canvas_left+10, canvas_top+canvas_height+50);
            context.closePath();

            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(13);
            context.fillText(daydayday[1], canvas_left +110, canvas_top + canvas_height + 50);
            context.closePath();


            context.beginPath();
            context.setFillStyle(obj.color.black);
            context.setFontSize(13);
            context.fillText(daydayday[2], canvas_left +210, canvas_top + canvas_height + 50);
            context.closePath();

            
            //画日期颜色线

            context.beginPath();
            context.setLineWidth(2);
            context.setStrokeStyle("#FFA500");
            context.moveTo(canvas_left + 85, canvas_top + canvas_height + 45);
            context.lineTo(canvas_left + 100, canvas_top + canvas_height + 45);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.setLineWidth(2);
            context.setStrokeStyle("#008B8B");
            context.moveTo(canvas_left + 185, canvas_top + canvas_height + 45);
            context.lineTo(canvas_left + 200, canvas_top + canvas_height + 45);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.setLineWidth(2);
            context.setStrokeStyle("#0000CD");
            context.moveTo(canvas_left + 285, canvas_top + canvas_height + 45);
            context.lineTo(canvas_left + 300, canvas_top + canvas_height + 45);

            context.stroke();
            context.closePath();
            
            let ydata_i=0;
            let xdata_i=0;
            let point = canvas_width / (24*2);//每半个小时的宽度
            
            //根据数据画曲线
            //第一天

            context.beginPath();
            context.setStrokeStyle("#FFA500");
            context.setLineWidth(1.5);
            for (var i = 0; i < one.length; i++) {
                //Y轴高度
                ydata_i = canvas_top + canvas_height - (one[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]));
                
                xdata_i = canvas_left + hourOne[i] * 2 * point
                context.lineTo(xdata_i,ydata_i);

            }
            context.stroke();
            context.closePath();

            //第二天
            context.beginPath();
            context.setStrokeStyle('#008B8B');
            context.setLineWidth(1.5);
            for (var i = 0; i < two.length; i++) {
                //Y轴高度
                ydata_i = canvas_top + canvas_height - (two[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]));

                xdata_i = canvas_left + hourTwo[i] * 2 * point
                context.lineTo(xdata_i, ydata_i);

            }
            context.stroke();
            context.closePath();

            //第三天
            context.beginPath();
            context.setStrokeStyle('#0000CD');
            context.setLineWidth(1.5);
            for (var i = 0; i < three.length; i++) {
                //Y轴高度
                ydata_i = canvas_top + canvas_height - (three[i] - yScale[0]) * (canvas_height / (yScale[yScale.length - 1] - yScale[0]));

                xdata_i = canvas_left + hourThree[i] * 2 * point
                context.lineTo(xdata_i, ydata_i);

            }
            context.stroke();
            context.closePath();

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

module.exports.brokenLinetPainterThree = brokenLinetPainter;