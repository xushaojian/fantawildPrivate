import { query as querySysIcons,removeSysIcons,updateSysIcons,addSysIcons} from '../services/sysIcon';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'sysIcon',
  state: {
    allData:{
        list: [],
        pagination:{}
    } 
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let token=getToken();
      payload={
        body:{...payload} ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(querySysIcons,payload);
      yield put({
        type: 'getSysIcons',
        payload: response.data,
      });
    },
    

    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.action) {
        callback = Object.keys(payload).length ===4 ? removeSysIcons : updateSysIcons;
      } else {
        callback = addSysIcons;
      }
      let token=getToken();
      let current_user=JSON.parse(getCurrentUser());
       payload={
        body:{
          ...payload,
          accountName:current_user.AccountName
        } ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(callback, payload); // get
      if(response.code==200){
        message.success('提交成功');
        yield put({
          type: 'getSysIcons',
          payload: response.data,
        });
      }else{
        message.error('提交失败');  
      }
    },

  },

  reducers: {
    getSysIcons(state, action) {
      return {
        ...state,
        allData: action.payload,
      };
    },
    
  },
};
