import React, { Fragment, useEffect, useState } from 'react';
import './ProfileForm.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { Modal } from 'bootstrap';
import AlertModal from '../../alertModal/AlertModal';
import { useTranslation } from 'react-i18next';

function ProfileForm(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState('');
  const [dataPonsel, setDataPonsel] = React.useState('');
  const [city, setCity] = useState([]);
  const [prov, setProv] = useState([]);
  const [district, setDistrict] = useState([]);
  const [sub_district, setSub_district] = useState([]);

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
    birth_date: '',
    age: '',
    email: '',
    phone_office: '',
    fax: '',
    province: '',
    city: '',
    district: '',
    sub_district: '',
    postal_code: '',
    address: '',
  });

  const [messageAlert, setMessageAlert] = useState({
    status: 'success',
    title: 'Success',
    subTitle: 'your password has been changed successfully',
  });
  var token = localStorage.getItem('access_token');

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

  async function getProvinceFromAPI() {
    await axios.get(props.base_url + 'location', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => {
      setProv(res.data);
    })
    .catch((e) => {
      if (e.response) {
        // console.log(e.response);
      } else if (e.request) {
        // console.log('request : ' + e.request);
      } else {
        // console.log('message : ' + e.message);
      }
    });
  }

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

  const getDisrictFromAPI = async (province, city) => {
    await axios.get(props.base_url + 'location/city/districts', {
      params: {
        prov_name: province,
        city_name: city,
      }
    })
    .then((res) => {
      setDistrict(res.data);
    })
    .catch((err) => {
      // console.log(err);
    });
  };

  const getSubDisrictFromAPI = async (province, city, district) => {
    await axios
      .get(props.base_url + 'location/city/districts/subdistricts', {
        params: {
          prov_name: province,
          city_name: city,
          dis_name: district,
        }
      })
      .then((res) => {
        setSub_district(res.data);
      });
  };

  useEffect(() => {
    setData(props.data);
    if (props.data !== '') {
      let newPhone = props.data.phone.toString();
      setDataPonsel(newPhone.slice(2));
    }

    getProvinceFromAPI();
    getCityFromAPI(props.data.province);
    getDisrictFromAPI(props.data.province, props.data.city);
    getSubDisrictFromAPI(props.data.province, props.data.city, props.data.district);
  }, [props.base_url, props.data]);

  const onChangeData = (e) => {
    if (e.target.ariaLabel === 'province') {
      setDistrict([])
      setSub_district([])
      setData({
        ...data,
        province: e.target.value,
        city: '',
        district: '',
        sub_district: ''
      });
      getCityFromAPI(e.target.value);
    } else if (e.target.ariaLabel === 'city') {
      setSub_district([])
      setData({
        ...data,
        city: e.target.value,
        district: '',
        sub_district: ''
      });
      getDisrictFromAPI(data.province, e.target.value);
    } else if (e.target.ariaLabel === 'district') {
      setData({
        ...data,
        district: e.target.value,
        sub_district: ''
      });
      getSubDisrictFromAPI(data.province, data.city, e.target.value);
    } else if (e.target.ariaLabel === 'phone') {
      setDataPonsel(e.target.value);
    } else {
      setData({
        ...data,
        [e.target.ariaLabel]: e.target.value,
      });
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault()
    setIsLoading(true)
    var token = localStorage.getItem('access_token');
    let formData = new FormData();
    formData.append('roles', localStorage.getItem('role'));
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('phone', '62' + dataPonsel);
    if(data.nik !== null){
      formData.append('nik', data.nik);
    }
    formData.append('status', data.status);
    formData.append('gender', data.gender);
    formData.append('birth_date', data.birth_date);
    // formData.append('province', data.province);
    // formData.append('city', data.city);
    // formData.append('district', data.district);
    // formData.append('sub_district', data.sub_district);
    // formData.append('postal_code', data.postal_code);
    // formData.append('address', data.address);
    if (data.age !== null) {
      formData.append('age', data.age);
    }

    if (data.phone_office !== null) {
      formData.append('phone_office', data.phone_office);
    }
    if (data.fax !== null) {
      formData.append('fax', data.fax);
    }
    axios.put(props.base_url + 'user', formData, {
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

        if (responError.location === 'gender') {
          setErrorData({
            ...errorData,
            gender: responError.reason,
          });
        }

        if (responError.location === 'birth_date') {
          setErrorData({
            ...errorData,
            birth_date: responError.reason,
          });
        }

        if (responError.location === 'age') {
          setErrorData({
            ...errorData,
            age: responError.reason,
          });
        }

        if (responError.location === 'email') {
          setErrorData({
            ...errorData,
            email: responError.reason,
          });
        }

        if (responError.location === 'phone_office') {
          setErrorData({
            ...errorData,
            phone_office: responError.reason,
          });
        }

        if (responError.location === 'fax') {
          setErrorData({
            ...errorData,
            fax: responError.reason,
          });
        }

        if (responError.location === 'province') {
          setErrorData({
            ...errorData,
            province: responError.reason,
          });
        }

        if (responError.location === 'city') {
          setErrorData({
            ...errorData,
            city: responError.reason,
          });
        }

        if (responError.location === 'district') {
          setErrorData({
            ...errorData,
            district: responError.reason,
          });
        }

        if (responError.location === 'sub_district') {
          setErrorData({
            ...errorData,
            sub_district: responError.reason,
          });
        }

        if (responError.location === 'postal_code') {
          setErrorData({
            ...errorData,
            postal_code: responError.reason,
          });
        }

        if (responError.location === 'address') {
          setErrorData({
            ...errorData,
            address: responError.reason,
          });
        }
      } else {
        // console.log(e.response);
      }
    }).finally(() => {
      setIsLoading(false)
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
    if(newPassword === '' || confirmPassword === '') {
      if(newPassword === '') {
        setErrorPassword({
          ...errorPassword,
          newPassword: 'New password is required'
        })
      } else if(confirmPassword === '') {
        setErrorPassword({
          ...errorPassword,
          confirmPassword: 'Confirm password is required'
        })
      }
    } else {
      let user_id = localStorage.getItem('id');
  
      var token = localStorage.getItem('access_token');
      let formData = new FormData();
      formData.append('userId', user_id);
      formData.append('password', newPassword);
      await axios.put(props.base_url + 'user/password', formData, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
      })
      .then((res) => {
        alertModal();
        setMessageAlert({
          status: 'success',
          title: 'Success',
          subTitle: 'your password has been changed successfully',
        });
        setErrorPassword({
          newPassword: '',
          confirmPassword: ''
        })
        setNewPasword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        let data = err.response;
        // console.log(err.response);
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
    }
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
              <form onSubmit={handleSubmitProfile}>
                <div className="form row">
                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">
                          {t('profile.first_name')}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          required
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
                          required
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
                          class={`form-select ${ errorData.gender !== '' ? 'is-invalid' : null }`}
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
                        <div className="invalid-feedback">
                          {errorData.gender}
                        </div>
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
                          class={`form-control ${ errorData.birth_date !== '' ? 'is-invalid' : null }`}
                          value={data.birth_date}
                          aria-label="birth_date"
                          onChange={onChangeData}
                        />
                        <div className="invalid-feedback">
                          {errorData.birth_date}
                        </div>
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
                          required
                          type="number"
                          min="0"
                          class={`form-control ${ errorData.age !== '' ? 'is-invalid' : null }`}
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
                          required
                          type="email"
                          class={`form-control ${ errorData.email !== '' ? 'is-invalid' : null }`}
                          value={data.email}
                          aria-label="email"
                          onChange={onChangeData}
                        />
                        <div className="invalid-feedback">
                          {errorData.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">
                          {t('profile.phone_number')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          class={`form-control ${ errorData.phone_office !== '' ? 'is-invalid' : null }`}
                          value={data.phone_office}
                          aria-label="phone_office"
                          onChange={onChangeData}
                        />
                        <div className="invalid-feedback">
                          {errorData.phone_office}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">{t('profile.fax')}</label>
                        <input
                          type="text"
                          class={`form-control ${ errorData.fax !== '' ? 'is-invalid' : null }`}
                          value={data.fax}
                          aria-label="fax"
                          onChange={onChangeData}
                        />
                        <div className="invalid-feedback">
                          {errorData.fax}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">
                          {t('profile.province')}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          required  
                          class={`form-select ${ errorData.province !== '' ? 'is-invalid' : null }`}
                          aria-label="province"
                          onChange={onChangeData}
                        >
                          {prov.map(function (item, i) {
                            return (
                              <option
                                value={item.prov_name}
                                key={i}
                                selected={ item.prov_name === props.data.province ? 'selected' : '' }
                              >
                                {item.prov_name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="invalid-feedback">
                          { errorData.birth_date }
                        </div>
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
                          required
                          class={`form-select ${ errorData.city !== '' ? 'is-invalid' : null }`}
                          aria-label="city"
                          onChange={onChangeData}
                          disabled={city.length === 0 ? 'disabled' : null}
                        >
                          <option selected={data.city === '' || data.city === undefined ? 'selected' : null} disabled>-- Select your city --</option>
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
                        <div className="invalid-feedback">
                          {errorData.city}
                        </div>
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
                        <select
                          required
                          class={`form-select ${ errorData.district !== '' ? 'is-invalid' : null }`}
                          aria-label="district"
                          onChange={onChangeData}
                          disabled={district.length === 0 ? 'disabled' : null}
                        >
                          <option selected={data.district === '' || data.district === undefined ? 'selected' : null} disabled>-- Select your district --</option>
                          {district.map(function (item, i) {
                            return (
                              <option
                                value={item.dis_name}
                                key={i}
                                selected={
                                  item.dis_name === props.data.district
                                    ? 'selected'
                                    : null
                                }
                              >
                                {item.dis_name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="invalid-feedback">
                          { errorData.district }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">
                          {t('profile.sub_district')}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          required
                          class={`form-select ${ errorData.sub_district !== '' ? 'is-invalid' : null }`}
                          aria-label="sub_district"
                          onChange={onChangeData}
                          disabled={sub_district.length === 0 ? 'disabled' : null}
                        >
                          <option selected={data.sub_district === '' || data.sub_district === undefined ? 'selected' : null} disabled>-- Select your sub district --</option>
                          {sub_district.map(function (item, i) {
                            return (
                              <option
                                value={item.subdis_name}
                                key={i}
                                selected={
                                  item.subdis_name === props.data.sub_district
                                    ? 'selected'
                                    : null
                                }
                              >
                                {item.subdis_name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="invalid-feedback">
                          {errorData.sub_district}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="px-lg-5">
                      <div class="mb-4">
                        <label class="form-label">
                          {t('profile.postal_code')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          class={`form-control ${ errorData.postal_code !== '' ? 'is-invalid' : null }`}
                          value={data.postal_code}
                          aria-label="postal_code"
                          onChange={onChangeData}
                        />
                        <div className="invalid-feedback">
                          {errorData.postal_code}
                        </div>
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
                          required
                          class={`form-control ${ errorData.address !== '' ? 'is-invalid' : null }`}
                          rows="6"
                          value={data.address}
                          aria-label="address"
                          onChange={onChangeData}
                        ></textarea>
                        <div class="invalid-feedback">{errorData.address}</div>
                      </div>
                    </div>
                  </div> */}

                  <div className="d-flex justify-content-center">
                    <div className="col-lg-3 col-12">
                      <div class="d-grid gap-2">
                        <button
                          class="btn btn-color-primary rounded-pill py-lg-1 profile-button"
                          type="submit"
                        >
                          {
                            isLoading ? 
                            <Fragment>
                              <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              Loading...
                            </Fragment> :
                            <Fragment>
                              {t('profile.save')}
                            </Fragment>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
