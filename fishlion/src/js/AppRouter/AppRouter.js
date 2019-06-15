import React from 'react';

import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import FishLionTabBar from './../FishLionTabBar/FishLionTabBar';
import FieldDetails from './../FieldDetails/FieldDetails';

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
          <Route exact path="/" component={FishLionTabBar} />
          <Route exact path="/fielddetails/:selectTime/:field" component={FieldDetails} />
        </div>
      </Router>
    );
  }
}
