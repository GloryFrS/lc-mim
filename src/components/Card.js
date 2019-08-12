import React from 'react';
import api from '../API/api';
import loading from '../img/loading.gif';
import notFound from '../img/404error.jpeg';


class Card extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        loader: false,
        id: this.props.match.params.id,
        master: null,
        services: [],
        address: ''
      }
      
    }

    componentDidMount() {
      const params = new URLSearchParams();
      params.append('id', this.state.id);

      api.mastersGet(params)
        .then(res => {
          this.setState({master: res.data, loader: true});
          // console.log(this.state.master);
        })
      api.masterServices(params)
        .then(res => {
          this.setState({services: res.data, loader2:true});
        })
    }
    

    render() {
      const {master, services, loader, id} = this.state;
      const servicesList = services.map((service, index) =>
        <div key={index} className=" col-12 col-md-6">
          <div className="service">
            {service.customer_services_label} / {service.customer_types_label}
            <span>от {service.price} рублей</span>
          </div>
        </div>
      );
      
      if (!loader){ return (
        <div className='loading'>
          <img src={loading} alt='loading...'/>
        </div>
      )}
      if (this.state.master === "master not found"){ return (
        <div className='notFound'>
          <img src={notFound} alt=""/>
        </div>
      )} 
      
      let addressObj = JSON.parse(master[0].address);
			const addressStr = addressObj.country.toString() + ' ' + addressObj.city.toString() + ' ' + addressObj.street.toString() + ' ' + addressObj.house.toString();
      return (
          <div>
            <header>
              <img src={master.avatar_url} alt="" />
              <h5>{master[0].full_name}</h5>
              <p className="info_adress">{ addressStr }</p>
            </header> 
            <div className="container fix">
              <div className="row">
                {servicesList}
              </div>
              <div className="d-flex j-s">
                <a className="btn" href={"https://vk.com/app6967349#master?id" + id}>Позвонить</a>
                <a className="btn" target="_blank" rel='noreferrer noopener' href={"https://vk.com/app6967349#master?id" + id}>Написать</a>
                <a className="btn" target="_blank" rel='noreferrer noopener' href={"https://vk.com/app6967349#master?id" + id}>Отзывы</a>
              </div>
              <div className="map">
              </div>
            </div>
          </div>
      );
    }

}

export default Card;