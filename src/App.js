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
import api from './API/api';


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
 

  componentDidMount(){
    api.customerTypes()
        .then(res=>{
            if (Array.isArray(res.data)) {
                this.setState({customerTypes: res.data})
            }
        })
        .catch(err => {
            console.log(err);
        });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
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
              <Route path='/card' component={Cards}/>

              <Redirect to="/profile"/>
            </Switch>
      </div>
    );
  }
}

export default App;
