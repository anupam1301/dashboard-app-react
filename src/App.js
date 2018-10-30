import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import Dashboard from './Dashboard';
import Auth from './Auth';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {

  render() {

    return (

              <Router>
                  <Switch>

                      <Route path="/" component={Home} exact />
                      <Route path="/Dashboard" component={Dashboard} />
                      <Route path="/auth/callback" component={Auth} />

                  </Switch>
              </Router>

    );
  }
}

export default App;
