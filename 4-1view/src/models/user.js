import { query as queryUsers, queryCurrent } from '../services/user';
import { getCurrentUser} from '../utils/currentUser';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      //获取当前用户信息(根据保存目录)
      let current_user=JSON.parse(getCurrentUser());
      console.log(current_user);
      // const response = yield call(queryCurrent);
      if(current_user==null){
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
      else{
        var result={
          name:current_user.AccountName,
          avatar:'',
          notifyCount:0,
          userid:current_user.Id
        }
        yield put({
          type: 'saveCurrentUser',
          payload: result,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
