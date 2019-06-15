import React from 'react';

import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import MainTabBar from './../MainTabBar/MainTabBar';
import ExpFieldMsg from './../ExpFieldMsg/ExpFieldMsg';
import ExpFieldDetails from './../ExpFieldDetails/ExpFieldDetails';
import BallDetails from './../BallDetails/BallDetails'
import PieDetail from './../PieDetail/PieDetail'
import BarDetail from './../BarDetail/BarDetail'
import MyListDetail from './../MyListDetail/MyListDetail'

export default class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <Router>
        <div>
          <Route exact path="/" component={MainTabBar} />
          <Route path="/expfieldmsg/:performno" component={ExpFieldMsg} />
          <Route path="/expfielddetails/:performno" component={ExpFieldDetails} />
          <Route path="/balldetails/:selectTime/:phyPositionNo" component={BallDetails} />
          <Route path="/piedetail/:anchorpoint/:type" component={PieDetail} />
          <Route path="/bardetail/:anchorpoint/:type" component={BarDetail} />
          <Route path="/mylistdetail/:anchorpoint/:type" component={MyListDetail} />
        </div>
      </Router>
    );
  }
}
