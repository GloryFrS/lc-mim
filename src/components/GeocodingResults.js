import React, { Component } from 'react';
import classnames from 'classnames';

import ResultList from './ResultList';
import ResultMap from './ResultMap';

// import './GeocodingResults.css';

const RESULT_TAB = 'RESULT_TAB';
const MAP_TAB = 'MAP_TAB';

class GeocodingResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: MAP_TAB,
      response: {"documentation":"https://opencagedata.com/api","licenses":[{"name":"see attribution guide","url":"https://opencagedata.com/credits"}],"rate":{"limit":2500,"remaining":2492,"reset":1564704000},"results":[{"annotations":{"DMS":{"lat":"55° 1' 53.77404'' N","lng":"82° 55' 24.94560'' E"},"MGRS":"44UPF2294499999","Maidenhead":"NO15la07to","Mercator":{"x":9231012.477,"y":7332960.231},"OSM":{"edit_url":"https://www.openstreetmap.org/edit?way=144034806#map=17/55.03160/82.92360","url":"https://www.openstreetmap.org/?mlat=55.03160&mlon=82.92360#map=17/55.03160/82.92360"},"UN_M49":{"regions":{"EASTERN_EUROPE":"151","EUROPE":"150","RU":"643","WORLD":"001"},"statistical_groupings":["MEDC"]},"callingcode":7,"currency":{"alternate_symbols":["руб.","р."],"decimal_mark":",","html_entity":"&#x20BD;","iso_code":"RUB","iso_numeric":"643","name":"Russian Ruble","smallest_denomination":1,"subunit":"Kopeck","subunit_to_unit":100,"symbol":"₽","symbol_first":0,"thousands_separator":"."},"flag":"🇷🇺","geohash":"vcfcnfpn7f6xyedhu5zr","qibla":241.34,"roadinfo":{"drive_on":"right","road":"улица Орджоникидзе","speed_in":"km/h"},"sun":{"rise":{"apparent":1564699020,"astronomical":0,"civil":1564696260,"nautical":1564692180},"set":{"apparent":1564669980,"astronomical":0,"civil":1564672740,"nautical":1564676700}},"timezone":{"name":"Asia/Novosibirsk","now_in_dst":0,"offset_sec":25200,"offset_string":"+0700","short_name":"+07"},"what3words":{"words":"sprays.fussed.assume"}},"bounds":{"northeast":{"lat":55.0317223,"lng":82.9238669},"southwest":{"lat":55.0313865,"lng":82.9230622}},"components":{"ISO_3166-1_alpha-2":"RU","ISO_3166-1_alpha-3":"RUS","_type":"hotel","city":"Новосибирск","city_district":"Центральный район","continent":"Asia","country":"РФ","country_code":"ru","county":"городской округ Новосибирск","hotel":"Marriot","house_number":"31","postcode":"630000","road":"улица Орджоникидзе","state":"Новосибирская область"},"confidence":9,"formatted":"Marriot, улица Орджоникидзе 31, Новосибирск, Новосибирская область, РФ, 630000","geometry":{"lat":55.0316039,"lng":82.923596}}],"status":{"code":200,"message":"OK"},"stay_informed":{"blog":"https://blog.opencagedata.com","twitter":"https://twitter.com/opencagedata"},"thanks":"For using an OpenCage API","timestamp":{"created_http":"Thu, 01 Aug 2019 04:10:38 GMT","created_unix":1564632638},"total_results":1},
    };
  }

  renderTab(title, tab, icon, activeTab) {
    return (
      <li className={classnames({ 'is-active': activeTab === tab })}>
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            this.setState({
              activeTab: tab,
            });
          }}
        >
          
          <span>{title}</span>
        </a>
      </li>
    );
  }

  render() {
    const { activeTab } = this.state;
    const results = this.state.response.results || [];

    return (
      <div className="box results">
        <div className="tabs is-boxed vh">
          <ul>
            {this.renderTab(
                'Карта',
                MAP_TAB,
                'fas fa-globe-americas',
                activeTab
              )}
            
          </ul>
        </div>

        {/* List of results */}
        
        
        {/* MAP result */}
        {activeTab === MAP_TAB &&
          results.length > 0 && <ResultMap response={this.state.response} />}
      </div>
    );
  }
}

export default GeocodingResults;