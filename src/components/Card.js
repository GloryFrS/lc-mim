import React from 'react';
import axios from 'axios';
import loading from '../img/loading.gif';
import notFound from '../img/404error.jpeg';


class Card extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        loader: false,
        id: this.props.match.params.id,
        master: null,
        services: []
      }
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
      return (
          <div>
            <header>
              <img src={master.avatar_url} alt="" />
              <h5>{master[0].full_name}</h5>
              <p>Россия, г. Барнаул, ул. Попова, д. 102</p>
            </header>
            <div className="container fix">
              <div className="row">
                {servicesList}
              </div>
              <div className="d-flex j-s">
                <a className="btn" href={"tel:" + master[0].phone_number}>Позвонить</a>
                <a className="btn" target="_blank" rel='noreferrer noopener' href={"https://vk.com/id" + id}>Написать</a>
              </div>
              <div className="map">
              </div>
            </div>
          </div>
      );
    }

}

export default Card;