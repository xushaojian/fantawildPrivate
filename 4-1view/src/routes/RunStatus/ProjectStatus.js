import React from 'react';
import { Card } from 'antd';
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
  data: projectStatus.data,
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
  }

  onTabChange = (key) => {
    this.setState({
      cardKey: key
    });
  };

  render() {
    console.log('peojectStatus - this.props.data');
    console.log(this.props.data);
    let that = this;
    return (
      
      <div>
        <Card
          style={{ width: '100%' }}
          tabList={tabList}
          activeTabKey={this.state.cardKey}
          onTabChange={key => {
            this.onTabChange(key);
          }}
        >
          {that.state.cardKey == 'card' ? <CardView data = {that.props.data} /> : <PicView />}
        </Card>
      </div>
    );
  }
}



