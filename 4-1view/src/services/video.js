import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Video/GetVideoList?${stringify(params.body)}`,params.auth);
}

 
export async function removeVideo(params) {
  return request(`/api/Video/RemoveVideo?${stringify(params.body)}`,params.auth);
}
 