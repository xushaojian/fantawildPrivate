import * as service from '../services/projectStatus';

export default {
	namespace: 'projectStatus',
	state: {
		myResult: {}
	},

	effects: {
		*getProjectStatus(_, { call, put }) {
			const result = yield call(service.getProjectStatus);
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
			return { ...state, myResult: reqData };
		},
	},
}