import request from '../utils/request';

export async function  getDriveStatus() {
  return request('/4-1Api/driveStatus/getDriveStatus') //get方法请求
}