import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/Sys_Role/GetSysRoleList?${stringify(params.body)}`,params.auth);
}
export async function queryVSysRole(params) {
  return request(`/api/Sys_Role/GetVSysRole?${stringify(params.body)}`,params.auth);
}

export async function addPermission(params) {
  return request(`/api/Sys_Role/AddRolePermission?${stringify(params.body)}`,params.auth);
}
export async function queryRolePermission(params) {
  return request(`/api/Sys_Role/GetRolePermissionList?${stringify(params.body)}`,params.auth);
}

export async function addSysRoles(params) {
  return request(`/api/Sys_Role/AddSysRole?${stringify(params.body)}`,params.auth);
}
export async function updateSysRoles(params) {
  return request(`/api/Sys_Role/UpdateSysRole?${stringify(params.body)}`,params.auth);
}
 
export async function removeSysRoles(params) {
  return request(`/api/Sys_Role/RemoveSysRole?${stringify(params.body)}`,params.auth);
}
export async function queryTree(params) {
  return request('/api/Sys_Role/GetPermissionTree2',params.auth);
}
