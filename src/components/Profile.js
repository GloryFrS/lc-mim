import React from 'react';
import banner from '../img/banner.png';
import Popup from "reactjs-popup";
import loading from '../img/loading.gif'
// import Geocode from "react-geocode";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { VKShareButton } from 'react-share';
import { Alert } from 'reactstrap';

const cookies = new Cookies();


class Profile extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			master: null,
			loader: false,
			address: '',
			services: [],
			loader2: false,
			id: cookies.get('name'),
			alertSucces: false,
			alertErr: false,
			api: '',
			apiG: ''
		};
		this.geo = this.geo.bind(this);
		this.handleUploadImage = this.handleUploadImage.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
	}
	componentDidMount() {
		const params = new URLSearchParams();
		params.append('id', this.state.id);

		axios.post(
            'http://vk.masterimodel.com/node/masters.get', params,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
            .then(res => {
				this.setState({master: res.data, loader: true});
			  })
		axios.post(
			'http://vk.masterimodel.com/node/masterServices.get', params,
			{headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
			.then(res => {
				this.setState({services: res.data, loader2:true});
			})

		const cook = {
			"token": cookies.get('token')
		};
		
		axios.post('http://vk.masterimodel.com:3004/sssh', cook)
			.then(res => {
				this.setState({
					api: res.data.api,
					apiG: res.data.apiG
				});
			})
	}

	geo = (e) => {
		e.preventDefault();
		let obj = this.state.master[0].coordinates;
		let coor = JSON.parse(obj);
		axios.get('https://api.opencagedata.com/geocode/v1/json', {
			params: {
			q: coor.lat.toString() + ',' + coor.lng.toString(), //"41.40139,2.12870"
			key: this.state.apiG,
			language: "ru",
			pretty: 1

			}
		})
		.then((res) => {
			this.setState({address: res.data.results[0].formatted})
		})
		.catch(function (err) {
			console.log(err);
		})
		  
	}
	
	handleUploadImage(ev) {
        ev.preventDefault();

        const data = new FormData();

        data.append('id', this.state.id);  //this.uploadInput.files[0]);
        data.append('api_key',  this.state.api); //this.uploadInput.files[0]);

        for (let i = 0; i < this.uploadInput.files.length; i++) {
            data.append(`file${i + 1}`, this.uploadInput.files[i]);
		}
		
		if (this.state.master.portfolio.length < 5) {
			// console.log(str.replace(/\s/g, ''));
			
			axios.post('http://vk.masterimodel.com/node/masterPortfolio.add', data)
            .then(response => {
                if (response.data.status === 'ok') {
					this.setState({alertSucces: true});
					document.location.reload();
					
                } else {
					this.setState({alertErr: true});
                }

            })
            .catch(function (error) {
                console.log(error);
            });
		} else {
			this.setState({alertErr: true});
		}

        
	}
	onDismiss() {
		this.setState({ alertSucces: false, alertErr: false });
	  }

	render() {
		
		if (this.state.loader && this.state.loader2) {
			const {master, services, address, alertErr, alertSucces} = this.state;
			const about = decodeURI(master[0].about_master);
			const servicesList = services.map((service, index) =>
				<div key={index} className=" col-12 col-md-6">
					<div className="service">
						{service.customer_services_label} / {service.customer_types_label}
						<span>от {service.price} рублей</span>
					</div>
				</div>
			);
			const portfolio = master.portfolio.map((photo, index) =>
				<Popup key={index} trigger={<img src={photo} alt="" />}  modal
				closeOnDocumentClick>
					<img className='origin_Photo' src={photo} alt="" />
				</Popup>
				
			);
			let addressObj = JSON.parse(master[0].address);
			const addressStr = addressObj.country.toString() + ' ' + addressObj.city.toString() + ' ' + addressObj.street.toString() + ' ' + addressObj.house.toString();  
			
			return (
				<div className="container">
					<div style={ alertSucces || alertErr ? {"display": 'block'} : {"display": 'none'} } onClick={this.onDismiss} className="popup-alert">
						<Alert color="success" onClick={this.onDismiss} isOpen={alertSucces} toggle={this.onDismiss}>"Портфолио обновлено!"</Alert>
						<Alert color="danger" onClick={this.onDismiss} isOpen={alertErr} toggle={this.onDismiss}>"Ошибка, нельзя добавить больше 5 фотографий"</Alert>
					</div>
					<div className="row">
						<div className="col-12">
							<h3 className="title">Ваш профиль</h3>
							<div className="row no-gutters">
								<div className="col-lg-3 col-md-4 col-3">
									<img className="info-photo" src={master.avatar_url} alt="" />
								</div>
								<div className="col-lg-9 col-md-8 col-9">
									<div className="info">
										<p className="info_name">{master[0].full_name}</p>
										<p className="info_phone">{master[0].phone_number}</p>
										<p className="info_adress">{ addressStr }</p>
										<Link to="/edit" className="btn">Редактирование</Link>
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<div className="row no-gutters">
						<h3 className="title mt-5">Услуги</h3>
						{servicesList}
					</div>
					<div className="row no-gutters">
						<h3 className="title mt-5">О себе</h3>
						<p>{about}</p>
					</div>
					<div className="row no-gutters">
						<h3 className="title mt-5">Примеры работ</h3>
						<div className="sample">				
							{portfolio}
							<form onSubmit={this.handleUploadImage}>
								<label className="sample-file-upload">
									<input onChange={this.handleUploadImage} ref={(ref) => { this.uploadInput = ref; }} type="file" multiple />
								</label>
							</form>
						</div>
					</div>
					<div className="row no-gutters">
						<div className='share'>
							<VKShareButton title='Мой профиль'
								description='Мой профиль' image='https://static.tildacdn.com/tild3861-3535-4630-b135-336536613961/center_2.png' url={'http://vk.masterimodel.com/card/' + this.state.id}>
								<button className="btn ">Поделиться профилем</button>	
							</VKShareButton>
							<a className="btn see" target="_blank" rel="noopener noreferrer" href={'http://vk.masterimodel.com/admin/card/' + this.state.id}>Посмотреть профиль</a>
						</div>	
					</div>
					<div className="banner">
						<img src={banner} alt="" />
					</div>
				</div>
			);
		} else {
			return (
				<div className='loading'>
					<img src={loading} alt='loading...'/>
				</div>
			)
		}
		
	};

}
export default Profile;
