import React from 'react';
import api from '../API/api';
import { Alert } from 'reactstrap';
import { Link } from "react-router-dom";
import Chatra from "./Chatra";

class RegUser extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			password: '',
            alertErr: false,
            alertSucces:false
		};
		this.onDismiss = this.onDismiss.bind(this);
	}

	handleInputChange = (event) => {
		const { value, name } = event.target;
		this.setState({
		  [name]: value
		});
	  }

	onSubmit = async (event) => {
        
		event.preventDefault();
		try {
			const res = await api.register(this.state);
			if (res.status === 200) {
                console.log(res);
                this.setState({ alertSucces: true });
				// cookies.set('token', res.data.token, { path: '/' });
				// this.props.history.push('/profile');
			} else {
				const error = new Error(res.error);
				throw error;
			}
		} catch(err) {
			console.log(err);
			this.setState({alertErr: true})
		}	
	
	}
	onDismiss() {
        this.setState({ alertErr: false });    
    }
    onRedirect () {
        this.props.history.push('/login');
        // this.setState({ alertSucces: false });
    }
    
	
	render() {
		return (
			<>
				<Chatra/>
				<div className='body-login d-flex'>
                    <div style={ this.state.alertSucces ? {"display": 'block'} : {"display": 'none'} }  onClick={() => this.onRedirect()} className="popup-alert">
                        <Alert color="success" style={{ "left": "calc(50% - 290px)" }} isOpen={this.state.alertSucces} toggle={() => this.onRedirect()}>"Спасибо! Вы успешно зарегистрировались!"</Alert>
					</div>
                    <div style={ this.state.alertErr ? {"display": 'block'} : {"display": 'none'} } onClick={this.onDismiss} className="popup-alert">
						<Alert color="danger"  isOpen={this.state.alertErr} toggle={this.onDismiss}>"Ошибка! Такой пользователь уже есть!"</Alert>
					</div>
					<div className='login'>
						<h1>Регистрация</h1>
						<form onSubmit={this.onSubmit}>
							<input type="number"
								name="name"
								placeholder="Ваш текущий ВК ID"
								value={this.state.name}
								onChange={this.handleInputChange}
								required
								/>
							<input type="password"
							name="password"
							placeholder="Придумайте пароль"
							value={this.state.password}
							onChange={this.handleInputChange}
							required />
							
							<input type="submit" className="button" value="Зарегистрироваться" />
						</form>
                        <Link  className="login-vk" to="/login">Вход</Link>
						
					</div>
				</div>
			</>	
		)
	};

}
export default RegUser;
