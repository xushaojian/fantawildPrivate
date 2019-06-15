var app = getApp();
Page({
    data: {
        id: '',
        title: '',
        description: '',
        radioData: [''],
        isEdit: false//判断是修改还是新建
    },

    onLoad(query) {
        if (query.type != undefined && query.type === "edit") {
            this.setData({
                id:query.id,
                isEdit: true,
                index: query.index,
                title: app.components[query.index].title,
                description: app.components[query.index].description,
                radioData: app.components[query.index].radioData
            })
        }else{
            this.setData({
                id: new Date().getTime(),
                title: '',
                description: '',
                radioData: [''],
                isEdit: false
            })
        }
    },

    //单选标题输入
    bindKeyInput(e) {
        this.setData({
            title: e.detail.value,
        });
    },

    //输入提示文本
    bindKeyTextarea(e) {
        this.setData({
            description: e.detail.value,
        });
    },

    //输入单选按钮文本
    bindRadioText(e) {
        let index = e.target.dataset.index;
        let radioText = this.data.radioData;
        radioText[index] = e.detail.value;
        this.setData({
            radioData: radioText
        })
    },

    //添加单选新选项或其他
    addRadio(e) {
        let radioItems = this.data.radioData;
        radioItems.push('')
        this.setData({
            radioData: radioItems
        })
    },

    delete(e) {
        let index = e.target.dataset.index;
        let radioItems = this.data.radioData;
        radioItems.splice(index, 1);
        this.setData({
            radioData: radioItems
        })
    },

    sure() {

        if(this.data.title.trim() === ""){
            dd.showToast({
                type: 'fail',
                content: '单选标题不能为空',
                duration: 3000,
            });
            return
        }

        let temp = false;
        for(let i in this.data.radioData){
            if(this.data.radioData[i].trim() === ""){
                temp = true;
                break;
            }
        }

        if(temp){
            dd.showToast({
                type: 'fail',
                content: '选项不能为空',
                duration: 3000,
            });
             return
        }


        let componentItem = {
            id: this.data.id,
            type: "radio",
            title: this.data.title,
            description: this.data.description,
            radioData: this.data.radioData,
            border: ""
        };


        if (this.data.isEdit) {
            app.components[this.data.index] = componentItem
        } else {
            app.components.push(componentItem)
        }

        //返回
        dd.navigateBack({
            delta: 1
        })
    },

    //清除页面信息
    clear() {
        this.setData({
            title: '',
            description: '',
            radioData: ['']
        })
    }
});
