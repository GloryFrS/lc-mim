import React from 'react';
import Cookies from 'universal-cookie';
import api from '../API/api';
import { Link } from "react-router-dom"
import { Alert } from 'reactstrap';
import Chatra from "./Chatra";
// import { AppContextConsumer } from '../App';


const cookies = new Cookies();

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			password: '',
			alertErr: false
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
		if (cookies.get('token')){
			cookies.remove('token',  { path: '/' })
		}
		try {
			const res = await api.login(JSON.stringify(this.state));
			if (res.status === 200) {
				cookies.set('token', res.data.token, { path: '/' });
				this.props.history.push('/profile');
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
		this.setState({ alertSucces: false, alertErr: false });
	  }
	
	render() {
		
		return (
			<>
				<Chatra/>
				<div className='body-login d-flex'>
					<div style={ this.state.alertErr ? {"display": 'block'} : {"display": 'none'} } onClick={this.onDismiss} className="popup-alert">
						<Alert color="danger" isOpen={this.state.alertErr} toggle={this.onDismiss}>"Неверно введен логин или пароль"</Alert>
					</div>
					<div className='login'>
						<h1>Вход <br/> в личный кабинет</h1>
						<a  className="login-vk button"  href="https://oauth.vk.com/authorize?response_type=code&redirect_uri=https%3A%2F%2Fvk.masterimodel.com%3A3005%2Fauth%2Fvkontakte%2Fcallback&client_id=7044956">Войти с помощью ВК</a>
						<form onSubmit={this.onSubmit}>
							<input type="text"
								name="name"
								placeholder="Введите ВК ID"
								value={this.state.name}
								onChange={this.handleInputChange}
								required
								/>
							<input type="password"
								name="password"
								placeholder="Введите пароль"
								value={this.state.password}
								onChange={this.handleInputChange}
								required />
							
							<input type="submit" className="button" value="Войти" />
							<Link  className="button" to="/registration">Регистрация</Link>
						</form>
					</div>
				</div>
			</>	
		)
	};

}
export default Login;
export const AppContext = React.createContext({
	id: "as"
  });
