import * as service from '../services/driveStatus';

export default {
	namespace: 'driveStatus',

	state: {
		data: [] 
	},

	effects: {

		*getDriveStatus(_, { call, put }) {
			const result = yield call(service.getDriveStatus);
			console.log('请求结果');
			console.log(result);
		
			yield put({
				type: 'save',
				payload: {
					reqData: result.data
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