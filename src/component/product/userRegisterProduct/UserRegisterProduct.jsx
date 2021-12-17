import React, { useEffect, useState } from 'react';
import './UserRegisterProduct.css';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import './SelectSearch.css';
import { format } from 'date-fns';
import AlertModal from '../../alertModal/AlertModal';
import { Modal } from 'bootstrap';
import { client_id, client_secret, grant_type } from '../../../variable';
import { useTranslation } from 'react-i18next';
var X2JS = require('x2js');

function UserRegisterProduct() {
  const xtojson = new X2JS();
  const { barcode } = useParams();
  const [data, setData] = useState('');
  const [storeValue, setStoreValue] = useState('');
  const [storeStreet, setStoreStreet] = useState('');
  const [dataStore, setDataStore] = useState([]);
  const [showFile1, setShowFile1] = useState('');
  const [showFile2, setShowFile2] = useState('');
  const [dataUser, setDataUser] = useState({});
  const [userData, setUserData] = useState({
    date: '',
    file1: '',
    file2: '',
    agreements: ''
  });
  const [errorData, setErrorData] = useState({
    barcode: ''
  })
  const [errorDate, setErrorDate] = useState('');
  const [errorFile1, setErrorFile1] = useState('');
  const [errorFile2, setErrorFile2] = useState('');
  const [errorStore, setErrorStore] = useState('');
  const [errorGSIS, setErrorGSIS] = useState('');
  const [messageModal, setMessageModal] = useState({
    status: 'success',
    title: 'Thanks You',
    subTitle: 'Your product has been successfully registered'
  })
  // const maxDate = () => {
  //   let currentDate = new Date().toLocaleDateString()
  //   let newCurrentDate = format(new Date(currentDate), 'yyyy-MM-dd');
  //   return newCurrentDate;
  // }
  // const [maxPurchaseDate, setMaxPurchaseDate] = useState(maxDate)
  const [isLoading, setIsLoadiing] = useState(false)
  var email = localStorage.getItem('email');
  var token = localStorage.getItem('access_token');
  const history = useHistory()
  return (
    <div>
      berhasil
    </div>
  )
}

export default UserRegisterProduct
