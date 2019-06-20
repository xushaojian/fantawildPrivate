class Base {
    constructor() {
        this.result = {
            code: 0,
            msg: 'success',
            data: null
        };
    }

    setResult(code, msg, data) {
        this.result.code = code;
        this.result.msg = msg;
        this.result.data = data;
    } 

    getResult() {
        return this.result;
    } 
}

module.exports = Base;
