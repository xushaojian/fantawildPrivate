import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Park/GetParkList?${stringify(params.body)}`,params.auth);
}

export async function addPark(params) {
  return request(`/api/Park/AddPark?${stringify(params.body)}`,params.auth);
}
export async function updatePark(params) {
  return request(`/api/Park/UpdatePark?${stringify(params.body)}`,params.auth);
}
 
export async function removePark(params) {
  return request(`/api/Park/RemovePark?${stringify(params.body)}`,params.auth);
}
 