import React from "react";
import {withAuth} from '../components/Auth';
import loading from '../img/loading.gif';

class Callback extends React.Component {
    
    componentDidMount() {
        const { handleAuthentication } = this.props;
        if(handleAuthentication) {
            handleAuthentication();
        }
    }

    render(){
        return (
            <div className='loading'>
                <img src={loading} alt='loading...'/>
            </div>
        );
    }
}

export default withAuth(Callback);