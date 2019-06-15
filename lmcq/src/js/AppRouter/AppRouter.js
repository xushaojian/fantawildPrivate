import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as dd from "dingtalk-jsapi"
import MainTabBar from './../MainTabBar/MainTabBar';
import CircleDetails from './../CircleDetails/CircleDetails';
export default class AppRouter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      };
    }

    componentWillMount() {
      dd.biz.navigation.setRight({
        show: false,
        control: false,
        text: '',
        onSuccess: function (result) {},
        onFail: function (err) {}
      });
    }

  render() {
    return (
        <Router>
        <div>
          <Route exact path="/" component={MainTabBar} />
          <Route path="/circledetails/:selectTime/:carId/:alarmNum/:roundId" component={CircleDetails} />
        </div>
      </Router>
    );
  }
}
