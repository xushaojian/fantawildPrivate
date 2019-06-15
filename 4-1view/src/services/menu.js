import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMenus(params) {
  return request(`/api/Sys_Role/GetMenu?${stringify(params)}`);
}
