import React from 'react';
import { Tabs } from 'antd-mobile';
import Week from './../Week/Week';
import Month from './../Month/Month';
import Year from './../Year/Year';
import './Statistics.css';

const tabs = [
  { title: '按周' },
  { title: '按月' },
  { title: '按年' },
];

export default class Statistics extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }
  
    render() {
      return <div>
      <div>
        <Tabs tabs={tabs}>
          <div >
            <Week />
          </div>
          <div>
            <Month />
          </div>
          <div>
            <Year />
          </div>
        </Tabs>
      </div>
    </div>
    }
  }
