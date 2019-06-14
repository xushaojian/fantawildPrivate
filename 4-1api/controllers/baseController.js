class BaseController {
    // constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
    constructor() {
        this.result = {
            code: 0,
            msg: 'success',
            data: null
        };
    }

    getResult(code, msg, data) {
        this.result.code = code;
        this.result.msg = msg;
        this.result.data = data;
        return this.result;
    } 
}

module.exports = BaseController;
