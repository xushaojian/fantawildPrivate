import { query as querySysUsers,removeSysUsers,updateSysUsers,addSysUsers } from '../services/sysUser';
import {queryTree as queryDepartmentTree,ResetPassword,UpdatePassword} from '../services/sysUser';
import {queryRole as querySysRoles} from '../services/sysUser';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'sysUser',
  state: {
    currentUser:{},
    roleData:[],
    treeData:[],
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
      const response = yield call(querySysUsers,payload);
      yield put({
        type: 'getSysUsers',
        payload: response,
      });
    },
    *fetchUser(_, { call, put }) {
      let current_user=JSON.parse(getCurrentUser());
 
      yield put({
        type: 'setUser',
        payload: current_user,
      });
    },
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
        const response = yield call(queryDepartmentTree,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getDepartmentTree',
          payload: data.treeData,
        })
      },
      *fetchRole(_, { call, put }) {
        let token=getToken();
        const payload={
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(querySysRoles,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysRoles',
          payload: data.roleData,
        })
      },

      *submit({ payload }, { call, put }) {
        let callback;
        if (payload.action) {
          callback = Object.keys(payload).length === 4 ? removeSysUsers : updateSysUsers;
        } else {
          callback = addSysUsers;
        }
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
        if(response.code==200){
          message.success('提交成功');
          yield put({
            type: 'getSysUsers',
            payload: response,
          });
        }else{
          message.error('提交失败');  
        }
      },
      *submitPassword({ payload }, { call, put }) {
        let token=getToken();
        let current_user=JSON.parse(getCurrentUser());
         payload={
          body:{
            ...payload,
            userId:current_user.Id
          } ,
          auth:{
            headers:{
              Authorization:'Basic '+token
            }
          }
        }
        const response = yield call(UpdatePassword, payload); // get
        if(response.code==200){
          message.success('提交成功');
        }else{
          message.error('提交失败');  
        }
      },
      *submitResetPwd({ payload }, { call, put }) {
        console.log(payload);
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
        const response = yield call(ResetPassword, payload); // get
        if(response.code==200){
          message.success('提交成功');
          yield put({
            type: 'getSysUsers',
            payload: response,
          });
        }else{
          message.error('提交失败');  
        }
      },
  },

  reducers: {
    setUser(state,action){
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    getSysUsers(state, action) {
      return {
        ...state,
        allData: action.payload.data,
      };
    },
    getDepartmentTree(state, action) {
        return {
          ...state,
          treeData: action.payload,
        };
      },
    getSysRoles(state, action) {
        return {
          ...state,
          roleData: action.payload,
        };
      },
  },
};
