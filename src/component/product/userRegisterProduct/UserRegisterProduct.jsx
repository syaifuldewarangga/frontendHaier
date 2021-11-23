import React from 'react';
import './UserRegisterProduct.css';
import { connect, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../../action/action';

function UserRegisterProduct(props) {
  const { barcode } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = React.useState('');
  const [userData, setUserData] = React.useState({
    date: new Date(),
    store_location: '',
    store_name: '',
  });

  React.useEffect(() => {
    async function fetchData() {
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
    if (barcode !== '') {
      fetchData();
    }
  }, [props.token, barcode]);

  async function fetchData() {
    var token = localStorage.getItem('access_token');
    const formdata = new FormData();

    formdata.append('barcode', data.Barcode);
    formdata.append('product_id', data.ProductID);
    formdata.append('brand', data.Brand);
    formdata.append('product_name', data.ProductName);
    formdata.append('product_name', data.ProductModel);
    formdata.append('serial_number', data.SerialNumber);
    formdata.append('date', userData.date);
    formdata.append('store_location', userData.store_location);
    formdata.append('store_name', userData.store_name);

    await axios
      .post(props.base_url + 'register-product', formdata, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        console.log('Berhasil');
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
                  className="form-control form-control-lg"
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
                  className="form-control form-control-lg"
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
                  className="form-control form-control-lg"
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
                  className="form-control form-control-lg"
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
                  className="form-control form-control-lg"
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
                  className="form-control form-control-lg"
                  id="serial-number"
                  value={data.SerialNumber}
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
                  className="form-control form-control-lg"
                  id="date-purchase"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ['date']: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-lg-5 mb-4">
                <label htmlFor="store-location" className="form-label">
                  Store Location
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="store-location"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ['store_location']: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-lg-5 mb-4">
                <label htmlFor="store-location" className="form-label">
                  Store Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="store-location"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ['store_name']: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="btn-upload-custom mb-4">
                <div class="dropzone-wrapper">
                  <div class="dropzone-desc">
                    <span class="material-icons"> cloud_upload </span>
                    <p>Attach Your Warranty Card Here</p>
                  </div>
                  <input
                    type="file"
                    name="warranty_card"
                    class="dropzone"
                    aria-label="file"
                    // onChange={onChangeData}
                  />
                  {/* { errorData.file } */}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
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
                    // onChange={onChangeData}
                  />
                  {/* { errorData.file } */}
                </div>
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
  };
};

export default connect(mapStateToProps, null)(UserRegisterProduct);
