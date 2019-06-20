if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;


function success() {
require('../..//app');
require('../../pages/myform/index');
require('../../pages/createform/index');
require('../../pages/my/index');
require('../../pages/createform/newform/newform');
require('../../pages/createform/testform/testform');
require('../../pages/createform/createTitle/createTitle');
require('../../pages/createform/createRadio/createRadio');
require('../../pages/createform/formConfig/formConfig');
require('../../pages/myform/form/form');
require('../../pages/myform/replyData/replyData');
require('../../pages/myform/QRCode/QRCode');
require('../../pages/myform/replyStatistics/replyStatistics');
require('../../pages/my/help/help');
require('../../pages/my/about/about');
require('../../pages/createform/createCheckbox/createCheckbox');
require('../../pages/myform/deminder/deminder');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}