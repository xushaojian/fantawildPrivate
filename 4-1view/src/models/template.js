import { query as queryTemplates } from '../services/template';

export default {
  namespace: 'template',
  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryTemplates);
      yield put({
        type: 'commit',
        payload: response.data,
      });
    },
 
  },

  reducers: {
    commit(state, action) {
      console.log(action.payload);
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
