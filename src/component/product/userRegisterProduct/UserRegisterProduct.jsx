import React, { useEffect, useState } from 'react';
import './UserRegisterProduct.css';
import { connect, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../../action/action';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import './SelectSearch.css';
import { format } from 'date-fns';
var X2JS = require('x2js');

function UserRegisterProduct(props) {
  const xtojson = new X2JS();
  const { barcode } = useParams();
  const dispatch = useDispatch();
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
  });
  const [errorDate, setErrorDate] = useState('');
  const [errorFile1, setErrorFile1] = useState('');
  const [errorFile2, setErrorFile2] = useState('');
  const [errorStore, setErrorStore] = useState('');

  var email = localStorage.getItem('email');
  var token = localStorage.getItem('access_token');

  useEffect(() => {
    let isi = dataStore.filter((word) => word.StoreName === storeValue);
    if (storeValue !== '') {
      setStoreStreet(isi[0].Street);
    }
  }, [storeValue]);

  useEffect(() => {
    async function fetchDataProduct() {
      const request = await axios
        .post(
          props.gtm_url + 'pmtcommondata/GetProductListByCondition',
          {
            Barcode: barcode,
            ProductID: '',
            ProductName: '',
          },
          {
            headers: {
              Authorization: props.token,
              'Content-Type': 'text/plain',
            },
          }
        )
        .then((res) => {
          setData(res.data.data[0]);
        })
        .catch((e) => {
          dispatch(getToken());

          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log('request : ' + e.request);
          } else {
            console.log('message : ' + e.message);
          }
        });
      return request;
    }
    async function fetchDataStore() {
      const request = await axios
        .post(
          props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
          {
            StoreID: '',
            StoreName: '',
            StoreCode: '',
          },
          {
            headers: {
              Authorization: props.token,
              'Content-Type': 'text/plain',
            },
          }
        )
        .then((res) => {
          setDataStore(res.data.data);
          async function fetchDataUser() {
            const request = await axios
              .get(props.base_url + 'user/get', {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
                params: {
                  identifier: email,
                },
              })
              .then((res) => {
                setDataUser(res.data);
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
            return request;
          }
          fetchDataUser();
        })
        .catch((e) => {
          dispatch(getToken());

          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log('request : ' + e.request);
          } else {
            console.log('message : ' + e.message);
          }
        });
      return request;
    }

    if (barcode !== '') {
      fetchDataProduct();
      fetchDataStore();
    }
  }, [props.token, barcode]);

  async function fetchData() {
    var id = localStorage.getItem('id');
    var phone = localStorage.getItem('phone');

    if (
      userData.date !== '' ||
      userData.file1 !== '' ||
      userData.file2 !== '' ||
      storeValue !== ''
    ) {
      var dateChange = userData.date.replaceAll('-', '/');
      const formdata = new FormData();
      const newPurcaseDate = format(new Date(dateChange), 'MM/dd/yyyy');
      const newBirthDateDate = format(new Date('1981//09/27'), 'MM/dd/yyyy');
      const newGender = dataUser.gender === 'Pria' ? 'Mr' : 'Ms';

      formdata.append('customer_id', id);
      formdata.append('barcode', data.Barcode);
      formdata.append('product_id', data.ProductID);
      formdata.append('brand', data.Brand);
      formdata.append('product_name', data.ProductName);
      formdata.append('product_model', data.ProductModel);
      formdata.append('serial_number', data.SerialNumber);
      formdata.append('category', data.Category);
      formdata.append('date', dateChange);
      formdata.append('store_location', storeStreet);
      formdata.append('store_name', storeValue);
      formdata.append('email', email);
      formdata.append('phone', phone);
      formdata.append('status', 1);
      formdata.append(
        'warranty_card',
        userData.file1 === '' ? '' : userData.file1
      );
      formdata.append('invoice', userData.file2 === '' ? '' : userData.file2);

      const postToGSIS = async () => {
        let xmls = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hai="http://haier.com" xmlns:spir="http://www.siebel.com/xml/SPIRightNowInboundObject">
            <soapenv:Header/>
            <soapenv:Body>
              <hai:HATProdReg0926>
                <spir:ProductRegister>
                  <spir:id>1</spir:id>
                  <spir:country>Indonesia</spir:country>
                  <spir:firstName>${dataUser.first_name}</spir:firstName>
                  <spir:lastName>${dataUser.last_name}</spir:lastName>
                  <spir:gender>${newGender}</spir:gender>
                  <spir:customerType>End User</spir:customerType>
                  <spir:telPhone></spir:telPhone>
                  <spir:mobilePhone>${dataUser.phone}</spir:mobilePhone>
                  <spir:officePhone>${dataUser.phone_office}</spir:officePhone>
                  <spir:age>${dataUser.age}</spir:age>
                  <spir:birthday>${newBirthDateDate}</spir:birthday>
                  <spir:email>${dataUser.email}</spir:email>
                  <spir:fax>${dataUser.fax}</spir:fax>
                  <spir:brand>${data.Brand}</spir:brand>
                  <spir:category>${data.Category}</spir:category>
                  <spir:productModel>${data.ProductModel}</spir:productModel>
                  <spir:serialNum>${data.SerialNumber}</spir:serialNum>
                  <spir:purchaseDate>${newPurcaseDate}</spir:purchaseDate>
                  <spir:expiryDate></spir:expiryDate>
                  <spir:status></spir:status>
                  <spir:haveYouPurchasedExtendedWarranty></spir:haveYouPurchasedExtendedWarranty>
                  <spir:retailerName>${storeValue}</spir:retailerName>
                  <spir:retailerAddress>${storeStreet}</spir:retailerAddress>
                  <spir:retailerPostcode></spir:retailerPostcode>
                  <spir:retailerCity></spir:retailerCity>
                  <spir:retailerContactFirstName></spir:retailerContactFirstName>
                  <spir:retailerContactLastName></spir:retailerContactLastName>
                  <spir:retailerContactPhone></spir:retailerContactPhone>
                  <spir:retailerEmail></spir:retailerEmail>
                  <spir:address>${dataUser.address}</spir:address>
                  <spir:AddressId></spir:AddressId>
                  <spir:City>${dataUser.city}</spir:City>
                  <spir:State></spir:State>
                  <spir:Street></spir:Street>
                </spir:ProductRegister>
              </hai:HATProdReg0926>
            </soapenv:Body>
          </soapenv:Envelope>
        `;
        await axios
          .post(props.gsis_url, xmls, {
            headers: {
              'Content-Type': 'text/xml',
              SOAPAction: '"document/http://haier.com:InsertHSIProdReg"',
            },
          })
          .then((res) => {
            console.log(res.data);
            var json = xtojson.xml2js(res.data);
            console.log(json);
            // let cek_error = json.Envelope.Body.InsertHSIProdReg_Output;
            // if (cek_error.ErrorCode.__text !== '0') {
            //   console.log(cek_error.ErrorMessage.__text);
            // } else {
            //   alert('berhasil')
            // }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      await axios
        .post(props.base_url + 'register-product', formdata, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then((res) => {
          // alert('berhasil')
          postToGSIS();
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
    } else {
      alert('Failed!');
      if (userData.date === '') {
        setErrorDate('Date Must be Required');
      }
      if (storeValue === '') {
        setErrorStore('Store Must be Required');
      }
      if (userData.file1 === '') {
        setErrorFile1('Warranty Card Must be Required');
      }
      if (userData.file2 === '') {
        setErrorFile2('Invoice Must be Required');
      }
    }
  }

  let newDataStore = dataStore.map(({ StoreName }) => ({
    value: StoreName,
    name: StoreName,
  }));

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
                  value={data.ProductModel}
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
                  value={data.SerialNumber}
                  disabled="disabled"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-lg-5 mb-4">
                <label htmlFor="serial-number" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="serial-number"
                  value={data.Category}
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
                  type="date"
                  className="form-control"
                  class={`form-control ${
                    errorDate !== '' ? 'is-invalid' : null
                  }`}
                  id="date-purchase"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ['date']: e.target.value,
                    })
                  }
                />
                <div class="invalid-feedback">{errorDate}</div>
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
                <div class="text-danger" style={{ fontSize: 14 }}>
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
                <div class="dropzone-wrapper">
                  <div class="dropzone-desc">
                    <span class="material-icons"> cloud_upload </span>
                    <p>Attach Your Warranty Card Here</p>
                  </div>
                  <input
                    type="file"
                    name="warranty_card"
                    aria-label="file"
                    class="dropzone"
                    onChange={(e) => {
                      setShowFile1(URL.createObjectURL(e.target.files[0]));
                      setUserData({
                        ...userData,
                        ['file1']: e.target.files[0],
                      });
                    }}
                  />
                  {/* { errorData.file } */}
                </div>
                <div class="text-danger">{errorFile1}</div>
              </div>
            </div>
            <div className="col-lg-6">
              {showFile2 !== '' ? (
                <div className="col-lg-12 d-flex justify-content-center mb-3">
                  <img src={showFile2} alt="file" className="img-fluid" />
                </div>
              ) : null}
              <div className="btn-upload-custom mb-4">
                <div class="dropzone-wrapper">
                  <div class="dropzone-desc">
                    <span class="material-icons"> cloud_upload </span>
                    <p>Attach Your Invoice Here</p>
                  </div>
                  <input
                    type="file"
                    name="warranty_card"
                    class="dropzone"
                    aria-label="file"
                    onChange={(e) => {
                      setShowFile2(URL.createObjectURL(e.target.files[0]));
                      setUserData({
                        ...userData,
                        ['file2']: e.target.files[0],
                      });
                    }}
                  />
                  {/* { errorData.file } */}
                </div>
                <div class="text-danger">{errorFile2}</div>
              </div>
            </div>
          </div>
          <div className="d-grid gap-2">
            <button
              className="btn btn-color-primary py-lg-3 btn-submit"
              onClick={fetchData}
            >
              Product Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    token: state.GTM_TOKEN,
    base_url: state.BASE_URL,
    gsis_url: state.GSIS_URL,
  };
};

export default connect(mapStateToProps, null)(UserRegisterProduct);
