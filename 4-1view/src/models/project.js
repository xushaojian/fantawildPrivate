import { query as queryProject ,
   removeProject,updateProject,addProject,
   queryParks} from '../services/project';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'project',
  state: {
    allData:{
      list: [],
      pagination:{}
    },
    parkData:[],
  },

  effects: {
    *fetch({payload}, { call, put }) {
      let token=getToken();
      payload={
        body:{...payload} ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(queryProject,payload);
      yield put({
        type: 'getProjects',
        payload: response.data,
      });
    },
    *fetchPark(_, { call, put }) {
      let token=getToken();
      const payload={
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(queryParks,payload);
      const { code, data } = response;
      // if(code === 0) return;
      yield put({
        type: 'getParks',
        payload: data.parkData,
      })
    },
  
     
    

    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.action) {
        callback = Object.keys(payload).length === 4 ? removeProject : updateProject;
      } else {
        callback = addProject;
      }
      console.log(callback);
      let token=getToken();
      let current_user=JSON.parse(getCurrentUser());
       payload={
        body:{
          ...payload,
          accountName:current_user.RealName
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
          type: 'getProjects',
          payload: response.data,
        });
      }else{
        message.error('提交失败');  
      }
    },
  },

  reducers: {
    getProjects(state, action) {
      return {
        ...state,
        allData: action.payload,
      };
    },
    getParks(state, action) {
      return {
        ...state,
        parkData: action.payload,
      };
    },
  },
};
