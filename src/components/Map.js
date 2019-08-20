import React, { Component } from 'react';
import L from 'leaflet'; 
// import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import  markerImg from '../img/default.9c0dca6d.svg';
// import './ResultMap.css';
import 'leaflet-control-geocoder';

const redIcon = L.icon({
  iconUrl: markerImg,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 40], // point of the icon which will correspond to marker's location
});

class ResultMap2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      layer: null,
      q: ''
    };
    this.mapNode = null;
  }
  componentDidMount() {
    // create the Leaflet map object
    if (!this.state.map) {
      this.initMap();
    }
  }
  componentWillUnmount() {
    // destroys the Leaflet map object & related event listeners
    this.state.map.remove();
  }
  initMap() {
    if (this.state.map) return;

    

    // creates the Leaflet map object
    // it is called after the Map component mounts
   
    
    var map = L.map('map').setView([this.props.lat, this.props.lng], 15);
    // var geocoder = L.Control.Geocoder.mapbox('pk.eyJ1IjoiZ2xvcnlmcnMiLCJhIjoiY2p5eHZtdm05MWJjaDNtcnJxY3UwdnYwOCJ9.VhGilGU54k8Voi0pIaVggQ');
      
      // if (URLSearchParams && window.location.search) {
      //   // parse /?geocoder=nominatim from URL
      //   var params = new URLSearchParams(window.location.search);
      //   var geocoderString = params.get('geocoder');
      //   if (geocoderString && L.Control.Geocoder[geocoderString]) {
      //     console.log('Using geocoder', geocoderString);
          
      //     geocoder = L.Control.Geocoder[geocoderString]();
      //   } else if (geocoderString) {
      //     console.warn('Unsupported geocoder', geocoderString);
      //   }
      // }
      // L.Control.geocoder({
      //   geocoder: geocoder
      // }).addTo(map);
      var marker = L.marker({lat:this.props.lat, lng:this.props.lng},{ icon: redIcon });
      marker.addTo(map);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // map.on('click', function(e) { 
      //   geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
      //     var r = results[0];
      //     console.log(r);
      //     if (r) {
      //       if (marker) {
      //         marker
      //           .setLatLng(r.center)
      //           .setPopupContent(r.html || r.name)
      //           .openPopup();
                
      //       } else {
      //         marker = L.marker(r.center)
      //           .bindPopup(r.name)
      //           .addTo(map)
      //           .openPopup();
      //       }
      //     }
      //   });
      // });


    
    // map.fitBounds(layer.getBounds());
    this.setState({ map });
  
  }

  

  render() {
    // const results = this.props.response.results || [];

    return (
      <div>
        <div
          ref={node => (this.mapNode = node)}
          id="map"
          data={this.state.data}
        />
      </div>
    );
  }
}

export default ResultMap2;