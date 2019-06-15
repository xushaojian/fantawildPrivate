import { queryMenus } from '../services/menu';
import { refreshRouterData } from '../common/router';

export default {
  namespace: 'menu',
  state: {
    authorityData: [],
    topMenuData:[],
    routerData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMenus, payload);
      const { code, data } = response;
      refreshRouterData(Array.isArray(data.authorityData) ? data.authorityData : []);
      yield put({
        type: 'saveAuthorityData',
        payload: Array.isArray(data.authorityData) ? data.authorityData : [],
      });
      yield put({
        type: 'saveTopMenuData',
        payload: Array.isArray(data.topMenuData) ? data.topMenuData : [],
      });
    },
  },

  reducers: {
    saveAuthorityData(state, action) {
      return {
        ...state,
        authorityData: action.payload,
      };
    },
    saveTopMenuData(state, action) {
      return {
        ...state,
        topMenuData: action.payload,
      };
    },
  },
};
