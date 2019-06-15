import React from 'react';
import { TabBar } from 'antd-mobile';
import * as dd from "dingtalk-jsapi"
import './../../css/iconfont.css'
import './FishLionTabBar.css';
import Field from '../Field/Field'
import Statistics from '../Statistics/Statistics'

export default class MainTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'field'
    };
  }

  componentWillMount() {
      dd.biz.navigation.setRight({
        show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
        control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
        text: '',//控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {},
        onFail : function(err) {}
    });
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          
          <TabBar.Item
            title="场次"
            key="field"
            icon={<span className="iconfont icon-changjingmoren" style={{fontSize:'25px'}}></span>}
            selectedIcon={<span className="iconfont icon-changjingmoren" style={{fontSize:'25px'}}></span>}
            selected={this.state.selectedTab === 'field'}
            onPress={() => {
              this.setState({
                selectedTab: 'field',
              });
            }}
            data-seed="logId"
          >
          <Field />
          </TabBar.Item>
          
          <TabBar.Item
            icon={<span className="iconfont icon-tongji" style={{fontSize:'21px'}}></span>}
            selectedIcon={<span className="iconfont icon-tongji" style={{fontSize:'21px'}}></span>}
            title="统计"
            key="statistics"
            selected={this.state.selectedTab === 'statistics'}
            onPress={() => {
              this.setState({
                selectedTab: 'statistics',
              });
            }}
          >
          <Statistics />
          </TabBar.Item>
          
        </TabBar>
      </div>
    );
  }
}
