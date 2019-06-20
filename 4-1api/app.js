var express = require('express');
var http = require('http');
var path = require('path');
var cors = require('cors');
var socketio = require('socket.io');
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('app');

var CONFIG = require('./config');
var router = require('./routes');
var mySocket = require('./socket');

var PORT;
var HOST;

//process是node的内置全局变量
if (process.env.NODE_ENV === 'development') {
    PORT = CONFIG.DEVELOPMENT.PORT;
    HOST = CONFIG.DEVELOPMENT.HOST;
} else {
    PORT = CONFIG.PRODUCTION.PORT;
    HOST = CONFIG.PRODUCTION.HOST;
}

//生成一个express实例 app
var app = express();

//设置允许跨域
app.use(cors());

//加载解析urlencoded请求体的中间件
app.use(express.urlencoded({ extended: false }));

//加载解析json的中间件,接受json请求
app.use(express.json());

//静态文件目录设置,设置files文件夹为存放静态文件的目录
//不需要加files 例如 http://127.0.0.1:4343/123.txt
app.use(express.static(path.join(__dirname, 'files')));

//一个简单的路由访问日志记录器
//所有请求都会首先触及这个中间件
app.use(function (req, res, next) {
    logger.info(`${req.method}  http://${req.headers.host + req.url}`);
    next();
});

//将路由统一到一个入口
router(app);

var server = http.createServer(app);
var sio = socketio(server);

//监听客户端连接,回调函数会传递本次连接的socket
sio.on('connection', (socket) => {
    mySocket(sio,socket);
});

server.listen(PORT, HOST, function () {
    console.log('http://%s:%s', HOST, PORT);
});

