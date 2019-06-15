var chartTypeFile = require("../chartType.js");
var chartType = chartTypeFile.chartType;
var brokenLinetPainterFile = require("brokenLinePainter.js");
var brokenLinePainterThreeFile = require("brokenLinePainterThree.js");
var painterFactory = {
    createObj : function(canvas_id, options){
        var obj = {};
        var chart_type = options.chart_type;
        switch(chart_type){
            case chartType.brokenLine:
            obj = brokenLinetPainterFile.brokenLinetPainter.createObj(canvas_id, options);
                break;
            case chartType.brokenLineThree:
    obj = brokenLinePainterThreeFile.brokenLinetPainterThree.createObj(canvas_id, options);
                break;
            default:
                break;
        }
        return obj;
    }
}

module.exports.painterFactory = painterFactory;