import React, { useEffect, useState } from 'react';
import './ProfileForm.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'bootstrap';
import AlertModal from '../../alertModal/AlertModal';
import { useTranslation } from 'react-i18next';

function ProfileForm(props) {
  const history = useHistory();
  const [data, setData] = useState({});
  const [dataPonsel, setDataPonsel] = React.useState('');
  const [city, setCity] = useState([]);
  const [prov, setProv] = useState([]);

  const [newPassword, setNewPasword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errorData, setErrorData] = useState({
    first_name: '',
    last_name: '',
    nik: '',
    gender: '',
    birth: '',
    age: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
  });

  const [messageAlert, setMessageAlert] = useState({
    status: 'success',
    title: 'Success',
    subTitle: 'your password has been changed successfully',
  });

  async function fetchData() {
    var token = localStorage.getItem('access_token');
    await axios
      .get(props.base_url + 'location', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        setProv(res.data);
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

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setErrorPassword({
        ...errorPassword,
        confirmPassword: 'passwords are not the same',
      });
    } else {
      setErrorPassword({
        ...errorPassword,
        confirmPassword: '',
      });
    }
  }, [confirmPassword]);

  useEffect(() => {
    setData(props.data);
    console.log(props.data);
    console.log('disini');
    if (props.data !== '') {
      let newPhone = props.data.phone.toString();
      setDataPonsel(newPhone.slice(2));
    }
    fetchData();
    getCityFromAPI(props.data.province);
  }, [props.base_url, props.data]);

  const getCityFromAPI = async (province) => {
    var token = localStorage.getItem('access_token');
    await axios
      .get(props.base_url + 'location/city', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          prov_name: province,
        },
      })
      .then((res) => {
        setCity(res.data);
      });
  };

  const onChangeData = (e) => {
    if (e.target.ariaLabel === 'province') {
      getCityFromAPI(e.target.value);
    }
    if (e.target.ariaLabel === 'phone') {
      setDataPonsel(e.target.value);
    } else {
      setData({
        ...data,
        [e.target.ariaLabel]: e.target.value,
      });
    }
  };

  const fetchAPI = () => {
    var token = localStorage.getItem('access_token');
    let formData = new FormData();
    formData.append('roles', localStorage.getItem('role'));
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('username', data.username);
    formData.append('phone', '62' + dataPonsel);
    formData.append('nik', data.nik);
    formData.append('status', data.status);
    formData.append('gender', data.gender);
    formData.append('birth_date', data.birth_date);
    formData.append('province', data.province);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('sub_district', data.sub_district);
    formData.append('postal_code', data.postal_code);
    formData.append('address', data.address);
    if (data.age !== null) {
      formData.append('age', data.age);
    }

    if (data.phone_office !== null) {
      formData.append('phone_office', data.phone_office);
    }
    if (data.fax !== null) {
      formData.append('fax', data.fax);
    }
    axios
      .put(props.base_url + 'user', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        localStorage.setItem('phone', dataPonsel);
        alertModal();
        setMessageAlert({
          status: 'success',
          title: 'Success',
          subTitle: 'your profile has been changed successfully',
        });
        onHideModal();
      })
      .catch((e) => {
        if (e.response.data) {
          let responError = e.response.data.errors;
          if (responError.location === 'first_name') {
            setErrorData({
              ...errorData,
              first_name: responError.reason,
            });
          }

          if (responError.location === 'last_name') {
            setErrorData({
              ...errorData,
              last_name: responError.reason,
            });
          }

          if (responError.location === 'nik') {
            setErrorData({
              ...errorData,
              nik: responError.reason,
            });
          }

          if (responError.location === 'age') {
            setErrorData({
              ...errorData,
              age: responError.reason,
            });
          }

          if (responError.location === 'phone') {
            setErrorData({
              ...errorData,
              phone: responError.reason,
            });
          }

          if (responError.location === 'address') {
            setErrorData({
              ...errorData,
              street: responError.reason,
            });
          }
        } else {
          console.log(e.response);
        }
      });
  };

  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  };

  const onHideModal = () => {
    var alertModal = document.getElementById('alertModal');
    alertModal.addEventListener('hide.bs.modal', function (event) {
      window.location.reload();
    });
  };

  const onChangePassword = (e) => {
    if (e.target.name === 'new_password') {
      setNewPasword(e.target.value);
    }

    if (e.target.name === 'confirm_password') {
      setConfirmPassword(e.target.value);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    let user_id = localStorage.getItem('id');

    var token = localStorage.getItem('access_token');
    let formData = new FormData();
    formData.append('userId', user_id);
    formData.append('password', newPassword);
    await axios
      .put(props.base_url + 'user/password', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        alertModal();
        setNewPasword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        let data = err.response;
        console.log(err.response);
        if (data !== undefined) {
          let responError = err.response.data;
          if (responError.errors.location === 'password') {
            setErrorPassword({
              ...errorPassword,
              newPassword: responError.message,
            });
          }
        }
      });
  };

  const { t } = useTranslation('common');
  return (
    <div className="profile-form mb-5">
      <div className="card">
        <div className="card-body">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <div
                class="nav-link active px-lg-5"
                data-bs-toggle="pill"
                data-bs-target="#pills-personal-data"
                role="tab"
                aria-controls="pills-personal-data"
                aria-selected="true"
              >
                <p>{t('profile.personal_data')}</p>
              </div>
            </li>
            <li class="nav-item" role="presentation">
              <div
                class="nav-link px-lg-5"
                data-bs-toggle="pill"
                data-bs-target="#pills-password"
                role="tab"
                aria-controls="pills-password"
                aria-selected="true"
              >
                <p>{t('profile.change_password')}</p>
              </div>
            </li>
          </ul>
          <div class="tab-content mt-4" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-personal-data"
              role="tabpanel"
              aria-labelledby="pills-personal-data-tab"
            >
              <div className="form row">
                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.first_name')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class={`form-control ${
                          errorData.first_name !== '' ? 'is-invalid' : null
                        }`}
                        value={data.first_name}
                        aria-label="first_name"
                        onChange={onChangeData}
                      />
                      <div class="invalid-feedback">{errorData.first_name}</div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.last_name')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class={`form-control ${
                          errorData.last_name !== '' ? 'is-invalid' : null
                        }`}
                        value={data.last_name}
                        aria-label="last_name"
                        onChange={onChangeData}
                      />
                      <div class="invalid-feedback">{errorData.last_name}</div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.ktp_sim')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        class={`form-control ${
                          errorData.nik !== '' ? 'is-invalid' : null
                        }`}
                        value={data.nik}
                        aria-label="nik"
                        onChange={onChangeData}
                      />
                      <div class="invalid-feedback">{errorData.nik}</div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.gender')}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        class={`form-select ${
                          errorData.gender !== '' ? 'is-invalid' : null
                        }`}
                        aria-label="gender"
                        onChange={onChangeData}
                      >
                        <option
                          value="Pria"
                          selected={data.gender === 'Pria' ? 'selected' : ''}
                        >
                          Pria 
                        </option>
                        <option
                          value="Wanita"
                          selected={data.gender === 'Wanita' ? 'selected' : ''}
                        >
                          Wanita
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.date_of_birth')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        class={`form-control ${
                          errorData.birth !== '' ? 'is-invalid' : null
                        }`}
                        value={data.birth_date}
                        aria-label="birth_date"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.age')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        class={`form-control ${
                          errorData.age !== '' ? 'is-invalid' : null
                        }`}
                        value={data.age}
                        aria-label="age"
                        onChange={onChangeData}
                      />
                      <div class="invalid-feedback">{errorData.age}</div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">{t('profile.email')}</label>
                      <input
                        type="email"
                        class="form-control"
                        value={data.email}
                        aria-label="email"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.mobile_phone_number')}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span class="input-group-text" id="basic-addon1">
                          +62
                        </span>
                        <input
                          type="number"
                          class={`form-control ${
                            errorData.phone !== '' ? 'is-invalid' : null
                          }`}
                          value={dataPonsel}
                          aria-label="phone"
                          onChange={onChangeData}
                        />
                        <div class="invalid-feedback">{errorData.phone}</div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.phone_number')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        class="form-control"
                        value={data.phone_office}
                        aria-label="phone_office"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">{t('profile.fax')}</label>
                      <input
                        type="text"
                        class="form-control"
                        value={data.fax}
                        aria-label="fax"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.province')}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        class={`form-select ${
                          errorData.province !== '' ? 'is-invalid' : null
                        }`}
                        aria-label="province"
                        onChange={onChangeData}
                      >
                        {prov.map(function (item, i) {
                          return (
                            <option
                              value={item.prov_name}
                              key={i}
                              selected={
                                item.prov_name === props.data.province
                                  ? 'selected'
                                  : ''
                              }
                            >
                              {item.prov_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.city')}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        class={`form-select ${
                          errorData.city !== '' ? 'is-invalid' : null
                        }`}
                        aria-label="city"
                        onChange={onChangeData}
                      >
                        {city.map(function (item, i) {
                          return (
                            <option
                              value={item.city_name}
                              key={i}
                              selected={
                                item.city_name === props.data.city
                                  ? 'selected'
                                  : null
                              }
                            >
                              {item.city_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.district')}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        class={`form-control ${
                          errorData.district !== '' ? 'is-invalid' : null
                        }`}
                        value={data.district}
                        aria-label="district"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.postal_code')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        class="form-control"
                        value={data.postal_code}
                        aria-label="postal_code"
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="px-lg-5">
                    <div class="mb-4">
                      <label class="form-label">
                        {t('profile.address')}
                        <span className="text-danger">*</span>
                      </label>
                      <textarea
                        class={`form-control ${
                          errorData.street !== '' ? 'is-invalid' : null
                        }`}
                        rows="6"
                        value={data.address}
                        aria-label="address"
                        onChange={onChangeData}
                      ></textarea>
                      <div class="invalid-feedback">{errorData.street}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <div className="col-lg-3 col-12">
                    <div class="d-grid gap-2">
                      <button
                        class="btn btn-color-primary rounded-pill py-lg-1 profile-button"
                        type="button"
                        onClick={fetchAPI}
                      >
                        {t('profile.save')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="tab-pane fade"
              id="pills-password"
              role="tabpanel"
              aria-labelledby="pills-password-tab"
            >
              <div className="form">
                <form onSubmit={handleChangePasswordSubmit}>
                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">New Password</label>
                        <input
                          type="password"
                          class={`form-control ${
                            errorPassword.newPassword !== ''
                              ? 'is-invalid'
                              : null
                          }`}
                          name="new_password"
                          value={newPassword}
                          onChange={onChangePassword}
                        />
                        <div className="invalid-feedback">
                          {errorPassword.newPassword}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          class={`form-control ${
                            errorPassword.confirmPassword !== ''
                              ? 'is-invalid'
                              : null
                          }`}
                          name="confirm_password"
                          value={confirmPassword}
                          onChange={onChangePassword}
                        />
                        <div className="invalid-feedback">
                          {errorPassword.confirmPassword}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="d-grid gap-2">
                        <button
                          class="btn btn-color-primary rounded-pill profile-button py-2"
                          type="submit"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertModal data={messageAlert} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};

export default connect(mapStateToProps, null)(ProfileForm);
