import React from 'react';
import { Tabs, Badge } from 'antd-mobile';

import ExpField from './../ExpField/ExpField'
import ExpBall from './../ExpBall/ExpBall'
import ExpBox from './../ExpBox/ExpBox'

const tabs = [
  { title: <Badge >异常场次</Badge> },
  { title: <Badge >故障源(球)</Badge> },
  { title: <Badge >故障源(箱)</Badge> }
];

export default class SubTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }
  
    render() {
      return (
        <div>
        <Tabs tabs={tabs}
          initialPage={0}
        >
          <div>
            <ExpField FailureList={this.props.TotalData.FailureList} Field={this.props.Field}/>
          </div>

          <div>
            <ExpBall BallList={this.props.TotalData.BallList} Field={this.props.Field}/>
          </div>
          
          <div>
            <ExpBox BoxList={this.props.TotalData.BoxList} Field={this.props.Field}/>
          </div>

        </Tabs>
        
        
      </div>
      );
    }
  }