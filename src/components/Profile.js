import React from 'react';
import banner from '../img/banner.png';
import axios from 'axios';
import Popup from "reactjs-popup";
import loading from '../img/loading.gif'
import Geocode from "react-geocode";




class Profile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			master: null,
			loader: false,
			address: '',
			services: [],
			loader2: false
		};
		this.geo = this.geo.bind(this);
	}
	componentDidMount() {
		const params = new URLSearchParams();
		params.append('id', 2991140);

		axios.post(
            'http://vk.masterimodel.com/node/masters.get', params,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
            .then(res => {
				this.setState({master: res.data, loader: true});
				console.log(this.state.master);
			  })
		axios.post(
			'http://vk.masterimodel.com/node/masterServices.get', params,
			{headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
			.then(res => {
				this.setState({services: res.data, loader2:true});
				console.log(this.state.service);
				})
		
				Geocode.fromAddress('Eiffel Tower').then(
					response => {
					  const { lat, lng } = response.results[0].geometry.location;
					  console.log(lat, lng);
					},
					error => {
					  console.error(error);
					}
				  );
	}
	

	geo = (e) => {
		
		let obj = this.state.master[0].coordinates;
		let coor = JSON.parse(obj);
		console.log(coor.lat.toString());
		
		
		
		
	}
	

	render() {
		
		if (this.state.loader && this.state.loader2) {
			const {master, services} = this.state;
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
			return (
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h3 onClick={this.geo} className="title">Ваш профиль</h3>
							<div className="row no-gutters">
								<img className="info-photo" src={master.avatar_url} alt="" />
								<div className="info">
									<p className="info_name">{master[0].full_name}</p>
									<p className="info_phone">{master[0].phone_number}</p>
									<p className="info_adress">Россия, г. Барнаул, ул. Попова, д. 102</p>
									<a className="btn" href="/edit">Редактирование</a>
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
							<form>
								<label className="sample-file-upload">
									<input type="file" />
								</label>
							</form>
						</div>
					</div>
					<div className="row no-gutters">
						<button className="btn ">Поделиться профилем</button>
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
