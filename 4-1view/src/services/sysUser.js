import { stringify } from 'qs';
import request from '../utils/request';

export async function ResetPassword(params) {
  return request(`/api/Sys_User/ResetPassword?${stringify(params.body)}`,params.auth);
}
export async function UpdatePassword(params) {
  return request(`/api/Sys_User/UpdatePassword?${stringify(params.body)}`,params.auth);
}
export async function query(params) {
  return request(`/api/Sys_User/GetSysUserList?${stringify(params.body)}`,params.auth);
}

export async function queryTree(params) {
    return request('/api/Sys_User/GetVDepartmentTree',params.auth);
}

export async function queryRole(params) {
    return request('/api/Sys_User/GetRoleList',params.auth);
}
 // 查询资源列表
export async function queryList(params) {
    return request('/api/sysUser/querySysUserList', {
      method: 'POST',
      body: {
        ...params,
      },
    })
}

export async function addSysUsers(params) {
  return request(`/api/Sys_User/AddSysUser?${stringify(params.body)}`,params.auth);
}
export async function updateSysUsers(params) {
  return request(`/api/Sys_User/UpdateSysUser?${stringify(params.body)}`,params.auth);
}
 
export async function removeSysUsers(params) {
  return request(`/api/Sys_User/RemoveSysUser?${stringify(params.body)}`,params.auth);
}
 