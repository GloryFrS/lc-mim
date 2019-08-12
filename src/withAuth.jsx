import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from './API/api';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class withAuth extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      
      const cook = {
        "token": cookies.get('token')
      };

      api.checkToken(cook)
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }


    render() {
      const ComponentToProtect = this.props.ComponentToProtect;
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <ComponentToProtect  {...this.props} />
        </React.Fragment>
      );
    }
  }

export default withAuth;