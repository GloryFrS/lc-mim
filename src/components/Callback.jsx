import React from "react";
import {withAuth} from '../components/Auth';

class Callback extends React.Component {
    
    componentDidMount() {
        const { handleAuthentication } = this.props;
        if(handleAuthentication) {
            handleAuthentication();
        }
    }

    render(){
        return (
           
                'loading...'
            
        );
    }
}

export default withAuth(Callback);