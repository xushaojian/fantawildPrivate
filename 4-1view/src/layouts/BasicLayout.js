import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message ,Modal} from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes ,isUrl} from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import {getSystem} from '../utils/system';
import logo from '../assets/u44.png';
 

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;


/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
// getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
 
enquireScreen(b => {
  isMobile = b;
});

@connect(({ user, global, menu, loading }) => ({
  topMenuData:menu.topMenuData,
  authorityData: menu.authorityData,
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))


export default  class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
  };

  getChildContext() {
    const { location, routerData,authorityData } = this.props;
    let treeList=[];
    authorityData.map((ele,i)=>{
      let itemTree={};
      itemTree.name=ele.name;
      itemTree.path=ele.path;
      itemTree.icon=ele.icon;
      itemTree.authority=ele.authority;
      itemTree.children= this.mapData(ele.children);
      treeList.push(itemTree);
      return treeList;
    });
    var treeData= this.formatter(treeList); 
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(treeData, routerData),
    };
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const { dispatch,location } = this.props;
    dispatch({
      type: 'menu/fetch',
      payload:{
        path:location.pathname
      }
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  /*添加于2019/05/07 */
  componentWillReceiveProps(nextProps){
    const { dispatch,location } = this.props;
   if(location.pathname!==nextProps.location.pathname){
      dispatch({
        type: 'menu/fetch',
        payload:{
          path:nextProps.location.pathname
        }
      });
   }
  } 

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '设备监测预警系统';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 设备监测预警系统`;
    }
    return title;
  }

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if(key==='account'){
      dispatch(routerRedux.push('/account/setting'));
      return;
    }
    if(key==='setting'){
      var version= getSystem();
      if(version==undefined) version='';
      Modal.success({
        title:'系统版本',
        content:version
      })
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };
  mapData= (children)=> {
    if (children && Array.isArray(children)) {
        return children.map((ele) => {
            if (ele.children && Array.isArray(ele.children)) {
                let item={};
                item.name=ele.name;
                item.path=ele.path;
                item.icon=ele.icon;
                item.authority=ele.authority;
                item.children=this.mapData(ele.children);
                return item;
            } else {
              return {
                name:ele.name,
                path:ele.path,
                icon:ele.icon,
                authority:ele.authority
              };
            }
        })
    }
    return []
  }
  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    if (visible) {
      // dispatch({
      //   type: 'global/fetchNotices',
      // });
    }
  };
  formatter=(data, parentPath = '/', parentAuthority)=> {
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
        result.children = this.formatter(item.children, `${parentPath}${item.path}/`, item.authority);
      }
      return result;
    });
  }

  render() {
    const {
      topMenuData,
      authorityData,
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props;
    const { isMobile: mb } = this.state;
    const bashRedirect = this.getBaseRedirect();
    /* ******************2019/01/14新增动态菜单********** */
    let topTreeList=[];
    let treeList=[];
    /* ******************2019/05/08新增顶部菜单********** */
    topMenuData.map((ele,i)=>{
      let itemTree={};
      itemTree.name=ele.name;
      itemTree.path=ele.path;
      itemTree.icon=ele.icon;
      itemTree.authority=ele.authority;
      itemTree.children= this.mapData(ele.children);
      topTreeList.push(itemTree);
      return topTreeList;
    });
    var topTreeData=  this.formatter(topTreeList);
    topTreeData.forEach(getRedirect);
    
    authorityData.map((ele,i)=>{
      let itemTree={};
      itemTree.name=ele.name;
      itemTree.path=ele.path;
      itemTree.icon=ele.icon;
      itemTree.authority=ele.authority;
      itemTree.children= this.mapData(ele.children);
      treeList.push(itemTree);
      return treeList;
    });
    var treeData=  this.formatter(treeList);
    treeData.forEach(getRedirect);
     /* *********************************************** */
    const layout = (
      <Layout >
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={treeData}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout style={{background:'#e9eff4'}}>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              Authorized={Authorized}
              menuData={topTreeData}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '20px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 ,background:'#e9eff4'}}>
            <GlobalFooter
              copyright={
                <Fragment>
                   开发者：研究院软件所
                  <br></br>
                  研究院版权所有 <Icon type="copyright" /> 2019 ALL rights reserved   电脑分辨率不低于：1152 x 864
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

