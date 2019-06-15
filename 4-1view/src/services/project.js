import { stringify } from 'qs';
import request from '../utils/request';
//queryParks,queryTypeForms,queryChildTypeForms
export async function query(params) {
  return request(`/api/Project/GetProjectList?${stringify(params.body)}`,params.auth);
}
export async function queryParks(params) {
  return request('/api/Project/GetParkList',params.auth);
}

export async function addProject(params) {
  return request(`/api/Project/AddProject?${stringify(params.body)}`,params.auth);
}
 
export async function updateProject(params) {
  return request(`/api/Project/UpdateProject?${stringify(params.body)}`,params.auth);
}
 
export async function removeProject(params) {
  return request(`/api/Project/RemoveProject?${stringify(params.body)}`,params.auth);
}
 