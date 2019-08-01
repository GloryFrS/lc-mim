import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bulma/css/bulma.css';
import './sass/main.sass'

ReactDOM.render(
  <BrowserRouter
    basename="/admin">
    <App />
  </BrowserRouter>,
  document.getElementById('root'));

registerServiceWorker();
