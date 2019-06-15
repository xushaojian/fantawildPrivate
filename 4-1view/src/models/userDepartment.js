 import {queryTree as queryDepartmentTree, removeDepartment,updateDepartment,addDepartment} from '../services/userDepartment';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'userDepartment',
  state: {
    treeData:[],
    userData:[]
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
        const response = yield call(queryDepartmentTree,payload);
        const { code, data } = response;
        // if(code === 0) return;
        yield put({
          type: 'getDepartmentTree',
          payload: data.treeData,
        })
        yield put({
          type: 'getMinisterUser',
          payload: data.userData,
        })
      },

      *submit({ payload }, { call, put }) {
        console.log(payload);
        let callback;
        if (payload.action) {
          callback = Object.keys(payload).length === 2? removeDepartment : updateDepartment;
        } else {
          callback = addDepartment;
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
            type: 'getDepartmentTree',
            payload: response.data.treeData,
          });
        }else{
          message.error('提交失败');  
        }
      },
  },

  reducers: {
    getDepartmentTree(state, action) {
        return {
          ...state,
          treeData: action.payload,
        };
      },
      getMinisterUser(state, action) {
        return {
          ...state,
          userData: action.payload,
        };
      },
  },
};
