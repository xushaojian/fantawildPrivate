Page({
  data: {
    pageName: 'biz/index',
    pageInfo: {
      pageId: 0,
    },
    curIndex: 0,
    arr: {
      onItemTap: 'onGridItemTap',
      list: [{
        icon: '/image/kongbai.png',
        title: '空白表单',
        page: '/pages/createform/newform/newform',
      }, {
        icon: '/image/tongyong.jpg',
        title: '团建投票',
        page: '/pages/createform/testform/testform',
      }, {
        icon: '/image/ydh.png',
        title: '服装尺码',
        page: '/pages/createform/testform/testform',
      }, {
        icon: '/image/zq.png',
        title: '中秋',
        page: '/pages/createform/testform/testform',
      }, {
        icon: '/image/nh.png',
        title: '年会报名',
        page: '/pages/createform/testform/testform',
      }, {
        icon: '/image/px.png',
        title: '培训满意度',
        page: '/pages/createform/testform/testform',
      }],
    },
  },
  onGridItemTap(e) {
    const page = this.data.arr.list[e.currentTarget.dataset.index].page;
    dd.navigateTo({ url: page });
  },
});
