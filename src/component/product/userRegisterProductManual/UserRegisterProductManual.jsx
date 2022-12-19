import React, { useEffect, useState } from 'react';
import './UserRegisterProductManual.css';
import { connect } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import './SelectSearch.css';
import { format } from 'date-fns';
import AlertModal from '../../alertModal/AlertModal';
import { Button, Modal } from 'bootstrap';
import { Modal as Modal2, Button as Button2, Form } from 'react-bootstrap'
import { client_id, client_secret, grant_type } from '../../../variable';
import { useTranslation } from 'react-i18next';
import Resizer from "react-image-file-resizer";
import { DataURIToBlob } from '../../../variable/DataUriToBlob';
import { ModelCheck } from '../../../variable/ModelCheck';
import { ImageFunction } from '../../../variable/ImageFunction';
import { useMemo } from 'react';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import { useRef } from 'react';
var X2JS = require('x2js');

function UserRegisterProductManual(props) {
  const xtojson = new X2JS();
  const { barcode } = props
  const [data, setData] = useState('');
  const [storeValue, setStoreValue] = useState('');
  const [storeStreet, setStoreStreet] = useState('');
  const [dataStore, setDataStore] = useState([]);
  const [showFile1, setShowFile1] = useState('');
  const [showFile2, setShowFile2] = useState('');
  const [dataUser, setDataUser] = useState({});
  const [isPromo, setIsPromo] = useState(false);
  const [dataPromo, setDataPromo] = useState({});
  const [userData, setUserData] = useState({
    date: '',
    file1: '',
    file2: '',
    agreements: ''
  });
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
  const [maxPurchaseDate, setMaxPurchaseDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLoading, setIsLoadiing] = useState(false)
  const [type, setType] = useState('GTM')
  var email = localStorage.getItem('email');
  var token = localStorage.getItem('access_token');
  const history = useHistory()

  const resizeFile = (file) => new Promise((resolve) => {
    Resizer.imageFileResizer( file, 600, 600, "JPEG", 100, 0,
      (uri) => {
        resolve(uri);
      }, "base64" );
  });

  async function fetchDataStore(gtmToken) {
    try{
      const res = await axios.post(props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
          {
            StoreID: '',
            StoreName: '',
            StoreCode: '',
          },
          {
            headers: {
              Authorization: "Bearer " + gtmToken,
            },
          }
      )
      setDataStore(res.data.data);
      return res
    }catch(e){
        if (e.response) {
          console.log(e.response);
        } else if (e.request) {
          console.log('request : ' + e.request);
        } else {
          console.log('message : ' + e.message);
        }
    }
  }

  const getTokenGTM = async () => {
    const { data: { access_token } } = await axios.post(props.gtm_token_url, {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: grant_type,
    })
    const temp =  await fetchDataStore(access_token)
    // console.log(temp)
    return temp
  }

  let newDataStore = useMemo(() => {
    return dataStore.map(({ StoreName }) => ({
      value: StoreName,
      name: StoreName,
    }))
  }, [dataStore]);

  const onChangeStore = (storeValue) => {
    if(dataStore.length === 0 ) return;
    let isi = dataStore.filter((word) => word.StoreName === storeValue);
    if(isi.length > 0){
      setStoreStreet(isi[0].Street);
      setStoreValue(storeValue)
    }
  }
  // useEffect(() => {
  //   let isi = dataStore.filter((word) => word.StoreName === storeValue);
  //   if (storeValue !== '') {
  //     setStoreStreet(isi[0].Street);
  //   }
  // }, [storeValue]);

  const onChangeFile = async (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    const image = await resizeFile(file);
    if(name === 'warranty_card') {
      setShowFile1(image)
      setUserData({
        ...userData,
        ['file1']: DataURIToBlob(image),
      });
    } else {
      setShowFile2(image)
      setUserData({
        ...userData,
        ['file2']: DataURIToBlob(image),
      });
    }
  }

  const [errorBrand, setErrorBrand] = useState('');
  const [errorProductModel, setErrorProductModel] = useState('');
  const [errorCategory, setErrorCategory] = useState('');
  const [form, setForm] = useState({
    brand: '',
    product_model: '',
    category: '',
  })
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  }

  const [selected, setSelected] = useState([])
  const [options, setOptions] = useState([])
  const getOptions = async () => {
    const res = await axios.get(`${props.base_url}extended-warranty-promo/wms?product_model=`, {
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
      },
    })
    setOptions([...res.data])
  }
  useEffect(() => {
    let m = true
    if(m) getOptions()
    return () => m = false
  }, [])
  const product_model = useMemo(() => {
    return selected.length === 0 ? form.product_model : selected[0]
  }, [selected, form.product_model]) 
  
  const isValid = useMemo(() => {
    if(product_model == '') return ' '
    return options.includes(product_model) ? 'is-valid' : 'is-invalid'

  }, [product_model])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoadiing(true)
    var id = localStorage.getItem('id');
    var phone = localStorage.getItem('phone');

    if ( 
      userData.date !== '' && 
      userData.file1 !== '' && 
      userData.file2 !== '' && 
      storeValue !== ''  &&
      form.brand !== '' &&
      // form.product_model !== '' &&
      form.category !== '' 
    
    ) {
      var dateChange = userData.date.replaceAll('-', '/');
      const formdata = new FormData();
      const newPurcaseDate = format(new Date(dateChange), 'MM/dd/yyyy');
      // const newBirthDateDate = format(new Date('1981//09/27'), 'MM/dd/yyyy');
      // const newGender = dataUser.gender === 'Pria' ? 'Mr' : 'Ms';
      // console.log(product_model)

      formdata.append('customer_id', id);
      formdata.append('barcode', barcode);
      formdata.append('brand', form.brand);
      formdata.append('product_model', product_model);
      formdata.append('serial_number', barcode);
      formdata.append('category', form.category);
      formdata.append('date', newPurcaseDate);
      formdata.append('store_location', storeStreet);
      formdata.append('store_name', storeValue);
      formdata.append('email', email);
      formdata.append('phone', phone);
      formdata.append('status', 1);
      formdata.append( 'warranty_card', userData.file1 === '' ? '' : userData.file1 );
      formdata.append('invoice', userData.file2 === '' ? '' : userData.file2);
      formdata.append('agreements', userData.agreements === 'Y' ? 'Y' : 'N');
      // setIsLoadiing(false)
      
      console.table(Object.fromEntries(formdata))
      setTimeout(() => {
        setIsLoadiing(false)
        setMessageModal({
          status: 'success',
          title: 'Thank you, ',
          subTitle: 'Data berhasil didaftarkan!',
          back: true
        })
        alertModal()
      }, 1000);
    } else {
      userData.date === '' ? setErrorDate('Date Must be Required') : setErrorDate('')
      storeValue === '' ? setErrorStore('Store Must be Required') : setErrorStore('')
      form.brand == '' ? setErrorBrand('Brand Must be Required') : setErrorBrand('')
      // form.product_model == '' ? setErrorProductModel('Product Model Must be Required') : setErrorProductModel('')
      form.category == '' ? setErrorCategory('Category Must be Required') : setErrorCategory('')
      userData.file1 === '' ? setErrorFile1('Warranty Card Must be Required') : setErrorFile1('');
      userData.file2 === '' ? setErrorFile2('Invoice Must be Required') : setErrorFile2('');
      setIsLoadiing(false)
    }
  }

  const { t } = useTranslation('common')

  useEffect(() => {
    let m = true
    if(m){
      getTokenGTM().then(({ data: { data: allStore } })  => {
        if(props.data){ 
            const { data } = props
            setForm({
              ...form,
              brand: data.brand,
              category: data.category,
              product_model: data.product_model,
            })
            setSelected([data.product_model])
            setStoreValue(data.store)
            setStoreStreet(allStore.find(v => v.StoreName == data.store).Street)
            setUserData({
              ...userData,
              agreements: data.agreements,
              date: data.date,
            })
            setShowFile1(data.warranty)
            setShowFile2(data.invoice)
        } 
      })
    }
      // formdata.append('customer_id', id);
      // formdata.append('barcode', barcode);
      // formdata.append('brand', form.brand);
      // formdata.append('product_model', form.product_model);
      // formdata.append('serial_number', barcode);
      // formdata.append('category', form.category);
      // formdata.append('date', newPurcaseDate);
      // formdata.append('store_location', storeStreet);
      // formdata.append('store_name', storeValue);
      // formdata.append('email', email);
      // formdata.append('phone', phone);
      // formdata.append('status', 1);
      // formdata.append( 'warranty_card', userData.file1 === '' ? '' : userData.file1 );
      // formdata.append('invoice', userData.file2 === '' ? '' : userData.file2);
      // formdata.append('agreements', userData.agreements === 'Y' ? 'Y' : 'N');
    return () => m = false
  }, [props.idProduct])
 
  

  return (
    <div className="user-register-product mb-5">
      <div className="container-fluid">
        <div className="col-lg-11 m-auto pt-lg-0 pt-1">
          <div className="head-product">
            <p>Product Register</p>
          </div>
        </div>

        <div className="col-lg-8 m-auto mt-3">
          <div className="title">
            <p>Data Product</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="barcode" className="form-label">
                    Barcode
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="barcode"
                    value={barcode}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="brand" className="form-label">
                    Brand
                  </label>
                  <select name='brand' onChange={onChange} value={form.brand} className="form-select" aria-label="Default select example" placeholder='choose brand'>
                    <option value='' disabled>Choose One Brand</option>
                    <option value="aqua">Aqua</option>
                    <option value="sanyo">Sanyo</option>
                    <option value="candy">Candy</option>
                  </select>
                  <div className="text-danger">{errorBrand}</div>
                </div>
              </div>

              {/* <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="product-model" className="form-label">
                    Product Model
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product-model"
                    value={form.product_model}
                    onChange={onChange}
                    name='product_model'
                  />
                  <div className="text-danger">{errorProductModel}</div>
                </div>
              </div> */}

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="product-model" className="form-label">
                    Product Model
                  </label>
                  <Typeahead
                    onInputChange={(v) => {
                      setForm({
                        ...form,
                        product_model: v
                      })
                    }}
                    inputProps={{ className: isValid }}
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={setSelected}
                    options={options}
                    placeholder="Choose a product model..."
                    selected={selected}
                  />
                  <div className="text-danger">{errorProductModel}</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="serial-number" className="form-label">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="serial-number"
                    value={barcode}
                    disabled="disabled"
                  />
                </div>
              </div>


              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select name='category' onChange={onChange} value={form.category} className="form-select" aria-label="Default select example" placeholder='choose brand'>
                    <option value='' disabled>Choose One Brand</option>
                    <option value="aqua">Aqua</option>
                    <option value="sanyo">Sanyo</option>
                    <option value="candy">Candy</option>
                  </select>                  
                  <div className="text-danger">{errorCategory}</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="date-purchase" className="form-label">
                    Date of Purchase
                  </label>
                  <input
                    type="date"
                    max={maxPurchaseDate}
                    className={`form-control ${
                      errorDate !== '' ? 'is-invalid' : null
                    }`}
                    value={userData.date}
                    // value={data !== '' && data.DataOfPurchase.slice(0, 10)}
                    id="date-purchase"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        ['date']: e.target.value,
                      })
                    }
                  />
                  <div className="invalid-feedback">{errorDate}</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="store-location" className="form-label">
                    Store Name
                  </label>
                  <SelectSearch
                    options={newDataStore}
                    value={storeValue}
                    onChange={onChangeStore}
                    search
                    filterOptions={fuzzySearch}
                    placeholder="Search something"
                  />
                  <div className="text-danger" style={{ fontSize: 14 }}>
                    {errorStore}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="store-location" className="form-label">
                    Store Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="store-location"
                    value={storeStreet}
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-6">
                {showFile1 !== '' ? (
                  <div className="col-lg-12 d-flex justify-content-center mb-3">
                    <img src={showFile1} alt="file" className="img-fluid" />
                  </div>
                ) : null}
                <div className="btn-upload-custom mb-4">
                  <div className="dropzone-wrapper">
                    <div className="dropzone-desc">
                      <span className="material-icons"> cloud_upload </span>
                      {
                        userData.file1 !== '' ? 
                        <p style={{ fontSize: '0.8rem' }}>Re-upload Warranty Card/Serial Number</p> :
                        <p style={{ fontSize: '0.8rem' }}>Attach Your Warranty Card/Serial Number Here</p>
                      }
                    </div>
                    <input
                      type="file"
                      name="warranty_card"
                      aria-label="file"
                      className="dropzone"
                      onChange={onChangeFile}
                    />
                    {/* { errorData.file } */}
                  </div>
                  <div className="text-danger">{errorFile1}</div>
                </div>
              </div>

              <div className="col-lg-6">
                {showFile2 !== '' ? (
                  <div className="col-lg-12 d-flex justify-content-center mb-3">
                    <img src={showFile2} alt="file" className="img-fluid" />
                  </div>
                ) : null}
                <div className="btn-upload-custom mb-4">
                  <div className="dropzone-wrapper">
                    <div className="dropzone-desc">
                      <span className="material-icons"> cloud_upload </span>
                      {
                        userData.file1 !== '' ? 
                        <p>Re-upload Invoice</p> :
                        <p>Attach Your Invoice Here</p>
                      }
                    </div>
                    <input
                      type="file"
                      name="invoice_card"
                      className="dropzone"
                      aria-label="file"
                      onChange={onChangeFile}
                    />
                    {/* { errorData.file } */}
                  </div>
                  <div className="text-danger">{errorFile2}</div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="Y"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          ['agreements']: e.target.value,
                        })
                      }
                    />
                    <label className="form-check-label">
                      {t('form_product_register.wa_flag')}
                    </label>
                  </div>
                </div>
              </div>
              
              {
                errorGSIS !== '' ?
                <div className="text-danger">
                  {errorGSIS}
                </div> : null
              }
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-color-primary py-lg-3 btn-submit"
                disabled={isLoading ? 'disabled' : null}
              >
                <div className="d-flex justify-content-center align-items-center">
                  {
                    isLoading ?
                    <div className="spinner-border text-primary me-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div> : null
                  }
                  <div>
                    Product Registration
                  </div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div> 
      <AlertModal data={messageModal}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    token: state.GTM_TOKEN,
    base_url: state.BASE_URL,
    gsis_url: state.GSIS_URL,
    image_url: state.URL,
    gtm_token_url: state.GTM_TOKEN_URL,
    oapi_url: state.OAPI_URL
  };
};

export default connect(mapStateToProps, null)(UserRegisterProductManual);