import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Sys_Menu/GetSysButtonList?${stringify(params.body)}`,params.auth);
}

export async function queryIcon(params) {
    return request('/api/Sys_Menu/GetIconList',params.auth);
}

export async function addSysButtons(params) {
  return request(`/api/Sys_Menu/AddSysButton?${stringify(params.body)}`,params.auth);
}
export async function updateSysButtons(params) {
  return request(`/api/Sys_Menu/UpdateSysButton?${stringify(params.body)}`,params.auth);
}
 
export async function removeSysButtons(params) {
  return request(`/api/Sys_Menu/RemoveSysButton?${stringify(params.body)}`,params.auth);
}
 