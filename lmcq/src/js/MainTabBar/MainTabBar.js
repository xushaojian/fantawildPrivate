import React from 'react';
import { TabBar } from 'antd-mobile';
import RunDetails from './../RunDetails/RunDetails'
import './../../css/iconfont.1.css'

import './MainTabBar.css';
import Statistics from '../Statistics/Statistics';

export default class MainTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'runDetalis'
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
            title="运行详情"
            key="runDetalis"
            icon={<span className="iconfont icon-changjingmoren" style={{fontSize:'25px'}}></span>}
            selectedIcon={<span className="iconfont icon-changjingmoren" style={{fontSize:'25px'}}></span>}
            selected={this.state.selectedTab === 'runDetalis'}
            onPress={() => {
              this.setState({
                selectedTab: 'runDetalis',
              });
            }}
          >
          
          <RunDetails />
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
