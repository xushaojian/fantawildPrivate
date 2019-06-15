import * as service from '../services/projectStatus';

export default {
	namespace: 'projectStatus',

	state: {
		data: [] 
	},

	effects: {

		*getProjectStatus(_, { call, put }) {
			const result = yield call(service.getProjectStatus);
			console.log('peojectStatus请求结果');
			console.log(result);
		
			yield put({
				type: 'save',
				payload: {
					reqData: result
				}
			});
		}
	},

	reducers: {
		save(state, { payload: { reqData } }) {
			return { ...state, data: reqData  };
		},
	},
}