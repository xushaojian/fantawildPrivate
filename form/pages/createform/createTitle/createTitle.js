var app = getApp();
Page({
    data: {
        id: new Date().getTime(),
        title: "",
        position:"left",
        description: "",
        items: [
            {name: '居左', value: 'left',checked: true},
            {name: '居中', value: 'center',checked: false},
            {name: '居右', value: 'right',checked: false},
        ],
        isEdit:false,//用于判断是否是 edit 事件
        index:''
    },

    onLoad(query) { 
        let app = getApp();
        if(query.type != undefined && query.type === "edit"){
            let temp = this.data.items;
            for(let i = 0 ; i < temp.length ; i++){
                if(temp[i].value == app.components[query.index].position){
                    temp[i].checked = true;
                }else{
                    temp[i].checked = false;
                }
            }

            this.setData({
                isEdit:true,
                index:query.index,
                title:app.components[query.index].title,
                position:app.components[query.index].position,
                description:app.components[query.index].description
            })
        }
        
    },

    bindKeyInput(e) {
        this.setData({
            title: e.detail.value,
        });
    },

    bindKeyTextarea(e) {
        this.setData({
            description: e.detail.value,
        });
    },

    radioChange: function(e) {
        this.setData({
            position: e.detail.value,
        });
    },

    clear(){
        this.setData({
            title: "",
            description:""
        });
    },

    sure() {
        
        if(this.data.title===""){
            dd.showToast({
                type: 'fail',
                content: '标题不能为空',
                duration: 3000,
            });
            return;
        }

        let componentItem = {
            id: this.data.id,
            type : "title",
            title : this.data.title,
            position : this.data.position,
            description : this.data.description,
            border:""
        };

        //如果是edit事件,这执行更新操作,否则执行插入操作
        if(this.data.isEdit){
            app.components[this.data.index] = componentItem
        }else{
            app.components.push(componentItem)
        }

        //返回
        dd.navigateBack({
            delta: 1
        })
    }
});
