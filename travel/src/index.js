import React from 'react';
import ReactDOM from 'react-dom';
import {
    Toast
} from 'antd-mobile';
import TabBarFT from './js/tabBar';
import registerServiceWorker from './registerServiceWorker';
Toast.loading('加载中...',0);

//实例组件类并输出信息。
ReactDOM.render( <TabBarFT /> , document.getElementById('root'),()=>{
    Toast.hide();
});
registerServiceWorker();