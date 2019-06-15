import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Major/GetMajorList?${stringify(params.body)}`,params.auth);
}

export async function addMajor(params) {
  return request(`/api/Major/AddMajor?${stringify(params.body)}`,params.auth);
}
export async function updateMajor(params) {
  return request(`/api/Major/UpdateMajor?${stringify(params.body)}`,params.auth);
}
 
export async function removeMajor(params) {
  return request(`/api/Major/RemoveMajor?${stringify(params.body)}`,params.auth);
}
 