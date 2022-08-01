import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import redux from './redux';
import { Provider } from 'react-redux';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import common_id from "./translations/id/common.json";
import common_en from "./translations/en/common.json";

i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: localStorage.getItem('language') !== null ? localStorage.getItem('language') : 'id',
    resources: {
        en: {
            common: common_en
        },
        id: {
            common: common_id
        },
    },
});


ReactDOM.render(
  <Provider store={redux}>
    <React.StrictMode>
      <I18nextProvider i18n={i18next}>
        <App/>
      </I18nextProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
