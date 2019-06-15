import { query as querySysRoles, queryVSysRole,removeSysRoles,updateSysRoles,addSysRoles,queryTree as queryPermissionMenuTree,addPermission as addRolePermission,queryRolePermission} from '../services/sysRole';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'sysRole',
  state: {
    status:undefined,
    allData:{
        list: [],
        pagination:{}
    },
    userData:{
      userList:[]
    },
    treeData:[],
    roleMenuButtonData:[],
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
      const response = yield call(querySysRoles,payload);
      yield put({
        type: 'getSysRoles',
        payload: response.data,
      });
    },
    *fetchVRole({ payload }, { call, put }) {
      let token=getToken();
      payload={
        body:{...payload} ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(queryVSysRole,payload);
      yield put({
        type: 'getVSysRole',
        payload: response.data,
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
        const response = yield call(queryPermissionMenuTree,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysMenuTree',
          payload: data.treeData,
        })
      },
      *fetchRoleMenuButton({ payload }, { call, put }) {
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
        const response = yield call(queryRolePermission,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getSysRoleMenuButtons',
          payload: data.permissionData,
        })
      },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.action) {
        callback = Object.keys(payload).length === 4 ? removeSysRoles : updateSysRoles;
      } else {
        callback = addSysRoles;
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
          type: 'getSysRoles',
          payload: response.data,
        });
      }else{
        message.error('提交失败');  
      }
    },
    *submitPermission({ payload }, { call, put }) {
      console.log(payload);
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
      const response = yield call(addRolePermission, payload); // get
      if(response.code==200){
        message.success('提交成功');
        yield put(
          routerRedux.push({
            pathname: '/system/roleManage',
          })
        );

      }else{
        message.error('提交失败');  
      }
      
   
      // yield put({
      //   type: 'getSysRoles',
      //   payload: response.data,
      // });
    },
  },

  reducers: {
    getSysRoles(state, action) {
      return {
        ...state,
        allData: action.payload,
      };
    },
    getVSysRole(state, action) {
      return {
        ...state,
        userData: action.payload,
      };
    },
    getSysMenuTree(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
    getSysRoleMenuButtons(state, action) {
      return {
        ...state,
        roleMenuButtonData: action.payload,
      };
    },
  },
};
