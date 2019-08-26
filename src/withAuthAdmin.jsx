import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from './API/api';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

class withAuthAdmin extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    async componentDidMount() {
     
       
      try {
        const cook = {
          "token": cookies.get('token')
        };
  
        const res = await api.checkAdmin(cook); 
        if (res.status === 200) {
          this.setState({ loading: false });
        } else {
          const error = new Error(res.error);
          throw error;
        }  
      } catch (err) {
          console.error(err);   
          this.setState({ loading: false, redirect: true })  
      }
    }

    
    render() {
      const ComponentToProtect = this.props.ComponentToProtect;
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/moderators" />;
      }
      return (
        <React.Fragment>
          <ComponentToProtect  {...this.props} />
        </React.Fragment>
      );
    }
  }

export default withAuthAdmin;