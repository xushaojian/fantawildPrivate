import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import CONFIG from '../../config';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
    if(type=='qrcode'){
      this.loadDingDingQrCode();
    }
  };

  handleSubmit = (err, values) => {
 
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  //钉钉扫码登陆
  loadDingDingQrCode=()=>{
      var url = encodeURIComponent(CONFIG.REDIRECT_URI);
      window.location.href='https://oapi.dingtalk.com/connect/qrconnect?appid='+CONFIG.DDAppID+'&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+url;
  }

  render() {
    const { login, submitting } = this.props;
    console.log(login.code);
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {
              login.code == 400?this.renderMessage('账户或密码错误'):''
            }
            <UserName name="userName" placeholder="账号" />
            <Password name="password" placeholder="密码" />
          </Tab>
          
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            {/* <a style={{ float: 'right' }} href="">
              忘记密码
            </a> */}
          </div>
          <Submit >登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="dingding" onClick={this.loadDingDingQrCode}/>
          </div>
        </Login>
      </div>
    );
  }
}
