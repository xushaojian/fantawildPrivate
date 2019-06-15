import {queryTree as queryMenuTree, removeMenu,updateMenu,addMenu} from '../services/sysMenu';
import {queryIcon as querySysIcons,queryButton as querySysButtons,queryMenuButton as querySysMenuButtons,addMenuButton} from '../services/sysMenu';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'sysMenu',
  state: {
    buttonData:[],
    treeData:[],
    iconData:[],
    menuButtonData:[],
    menuLength:0
  },

  effects: {
    *fetchTree(_, { call, put }) {
      let token=getToken();
      // console.log('token:'+token);
      const payload={
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
        const response = yield call(queryMenuTree,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysMenuTree',
          payload: data.treeData,
        })
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
      *fetchButton(_, { call, put }) {
        let token=getToken();
        const payload={
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(querySysButtons,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysButtons',
          payload: data.buttonData,
        })
      },
      *fetchMenuButton({ payload }, { call, put }) {
        let token=getToken();
         payload={
          body:{
            ...payload,
          } ,
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(querySysMenuButtons,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysMenuButtons',
          payload: data.menuButtonData,
        })

        yield put({
          type: 'getSysMenuLength',
          payload: data.menuLength,
        })
      },

      *submit({ payload }, { call, put }) {
        let callback;
        console.log(payload);
        if (payload.action) {
          callback = Object.keys(payload).length ===2 ? removeMenu : updateMenu;
        } else {
          callback = addMenu;
        }
        console.log(callback);
        let token=getToken();
        let current_user=JSON.parse(getCurrentUser());
         payload={
          body:{
            ...payload,
            userName:current_user.AccountName
          } ,
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(callback, payload); // get
        console.log(response);
        if(response.code==200){
          message.success('提交成功');
          yield put({
            type: 'getSysMenuTree',
            payload: response.data.treeData,
          });
        }else{
          message.error('提交失败');  
        }
      },
      *submitButton({ payload }, { call, put }) {
        let token=getToken();
        let current_user=JSON.parse(getCurrentUser());
         payload={
          body:{
            ...payload,
            userName:current_user.AccountName
          } ,
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(addMenuButton, payload); // get
        console.log(response);
        if(response.code==200){
          message.success('提交成功');
          yield put({
            type: 'getSysMenuTree',
            payload: response.data.treeData,
          });
        }else{
          message.error('提交失败');  
        }
       
      },
  },

  reducers: {
    getSysMenuTree(state, action) {
        return {
          ...state,
          treeData: action.payload,
        };
      },
      getSysIcons(state, action) {
        return {
          ...state,
          iconData: action.payload,
        };
      },
      getSysButtons(state, action) {
        return {
          ...state,
          buttonData: action.payload,
        };
      },
      getSysMenuButtons(state, action) {
        return {
          ...state,
          menuButtonData: action.payload,
        };
      },
      getSysMenuLength(state, action) {
        return {
          ...state,
          menuLength: action.payload,
        };
      },
  },
};
