import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import FishLionTabBar from './../FishLionTabBar/FishLionTabBar';
import FieldDetails from './../FieldDetails/FieldDetails';
import PieDetail from './../PieDetail/PieDetail';
import BarDetail from './../BarDetail/BarDetail';
import TerminalDetails from './../TerminalDetails/TerminalDetails';

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
          <Route exact path="/fielddetails/:id" component={FieldDetails} />
          <Route path="/piedetail/:anchorpoint/:type" component={PieDetail} />
          <Route path="/bardetail/:anchorpoint/:type" component={BarDetail} />
          <Route path="/terminaldetails/:frameid" component={TerminalDetails} />
        </div>
      </Router>
    );
  }
}
