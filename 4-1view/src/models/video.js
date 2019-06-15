import { query as queryVideos,removeVideo} from '../services/video';
import { getToken } from '../utils/token';
import { getCurrentUser} from '../utils/currentUser';
import { message } from 'antd';

export default {
  namespace: 'video',
  state: {
    allData:{
        list: [],
        pagination:{}
    },
    // previewData:{
    //     playUrl:''
    // } 
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let token=getToken();
      payload={
        body:{...payload} ,
        auth:{
          headers:{
            Authorization:'Basic '+token
          }
        }
      }
      const response = yield call(queryVideos,payload);
      yield put({
        type: 'getVideos',
        payload: response.data,
      });
    },

    // *fetchPreview({ payload }, { call, put }) {
    //     let token=getToken();
    //     payload={
    //       body:{...payload} ,
    //       auth:{
    //         headers:{
    //           Authorization:'Basic '+token
    //         }
    //       }
    //     }
    //     const response = yield call(queryVideoPreview,payload);
    //     yield put({
    //       type: 'getVideoPreview',
    //       payload: response.data,
    //     });
    //   },

    *submit({ payload }, { call, put }) {
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
      const response = yield call(removeVideo, payload); // get
      if(response.code==200){
        message.success('提交成功');
        yield put({
          type: 'getVideos',
          payload: response.data,
        });
      }else{
        message.error('提交失败');  
      }
    },

  },

  reducers: {
    getVideos(state, action) {
      return {
        ...state,
        allData: action.payload,
      };
    },
    // getVideoPreview(state, action) {
    //     return {
    //       ...state,
    //       previewData: action.payload,
    //     };
    //   },
  },
};
