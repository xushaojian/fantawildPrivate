import React from 'react';
import { Card } from 'antd';
import CardView from './CardView'

const tabListNoTitle = [
  {
    key: 'card',
    tab: '卡片视图',
  },
  {
    key: 'pic',
    tab: '图表视图',
  },
];

const contentListNoTitle = {
  card: <CardView />,
  pic: <CardView />,
};

class TabsCard extends React.Component {
  state = {
    noTitleKey: 'card',
  };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    return (
      <div>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey');
          }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}

export default () => (<TabsCard />);


