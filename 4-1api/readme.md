# 4-1api
## 基于Express框架（mvc）的api接口框架
## vscode调试 launch.json源码说明
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "4-1api",
            //启动文件
            "program": "${workspaceFolder}/4-1api/app.js",
            //设置环境变量
            "env": {
                "NODE_ENV":"development"
            },
            //项目根目录
            "cwd": "${workspaceFolder}/4-1api/"
        },
    ]
}
```

## 需要全局安装的包
```
进程管理,配置看 pm2.json
npm install -g pm2

代码规范检查 配置看 .eslintrc.json
npm install -g eslint

api文档自动生成 配置看 jsdoc.json
npm install -g jsdoc
执行 jsdoc -c jsdoc.json --debug --recurse

打包node程序成exe(可能会用到)
npm install -g pkg
```
## eslint校验规则
* 基于百度js规范和eslint最佳实践的nodejs开发规范 https://www.npmjs.com/package/eslint-config-fornode

* "off"或者0，不启用这个规则
* "warn"或者1，出现问题会有警告
* "error"或者2，出现问题会报错
* "camelcase": "error" 强制驼峰法命名
* "no-console": "off" 禁用 console
* "no-unused-vars": 2 禁止出现未使用过的变量
* "no-use-before-define": 2 不允许在变量定义之前使用它们
* "linebreak-style": [2, "unix"] 强制使用一致的换行风格
* "quotes": ["error", "single"] 强制使用一致的单引号
* "semi": ["error", "always"] 控制行尾部分号
* "curly": ["error", "all"] 强制所有控制语句使用一致的括号风格
* "global-require": "error" 要求 require() 出现在顶层模块作用域中
* "lines-around-comment": ["error", { "beforeBlockComment": true }] 要求在注释周围有空行 ( 要求在块级注释之前有一空行)
* "newline-after-var": ["error", "always"] 要求或禁止 var 声明语句后有一行空行
* "newline-before-return": "error" 要求 return 语句之前有一空行
* "new-cap": ["error", { "newIsCap": true, "capIsNew": false}] 构造函数首字母大写
* "no-multiple-empty-lines": ["error", {"max": 2}] 空行不能够超过2行
* "max-params": [1, 3] function 定义中最多允许的参数数量
* "prefer-template": "error", // 使用模板而非字符串连接

## jsdoc文档
* https://www.html.cn/doc/jsdoc/about-configuring-jsdoc.html

## pm2的使用
```
参考文档:
http://pm2.keymetrics.io/docs/usage/startup/
https://www.cnblogs.com/luxiaoyao/p/9591009.html

(1)	就4-1api使用流程
        全局安装pm2 :  npm  install  pm2  –g
	全局安装(windows兼容启动脚本) : npm install pm2-windows-startup  –g
	CMD进入到 4-1api 目录
	执行pm2-startup  install;
	执行pm2  kill;
	执行pm2 start pm2.json
	执行pm2  save

上述步骤实现含义: 
	当www.js发生变更时,服务自动重启
	开启一个进程服务,进程数量可选(最大等于cpu核数,负载均衡)
	设置服务名称为DDNodeJsServer
	开机自动启动服务
	CMD窗口可全部关闭,也可以重新调出查看日志

(2)	pm2 常用指令
	pm2  logs  : 查看程序运行日志
	pm2  list  : 列出所有进程/应用
	pm2  restart  app.js : 重启  pm2 reload
	pm2  stop  app_name|app_id
	pm2  stop  all : 停止所有应用
	pm2  start  app.js  --watch : 监听app.js文件,发生变更时自动重启服务
	pm2  start  app.js  -i 3 : 开启三个进程(负载均衡)
	pm2  start  app.js  -i max : 根据CPU核数,开启对应数目的进程(负载均衡)
	pm2  --help : 查看帮助
	PM2  pid : 查看进程id
	pm2 delete www : 删除进程/应用
	重新启动所有进程/应用        pm2 restart all
	查看进程/应用的资源消耗情况       pm2 monit
	查看某个进程/应用具体情况      pm2 describe www
	删除所有进程/应用            pm2 delete all
```
