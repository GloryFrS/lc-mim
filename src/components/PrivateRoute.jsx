import React from 'react';
import { withAuth } from './Auth';
import { Route, Redirect } from 'react-router-dom';
import WithAuth from '../withAuth';


export const PrivateRoute = withAuth(
    ({ component: RouteComponent, isAuthorized, ...rest }) => (
        <Route 
            {...rest} 
            render={routeProps => 
                isAuthorized ? (
                    <RouteComponent {...rest} {...routeProps}/>
                    ) : (
                    <WithAuth 
                      ComponentToProtect={RouteComponent}
                      {...rest}
                    />
                    // <Redirect to={"/login"}/> 
            )}
        />
    )    
)