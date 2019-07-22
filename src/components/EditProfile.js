import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import loading from '../img/loading.gif';
import GeocodingForm from './GeocodingForm';
import GeocodingResults from './GeocodingResults';
import * as opencage from 'opencage-api-client';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const cookies = new Cookies();

class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      id: cookies.get('id'),
      services: [],
      name: '',
      phone: '',
      lat: '',
      lng: '',
      vk: '',
      about: '',
      price: '',
      alert: null,
      loader: false,
      newServices: [],
      servicesTemp:false,
      select: '',
      query: '',
      apikey: 'fb0d5699bd8145b68ec866138df4a623',
      isSubmitting: false,
      response: {},
      modal: false,
      backdrop: true
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.setNewService = this.setNewService.bind(this);
    this.deleteSetvice = this.deleteSetvice.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
            vk: res.data[0].vk_id,
            about: decodeURI(res.data[0].about_master),
            loader: true,
            select: ''
          });
				console.log(res.data);
        })
        axios.post(
          'http://vk.masterimodel.com/node/masterServices.get', params,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})
          .then(res => {
            this.setState({services: res.data});
            console.log(this.state.service);
          })
        
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  
  handleChange(key, value) {
    this.setState({ [key]: value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    opencage
      .geocode({ key: this.state.apikey, q: this.state.query })
      .then(response => {
        console.log(response);
        this.setState({ response, isSubmitting: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ response: {}, isSubmitting: false });
      });
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
                console.log(res.data);
            }
          })
          .catch(err => {
              console.log(err);
          });
    
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
    const { name,phone,lat,lng,vk,about } = this.state;
    const params = new URLSearchParams();

    params.append('id',             vk);
    params.append('full_name',      name);
    params.append('phone_number',   phone);
    params.append('about_master',   about);
    params.append('coordinates',     JSON.stringify({
      'lat': lat,
      'lng': lng
    }));
    params.append('is_approved',    false);
    params.append('is_immediately', false);
    params.append('reviews_number', "0");
    params.append('api_key',        "5dec5986d30fb2dc1a92bb6d1e055447a359f0590e6794706eb991bbb4eab090");


    axios.post(
        'http://vk.masterimodel.com/node/masters.edit', params,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"}})

        .then(res =>{
          if (res.data.status === "ok") {
            this.setState({alert: true});
          }

          console.log("params:", params);
          console.log("response:", res);
        })
        .catch(function (error) {
            console.log(error);
        });

  }
  onDismiss() {
    this.setState({ alert: false });
  }
  
  getSelectedText(elementId) {
    const elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
  }


  setNewService (e) {
    e.preventDefault();
    const { select, select2 } = this.state;
    const label = this.getSelectedText('service');
    const label2 = this.getSelectedText('service2');
    const service = {
        customer_types_id: select, 
        customer_services_id: select2, 
        customer_types_label: label, 
        customer_services_label: label2, 
        price: this.state.price
    }
    
    // this.state.services.push(service);
    console.log(this.state.services);
    
    this.setState(prevState => ({
        services: [...prevState.services, service]
    }))
  }

  deleteSetvice(e, i){
    e.preventDefault();
    let arr = [...this.state.services]; // make a separate copy of the array
    if (i !== -1) {
      arr.splice(i, 1);
      this.setState({services: arr});
    }
    console.log(i);
  }
   
  render() {
    const { name,phone,lat,lng,vk,about,alert,loader,price,services } = this.state;
    const listServices = services.map((service, index) =>
      <div key={index} className="d-flex" style={{"alignItems": "center"}}>
        <p>{service.customer_services_label} / {service.customer_types_label}</p>
        <p>{service.price} руб.</p>
        <button type="button" onClick={(event) => this.deleteSetvice(event, index)} id={index} className="del" >
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
            <Alert color="success" isOpen={alert} toggle={this.onDismiss}>"Данные успешно отредактированы!"</Alert>
            <form onSubmit={this.handleOnSubmit} className="edit-profile">
              <div className="d-flex">
                  <h3 className="title">Редактирование профиля</h3>
                  <div className="btn-block d-flex">
                      <button type="submit" className="btn">Сохранить изменения</button>
                      <button type="reset" onClick={(e) => this.props.history.goBack()} className=" btn-cancel">Отмена</button>
                  </div>
              </div>
              <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="name-input">Ваша имя и фамилия</label>
                    <input name="name" onChange={this.handleInputChange} type="text" id="name-input" className="form-control" value={name} placeholder="Введите имя и фамилию" />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="tel">Телефон</label>
                    <input name="phone" onChange={this.handleInputChange} type="tel" className="form-control" id="tel" value={phone} placeholder="Введите номер" />
                  </div>
              </div>
              <div className="row">
                  <label className="fix-label">Координаты местоположения</label>
                  <div className="form-group col-md-4">
                    <input name="lat" onChange={this.handleInputChange} type="text" className="form-control" value={lat} placeholder="Широта" />
                  </div>
                  <div className="form-group col-md-4">
                    <input name="lng" onChange={this.handleInputChange} type="text" className="form-control" value={lng} placeholder="Долгота" />
                  </div>
                  <Button color="danger" onClick={this.toggle}>Найти координаты</Button>
                  
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
                    <div className="col-md-4">
                      <select name="select" className="form-control" id="service" value={this.state.select}  onChange={this.handleInputChange}>
                        <option>Выберите тип</option>
                        {selectTypes}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <select name="select2" className="form-control" id="service2" value={this.state.select2} onChange={this.handleInputChange}>
                        { this.state.servicesTemp ? this.state.servicesTemp.customer_services.map((service) =>
                          <option key={service.id} value={service.id}>{service.label}</option>
                        ) : '' }
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input name="price" id="price" onChange={this.handleInputChange} value={price} className="form-control" type="number" placeholder="Цена в рублях" />
                    </div>
                    <div className="col-md-1">
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
              <button type="reset" onClick={this.goBack} className=" btn-cancel">Отмена</button>
          </div>
        </form>
        
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
            <ModalHeader toggle={this.toggle}>Введите адрес или координаты</ModalHeader>
            <ModalBody>
              <div className="columns">
                <div className="column is-one-third-desktop">
                  <GeocodingForm
                    apikey={this.state.apikey}
                    query={this.state.query}
                    isSubmitting={this.state.isSubmitting}
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}
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