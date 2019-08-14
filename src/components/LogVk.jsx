import React from "react";
import { withAuth } from "../components/Auth";
import { Redirect } from "react-router-dom"; 
import { Link } from 'react-router-dom';


export default withAuth(({ isAuthorized, authorize }) => (
    isAuthorized ? (
        <Redirect to="/profile"/>
     ) : ( 
        <>  
            <Link className="login-vk" to='/' onClick={authorize}>
                Войти с помощью ВК
            </Link>
        </>
    )
));