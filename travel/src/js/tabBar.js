import React ,{Component} from 'react';
import { TabBar } from 'antd-mobile';
import Live from './live/live';
import Statistic from './statistic/statistic';
import './../css/icon.css';
import './font';

class TabBarFT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'blueTab',
			hidden: false,
			fullScreen: true,
		};
	}

	render() {
		return(
      <div>
			<div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: '0',zIndex:'0' } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber="0" //预加载相邻tab内容，Infinity:加载所有tab内容;0:仅加载当前tab内容，默认为1
        >
        <TabBar.Item
            title="出差实况"
            key="Live"
            icon={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-chuchai"></use>
              </svg>
            }
            selectedIcon={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-chucha"></use>
              </svg>
            }
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {//点击触发
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
          >
		      <Live />
          </TabBar.Item>

          <TabBar.Item
            icon={
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-tongji4"></use>
            </svg>
          }
            selectedIcon={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-tongji"></use>
              </svg>
            }
            title="出差统计"
            key="Statistic"
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
          >
          <Statistic />
          </TabBar.Item>
        </TabBar>
      </div>
      </div>
		);
	}
}

export default TabBarFT;