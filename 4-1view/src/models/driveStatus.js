import * as service from '../services/driveStatus';

export default {
	namespace: 'driveStatus',

	state: {
		myResult: {}
	},

	effects: {
		*getDriveStatus(_, { call, put }) {
			const result = yield call(service.getDriveStatus);
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