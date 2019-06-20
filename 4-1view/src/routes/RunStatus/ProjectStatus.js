import React from 'react';
import { Card, Button, Affix } from 'antd';
import { connect } from 'dva';

import CardView from './CardView';
import PicView from './PicView';

const tabList = [
  {
    key: 'card',
    tab: '卡片视图',
  },
  {
    key: 'pic',
    tab: '图表视图',
  },
];

@connect(({ projectStatus, loading }) => ({
  myResult: projectStatus.myResult,
  loading: loading.models.projectStatus
}))

export default class ProjectStatus extends React.Component {

  state = {
    cardKey: 'card',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'projectStatus/getProjectStatus',
    })
    
    this.timerID = setInterval(
      () => this.myRefresh(),
      30000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  myRefresh = () => {
    console.log('myRefresh')
    this.props.dispatch({
      type: 'projectStatus/getProjectStatus',
    })
  }

  onTabChange = (key) => {
    this.setState({
      cardKey: key
    });
  };

  render() {
    
    let that = this;
    return (

      <div>
        <Card
          style={{ width: '100%' }}
          tabList={tabList}
          activeTabKey={this.state.cardKey}
          extra={
            <Affix style={{ position: 'absolute', top: 33, right: 30 }} >
              <Button type="primary" shape="circle" icon="reload" size={30}  onClick={() => this.myRefresh()}/>
              每30秒自动刷新
            </Affix>
          }
          onTabChange={key => {
            this.onTabChange(key);
          }}
        >
          {that.state.cardKey == 'card' ? <CardView data={that.props.myResult.data} /> : <PicView />}
        </Card>
      </div>
    );
  }
}



