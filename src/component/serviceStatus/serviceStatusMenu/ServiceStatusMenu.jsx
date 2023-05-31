import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import './ServiceStatusMenu.css';
import axios from 'axios';
import { connect } from 'react-redux';
var X2JS = require('x2js');

const ServiceStatusMenu = (props) => {
  const xtojson = new X2JS();
  const { t } = useTranslation('common');
  const history = useHistory();
  const [data, setData] = useState({
    srNumber: '',
    phone_number: '',
  });
  const token = localStorage.getItem('access_token');


  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append('SRNum', data.srNumber);
    fd.append('MobilePhone', data.phone_number);

    await axios
      .post(props.gsis_url + 'checkhsisrstatus', fd, {
        headers: {
          Accept: 'application/xml',
        },
      })
      .then((res) => {
        var json = xtojson.xml2js(res.data);
        let cek_error = json.Envelope.Body.CheckHSISRStatus_Output;
        // console.log(cek_error.ErrorCode);
        if (
          cek_error.ErrorCode === undefined ||
          cek_error.ErrorCode.__text !== '0'
        ) {
          alert('Barang Tidak di Temukan!');
        } else {
          history.push(
            `/service-status/detail/${data.srNumber}/${data.phone_number}`
          );
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const [loading, setLoading] = useState(false)
  const handleSubmitGcc = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('SRNum', data.srNumber)
    // formData.append('ApplyId', data.srNumber)
    formData.append('PhoneNumber', data.phone_number)
    try {
      const res = await axios.post(props.base_url + 'v2/register-service/status', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if(!!res.data.data.Data.CustomerName){
        // if(res.data.data.Data.WorkOrderNumber !== ""){
        //   const formData2 = new FormData()
        //   formData2.append('SRNum', data.srNumber)
        //   // formData2.append('ApplyId', data.srNumber)
        //   formData2.append('PhoneNumber', data.phone_number)
        //   const res = await axios.post(props.base_url + 'v2/register-service/status', formData2, {
        //     headers: {
        //       Authorization: 'Bearer ' + token,
        //     },
        //   })
        //   history.push(`/service-status/detail/${data.srNumber}/${data.phone_number}`);
        // }
        history.push(`/service-status/detail/${data.srNumber}/${data.phone_number}`);
      }else{
        alert('Barang Tidak di Temukan!');
      }
    } catch (err) {
      alert('Barang Tidak di Temukan!');
      // console.log(err.response)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="service-menu">
        <div className="service-menu-header py-lg-3 pt-3">
          <p>{t('status_service.status_service')}</p>
        </div>

        <div className="service-menu-content row justify-content-center">
          <div className="mb-5 col-lg-8">
            <form onSubmit={handleSubmitGcc}>
              <div className="row">
                <div className="col-lg-12 row">
                  <div className="col-lg-6 mb-3">
                    <input
                      type="text"
                      class="form-control"
                      name="srNumber"
                      placeholder="SR Number"
                      required
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <input
                      type="number"
                      class="form-control"
                      name="phone_number"
                      placeholder="Phone Number"
                      required
                      min="0"
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="col-lg-12 d-flex justify-content-end">
                    <button disabled={loading} className="btn btn-outline-success" type="submit">
                      {!loading ? 'Search' : 'Loading..'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gsis_url: state.GSIS_URL,
    base_url: state.BASE_URL
  }
}
export default connect(mapStateToProps, null) (ServiceStatusMenu);
