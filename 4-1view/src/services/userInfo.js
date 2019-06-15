import { stringify } from 'qs';
import request from '../utils/request';

// 获取用户基本信息
export function getUserInfo(id) {
  return request(`/api/user/info?id=${id}`);
}

export async function getChartInfo() {
  return request('/api/Analysis/GetChartInfo');
}

export async function getDynamicInfo() {
  return request('/api/Analysis/GetDynamicList');
}

export async function getAllDynamicInfo(params) {
  return request(`/api/Analysis/GetAllDynamicList?${stringify(params.body)}`,params.auth);
}