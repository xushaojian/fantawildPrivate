import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '我的工作区',
    icon: 'user',
    path: 'work',
    authority: ['test','admin','超级管理员'],
  },
  {
    name: '最近查看',
    icon: 'clock-circle',
    path: 'review',
    authority: ['admin','超级管理员'],
  },
  {
    name: '模板管理',
    icon: 'database',
    path: 'template',
    authority: ['admin','超级管理员'],
    children: [
      {
        name: '模板信息',
        path: 'templateList',
        icon: 'setting',
      },
      {
        name: '模板上传',
        path: 'templateUpload',
        icon: 'setting',
      }, 
    ],
  }
  ,
  {
    name: '报告管理',
    icon: 'folder',
    path: 'report',
    authority: ['admin','超级管理员','个人'],
    children: [
      {
        name: '报告列表',
        icon: 'profile',
        path: 'reportList',
      },
      {
        name: '报告导入',
        icon: 'cloud-upload',
        path: 'reportUpload',
      },
    ],
  },
  {
    name: '资源跟进',
    icon: 'customer-service',
    path: 'follow',
    authority: [ 'admin', 'supervisor'],
  },
  {
    name: '系统设置',
    icon: 'setting',
    path: 'system',
    authority: ['admin','超级管理员'],
    children: [
          {
            name: '用户管理',
            path: 'userManage',
            icon: 'user',
          },
          {
            name: '角色管理',
            path: 'roleManage',
            icon: 'profile',
          },
          {
            name: '部门管理',
            path: 'userDepartment',
            icon: 'team',
            // hideInBreadcrumb: true,
            // hideInMenu: true,
          }
          ,
          {
            name: '菜单管理',
            path: 'sysMenu',
            icon: 'team',
            // hideInBreadcrumb: true,
            // hideInMenu: true,
          }
          ,
          {
            name: '图标管理',
            path: 'sysIcon',
            icon: 'setting',
            // hideInBreadcrumb: true,
            // hideInMenu: true,
          },
          {
            name: '按钮管理',
            path: 'sysButton',
            icon: 'setting',
            // hideInBreadcrumb: true,
            // hideInMenu: true,
          },
        ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () =>formatter(menuData);
  

