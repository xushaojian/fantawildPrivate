var express = require('express');
var http = require('http');
var path = require('path');
//解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理
var mutipart = require('connect-multiparty');
var cors = require('cors');

var log4js = require('log4js');
log4js.configure('./log4js.json');

var CONFIG = require("./config");
var ddRouter = require('./routes/ddRouter');
var formAppRouter = require('./routes/formAppRouter');
var webRouter = require('./routes/webRouter');
//生成一个express实例 app
var app = express();

//设置允许跨域
app.use(cors());

//加载解析urlencoded请求体的中间件
app.use(express.urlencoded({ extended: false }));

//加载解析json的中间件,接受json请求
app.use(express.json());

var PORT;
var HOST;
if (process.env.NODE_ENV === "development") {
    PORT = CONFIG.DEVELOPMENT.PORT;
    HOST = CONFIG.DEVELOPMENT.HOST;
} else {
    PORT = CONFIG.PRODUCTION.PORT;
    HOST = CONFIG.PRODUCTION.HOST;
}
app.listen(PORT, HOST,function () {
    console.log('http://%s:%s', HOST, PORT);
  });

//静态文件目录设置,设置public文件夹为存放静态文件的目录
//不需要加file或dist 例如 http://127.0.0.1:4343/123.txt
app.use(express.static(path.join(__dirname, 'file')));
app.use(express.static(path.join(__dirname, 'dist')));

//修改临时文件的储存位置
app.use(mutipart({ uploadDir: 'file' }));
app.use(log4js.connectLogger(log4js.getLogger("app"), { level: 'INFO' }));
//路由控制器
app.use('/formAppRouter', formAppRouter);
app.use('/ddRouter', ddRouter);
app.use('/webRouter', webRouter);
//Create HTTP server.
http.createServer(app).listen(8888);






