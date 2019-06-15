import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getUserInfo,getChartInfo,getDynamicInfo ,getAllDynamicInfo} from "../services/userInfo";
import { getCurrentUser} from '../utils/currentUser';
import { getToken } from '../utils/token';

export default {
  namespace: 'userInfo',

  state: {
    basicInfo: {},
    dynamicData:[],
    allData:{
      list: [],
      pagination:{}
    }
  },

  effects: {
    *fetchUserInfo(_,{ call, put}) {
      let current_user=JSON.parse(getCurrentUser());
       if(current_user==null){
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
       }else{
          yield put({
            type: 'saveBasicInfo',
            basicData: current_user,
          })
       }
    },
    
    *fetchDynamicInfo(_,{ call, put}) {
      const response = yield call(getDynamicInfo);
      yield put({
        type: 'saveDynamicInfo',
        dynamicData: response.data,
      })
    },

    *fetchAllDynamicInfo({payload},{ call, put}) {
      let token=getToken();
      payload={
        body:{...payload} ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(getAllDynamicInfo,payload);
      yield put({
        type: 'saveAllDynamicInfo',
        allData: response.data,
      })
    },
  },

  reducers: {
    saveBasicInfo(state, { basicData }) {
      return {
        ...state,
        basicInfo: basicData,
      }
    },
    saveDynamicInfo(state, { dynamicData }) {
      return {
        ...state,
        dynamicData: dynamicData,
      }
    },
    saveAllDynamicInfo(state, { allData }) {
      return {
        ...state,
        allData: allData,
      }
    },
  },
}
