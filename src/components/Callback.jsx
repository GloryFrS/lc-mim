import React from "react";
import {withAuth} from '../components/Auth';
import loading from '../img/loading.gif';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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

class Callback2 extends React.Component {
    
    async componentDidMount() {
        const paramsString = window.location.search;
        const searchParams = new URLSearchParams(paramsString);
        console.log(searchParams.get('token'));
        cookies.set('token', searchParams.get('token'), { path: '/' });
        if (searchParams.get('token')){
            this.props.history.push("/profile");
        }else {
            this.props.history.push("/login");
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

const callback = withAuth(Callback);
const callback2 = withAuth(Callback2);

export { callback as Callback, callback2 as Callback2 };