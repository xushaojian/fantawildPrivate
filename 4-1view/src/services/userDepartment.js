import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTree(params) {
    return request('/api/Sys_User/GetVDepartmentTree',params.auth);
}
export async function addDepartment(params) {
    return request(`/api/Sys_Department/AddSysDepartment?${stringify(params.body)}`,params.auth);
  }
  export async function updateDepartment(params) {
    return request(`/api/Sys_Department/UpdateSysDepartment?${stringify(params.body)}`,params.auth);
  }
   
  export async function removeDepartment(params) {
    return request(`/api/Sys_Department/RemoveSysDepartment?${stringify(params.body)}`,params.auth);
  }
   