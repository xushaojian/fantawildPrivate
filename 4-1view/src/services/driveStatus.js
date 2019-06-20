import request from '../utils/request';

export async function  getDriveStatus() {
  return request('/4-1Api/status/getDriveStatus');
}