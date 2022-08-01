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
        console.log(cek_error.ErrorCode);
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
        console.log(err);
      });
  };

  return (
    <div>
      <div className="service-menu">
        <div className="service-menu-header py-lg-3 pt-3">
          <p>{t('status_service.status_service')}</p>
        </div>

        <div className="service-menu-content row justify-content-center">
          <div className="mb-5 col-lg-8">
            <form onSubmit={handleSubmit}>
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
                    <button className="btn btn-outline-success" type="submit">
                      Search
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
    gsis_url: state.GSIS_URL
  }
}
export default connect(mapStateToProps, null) (ServiceStatusMenu);
