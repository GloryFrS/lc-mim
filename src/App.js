import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import WithAuth from './withAuth';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Card from './components/Card';
import {AppContext} from './components/Login';
import axios from 'axios';


const AppContextConsumer = AppContext.Consumer;
// const AppContext = React.createContext ();

class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        id: AppContext.id,
        customerTypes: []
      };
    
    
  }
 

  componentDidMount(){
    axios.get('http://vk.masterimodel.com/node/customerTypes.get')
        .then(res=>{
            if (Array.isArray(res.data)) {
                // console.log("response:", response.data);
                this.setState({customerTypes: res.data})
            }
        })
        .catch(err => {
            console.log(err);
        });
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
          <li><Link to="/profile">Мой профиль</Link></li>
          <li><Link to="/login">Вход</Link></li>
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
                customerTypes={this.state.customerTypes}

              />
            )} />
            <Route path="/card/:id" render={(props)=>(
              <WithAuth {...props}
                ComponentToProtect={Card}
              />
            )} />
            <Redirect to="/profile"/>
          </Switch>
        
      </div>
    );
  }
}

export default App;
