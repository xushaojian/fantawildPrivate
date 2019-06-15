
export default{
    namespace:'report',
    state:{
      status: undefined,
    },

    effects:{
        *fetch(_, { call, put }) {
            
            yield put({
              type: 'save',
              payload: {
              },
            });
          },
    },

    reducers: {
        save(state, action) {
          return {
            ...state,
            data: action.payload,
          };
        },
    },
};