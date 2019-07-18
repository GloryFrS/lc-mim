import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import withAuth from './withAuth';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Card from './components/Card';
import Geocode from "react-geocode";

class App extends Component {
  

  componentDidMount () {
    Geocode.setApiKey("AIzaSyCddh3ZpGAPpmI0FT-8yX6iPhl3KNM2sPo");
    Geocode.enableDebug();
    
  }

  render() {
    return (
      <div>
        <ul>
          <li><Link to="/profile">Secret</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/profile" component={withAuth(Profile)} />
          <Route path="/edit" component={withAuth(EditProfile)} />
          <Route path="/card/:id" component={withAuth(Card)} />
          <Redirect to="/profile"/>
        </Switch>
      </div>
    );
  }
}

export default App;
