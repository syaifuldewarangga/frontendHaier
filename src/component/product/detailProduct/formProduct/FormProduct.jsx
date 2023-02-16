import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './FormProduct.css';
import { format } from 'date-fns';
import AlertModal from '../../../alertModal/AlertModal';
import { Modal } from 'bootstrap';
import { useHistory } from 'react-router';
var X2JS = require('x2js');

const visitHoursData = [
  '06:00-08:00',
  '08:00-10:00',
  '10:00-12:00',
]

const FormProduct = (props) => {
  const xtojson = new X2JS();
  const history = useHistory();
  const [newDate, setNewDate] = useState();
  const [data, setData] = useState({
    brand: '',
    category: '',
    product_model: '',
    serial_number: '',
    purchase_date: '',
    address: '',
    barcode: '',
    product_id: '',
    product_name: '',
    store_name: '',
    store_location: '',
    visit_date: '',
    visit_hours: '',
    description: '',
    mobile_phone: '',
  });
  const [errorData, setErrorData] = useState({
    store_name: '',
    visit_date: '',
    visit_hours: '',
    description: '',
  });
  const [errorGSIS, setErrorGSIS] = useState('');
  const [dataUser, setDataUser] = useState();
  const [dataAlert, setDataAlert] = useState({
    status: 'success',
    title: 'Success',
    subTitle: 'successfully requested service',
  });
  const [minDateVisitDate, setMinVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLoading, setIsLoading] = useState(false)

  let token = localStorage.getItem('access_token');

  useEffect(() => {
    if (props.data.date !== undefined) {
      let new_date = format(new Date(props.data.date), 'yyyy-MM-dd')
      // setNewDate(props.data.date.replaceAll('/', '-'));
      setNewDate(new_date);
    }
  }, [props.data.date]);

  const getDataUserFromAPI = async () => {
    await axios
      .get(props.base_url + 'user', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          username: localStorage.getItem('username'),
        },
      })
      .then((res) => {
        setDataUser(res.data);
      });
  };

  useEffect(() => {
    getDataUserFromAPI();
  }, []);

  useEffect(() => {
    setData({
      ...data,
      brand: props.data.brand,
      category: props.data.category,
      product_model: props.data.product_model,
      serial_number: props.data.serial_number,
      purchase_date: props.data.date,
      address: dataUser !== undefined ? dataUser.address : '',
      barcode: props.data.barcode,
      product_id: props.data.product_id,
      product_name: props.data.product_name,
      store_name: props.data.store_name,
      store_location: props.data.store_location,
      mobile_phone: dataUser !== undefined ? dataUser.phone : '',
    });
  }, [props.data, dataUser]);

  const onChangeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const deleteServiceRequest = async (SRNum) => {
    await axios.delete(props.base_url + 'register-service/delete', {
      headers: {
        Authorization: 'Bearer ' + token
      }, 
      params: {
        SRNum: SRNum
      }
    }).then(() => {
      console.log('success delete')
    }).catch((err) => {
      console.log(err.response)
    })
  }

  const InsertHSISRAPI = async (SRNum) => {
    const newPurchaseDate = format(new Date(data.purchase_date), 'MM/dd/yyyy');
    const newVisitDate = format(new Date(data.visit_date), 'MM/dd/yyyy');

    const fd = new FormData();
    fd.append('SerialNum', data.serial_number);
    fd.append('Category', data.category);
    fd.append('ProductModel', data.product_model);
    fd.append('PurchaseDate', newPurchaseDate);
    fd.append('PreferredVisitDate', newVisitDate);
    fd.append('PreferredTime', data.visit_hours);
    fd.append('Requirement', data.description);
    fd.append('FirstName', dataUser.first_name);
    fd.append('LastName', dataUser.last_name);
    fd.append('HomePhone', '');
    fd.append('MobilePhone', dataUser.phone);
    fd.append('Email', dataUser.email);
    fd.append('Brand', data.brand);
    fd.append('SRNum', SRNum);
    fd.append('DetailAddress', dataUser.address);
    fd.append('AddressId', "");
    await axios
      .post(props.gsis_url + 'inserthsisr', fd, {
        headers: {
          Accept: 'application/xml',
        },
      })
      .then((res) => {
        var json = xtojson.xml2js(res.data);
        let cek_error = json.Envelope.Body.InsertHSISR_Output
        if(cek_error.ErrorCode.__text !== '0') {
          setErrorGSIS(cek_error.ErrorMessage.__text)
          deleteServiceRequest(SRNum)
        } else {
          alertModal();
          onHideModal('/service-status');
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false)
      });
  };

  const InsertServiceRegister = async () => {
    const formData = new FormData();

    let newVisitDateE = '';
    if (data.visit_date !== '') {
      newVisitDateE = data.visit_date.replaceAll('-', '/');
    }

    let newPostPurchaseDate = format(new Date(data.purchase_date), 'yyyy/MM/dd');
    
    formData.append('brand', data.brand);
    formData.append('category', data.category);
    formData.append('product_model', data.product_model);
    formData.append('serial_number', data.serial_number);
    formData.append('purchase_date', newPostPurchaseDate);
    formData.append('address', data.address);
    formData.append('barcode', data.barcode);
    formData.append('product_id', data.product_id);
    formData.append('product_name', data.product_name);
    formData.append('store_name', data.store_name);
    formData.append('store_location', data.store_location);
    formData.append('visit_date', newVisitDateE);
    formData.append('visit_hours', data.visit_hours);
    formData.append('description', data.description);
    formData.append('mobile_phone', data.mobile_phone);
    formData.append('status', 1);
    await axios.post(props.base_url + 'register-service', formData, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then((res) => {
      InsertHSISRAPI(res.data);
    }).catch((err) => {
      console.log(err.response)
      if (err.response.data.errors !== undefined) {
        let responError = err.response.data.errors;

        if (responError.location === 'barcode') {
          setDataAlert({
            status: 'error',
            title: 'Sory',
            subTitle: 'Your product has been registered. please check the service status list',
          })
          alertModal();
          onHideModal('/service-status')
        }
        
        if (responError.location === 'store_name') {
          setErrorData({
            ...errorData,
            store_name: responError.reason,
          });
        }

        if (responError.location === 'visit_date') {
          setErrorData({
            ...errorData,
            visit_date: responError.reason,
          });
        }

        if (responError.location === 'visit_hours') {
          setErrorData({
            ...errorData,
            visit_hours: responError.reason,
          });
        }

        if (responError.location === 'description') {
          setErrorData({
            ...errorData,
            description: responError.reason,
          });
        }
      } else {
        console.log(err.response);
      }
      setIsLoading(false)
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    InsertServiceRegister();
  };

  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  };

  const onHideModal = (url = null) => {
    var alertModal = document.getElementById('alertModal');
    alertModal.addEventListener('hide.bs.modal', function (event) {
      url !== null ? history.push(url) : history.push('/landing-page');
    });
  };

  return (
    <div className="px-lg-5 px-1 py-5 mb-5 detail-product">
      <p className="title">Product Detail</p>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="barcode" className="form-label">
                  Barcode
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="barcode"
                  disabled
                  value={props.data.barcode}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="product-id" className="form-label">
                  Product ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="product-id"
                  disabled
                  value={props.data.product_id}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="brand" className="form-label">
                  Brand
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  disabled
                  value={props.data.brand}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="product" className="form-label">
                  Product
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="product"
                  disabled
                  value={props.data.product_name}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="product-model" className="form-label">
                  Product Model
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="product-model"
                  value={props.data.product_model}
                  disabled
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <label htmlFor="serial-number" className="form-label">
                  Serial Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="serial-number"
                  disabled
                  value={props.data.serial_number}
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-4">
                <label htmlFor="date-purchase" className="form-label">
                  Date of Purchase
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date-purchase"
                  disabled
                  value={newDate}
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-lg-6">
                <div>
                  <label htmlFor="visit-date" className="form-label">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      errorData.visit_date !== '' ? 'is-invalid' : null
                    }`}
                    id="visit-date"
                    name="visit_date"
                    onChange={onChangeData}
                    min={minDateVisitDate}
                    required
                  />
                  <div className="invalid-feedback">{errorData.visit_date}</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div>
                  <label htmlFor="reapair-visit" className="form-label">
                    Visit Hours
                  </label>
                  <select 
                    className= {`form-select ${ errorData.visit_hours !== '' ? 'is-invalid' : null  }`} 
                    name="visit_hours"  
                    onChange={onChangeData} 
                    required
                  >
                      <option value="" selected disabled>-- Select Visit Hours -- </option>
                      {
                        visitHoursData.map((item, index) => (
                          <option value={item} key={index}>{item}</option>
                        ))
                      }
                  </select>
                  <div className="invalid-feedback">
                    {errorData.visit_hours}
                  </div>
                </div>
              </div>

              <div className="col-12 mt-2">
                <p
                  className="text-danger"
                  style={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  Catatan: Pilihan Tanggal Kunjungan Perbaikan hanya untuk
                  referensi Anda dan tunduk pada waktu pemrosesan internal kami.
                  Kami akan berusaha untuk menghubungi Anda sesuai dengan
                  pilihan tanggal kunjungan perbaikan Anda.
                </p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-2">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className={`form-control ${
                    errorData.description !== '' ? 'is-invalid' : null
                  }`}
                  id="description"
                  rows="5"
                  name="description"
                  onChange={onChangeData}
                  required
                ></textarea>
                <div className="invalid-feedback">{errorData.description}</div>
              </div>
            </div>

            {errorGSIS !== '' ? (
              <div className="text-danger mb-3">{errorGSIS}</div>
            ) : null}
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-color-primary py-3 btn-submit"
              type="submit"
              disabled={isLoading ? 'disabled' : null }
            >
              <div className="d-flex justify-content-center">
                {
                  isLoading ?
                  <div class="spinner-border text-primary me-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>: null
                }
                <div>
                  Service Registration
                </div>
              </div>
            </button>
          </div>
        </form>
      </div>
      <AlertModal data={dataAlert} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
    gsis_url: state.GSIS_URL,
  };
};
export default connect(mapStateToProps, null)(FormProduct);
