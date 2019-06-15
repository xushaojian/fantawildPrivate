import React from 'react';
import { TabBar } from 'antd-mobile';
import MainTab from './../MainTab/MainTab'
import Ball from './../Ball/Ball'
import Statistics from './../Statistics/Statistics'
import './../../css/iconfont.css'

import './MainTabBar.css';

export default class MainTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'field'
    };
  }
   
  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="#F8F8FF"
          prerenderingSiblingsNumber='0'
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
            <MainTab />
          </TabBar.Item>
          
          <TabBar.Item
            icon={<span className="iconfont icon-caiqiu" style={{fontSize:'25px'}}></span>}
            selectedIcon={<span className="iconfont icon-caiqiu" style={{fontSize:'25px'}}></span>}
            title="球体"
            key="ball" 
            selected={this.state.selectedTab === 'ball'}
            onPress={() => {
              this.setState({
                selectedTab: 'ball',
              });
            }}
          >
            <Ball />
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
