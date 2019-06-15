import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Sys_Menu/GetSysIconList?${stringify(params.body)}`,params.auth);
}
 

export async function addSysIcons(params) {
  return request(`/api/Sys_Menu/AddSysIcon?${stringify(params.body)}`,params.auth);
}
export async function updateSysIcons(params) {
  return request(`/api/Sys_Menu/UpdateSysIcon?${stringify(params.body)}`,params.auth);
}
 
export async function removeSysIcons(params) {
  return request(`/api/Sys_Menu/RemoveSysIcon?${stringify(params.body)}`,params.auth);
}
 