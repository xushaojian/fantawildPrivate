import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Row,Col,Form,Icon,Input,Checkbox,message,Button,Tabs,Alert} from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/u44.png';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 华强方特-研究院-软件所
  </Fragment>
);

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '设备监测预警系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 设备监测预警系统`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div style={{position:'absolute',top:'0px',left:'0px',right:'0px',bottom:'0px',background:'rgb(0,0,0)',opacity:'0.5'}}></div>
          <Row className={styles.row}>
            <Col lg={12}>
              <div className={styles.infoWrapper}>
                <div className={styles.content}>
                  <div className={styles.title}>设备监测预警系统</div>
                  <p className={styles.description}>设备运行参数监控</p>
                  <p className={styles.description}>数据分析预警评价</p>
                </div>
              </div>
            </Col>
            <Col lg={12}>
                <div className={styles.formWrapper}>
                  <div className={styles.form}>
                      <Switch>
                        {getRoutes(match.path, routerData).map(item => (
                          <Route
                            key={item.key}
                            path={item.path}
                            component={item.component}
                            exact={item.exact}
                          />
                        ))}
                        <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
                      </Switch>
                  </div>
                </div>
            </Col>
          </Row>
          <div className={styles.footer}>
            <div className={styles.copyright}>华强方特研究院 © 2019 版权所有</div>
          </div>
        </div>
        
      </DocumentTitle>
    );
  }
}

export default UserLayout;
