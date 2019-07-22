import React, { Component } from 'react';
import geo from '../img/country-pointer-geo-location-japan-512.png'
class GeocodingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLocating: false,
    };
    this.handleGeoLocation = this.handleGeoLocation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = props.onSubmit;
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
        isLocating: false,
      });
      this.props.onChange(
        'query',
        location.coords.latitude + ', ' + location.coords.longitude
      );
    });
  }
  handleInputChange(event) {
    const { target } = event;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    // console.log(name, value);
    // this.setState({
    //   [name]: value,
    // });
    this.props.onChange(name, value);
  }
  handleSubmit(event) {
    console.log('Form was submitted with state: ', this.state);
    event.preventDefault();
  }
  render() {
    const { apikey, isSubmitting, query } = this.props;
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
            <label className="label">Адрес или координаты</label>
            <div className="control has-icons-left">
              <span className="icon is-small is-left">
                <i className="fas fa-map-marked-alt" />
              </span>
              <input
                name="query"
                className="input"
                type="text"
                placeholder="Адрес"
                value={query}
                onChange={this.handleInputChange}
              />
              <div className="help">
                Адрес, название места
                <br />
                Координаты в виде широты, долготы <code>широты, долготы</code> или{' '}
                <code>y, x</code>.
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
            Получить координаты
          </button>
          {/* <!-- ./Button Geocode --> */}
        </form>
      </div>
    );
  }
}
export default GeocodingForm;