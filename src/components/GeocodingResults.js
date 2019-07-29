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
      activeTab: RESULT_TAB,
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
    const results = this.props.response.results || [];

    return (
      <div className="box results">
        <div className="tabs is-boxed vh">
          <ul>
            {this.renderTab('Результат', RESULT_TAB, 'fas fa-list-ul', activeTab)}
            {results.length > 0 &&
              this.renderTab(
                'Карта',
                MAP_TAB,
                'fas fa-globe-americas',
                activeTab
              )}
            
          </ul>
        </div>

        {/* List of results */}
        {activeTab === RESULT_TAB &&
          results.length > 0 && <ResultList response={this.props.response} />}
        
        {/* MAP result */}
        {activeTab === MAP_TAB &&
          results.length > 0 && <ResultMap response={this.props.response} />}
      </div>
    );
  }
}

export default GeocodingResults;