import React, { Component } from 'react';
import L from 'leaflet'; 
// import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
// import './ResultMap.css';
import 'leaflet-control-geocoder';

const redIcon = L.icon({
  iconUrl: 'marker-icon-red.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 40], // point of the icon which will correspond to marker's location
});

class ResultMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      layer: null,
      data: props.response.results,
      latlng: {"lat":props.lat,"lng":props.lng}
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
    const map = L.map(this.mapNode, {
      center: [this.props.lat, this.props.lng],
      zoom: 15,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layer = L.featureGroup().addTo(map);
    
    if (Object.keys(this.props.response).length !== 0) {
      const { results } = this.props.response;
    
      for (let i = 0; i < results.length; i++) {
        const marker = L.marker(results[i].geometry, { icon: redIcon });
        marker.addTo(layer).bindPopup(i + 1 + ' - ' + results[i].formatted);
      }
    }

    L.Control.geocoder({
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);
    
    
    const marker = L.marker(this.state.latlng,{ icon: redIcon });
    marker.addTo(map);

    let newMarker;
    map.on('click', (e) => {
      this.setState({ latlng: e.latlng });
      const { latlng } = this.state;
      
      console.log(JSON.stringify(latlng));
      if (newMarker) { // check
        map.removeLayer(newMarker); // remove
        console.log('remove');
      } else if (marker) {
        map.removeLayer(marker);
      }
      newMarker = L.marker(e.latlng,{ icon: redIcon });
      newMarker.addTo(map);
    });

    
    // map.fitBounds(layer.getBounds());

    // set the state
    this.setState({ map, layer });
  }

  render() {
    // const results = this.props.response.results || [];

    return (
      <div>
        {/* <input type='text' value={this.state.latlng.lat}/>
        <input type='text' value={this.state.latlng.lng}/> */}
        <div
          ref={node => (this.mapNode = node)}
          id="map"
          data={this.props.data}
        />
      </div>
    );
  }
}

export default ResultMap;