import React from 'react';

export default class Chatra extends React.Component {
  componentDidMount() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML = (function(d, w, c) {
        w.ChatraID = 'YjzHFQHMYGShv7JAc';
        var s = d.createElement('script');
        w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';
        if (d.head) d.head.appendChild(s);
    })(document, window, 'Chatra');
    this.instance.appendChild(s);
  }

  render() {
    return <div ref={el => (this.instance = el)} />;
  }
}