import React, { Component } from 'react';
import geo from '../img/country-pointer-geo-location-japan-512.png'
import * as opencage from 'opencage-api-client';
import ResultMap from './ResultMap';

class GeocodingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLocating: false,
      query: '',
      isSubmitting: false,
      response: {},
      lat: props.lat,
      lng: props.lng 
    };
    this.handleGeoLocation = this.handleGeoLocation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    console.log(this.props.str);
  }
  handleGeoLocation() {
    const geolocation = navigator.geolocation;
    const p = new Promise((resolve, reject) => {
      if (!geolocation) {
        reject(new Error('Not Supported'));
      }
      this.setState({
        isLocating: true,
      });
      geolocation.getCurrentPosition(
        position => {
          console.log('Location found');
          resolve(position);
        },
        () => {
          console.log('Location : Permission denied');
          reject(new Error('Permission denied'));
        }
      );
    });
    p.then(location => {
      this.setState({
        isLocating: false, lat: location.coords.latitude, lng: location.coords.longitude
      });
      this.handleChange(
        'query',
        location.coords.latitude + ', ' + location.coords.longitude
      );
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    opencage
      .geocode({ key: this.props.apikey, q: this.state.query })
      .then(response => {
        this.setState({ response, isSubmitting: false });
        console.log(this.state.response.results);
      })
      .catch(err => {
        console.error(err);
        this.setState({ response: {}, isSubmitting: false });
      });
  }
  handleInputChange(event) {
    const { target } = event;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value; 
    
    this.handleChange(name, value);
  }
  handleChange(key, value) {
    this.setState({ [key]: value });
  }
  // handleSubmit(event) {
  //   console.log('Form was submitted with state: ', this.state);
  //   event.preventDefault();
  // }


  render() {
    const { isSubmitting, query } = this.state;
    const { isLocating } = this.state;
    return (
      <div className="box form">
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          
          {/* <!-- Query --> */}
          <div className="field">
            <label className="label">Адрес</label>
            <div className="control has-icons-left">
              <span className="icon is-small is-left">
                <i className="fas fa-map-marked-alt" />
              </span>
              <input
                name="query"
                className="input"
                type="text"
                placeholder="Адрес"
                onChange={this.handleInputChange}
                value={query}
                
              />
              <div className="help">
                Адрес, название места
              </div>
            </div>
          </div>
          {/* <!-- ./Query --> */}
          <div className="field">
            <label className="label">Мое местоположение</label>
            <div className="control" onClick={this.handleGeoLocation}>
              {!isLocating && (
                <button className="button is-static">
                  <span className="icon is-small">
                    <img src={geo} alt=''/>
                  </span>
                </button>
              )}
              {isLocating && (
                <button className="button is-static">
                  <span className="icon is-small">
                  <img src={geo} alt=''/>
                  </span>
                </button>
              )}
            </div>
          </div>
          {/* <!-- Button Geocode --> */}
          <button
            className="button is-success"
            onClick={this.handleSubmit}
            disabled={isLocating || isSubmitting}
          >
            Показать на карте
          </button>
          {/* <!-- ./Button Geocode --> */}
        </form>
        <ResultMap lat={this.state.lat} lng={this.state.lng} response={this.state.response} />
      </div>
    );
  }
}
export default GeocodingForm;