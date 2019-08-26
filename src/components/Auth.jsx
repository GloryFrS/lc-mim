import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import auth0 from 'auth0-js'
import Cookies from 'universal-cookie';
import api from '../API/api';


const cookies = new Cookies();


const {Provider, Consumer: AuthConsumer} = React.createContext({ //переименовали чтобы не путаться
    isAuthorized:false
});

class AuthProvider extends Component {
    state={ isAuthorized: false }

    auth0 = new auth0.WebAuth({
        domain: 'dev-o767y9xo.eu.auth0.com',
        clientID: 'DjdBsgV3wv3nEwY6wAYoymOF6Ejd4Qa9',
        redirectUri: 'http://localhost:3001/callback',
        responseType: 'token id_token',
        scope: 'openid'
    })

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken) {
                const self = this
                this.setState({ isAuthorized:true }, () => {
                    this.auth0.client.userInfo(authResult.accessToken, async function(err, user) {
                        let name = user.sub.replace(/\D/g,'');
                        console.log(name);
                        const response = await api.authVk({"id":name});
                        cookies.set('token', response.data.token, { path: '/' });
                        
                        self.props.history.push("/profile");
                    });

                });
            } else if (err) {
                console.log(err)
            }
        })
        
    }

    authorize = () => {
        this.auth0.authorize();
        console.log('clock');
        
    }
    render(){
        const { isAuthorized } = this.state;

        return (
            <Provider value={{ isAuthorized, authorize: this.authorize, handleAuthentication: this.handleAuthentication }} >
                {this.props.children}
            </Provider>
        )
    }
}

export function withAuth(WrappedComponent) {
    return class AuthHook extends Component {
        render(){
            return(
                <AuthConsumer>
                    {contextProps => (
                        <WrappedComponent {...contextProps} {...this.props}/>
                    )}
                </AuthConsumer>
            )
        }
        
    }
}

const AuthProviderWithRouter = withRouter(AuthProvider);

export { AuthProviderWithRouter as AuthProvider};