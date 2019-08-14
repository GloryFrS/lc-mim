import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
 } from 'reactstrap';
import WithAuth from './withAuth';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Cards from './components/Cards.jsx';
import {AppContext} from './components/Login';
import LogVk from './components/LogVk';
import api from './API/api';
import Callback from './components/Callback';
import {AuthProvider} from "./components/Auth";
import { PrivateRoute } from './components/PrivateRoute'


const AppContextConsumer = AppContext.Consumer;
// const AppContext = React.createContext ();

class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        id: AppContext.id,
        customerTypes: [],
        isOpen: false
      };
      this.toggle = this.toggle.bind(this);
    
    
    
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

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <AuthProvider>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/admin">Мастер и Модель</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className='nav-link' to="/login/">Войти</Link>
              </NavItem>
              <NavItem>
                <Link className='nav-link' to="/profile/">Профиль</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        
          {/* <AppContextConsumer>
            {({ id }) => (
            <h1>{id}</h1>
            )}
          </AppContextConsumer> */}
          
         
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
