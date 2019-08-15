import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import InputMask from 'react-input-mask';
import ResultMap2 from './Map';
import L from 'leaflet'; 
import api from '../API/api';
import { Link, Redirect } from 'react-router-dom';



export default class Registration extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            phone: '',
            lat: '',
            lng: '',
            about: '',
            country: '',
            city: '',
            street: '',
            house: '',
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleOnSubmit = async (e) => {
        e.preventDefault();
        
        const { name, phone, about, country, city, street, house }  = this.state;
        const str = country + ',' + city + ',' + street + ',' + house;
        const geocoder = L.Control.Geocoder.mapbox('pk.eyJ1IjoiZ2xvcnlmcnMiLCJhIjoiY2p5eHZtdm05MWJjaDNtcnJxY3UwdnYwOCJ9.VhGilGU54k8Voi0pIaVggQ');
        const self = this;
        
        
        geocoder.geocode(str, async results => {
            if (results) {
                self.setState({lat: results[0].center.lat, lng: results[0].center.lng});
                console.log(results);
                const params = new URLSearchParams();
                params.append('id',             parseInt(this.props.id));
                params.append('full_name',      name);
                params.append('phone_number',   phone);
                params.append('about_master',   about);
                params.append('coordinates',     JSON.stringify({
                    'lat': results[0].center.lat,
                    'lng': results[0].center.lng
                }));
                params.append('address',     JSON.stringify({
                    'country': country,
                    'city': city,
                    'street': street,
                    'house': house
                }));
                params.append('is_approved',    1);
                params.append('is_immediately', 0);
                params.append('api_key',        '5dec5986d30fb2dc1a92bb6d1e055447a359f0590e6794706eb991bbb4eab090');

            
                try {
                    const res = await api.mastersAdd(params);
                    if (res.data.status === 'ok') {
                        this.setState({ redirect: true });
                    } else {
                        alert("Ошибка");
                    }
                } catch (error) {
                    console.log(error);
                }
            }else {
                alert('Такого адреса нету');
            }
            
        })
        
    }

    render () {
        const { name, phone, about, country, city, street, house, redirect } = this.state;
        if (redirect) { return <Redirect to='/'/>} ;
        return (
            <Modal isOpen={this.props.isOpen}  >
                <ModalHeader >Добро пожаловать в Мастер и Модель</ModalHeader>
                <ModalBody>
                    <form onSubmit={ this.handleOnSubmit }  className="edit-profile">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name-input">Ваша имя и фамилия</label>
                                <Input required name="name" onChange={this.handleInputChange} type="text" id="name-input" className="form-control" value={name}  placeholder="Введите имя и фамилию" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="tel">Телефон</label>
                                <InputMask required  name="phone" value={phone} onChange={this.handleInputChange} id="tel" className="form-control"  placeholder="Введите номер" mask="+79999999999" maskChar=" " />
                                
                            </div>
                            
                            <div className="form-group col-12 col-md-3">
                                <label >Страна</label>
                                <Input required name="country" value={country} type="text" onChange={this.handleInputChange} className="form-control"  placeholder="Страна"/>
                            </div>
                            <div className="form-group col-12 col-md-4">                            
                                <label >Город(область)</label>
                                <Input required name="city" type="text" onChange={this.handleInputChange} value={city} className="form-control"  placeholder="Город"/>
                            </div>
                            <div className="form-group col-12 col-md-3">
                                <label >Улица</label>                            
                                <Input required name="street" type="text" onChange={this.handleInputChange} value={street} className="form-control"  placeholder="Улица"/>
                            </div>
                            <div className="form-group col-12 col-md-2">
                                <label>Дом</label>                            
                                <Input required name="house" type="number" onChange={this.handleInputChange} value={house} className="form-control"  placeholder="Дом"/>
                            </div>
                            <div className="form-group col-md-12">
                                <label>О себе</label>
                                <textarea required name="about" onChange={this.handleInputChange} value={about} className="form-control" rows={5}  />
                            </div>
                            
                            <div className="form-group col-md-12">
                                <div className="row">
                                    <div className="offset-5 col-4">
                                        <Button type='submit' color="success" >Зарегистрироваться</Button>{' '}
                                    </div>
                                    <div className="col-3">
                                        <Link className='btn-cancel' to='/login'>Выход</Link>
                                    </div>
                                </div>         
                            </div>
                        </div>    
                    </form>
                </ModalBody>
                
            </Modal>
        );
    };
  };

