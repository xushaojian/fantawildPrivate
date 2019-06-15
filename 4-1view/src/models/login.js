import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from '../services/api';
import { fakeAccessToken } from '../services/api';
import { setAuthority } from '../utils/authority';
import { setToken,removeToken } from '../utils/token';
import { setSystem,removeSystem } from '../utils/system';
import { setCurrentUser,removeCurrentUser } from '../utils/currentUser';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';
import { message } from 'antd';

export default {
  namespace: 'login',
  state: {
    code: 0,
    type:''
  },

  effects: {
    *login({ payload }, { call, put }) {
      //先获取Token
      const tokenResponse = yield call(fakeAccessToken, payload);
      if(tokenResponse.data.ticket==undefined){
        yield put({
          type: 'changeTokenStatus',
          payload: tokenResponse,
        });
      }
      else{
          //保存Token
          setToken(tokenResponse.data.ticket);
          payload={
            auth:{
              headers:{
                Authorization:'Basic '+tokenResponse.data.ticket
              }
            },
            body:{...payload} 
          }
          const response = yield call(fakeAccountLogin, payload);
          const currentUser={
            ...response.data.currentUser
          };
          setSystem(response.data.sysVersion);
          setCurrentUser(JSON.stringify(currentUser));
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          // Login successfully
          if (response.code === 200) {
            console.log('登陆请求成功!!');
            reloadAuthorized();
            console.log('刷新权限!!');
            const urlParams = new URL(window.location.href);
            const params = getPageQuery();
            console.log(params);
            let { redirect } = params;
            if (redirect) {
              console.log('链接跳转!!');
              const redirectUrlParams = new URL(redirect);
              if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);
                if (redirect.startsWith('/#')) {
                  redirect = redirect.substr(2);
                }
              } else {
                window.location.href = redirect;
                return;
              }
            }
            var redirect='/'+response.data.redirect
            yield put(
              routerRedux.push({
                pathname:redirect,
              })
            )
            // yield put(routerRedux.replace(redirect || '/'));
          }
    }

    },
    *ddlogin({ payload }, { call, put }) {
      //先获取Token
      const tokenResponse = yield call(fakeAccessToken, payload);
      if(tokenResponse.data.ticket==undefined){
        message.info(tokenResponse.message);
      }else{
        //保存Token
        setToken(tokenResponse.data.ticket);
        payload={
          auth:{
            headers:{
              Authorization:'Basic '+tokenResponse.data.ticket
            }
          },
          body:{...payload} 
        }
        const response = yield call(fakeAccountLogin, payload);
        const currentUser={
          ...response.data.currentUser
        };
        setSystem(response.data.sysVersion);
        setCurrentUser(JSON.stringify(currentUser));
        yield put({
          type: 'changeDDLoginStatus',
          payload: response,
        });

        // Login successfully
        if (response.code === 200) {
          console.log('登陆请求成功!!');
          reloadAuthorized();
          console.log('刷新权限!!');
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          console.log(params);
          let { redirect } = params;
          if (redirect) {
            console.log('链接跳转!!');
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
        
          yield put(
            routerRedux.push({
              pathname:'/monitor/home',
            })
          )
          // yield put(routerRedux.replace(redirect || '/'));
        }
      }

    },
    *logout(_, { put }) {
      //移除Token
      removeToken();
      console.log('移除Token');
      removeCurrentUser();
      removeSystem();
      console.log('移除用户信息');
      yield put({
        type: 'changeLoginStatus',
        payload: {
          code: 0,
          data:{
            currentUser:{
              RoleName: 'guest'
            },
            type:'account'
          },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeTokenStatus(state, { payload }) {
      return {
        ...state,
        code: payload.code
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentUser.RoleName);
      return {
        ...state,
        code: payload.code,
        type: payload.data.type,
      };
    },
    changeDDLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentUser.RoleName);
      return {
        ...state,
        code: payload.code
      };
    },
  },
};
