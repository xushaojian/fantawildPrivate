var chartColorFile = require("../chartColor.js")
var basePainter = {
    createObj : function(){
        var obj = {}; 
        obj.color = chartColorFile.chartColor;
        return obj;
    }
}

module.exports.basePainter = basePainter;