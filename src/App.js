import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import WithAuth from './withAuth';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Card from './components/Card';
import {AppContext} from './components/Login';


const AppContextConsumer = AppContext.Consumer;
// const AppContext = React.createContext ();

class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        id: AppContext.id,
      };
    
    
  }
 

  componentDidMount(){
    
  }

  render() {
    return (
      <div>
        <ul>
          <AppContextConsumer>
            {({ id }) => (
            <h1>{id}</h1>
            )}
            
          </AppContextConsumer>
          <li><Link to="/profile">Secret</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        
          <Switch>
            <Route path="/login" render={(props)=>(
              <Login {...props}/>
            )} 
            /> 
                  
            <Route path="/profile" render={(props)=>(
              <WithAuth {...props}
                ComponentToProtect={Profile}
              />
            )} />
            <Route path="/edit" render={(props)=>(
              <WithAuth {...props}
                ComponentToProtect={EditProfile}
              />
            )} />
            <Route path="/card/:id" render={(props)=>(
              <WithAuth {...props}
                ComponentToProtect={Card}
              />
            )} />
            {/* <Route path="/edit" component={withAuth(EditProfile)} />
            <Route path="/card/:id" component={withAuth(Card)} /> */}
            <Redirect to="/profile"/>
          </Switch>
        
      </div>
    );
  }
}

export default App;
