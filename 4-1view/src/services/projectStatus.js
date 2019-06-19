import request from '../utils/request';

export async function  getProjectStatus() {
  return request('/4-1Api/status/getProjectStatus');
}