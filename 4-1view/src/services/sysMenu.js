import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTree(params) {
    return request('/api/Sys_Menu/GetVSysMenuTree',params.auth);
}

export async function queryIcon(params) {
    return request('/api/Sys_Menu/GetIconList',params.auth);
}

export async function queryButton(params) {
  return request('/api/Sys_Menu/GetButtonList',params.auth);
}

export async function queryMenuButton(params) {
  return request(`/api/Sys_Menu/GetMenuButtonList?${stringify(params.body)}`,params.auth);
}

export async function addMenu(params) {
    return request(`/api/Sys_Menu/AddSysMenu?${stringify(params.body)}`,params.auth);
}

export async function addMenuButton(params) {
  return request(`/api/Sys_Menu/AddSysMenuButton?${stringify(params.body)}`,params.auth);
}

export async function updateMenu(params) {
    return request(`/api/Sys_Menu/UpdateSysMenu?${stringify(params.body)}`,params.auth);
}
   
export async function removeMenu(params) {
    return request(`/api/Sys_Menu/DeleteSysMenu?${stringify(params.body)}`,params.auth);
}
   