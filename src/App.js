import React, {Suspense} from 'react';
import './App.css';
import LandingPageRouter from './route/LandingPageRouter';
import {useTranslation} from "react-i18next";


function HeaderComponent()
{
  const {t, i18n} = useTranslation('common');
  return <h1>{t('home')}</h1>
}

function App() {
  return (
    <Suspense fallback="loading">
      <div className="App">
        <LandingPageRouter />
      </div>
    </Suspense>
  );
}

export default App;
