** 如果当前的中间件功能没有结束请求响应周期，则必须调用next()将控制传递给下一个中间件函数。否则，请求将被搁置。(常见情景：服务器手动回车后才能接收下一个请求)

** 中间件是在管道中执行的。你可以想象一个送水的真实管道。水从一端泵入，然后在到达目的地之前还会经过各种仪表与阀门。
   这个比喻很重要的一部分就是顺序问题，你把压力表放在阀门之前和之后效果是不同的。

** 在管道最后面我们会放一个来处理和前面任何路由都不匹配的请求。也就是错误处理中间件一般返回状态吗404.

**可以把一个中间件理解为一个处理函数（从请求产生响应），通过app.use(<中间件名称>)方法将中间件添加到一个列表中。
  当HTTP请求到达时，Express会依次调用队列中的中间件，它们的功能便会依次执行，直到某个中间件返回了HTTP响应为止。
**

Request 对象 - request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性。常见属性有：

req.app：当callback为外部文件时，用req.app访问express的实例
req.baseUrl：获取路由当前安装的URL路径
req.body / req.cookies：获得「请求主体」/ Cookies
req.fresh / req.stale：判断请求是否还「新鲜」
req.hostname / req.ip：获取主机名和IP地址
req.originalUrl：获取原始请求URL
req.params：获取路由的parameters
req.path：获取请求路径
req.protocol：获取协议类型
req.query：获取URL的查询参数串
req.route：获取当前匹配的路由
req.subdomains：获取子域名
req.accepts()：检查可接受的请求的文档类型
req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages：返回指定字符集的第一个可接受字符编码
req.get()：获取指定的HTTP请求头
req.is()：判断请求头Content-Type的MIME类型
Response 对象 - response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。常见属性有：

res.app：同req.app一样
res.append()：追加指定HTTP头
res.set()在res.append()后将重置之前设置的头
res.cookie(name，value [，option])：设置Cookie
opition: domain / expires / httpOnly / maxAge / path / secure / signed
res.clearCookie()：清除Cookie
res.download()：传送指定路径的文件
res.get()：返回指定的HTTP头
res.json()：传送JSON响应
res.jsonp()：传送JSONP响应
res.location()：只设置响应的Location HTTP头，不设置状态码或者close response
res.redirect()：设置响应的Location HTTP头，并且设置状态码302
res.render(view,[locals],callback)：渲染一个view，同时向callback传递渲染后的字符串，如果在渲染过程中有错误发生next(err)将会被自动调用。callback将会被传入一个可能发生的错误以及渲染后的页面，这样就不会自动输出了。
res.send()：传送HTTP响应
res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定Content-Type
res.set()：设置HTTP头，传入object可以一次设置多个头
res.status()：设置HTTP状态码
res.type()：设置Content-Type的MIME类型


编程规范：
1、使用单引号
2、大括号位置
if (true) {
    console.log('winning');
}
4、函数名，变量名 采用小驼峰命名法 ：adminUser
5、类名采用大驼峰命名法 ：AdminUser
6. 常量命名 ：单词的所有字母都大写，并用下划线分割 PINK_COLOR
7、 CSS 类使用连字号 如 font-family ，text-align等
8、尽早的从函数中返回
    function isPercentage(val) {
    if (val < 0) {
        return false;
    }
    if (val > 100) {
        return false;
    }
    return true;
}

9.异步回调函数的第一个参数应该是错误指示
10.类继承
function Socket(options) {
    // ...
    stream.Stream.call(this);
    // ...
}

util.inherits(Socket, stream.Stream);

11.
C.2.9　注解规范
一般情况下，我们会对每个方法编写注释，这里采用dox的推荐注释，示例如下：
/**
* Queries some records
* Examples:
* ```
* query('SELECT * FROM table', function (err, data) {
* // some code
* });
* ```
* @param {String} sql Queries
* @param {Function} callback Callback
*/
exports.query = function (sql, callback) {
    // ...
};

dox的注释规范源自于JSDoc。可以通过注释生成对应的API文档。


常见http错误
400 Invalid syntax. 语法问题
404 Object not found. 对象没有找到
500 Internal server error. 服务器内部错误




强制https
// force https
app.use((ctx, next) => {
    if(ctx.protocol == 'http') {
        ctx.redirect(ctx.href.replace('http', 'https'))
    } else {
        return next()
    }
})


log4js
解释：
"type": "dateFile"   // 可以设置成 console、file、dateFile三种
"filename": "./logs/access-", // 设置log输出的文件路劲和文件名

"pattern": ".yyyy-MM-dd.log",
"alwaysIncludePattern": true, // 和上面同时使用 设置每天生成log名

"encoding": "utf-8", // 设置文件编码格式
"maxLogSize ": 31457280 // 设置文件大小

"level": "debug", // 设置log输出的最低级别
"maxLevel": "error" // 设置log输出的最高级别 
// log级别为8级 ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF。默认级别是 OFF

logger.debug("this is debug");//等级最低
logger.trace("this is trace");
logger.info("this is info");
logger.warn("this is warn");
logger.error("this is error");
logger.fatal("this is fatal");//等级最高


console.log(process.env.NODE_ENV)




