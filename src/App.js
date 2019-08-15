import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Cards from './components/Cards.jsx';
import {AppContext} from './components/Login';
import LogVk from './components/LogVk';
import api from './API/api';
import Callback from './components/Callback';
import {AuthProvider} from "./components/Auth";
import { PrivateRoute } from './components/PrivateRoute';

class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        id: AppContext.id,
        customerTypes: [],
        isOpen: false
      };
  }
 

  async componentDidMount(){
    try{
      const res = await api.customerTypes();
      if (Array.isArray(res.data)) {
        this.setState({customerTypes: res.data})
      }
    } catch(err) {
      console.log(err);
    }
  }

  
  

  render() {
    return (
      <AuthProvider>
        <Switch>
          <Route path="/login" render={(props)=>(
            <Login {...props}/>
          )} 
          /> 
          <PrivateRoute path="/profile" component={Profile}/>
          <PrivateRoute path="/edit" customerTypes={this.state.customerTypes} component={EditProfile}/>
          
          <Route path='/card' component={Cards}/>
          <Route path='/callback' component={Callback}/>
          <Route path='/login-vk' component={LogVk}/>
          
          <Redirect to="/profile"/>
        </Switch>
      </AuthProvider>
    );
  }
}

export default App;
