import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
// import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function mergeRouterData(menuList, routerConfig) {
  const menuData = getFlatMenuData(menuList);
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
}

export const refreshRouterData = menuList => {
  routerDataCache = mergeRouterData(menuList, routerDataCache);
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'menu'], () => import('../layouts/BasicLayout')),
    },
    // 首页
    '/data/test': {
      component: dynamicWrapper(app, ['userInfo'], () => import('../routes/Dashboard/Workplace')),
    },
    // 首页
    '/monitor/home': {
      component: dynamicWrapper(app, ['userInfo'], () => import('../routes/Dashboard/Workplace')),
    },
    // 日志管理
    '/log': {
      component: dynamicWrapper(app, ['userInfo'], () => import('../routes/System/DynamicManage')),
    },
    // 用户管理
    '/system/userManage': {
      component: dynamicWrapper(app, ['sysUser'], () => import('../routes/System/UserManage')),
    },
    // 角色管理
    '/system/roleManage': {
      component: dynamicWrapper(app, ['sysRole'], () => import('../routes/System/RoleManage')),
    },
    // 部门管理
    '/system/userDepartment': {
      component: dynamicWrapper(app, ['userDepartment'], () => import('../routes/System/DepartmentManage')),
    },
    // 菜单管理
    '/system/sysMenu': {
      component: dynamicWrapper(app, ['sysMenu'], () => import('../routes/System/MenuManage')),
    },
    // 图标管理
    '/system/sysIcon': {
      component: dynamicWrapper(app, ['sysIcon'], () => import('../routes/System/IconManage')),
    },
    // 按钮管理
    '/system/sysButton': {
      component: dynamicWrapper(app, ['sysButton'], () => import('../routes/System/ButtonManage')),
    },

    // 异常页-403
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    // 异常页-404
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    // 异常页-500
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    // 公园管理
    '/base/park': {
      component: dynamicWrapper(app, ['park'], () =>
        import('../routes/Base/Park')
      ),
    },
    // 项目管理
    '/base/project': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Base/ProjectManage')
      ),
    },
    // 项目管理
    '/base/project/info': {
      component: dynamicWrapper(app, ['project'], () =>
        import('../routes/Base/Project')
      ),
    },
    // 用户模板
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    // 用户登陆
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    // 钉钉登陆
    '/user/dingding': {
      component: dynamicWrapper(app, [], () => import('../routes/User/DingDing')),
    },
    // 用户注册
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/account/setting': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/Setting')),
    },
    '/video/realVideo': {
      component: dynamicWrapper(app, ['video'], () => import('../routes/Video/VideoList')),
    },
    '/video/preview': {
      component: dynamicWrapper(app, [], () => import('../routes/Video/RealVideo')),
    },
    '/video/videoback': {
      component: dynamicWrapper(app, [], () => import('../routes/Video/VideoBack')),
    },
    '/data/realData/RealList': {
      component: dynamicWrapper(app, [], () => import('../routes/Data/ProjectStatus')),
    },
    // 项目状态
    '/RunStatus/ProjectStatus': {
      component: dynamicWrapper(app, ['projectStatus'], () => import('../routes/RunStatus/ProjectStatus')),
    },
    // 设备状态
    '/RunStatus/DriveStatus': {
      component: dynamicWrapper(app, ['driveStatus'], () => import('../routes/RunStatus/DriveStatus')),
    },
  };
  routerDataCache = routerConfig;
  return routerDataCache;

};
