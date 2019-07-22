import React from 'react';
import banner from '../img/banner.png';
import Popup from "reactjs-popup";
import loading from '../img/loading.gif'
// import Geocode from "react-geocode";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { VKShareButton } from 'react-share';

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
			id: cookies.get('id')
		};
		this.geo = this.geo.bind(this);
		this.handleUploadImage = this.handleUploadImage.bind(this);
	}
	componentDidMount() {
		const params = new URLSearchParams();
		params.append('id', this.state.id);

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
	}

	geo = (e) => {
		e.preventDefault();
		let obj = this.state.master[0].coordinates;
		let coor = JSON.parse(obj);
		axios.get('https://api.opencagedata.com/geocode/v1/json', {
			params: {
			  q: coor.lat.toString() + ',' + coor.lng.toString(), //"41.40139,2.12870"
			  key: "fb0d5699bd8145b68ec866138df4a623",
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
        data.append('api_key',  '5dec5986d30fb2dc1a92bb6d1e055447a359f0590e6794706eb991bbb4eab090'); //this.uploadInput.files[0]);

        for (let i = 0; i < this.uploadInput.files.length; i++) {
            data.append(`file${i + 1}`, this.uploadInput.files[i]);
        }

        axios.post('http://vk.masterimodel.com/node/masterPortfolio.add', data)
            .then(function (response) {
                console.log(response)

                if (response.data.status === 'ok') {
					alert("Файлы успешно добавлены!");
					document.location.reload();
					
                } else {
                    alert("Woops! Something is wrong"); //
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

	render() {
		
		if (this.state.loader && this.state.loader2) {
			const {master, services, address} = this.state;
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
							<h3 className="title">Ваш профиль</h3>
							<div className="row no-gutters">
								<img className="info-photo" src={master.avatar_url} alt="" />
								<div className="info">
									<p className="info_name">{master[0].full_name}</p>
									<p className="info_phone">{master[0].phone_number}</p>
									{address===''? <p onClick={this.geo} className="info_adress">Нажмите, чтобы показать адрес</p> : <p>{address}</p>}
									<Link to="/edit" className="btn">Редактирование</Link>
									
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
						<VKShareButton title='Мой профиль'
							description='Мой профиль' image='https://static.tildacdn.com/tild3861-3535-4630-b135-336536613961/center_2.png' url={'http://localhost:3000/card/' + this.state.id}>
							<button className="btn ">Поделиться профилем</button>	
						</VKShareButton>
						
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
