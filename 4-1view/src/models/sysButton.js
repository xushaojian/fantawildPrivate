import { query as querySysButtons,removeSysButtons,updateSysButtons,addSysButtons} from '../services/sysButton';
import {queryIcon as querySysIcons} from '../services/sysMenu';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'sysButton',
  state: {
    iconData:[],
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
      const response = yield call(querySysButtons,payload);
      yield put({
        type: 'getSysButtons',
        payload: response.data,
      });
    },
    *fetchIcon(_, { call, put }) {
        let token=getToken();
        const payload={
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(querySysIcons,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysIcons',
          payload: data.iconData,
        })
      },

    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.action) {
        callback = Object.keys(payload).length ===4 ? removeSysButtons : updateSysButtons;
      } else {
        callback = addSysButtons;
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
          type: 'getSysButtons',
          payload: response.data,
        });
      }else{
        message.error('提交失败');  
      }
    },

  },

  reducers: {
    getSysButtons(state, action) {
      return {
        ...state,
        allData: action.payload,
      };
    },
    getSysIcons(state, action) {
        return {
          ...state,
          iconData: action.payload,
        };
      },
  },
};
