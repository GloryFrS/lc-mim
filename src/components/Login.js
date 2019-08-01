import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Alert } from 'reactstrap';
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

	componentDidMount() {
		
	}

	
	handleInputChange = (event) => {
		const { value, name } = event.target;
		this.setState({
		  [name]: value
		});
	  }

	onSubmit = (event) => {
		event.preventDefault();
		axios.post(
			'http://vk.masterimodel.com:3004/login', JSON.stringify(this.state),
			{headers: {'Content-Type': 'application/json'}})
		.then(res => {
			if (res.status === 200) {
				cookies.set('name', this.state.name, { path: '/' });
				cookies.set('token', res.data.token, { path: '/' });
				this.props.history.push('/profile');
			} else {
			const error = new Error(res.error);
			throw error;
			}
		})
		.catch(err => {
			console.error(err);
			this.setState({alertErr: true})
			
		});
	}
	onDismiss() {
		this.setState({ alertSucces: false, alertErr: false });
	  }
	
	
	render() {
		
		return (
			<div className='body-login d-flex'>
				<Alert color="danger" isOpen={this.state.alertErr} toggle={this.onDismiss}>"Неверно введен логин или пароль"</Alert>
				
				<div className='login'>
					<h1>Вход <br/> в личный кабинет</h1>
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
					</form>
					{/* <a className="login-vk" href="/profile">Войти с помощью ВК</a> */}
				</div>
			</div>	
		)
	};

}
export default Login;
export const AppContext = React.createContext({
	id: "as"
  });
