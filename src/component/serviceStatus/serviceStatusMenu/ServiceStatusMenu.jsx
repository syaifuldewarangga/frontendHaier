import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import './ServiceStatusMenu.css';
import axios from 'axios';
var X2JS = require('x2js');

const ServiceStatusMenu = () => {
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
      .post('https://e-warranty.click/oapi/gsis/checkhsisrstatus', fd, {
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

        <div className="service-menu-content">
          {/* <div className="row text-center mb-4">
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover active">All Status</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Appointment Scheduled</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Received by Service Partner</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Processing by Call Center</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Repair Finished</div>
                        </div>
                    </div> */}
          {/* <div className="mb-5 mt-4">
                        <span className="material-icons-outlined md-36 search-addon"> search </span>
                        <input type="text" className="form-control form-control-lg search-input" placeholder={t('status_service.search_id_service')} />
                    </div> */}
          <div className="mb-5">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 row">
                  <div className="col">
                    <input
                      type="text"
                      class="form-control"
                      name="srNumber"
                      placeholder="SR Number"
                      required
                      onChange={handleChange}
                    ></input>
                  </div>
                  <div className="col">
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
                  <div className="col">
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

export default ServiceStatusMenu;
