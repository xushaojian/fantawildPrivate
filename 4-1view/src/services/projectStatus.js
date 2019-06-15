import request from '../utils/request';

export async function  getProjectStatus() {
  return request('/4-1Api/driveStatus/getProjectStatus') //get方法请求
}