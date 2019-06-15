import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './js/AppRouter/AppRouter';
import { Toast } from 'antd-mobile';
import registerServiceWorker from './registerServiceWorker';
Toast.loading("加载中...",0)
ReactDOM.render( <AppRouter /> , document.getElementById('root'),()=>{
    Toast.hide();
});
registerServiceWorker();