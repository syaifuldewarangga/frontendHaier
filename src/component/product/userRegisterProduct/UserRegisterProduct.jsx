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
import Resizer from "react-image-file-resizer";
import { DataURIToBlob } from '../../../variable/DataUriToBlob';
import { ModelCheck } from '../../../variable/ModelCheck';
var X2JS = require('x2js');

function UserRegisterProduct(props) {
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
  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  }

  const onHideModal = () => {
    var alertModal = document.getElementById('alertModal');
    alertModal.addEventListener('hide.bs.modal', function (event) {
      history.push('/landing-page')
    });
  };

  useEffect(() => {
    let isi = dataStore.filter((word) => word.StoreName === storeValue);
    if (storeValue !== '') {
      setStoreStreet(isi[0].Street);
    }
  }, [storeValue]);

  const getTokenGTM = async () => {
    await axios.post(props.gtm_token_url, {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: grant_type,
    }).then((res) => {
      const token = res.data.access_token
      fetchDataProduct(token)
      fetchDataStore(token)
    }).catch((err) => {
      console.log(err.response)
    })
  }

  async function fetchDataProduct(gtmToken) {
    await axios.post(
      props.gtm_url + 'pmtcommondata/GetProfileUserByCondition',
      {
        Barcode: barcode,
        ProductID: '',
        PhoneNumber: '',
      },
      {
        headers: {
          Authorization: "Bearer " + gtmToken,
        },
      }
    )
    .then((res) => {
      let count = res.data.data.length
      if(count > 0) {
        setType('GTM')
        setData(res.data.data[0]);
        setUserData({
          ...userData,
          date: res.data.data[0].DataOfPurchase.slice(0, 10),
        })
      } else {
        setType('WMS')
        fetchDataProductWMS();
      }
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response);
      } else if (e.request) {
        console.log('request : ' + e.request);
      } else {
        console.log('message : ' + e.message);
      }
    });
  }

  const fetchDataProductWMS = async () => {
    await axios.get(props.oapi_url + 'wms-order-out', {
      params: {
        barcode: barcode
      }
    }).then((res) => {
      let data = res.data
      let count = Object.keys(data).length
      if(count > 0) {
        let modelData = ModelCheck(data.PRODUCT_DESC_ZH.substring(0,4))
        setData({
          Barcode: data.BARCODE,
          ProductName: data.PRODUCT_DESC_ZH,
          ProductID: data.PRODUCT_CODE,
          ProductCategoryName: modelData.category,
          Brand: modelData.brand
        })
      } else {
        setData('')
      }
    })
  }
  
  async function fetchDataStore(gtmToken) {
    await axios.post(props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
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
      .then((res) => {
        setDataStore(res.data.data);
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response);
        } else if (e.request) {
          console.log('request : ' + e.request);
        } else {
          console.log('message : ' + e.message);
        }
      });
  }

  async function fetchDataUser() {
    await axios.get(props.base_url + 'user/get', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: {
        identifier: email + 'C',
      },
    }).then((res) => {
      setDataUser(res.data);
    })
    .catch((e) => {
      console.log(e.response)
    });
  }
  
  useEffect(() => {
    fetchDataUser()
    getTokenGTM();
  }, [])

  const resizeFile = (file) => new Promise((resolve) => {
    Resizer.imageFileResizer( file, 600, 600, "JPEG", 100, 0,
      (uri) => {
        resolve(uri);
      }, "base64" );
  });

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

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoadiing(true)
    var id = localStorage.getItem('id');
    var phone = localStorage.getItem('phone');

    if ( userData.date !== '' && userData.file1 !== '' && userData.file2 !== '' && storeValue !== '' ) {
      var dateChange = userData.date.replaceAll('-', '/');
      const formdata = new FormData();
      const newPurcaseDate = format(new Date(dateChange), 'MM/dd/yyyy');
      // const newBirthDateDate = format(new Date('1981//09/27'), 'MM/dd/yyyy');
      // const newGender = dataUser.gender === 'Pria' ? 'Mr' : 'Ms';
      
      formdata.append('customer_id', id);
      formdata.append('barcode', data.Barcode);
      formdata.append('product_id', data.ProductID);
      formdata.append('brand', data.Brand);
      formdata.append('product_name', data.ProductName);
      formdata.append('product_model', data.ProductName);
      formdata.append('serial_number', data.Barcode);
      formdata.append('category', data.ProductCategoryName);
      formdata.append('date', newPurcaseDate);
      formdata.append('store_location', storeStreet);
      formdata.append('store_name', storeValue);
      formdata.append('email', email);
      formdata.append('phone', phone);
      formdata.append('status', 1);
      formdata.append( 'warranty_card', userData.file1 === '' ? '' : userData.file1 );
      formdata.append('invoice', userData.file2 === '' ? '' : userData.file2);
      formdata.append('agreements', userData.agreements === 'Y' ? 'Y' : 'N');
      
      const deleteProduct = async (productID) => {
        await axios.delete(props.base_url + 'register-product/product', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          params: {
            id: productID
          }
        }).then(() => {
          console.log('success delete')
        }).catch((error) => {
          console.log(error.response)
        })
      }
      // console.log(dataUser)
      const postToGSIS = async (dbData) => {
        let formGSIS = new FormData()
        formGSIS.append('id', dbData.id)
        formGSIS.append('country', 'Indonesia')
        formGSIS.append('firstName', dataUser.first_name)
        formGSIS.append('lastName', dataUser.last_name)
        formGSIS.append('mobilePhone', dataUser.phone)
        formGSIS.append('email', dataUser.email)
        formGSIS.append('address', dataUser.address)
        formGSIS.append('AddressId', "")
        formGSIS.append('City', dataUser.city)
        formGSIS.append('State', dataUser.district)
        formGSIS.append('Street', dataUser.sub_district)
        formGSIS.append('brand', data.Brand)
        formGSIS.append('category', data.ProductCategoryName);
        formGSIS.append('productModel', data.ProductName);
        formGSIS.append('serialNum', data.Barcode);
        formGSIS.append('purchaseDate', newPurcaseDate);
        let invoiceURL = props.image_url + dbData.invoice
        formGSIS.append('Invoiceattachment', invoiceURL);
        let attachmentURL = props.image_url + dbData.warranty_card
        formGSIS.append('Warrantyattachment', attachmentURL);
        formGSIS.append('whatsappflag', userData.agreements === 'Y' ? 'Y' : 'N');
        await axios.post(props.gsis_url + 'hatprodreg', formGSIS, {
          headers: {
            Accept: 'application/xml',
          }
        }).then((res) => {
          let response = xtojson.xml2js(res.data)
          let errorCode = response.Envelope.Body.HESAProdRegResponse.Error_spcCode
          if(errorCode === '0') {
            setMessageModal({
              status: 'success',
              title: 'Thanks You',
              subTitle: 'Your product has been successfully Updated'
            })
            alertModal()
            onHideModal()
          } else {
            deleteProduct(dbData.id)
            setErrorGSIS(response.Envelope.Body.HESAProdRegResponse.Error_spcMessage)
          } 
        }).catch((err) => {
          deleteProduct(dbData.id)
          console.log(err.response)
        }).finally(() => {
          setIsLoadiing(false)
        });
      }

      await axios.post(props.base_url + 'register-product', formdata, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        postToGSIS(res.data);
      })
      .catch((e) => {
        let error = e.response
        console.log(error)
        if(error.data.errors) {
          if(error.data.errors.location === 'barcode' || error.data.errors.location === 'product_id') {
            setMessageModal({
                status: 'error',
                title: 'Sorry',
                subTitle: 'your product has been registered'
            })
            alertModal()
            onHideModal()
          }
          setErrorDate('')
          setErrorStore('')
          setErrorFile1('')
          setErrorFile2('')
        } else {
          console.log(error)
        }
      })
    } else {
      userData.date === '' ? setErrorDate('Date Must be Required') : setErrorDate('')
      storeValue === '' ? setErrorStore('Store Must be Required') : setErrorStore('')
      userData.file1 === '' ? setErrorFile1('Warranty Card Must be Required') : setErrorFile1('');
      userData.file2 === '' ? setErrorFile2('Invoice Must be Required') : setErrorFile2('');
      setIsLoadiing(false)
    }
  }

  let newDataStore = dataStore.map(({ StoreName }) => ({
    value: StoreName,
    name: StoreName,
  }));

  const { t } = useTranslation('common')
 
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
                    value={data.Barcode}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="product-id" className="form-label">
                    Product ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product-id"
                    value={data.ProductID}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="brand" className="form-label">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    value={data.Brand}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="product" className="form-label">
                    Product
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product"
                    value={data.ProductName}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="product-model" className="form-label">
                    Product Model
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product-model"
                    value={data.ProductName}
                    disabled="disabled"
                  />
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
                    value={data.Barcode}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    value={data.ProductCategoryName}
                    disabled="disabled"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-lg-5 mb-4">
                  <label htmlFor="date-purchase" className="form-label">
                    Date of Purchase
                  </label>
                  <input
                    disabled={type === 'GTM' ? 'disabled' : ''}
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
                    onChange={setStoreValue}
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
                        <p>Re-upload Warranty Card</p> :
                        <p>Attach Your Warranty Card Here</p>
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

export default connect(mapStateToProps, null)(UserRegisterProduct);
