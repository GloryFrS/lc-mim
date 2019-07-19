import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import loading from '../img/loading.gif'

const cookies = new Cookies();

class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      id: cookies.get('id'),
      services: [],
      name: '',
      phone: '',
      country: '',
      city: '',
      street: '',
      house: '',
      vk: '',
      about: '',
      alert: null,
      loader: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
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
          country: '',
          city: '',
          street: '',
          house: '',
          vk: res.data[0].vk_id,
          about: decodeURI(res.data[0].about_master),
          loader: true
        });
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
  goBack(){
    this.props.history.goBack();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
    const { name,phone,country,city,street,house,vk,about } = this.state;
    const params = new URLSearchParams();

    params.append('id',             vk);
    params.append('full_name',      name);
    params.append('phone_number',   phone);
    params.append('about_master',   about);
    params.append('coordinates',     JSON.stringify({
      'lat': "58,21180030000001",
      'lng': "68,27371010000002"
    }));
    params.append('is_approved',    true);
    params.append('is_immediately', true);
    params.append('reviews_number', "5");
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
   
  render() {
    const { name,phone,country,city,street,house,vk,about,alert, loader } = this.state;
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
                      <button type="reset" onClick={this.goBack} className=" btn-cancel">Отмена</button>
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
                  <label className="fix-label">Адрес</label>
                  <div className="form-group col-md-3">
                  <input name="country" onChange={this.handleInputChange} type="text" className="form-control" value={country} placeholder="Страна" />
                  </div>
                  <div className="form-group col-md-3">                            
                  <input name="city" onChange={this.handleInputChange} type="text" className="form-control" value={city} placeholder="Город" />
                  </div>
                  <div className="form-group col-md-3">                            
                  <input name="street" onChange={this.handleInputChange} type="text" className="form-control" value={street} placeholder="Улица" />
                  </div>
                  <div className="form-group col-md-3">                            
                  <input name="house" onChange={this.handleInputChange} type="text" className="form-control" value={house} placeholder="Дом" />
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
                <div className="form-group col-md-9">
                  <label>Ваши услуги</label>
                  <div className="row" style={{alignItems: 'center'}}>
                    <div className="col-md-6">
                      <select className="form-control" id="service">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input id="price" className="form-control" type="text" />
                    </div>
                    <div className="col-md-2">
                      <a href='123'  id="add">+</a>
                    </div>
                  </div>
                  <div id="dynamic_field">
                </div>
            </div>
          </div>
          <div className="btn-block-bottom d-flex">
              <button type="submit" className="btn" href="/card">Сохранить изменения</button>
              <button type="reset" onClick={this.goBack} className=" btn-cancel">Отмена</button>
          </div>
        </form>
      </div>
    </div>
    </div>
    )
      
  }



}

export default EditProfile;