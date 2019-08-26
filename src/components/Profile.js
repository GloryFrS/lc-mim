import React from 'react';
import Popup from "reactjs-popup";
import Loading from './Loading';
import api from '../API/api';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { VKShareButton } from 'react-share';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Registration from './Registration';
import Chatra from "./Chatra"

import Menu from "./Menu";

const cookies = new Cookies();


class Profile extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			master: null,
			portfolio: [],
			loader: false,
			address: '',
			services: [],
			id: '',
			alertSucces: false,
			alertErr: false,
			api: '',
			apiG: '',
			newMaster: false,
			loadImg: false,
			admin: false
		};
		this.handleUploadImage = this.handleUploadImage.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.deletePortfolio = this.deletePortfolio.bind(this);
	}
	async componentDidMount() {

		const cook = {
			"token": cookies.get('token')
		};
		const admin = await api.checkAdmin(cook);
		if (admin) {
			this.setState({ admin: true });
		}
		try {
			const masterData = await api.mastersGet2(cook);
			const params = new URLSearchParams();
			params.append('id', masterData.data[0].vk_id);
			const masterServices = await api.masterServices(params);
			const sssh = await api.sssh(cook);
			const link = await api.linkGet();
				
			if (link.status === 200){
				this.setState({ link: link.data.status[0].link });
			}
			if ( masterData.data === 'master not found' ) {
				this.setState({ newMaster: true })
			} else { 
				this.setState({
					master: masterData.data,
					id: masterData.data[0].vk_id,
					portfolio: masterData.data.portfolio, 
					loader: true,
					services: masterServices.data, 
					api: sssh.data.api,
					apiG: sssh.data.apiG
				});
				console.log(masterData.data);
			 }
			
			
		} catch (err) {
			console.log(err)
		}
		
	}

	async handleUploadImage (ev) {
		ev.preventDefault();
		this.setState({ loadImg: true });
        const data = new FormData();
        data.append('id', this.state.id);  //this.uploadInput.files[0]);
        data.append('api_key',  this.state.api); //this.uploadInput.files[0]);
        for (let i = 0; i < this.uploadInput.files.length; i++) {
            data.append(`file${i + 1}`, this.uploadInput.files[i]);
		}
		const params = new URLSearchParams();
		params.append('id', this.state.master[0].vk_id);
		if (this.state.master.portfolio.length < 5) {
			// console.log(str.replace(/\s/g, ''));
			try {
				const response = await api.masterPortfolioAdd(data);
				if (response.data.status === 'ok') {
					this.setState({ alertSucces: true, loadImg: false });

					document.location.reload();
					console.log(response)
					
                } else {
					this.setState({alertErr: true});
                }	
			} catch (error) {
				console.log(error);
			}
			
		} else {
			this.setState({alertErr: true});
		}

        
	}
	onDismiss() {
		this.setState({ alertSucces: false, alertErr: false });
	  }

	async deletePortfolio(e, photo, i) {
		e.preventDefault();
		const data2 = {
			'id': this.state.id,  
			'api_key':  this.state.api,
			'filename':  photo.split('/')[7]
		};
		try {
			const response = await api.masterPortfolioDel(data2);
			if (response.data === "portfolio item has been deleted") {
				let arr = [...this.state.portfolio]; 
				if (i !== -1) {
					arr.splice(i, 1);
					this.setState({portfolio: arr});
				}
				console.log(response)
				
			} else {
				this.setState({alertErr: true});
				console.log(response)
			}
		} catch (error) {
			console.log(error);
		}
	}	  

	render() {
		if( this.state.loadImg ) {
			return (
				<Loading/>
			)
		}
		if (this.state.admin){
			return (
				<Redirect to="/moderators"/>
			)
		}
		
		if (this.state.loader) {
			const {master, portfolio, services, alertErr, alertSucces, newMaster, link} = this.state;
			const about = decodeURI(master[0].about_master);
			const servicesList = !newMaster ? services.map((service, index) =>
				<div key={index} className=" col-12 col-md-6">
					<div className="service">
						{service.customer_services_label} / {service.customer_types_label}
						<span>от {service.price} рублей</span>
					</div>
				</div>
			) : null;
			const portfolioList = !newMaster ? portfolio.map((photo, index) =>
				<div className='masters_portfolio' key={index}>
					<FontAwesomeIcon icon={faTimesCircle} onClick={(e) => this.deletePortfolio(e,photo,index)} size="lg" color='red'/>
					<Popup  trigger={<img src={photo} alt="" />} modal closeOnDocumentClick>
						<img className='origin_Photo' src={photo} alt="" />
					</Popup>
				</div>
				
			) : null;
			let addressObj = JSON.parse(master[0].address);
			const addressStr = !addressObj ? '' : addressObj.country.toString() + ' ' + addressObj.city.toString() + ' ' + addressObj.street.toString() + ' ' + addressObj.house.toString();  
			
			return (
				<>	
					<Chatra/>
					<Menu/>
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
							{this.state.loadImg ? <Loading/> : ''}
							<div className="sample">				
								{portfolioList}
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
									description='Мой профиль' image='https://static.tildacdn.com/tild3861-3535-4630-b135-336536613961/center_2.png' url={'http://lk.masterimodel.app/card/' + this.state.id}>
									<button className="btn ">Поделиться профилем</button>	
								</VKShareButton>
								<a className="btn see" target="_blank" rel="noopener noreferrer" href={'http://lk.masterimodel.app/card/' + this.state.id}>Посмотреть профиль</a>
							</div>	
						</div>
						<div className="banner">
							<a href={link} target="_blank" rel="noopener noreferrer">
								<img src={'http://vk.masterimodel.com/node/images/banners/mim.png'} alt="" />
							</a>
						</div>
					</div>
				</>
			);
		} else {
			return (
				<>
					<Registration id={this.state.id} isOpen={this.state.newMaster} api={this.state.api}/>
					<Loading/>
				</>
			)
		}
		
	};

}
export default Profile;
