var app = getApp();
Page({
    data: {
        id: '',
        title: '',
        description: '',
        checkboxData: [''],
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
                checkboxData: app.components[query.index].checkboxData
            })
        }else{
            this.setData({
                id: new Date().getTime(),
                title: '',
                description: '',
                checkboxData: [''],
                isEdit: false
            })
        }
    },

    //标题输入
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

    //输入选项文本
    bindChaechboxText(e) {
        let index = e.target.dataset.index;
        let checkboxText = this.data.checkboxData;
        checkboxText[index] = e.detail.value;
        this.setData({
            chaechboxData: checkboxText
        })
    },

    //添加单选新选项或其他
    addCheckbox(e) {
        let checkboxItems = this.data.checkboxData;
        checkboxItems.push('')
        this.setData({
            checkboxData: checkboxItems
        })
    },

    delete(e) {
        let index = e.target.dataset.index;
        let checkboxItems = this.data.checkboxData;
        checkboxItems.splice(index, 1);

        this.setData({
            checkboxData: checkboxItems
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
        for(let i in this.data.checkboxData){
            if(this.data.checkboxData[i].trim() === ""){
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
            type: "checkbox",
            title: this.data.title,
            description: this.data.description,
            checkboxData: this.data.checkboxData,
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
            checkboxData: ['']
        })
    }
});

