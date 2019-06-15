
var painterFactoryFile = require("painter/painterFactory.js");
var painterFactory = painterFactoryFile.painterFactory;
var chartUtil = {
    createObj : function(){
        var obj = {};
        var _canvas_id = null;
        var _options = null;
        
        obj.setCanvasId = function(canvas_id){
            _canvas_id = canvas_id;
        }
        obj.getCanvasId = function(){
            return _canvas_id;
        }
        obj.setOptions = function(options){
            _options = options;
        }
        obj.getOptions = function(){
            return _options;
        }
        obj.init = function(canvas_id, options){
            obj.setCanvasId(canvas_id);
            obj.setOptions(options);
        }
        
        obj.draw = function(){
            var testPainterObj = painterFactory.createObj(_canvas_id, _options);
            testPainterObj.draw();
        };
        return obj;
    }
};

module.exports.chartUtil = chartUtil;
var chartTypeFile = require("chartType.js");
var chartType = chartTypeFile.chartType;
module.exports.chartType = chartType;
var chartColorFile = require("chartColor.js");
var chartColor = chartColorFile.chartColor;
module.exports.chartColor = chartColor;
