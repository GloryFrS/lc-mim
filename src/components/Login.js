import React from 'react';
import Cookies from 'universal-cookie';
// import { AppContextConsumer } from '../App';

const cookies = new Cookies();

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			id: '',
			password: ''
		};
		
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
		fetch('/api/authenticate', {
			method: 'POST',
			body: JSON.stringify(this.state),
			headers: {
			'Content-Type': 'application/json'
			}
		})
		.then(res => {
			if (res.status === 200) {
				cookies.set('id', this.state.id);
				this.props.history.push('/profile');
			} else {
			const error = new Error(res.error);
			throw error;
			}
		})
		.catch(err => {
			console.error(err);
			alert('Error logging in please try again');
		});
	}

	
	
	render() {
		
		return (
			<div className='body-login d-flex'>
				<div className='login'>
				
					<h1>Вход <br/> в личный кабинет</h1>
					

					<form onSubmit={this.onSubmit}>
						<input type="text"
							name="id"
							placeholder="Ваш номер телефона 7xxxxxxxxxx"
							value={this.state.id}
							onChange={this.handleInputChange}
							required
							/>
						<input type="password"
						name="password"
						placeholder="Enter password"
						value={this.state.password}
						onChange={this.handleInputChange}
						required />
						
						<input type="submit" className="button" value="Войти" />
					</form>
					<a className="login-vk" href="/profile">Войти с помощью ВК</a>
				</div>
			</div>	
		)
	};

}
export default Login;
export const AppContext = React.createContext({
	id: "as"
  });
