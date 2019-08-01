import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import loading from '../img/loading.gif';
import GeocodingForm from './GeocodingForm';
import GeocodingResults from './GeocodingResults';
import { Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import InputMask from 'react-input-mask';
import * as opencage from 'opencage-api-client';
// import Map2 from './Map';

const cookies = new Cookies();

class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      id: cookies.get('name'),
      services: [],
      name: '', phone: '', lat: '', lng: '', vk: '', about: '', price: '', country: '', city: '', street: '', house: '',select: '', select2: '',
      loader: false,
      newServices: [],
      servicesTemp:false,
      modal: false,
      backdrop: true,
      alertErr: false, alert: null,
      api: '', apiG: '',
      isLocating: false,
      isSubmitting: false,
      response: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.setNewService = this.setNewService.bind(this);
    this.deleteSetvice = this.deleteSetvice.bind(this);
    this.handleSubmitGeo = this.handleSubmitGeo.bind(this);
    

    
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {

		const params = new URLSearchParams();
		params.append('id', this.state.id);

		axios.post(
        'http://vk.masterimodel.com/node/masters.get', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
        .then(res => {
          this.setState({
            name: res.data[0].full_name,
            phone: res.data[0].phone_number,
            lat: JSON.parse(res.data[0].coordinates).lat.toString(),
            lng: JSON.parse(res.data[0].coordinates).lng.toString(),
            country: JSON.parse(res.data[0].address).country.toString(),
            city: JSON.parse(res.data[0].address).city.toString(),
            street: JSON.parse(res.data[0].address).street.toString(),
            house: JSON.parse(res.data[0].address).house.toString(),
            vk: res.data[0].vk_id,
            about: decodeURI(res.data[0].about_master),
            loader: true,
            select: ''
          });
        })
        axios.post(
          'http://vk.masterimodel.com/node/masterServices.get', params,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
          .then(res => {
            this.setState({services: res.data});
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
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    const params = new URLSearchParams();
    
    if (target.id === 'service')
      params.append('customer_type_id', target.value);  
      axios.post(
          'http://vk.masterimodel.com/node/customerServices.get', params,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
          .then(res => {
            if (res.data.hasOwnProperty('customer_services')) {
                this.setState({servicesTemp: res.data});
            }
          })
          .catch(err => {
              console.log(err);
          });
    
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
    const { name,phone,lat,lng,vk,about, country, city, street, house }  = this.state;
    const str = country + ' ' + city + ' ' + street + ' ' + house;
    opencage
      .geocode({ key: this.state.apiG, q: str })
      .then(response => {
        this.setState({ response, isSubmitting: false })
        const latLng = this.state.response.results[0].geometry;
        this.setState({ lat: latLng.lat, lng: latLng.lng });
        const params = new URLSearchParams();
        params.append('id',             vk);
        params.append('full_name',      name);
        params.append('phone_number',   phone);
        params.append('about_master',   about);
        params.append('coordinates',     JSON.stringify({
          'lat': lat,
          'lng': lng
        }));
        params.append('address',     JSON.stringify({
          'country': country,
          'city': city,
          'street': street,
          'house': house
        }));
        params.append('is_approved',    false);
        params.append('is_immediately', false);
        params.append('reviews_number', "0");
        params.append('api_key',        this.state.api);


        axios.post(
          'http://vk.masterimodel.com/node/masters.edit', params,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})

          .then(res =>{
            if (res.data.status === "ok") {
              this.setState({alert: true});
            }
          })
          .catch(function (error) {
              console.log(error);
          });
        })
      .catch(err => {
        console.error(err);
        this.setState({ response: {}, isSubmitting: false });
      });
    
      
    
    

  }
  onDismiss() {
    this.setState({ alert: false, alertErr: false });
  }
  
  getSelectedText(elementId) {
    const elt = document.getElementById(elementId);

    if (elt.selectedIndex === -1)
        return null;

    return elt.options[elt.selectedIndex].text;
  }


  setNewService (e) {
    e.preventDefault();
    const { id, select, select2, price } = this.state;
    const label = this.getSelectedText('service');
    const label2 = this.getSelectedText('service2');
    const service = {
        customer_types_id: select, 
        customer_services_id: select2, 
        customer_types_label: label, 
        customer_services_label: label2, 
        price: price
    }
    
    // this.state.services.push(service);
    
    if (select.trim() !== '' && select2 !== '' && price.trim() !== '') {
      
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('customer_types_id',      select);
      params.append('customer_services_id',   select2);
      params.append('price',   price); 
      params.append('api_key',        this.state.api);

      axios.post(
        'http://vk.masterimodel.com/node/masterServices.add', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
  
        .then(res =>{
          if (res.data.status === "ok") {
            // this.setState({alert: true});
            this.setState(prevState => ({
              services: [...prevState.services, service],
              alert: true
            }))
          }else {
            this.setState({alertErr: true});
          }
        })
        .catch(function (error) {
            console.log(error);
        });

    }
    
  }

  deleteSetvice(e, i, id_type, id_service){
    e.preventDefault();
    

    const { id } = this.state;
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('customer_types_id',      id_type);
    params.append('customer_services_id',   id_service); 
    params.append('api_key',        this.state.api);
    
    axios.post(
    'http://vk.masterimodel.com/node/masterServices.delete', params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})

    .then(response => {


        if (response.data.hasOwnProperty('status') && response.data.status === 'ok') {
            this.setState({ alert: true });
            let arr = [...this.state.services]; 
            if (i !== -1) {
              arr.splice(i, 1);
              this.setState({services: arr});
            }
        }
    })

    .catch(function (error) {
        console.log(error);
    });
  }

  

  handleSubmitGeo(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { country, city , street, house } = this.state;
    const str = country + ' ' + city + ' ' + street + ' ' + house;
    opencage
      .geocode({ key: this.state.apiG, q: str })
      .then(response => {
        this.setState({ response, isSubmitting: false });
        const latLng = this.state.response.results[0].geometry;
        this.setState({lat: latLng.lat, lng: latLng.lng}) 
        console.log(this.state.lat)
      })
      .catch(err => {
        console.error(err);
        this.setState({ response: {}, isSubmitting: false });
      });
  }
   
  render() {
    const { name,phone,vk,about,alert,alertErr,loader,price,services, country, city, street, house } = this.state;
    const listServices = services.map((service, index) =>
      <div key={index} className="d-flex" style={{"alignItems": "center"}}>
        <p>{service.customer_services_label} / {service.customer_types_label}</p>
        <p>{service.price} руб.</p>
        <button type="button" onClick={(event) => this.deleteSetvice(event, index, service.customer_types_id, service.customer_services_id)} id={index} className="del" >
          <i >+</i>
        </button>
      </div>
    );
    const selectTypes = this.props.customerTypes.map((type) =>
      <option key={type.id} value={type.id}>{type.label}</option>
    ) 
    
    if(!loader){
      return (
				<div className='loading'>
					<img src={loading} alt='loading...'/>
				</div>
			)
    }
    return (
        <div className="container">
          <div className="row">
            <div className="col-12">
              
              <div style={ alert || alertErr ? {"display": 'block'} : {"display": 'none'} } onClick={this.onDismiss} className="popup-alert">
                <Alert color="success" onClick={this.onDismiss} isOpen={alert} toggle={this.onDismiss}>"Данные успешно отредактированы!"</Alert>
                <Alert color="danger" isOpen={alertErr} onClick={this.onDismiss} toggle={this.onDismiss}>"Ошибка, такая услуга уже есть!"</Alert>
              </div>
              <form onSubmit={this.handleOnSubmit} className="edit-profile">
                <div className="d-flex row">
                    <div className='col-md-7 col-xl-9 col-12 '>
                      <h3 className="title">Редактирование профиля</h3>
                    </div>
                    <div className='col-md-5 col-xl-3 col-10'>
                      <div className="btn-block d-flex">
                          <button type="submit" className="btn">Сохранить</button>
                          <button type="reset" onClick={() => this.props.history.goBack()} className=" btn-cancel">Отмена</button>
                      </div>
                    </div>
                    
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name-input">Ваша имя и фамилия</label>
                      <input name="name" onChange={this.handleInputChange} type="text" id="name-input" className="form-control" value={name} placeholder="Введите имя и фамилию" />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="tel">Телефон</label>
                      <InputMask  name="phone" onChange={this.handleInputChange}  id="tel" className="form-control" value={phone} placeholder="Введите номер" mask="+7 999 999 99 99" maskChar=" " />
                      {/* <input name="phone" onChange={this.handleInputChange} type="tel" className="form-control" id="tel" value={phone} placeholder="Введите номер" /> */}
                    </div>
                </div>
                <div className="row">
                    <label className="fix-label">Адрес</label>
                    <div className="form-group col-6 col-md-3">
                        <input name="country" type="text" onChange={this.handleInputChange} className="form-control" value={country} placeholder="Страна"/>
                    </div>
                    <div className="form-group col-6 col-md-3">                            
                        <input name="city" type="text" onChange={this.handleInputChange} className="form-control"  value={city} placeholder="Город"/>
                    </div>
                    <div className="form-group col-6 col-md-3">                            
                        <input name="street" type="text" onChange={this.handleInputChange}  className="form-control" value={street} placeholder="Улица"/>
                    </div>
                    <div className="form-group col-6 col-md-3">                            
                        <input name="house" type="text" onChange={this.handleInputChange} className="form-control" value={house} placeholder="Дом"/>
                    </div>
                    <div className="form-group col-md-2">
                    
                      {/* <Button color="danger"  className='geoButton' onClick={this.handleSubmitGeo}>Подтвердить адрес</Button> */}
                      {/* <Button color="danger" onChange={this.handleInputChange} className='geoButton' onClick={this.toggle}>Показать на карте</Button> */}
                      {/* <input name="lat" onChange={this.handleInputChange} type="text" className="form-control" value={lat} placeholder="Широта" /> */}
                    </div>
                    <div className="form-group col-md-4">
                      {/* <input name="lng" onChange={this.handleInputChange} type="text" className="form-control" value={lng} placeholder="Долгота" /> */}
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                    <label>Ваш VK id</label>
                    <input name="vk" onChange={this.handleInputChange} type="text" id="name-input" className="form-control" value={vk} placeholder="https://vk.com/idxxxxxxx" />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-12">
                    <label>О себе</label>
                    <textarea name="about" onChange={this.handleInputChange} className="form-control" rows={5} value={about} />
                    </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Ваши услуги</label>
                    <div className="row" style={{alignItems: 'center'}}>
                      <div className="col-12 col-md-4">
                        <select name="select" className="form-control" id="service" value={this.state.select}  onChange={this.handleInputChange}>
                          <option>Выберите тип</option>
                          {selectTypes}
                        </select>
                      </div>
                      <div className="col-12 col-md-4">
                        <select name="select2" className="form-control" id="service2" value={this.state.select2} onChange={this.handleInputChange}>
                          <option>Выберите услугу</option>
                          { this.state.servicesTemp ? this.state.servicesTemp.customer_services.map((service) =>
                            <option key={service.id} value={service.id}>{service.label}</option>
                          ) : '' }
                        </select>
                      </div>
                      <div className="col-10 col-md-3">
                        <input name="price" id="price" onChange={this.handleInputChange} value={price} className="form-control" type="number" placeholder="Цена в рублях" />
                      </div>
                      <div className="col-md-1 col-2">
                        <button onClick={this.setNewService} id="add">+</button>
                      </div>
                    </div>
                    <div id="dynamic_field">
                      {listServices}
                    </div>
              </div>
            </div>
                <div className="btn-block-bottom d-flex">
                    <button type="submit" className="btn" href="/card">Сохранить изменения</button>
                    <button type="reset" onClick={() => this.props.history.goBack()} className=" btn-cancel">Отмена</button>
                </div>
              </form>
          
              <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.toggle}>Введите адрес или координаты</ModalHeader>
                <ModalBody> 
                  <div className="columns">
                    <div className="column is-one-third-desktop">
                      <GeocodingForm
                        apikey = {this.state.apiG}
                        str = { country + ' ' + city + ' ' + street + ' ' + house }
                      />
                    </div>
                    <div className="column">
                      <GeocodingResults response={this.state.response} />
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </div>
    )
      
  }



}

export default EditProfile;