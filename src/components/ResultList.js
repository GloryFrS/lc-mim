// ./src/ResultList.js
import React, { Component } from 'react';
class ResultList extends Component {
  render() {
    // const rate = this.props.response.rate || {};
    const results = this.props.response.results || [];
    return (
      <article className="message">
        <div className="message-body">
          <ol>
            {results.map((result, index) => {
              return (
                <li key={index}>
                  {result.annotations.flag} {result.formatted}
                  <br />
                  <code>
                    {result.geometry.lat} {result.geometry.lng}
                  </code>
                </li>
              );
            })}
          </ol>
        </div>
      </article>
    );
  }
}
export default ResultList;