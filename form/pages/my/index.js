Page({
  data: {
    userInfo:{},
    listData: {
      title:"",
      data: [
        {
          thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
          title: '使用帮助',
          arrow: 'horizontal',
          onItemTap:'onTapForHelp'
        },{
          thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
          title: '关于',
          arrow: 'horizontal',
          onItemTap:'onTapForAbout'
        }
      ]
    },
  },

    onLoad(){
        let that = this;
        dd.getStorage({ 
            key: "userInfo",
            success: function(res) {
                console.log(res)
                if(res.data.avatar === ""){
                    res.data.avatar = '/image/myactive.png'
                }
                that.setData({
                    userInfo:res.data
                })
            },
            fail: function(res){
                dd.alert({content: res.errorMessage});
            }
        });
    },

    onItemTap(){

        // dd.chooseChat({
           
        //     success:function(res){
        //         console.log(JSON.stringify(res))
        //         dd.alert({
        //             content:JSON.stringify(res)
        //         })
        //         /*{
        //             id: 123   //企业群id
        //         }*/            
        //     },
        //     fail:function(err){
        //         dd.alert({
        //             content:JSON.stringify(err)
        //         })
        //     }
        // });

    },

    onTapForHelp(e){
        dd.navigateTo({
            url: 'help/help'
        })
    },

    onTapForAbout(e){
        dd.navigateTo({
            url: 'about/about'
        })
    }
})