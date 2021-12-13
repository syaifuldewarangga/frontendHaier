import axios from 'axios';
import { encode } from 'base-64';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import LoginMenu from '../loginMenu/LoginMenu';

const FormRegister = (props) => {
  const history = useHistory();
  const [errorData, setErrorData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    nik: '',
    gender: '',
    birth_date: '',
    age: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    sub_district: '',
    address: '',
    password: '',
    confirmpassword: '',
  });
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    nik: '',
    gender: '',
    birth_date: '',
    age: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    sub_district: '',
    address: '',
    password: '',
    confirmpassword: '',
  });

  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [sub_district, setSub_district] = useState([]);

  useEffect(() => {
    if (data.password !== data.confirmpassword) {
      setErrorData({
        confirmpassword: 'password are not the same',
      });
    } else {
      setErrorData({
        confirmpassword: '',
      });
    }
  }, [data.confirmpassword]);

  useEffect(() => {
    if(data.phone.toString().slice(0, 2) !== '62' && data.phone !== '') {
      setErrorData({
        phone: 'check your phone number, use 62 for phone number code'
      })
    }
  }, [data.phone])

  const getProvinceFromAPI = async () => {
    await axios
      .get(props.base_url + 'location')
      .then((res) => {
        setProvince(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getCityFromAPI = async (province) => {
    await axios
      .get(props.base_url + 'location/city', {
        params: {
          prov_name: province,
        },
      })
      .then((res) => {
        setCity(res.data);
      });
  };

  const getDisrictFromAPI = async (city) => {
    await axios
      .get(props.base_url + 'location/city/districts', {
        params: {
          city_name: city,
        }
      })
      .then((res) => {
        setDistrict(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubDisrictFromAPI = async (district) => {
    await axios
      .get(props.base_url + 'location/city/districts/subdistricts', {
        params: {
          district_name: district,
        }
      })
      .then((res) => {
        setSub_district(res.data);
      });
  };

  useEffect(() => {
    getProvinceFromAPI();
  }, []);

  const onChangeInput = (e) => {
    if (e.target.name === 'province') {
      getCityFromAPI(e.target.value);
    }
    if (e.target.name === 'city') {
      getDisrictFromAPI(e.target.value);
    }
    if (e.target.name === 'district') {
      getSubDisrictFromAPI(e.target.value);
    }
    if (
      e.target.name === 'phone' &&
      data.phone.toString().slice(0, 1) === '0'
    ) {
      let newPhone = '62' + e.target.value.slice(1);
      setData({
        ...data,
        phone: newPhone,
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('username', data.username);
    formData.append('nik', data.nik);
    formData.append('gender', data.gender);
    formData.append('birth_date', data.birth_date);
    formData.append('age', data.age);
    formData.append('phone', data.phone);
    formData.append('province', data.province);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('sub_district', data.sub_district);
    formData.append('address', data.address);
    formData.append('password', data.password);
    formData.append('role', 'CUSTOMER');

    await axios
      .post(props.base_url + 'register', formData)
      .then((res) => {
        let response = res.data;
        history.push(
          '/register_otp/' +
            encode(response.data.userId) +
            '/' +
            encode(data.phone)
        );
      })
      .catch((err) => {
        let error = err.response;
        console.log(error)
        if (error !== undefined) {
          let responError = error.data.errors;
          if (responError !== undefined) {
            if (responError.location === 'first_name') {
              setErrorData({
                first_name: error.data.message,
              });
            }

            if (responError.location === 'last_name') {
              setErrorData({
                last_name: error.data.message,
              });
            }

            if (responError.location === 'username') {
              setErrorData({
                username: error.data.message,
              });
            }

            if (responError.location === 'nik') {
              setErrorData({
                nik: error.data.message,
              });
            }

            if (responError.location === 'gender') {
              setErrorData({
                gender: error.data.message,
              });
            }

            if (responError.location === 'birth_date') {
              setErrorData({
                birth_date: error.data.message,
              });
            }

            if (responError.location === 'age') {
              setErrorData({
                age: error.data.message,
              });
            }

            if (responError.location === 'province') {
              setErrorData({
                province: error.data.message,
              });
            }

            if (responError.location === 'city') {
              setErrorData({
                city: error.data.message,
              });
            }

            if (responError.location === 'district') {
              setErrorData({
                district: error.data.message,
              });
            }

            if (responError.location === 'sub_district') {
              setErrorData({
                sub_district: error.data.message,
              });
            }

            if (responError.location === 'address') {
              setErrorData({
                address: error.data.message,
              });
            }

            if (responError.location === 'phone') {
              setErrorData({
                phone: error.data.message,
              });
            }

            if (responError.location === 'password') {
              setErrorData({
                password: error.data.message,
              });
            }
          } else {
            console.log(err.response);
          }
        } else {
          console.log(error)
        }
      });
  };

  return (
    <div>
      <div className="">
        <div className="d-flex justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0">
              <div className="card-body p-3 p-lg-5 right-content">
                <LoginMenu />
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: '10%' }}
                >
                  <div className="col-12">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            First Name
                          </div>
                          <input
                            type="text"
                            name="first_name"
                            className={`form-control ${
                              errorData.first_name !== '' && errorData.first_name !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="First Name"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.first_name}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            Last Name
                          </div>
                          <input
                            type="text"
                            name="last_name"
                            className={`form-control ${
                              errorData.last_name !== ''  && errorData.last_name !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="Last Name"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.last_name}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            Username
                          </div>
                          <input
                            type="text"
                            name="username"
                            className={`form-control ${
                              errorData.username !== '' && errorData.username !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="Username"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.username}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">NIK</div>
                          <input
                            type="number"
                            name="nik"
                            min="0"
                            className={`form-control ${
                              errorData.nik !== '' && errorData.nik !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="nik"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.nik}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">Gender</div>
                          <select
                            class={`form-select ${
                              errorData.gender !== '' && errorData.gender !== undefined ? 'is-invalid' : null
                            }`}
                            name="gender"
                          >
                            <option value="Pria"> Pria </option>
                            <option value="Wanita"> Wanita </option>
                          </select>
                          <div className="invalid-feedback">
                            {errorData.gender}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            Date of Birth
                          </div>
                          <input
                            type="date"
                            name="birth_date"
                            className={`form-control ${
                              errorData.birth_date !== '' && errorData.birth_date !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="birth_date"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.birth_date}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">Age</div>
                          <input
                            type="number"
                            name="age"
                            className={`form-control ${
                              errorData.age !== '' && errorData.age !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="age"
                            min="1"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.age}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">Phone</div>
                          <div className="input-group">
                            <input
                              type="number"
                              name="phone"
                              min="0"
                              className={`form-control ${
                                errorData.phone !== '' && errorData.phone !== undefined ? 'is-invalid' : null
                              }`}
                              placeholder="Phone"
                              value={data.phone}
                              onChange={onChangeInput}
                            />
                            <div className="invalid-feedback">
                              {errorData.phone}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div class="form-label"> Province </div>
                          <select
                            class={`form-select ${
                              errorData.province !== '' && errorData.province !== undefined ? 'is-invalid' : null
                            }`}
                            name="province"
                            onChange={onChangeInput}
                          >
                            <option> -- Select your province -- </option>
                            {province.map(function (item, i) {
                              return (
                                <option value={item.prov_name} key={i}>
                                  {item.prov_name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errorData.province}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div class="form-label"> City </div>
                          <select
                            class={`form-select ${
                              errorData.city !== '' && errorData.city !== undefined ? 'is-invalid' : null
                            }`}
                            name="city"
                            onChange={onChangeInput}
                            disabled={city.length === 0 ? 'disabled' : null}
                          >
                            {city.map(function (item, i) {
                              return (
                                <option value={item.city_name} key={i}>
                                  {item.city_name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errorData.city}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label">District</div>
                          <select
                            class={`form-select ${
                              errorData.district !== '' && errorData.district !== undefined ? 'is-invalid' : null
                            }`}
                            name="district"
                            onChange={onChangeInput}
                            disabled={district.length === 0 ? 'disabled' : null}
                          >
                            {district.map(function (item, i) {
                              return (
                                <option value={item.dis_name} key={i}>
                                  {item.dis_name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errorData.district}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label">Sub district</div>
                          <select
                            class={`form-select ${
                              errorData.sub_district !== '' && errorData.sub_district !== undefined
                                ? 'is-invalid'
                                : null
                            }`}
                            name="sub_district"
                            onChange={onChangeInput}
                            disabled={
                              sub_district.length === 0 ? 'disabled' : null
                            }
                          >
                            {sub_district.map(function (item, i) {
                              return (
                                <option value={item.subdis_name} key={i}>
                                  {item.subdis_name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errorData.sub_district}
                          </div>
                        </div>

                        <div className="col-lg-12 mb-3">
                          <div className="form-label">address</div>
                          <textarea
                            class={`form-control ${
                              errorData.address !== '' && errorData.address !== undefined? 'is-invalid' : null
                            }`}
                            rows="6"
                            name="address"
                            onChange={onChangeInput}
                          ></textarea>
                          <div class="invalid-feedback">
                            {errorData.address}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            Password
                          </div>
                          <input
                            type="password"
                            name="password"
                            className={`form-control ${
                              errorData.password !== '' && errorData.password !== undefined ? 'is-invalid' : null
                            }`}
                            placeholder="Password"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.password}
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-label color-primary">
                            Password Confirmation
                          </div>
                          <input
                            type="password"
                            name="confirmpassword"
                            className={`form-control ${
                              errorData.confirmpassword !== '' && errorData.confirmpassword  !== undefined
                                ? 'is-invalid'
                                : null
                            }`}
                            placeholder="Password Confirmation"
                            onChange={onChangeInput}
                          />
                          <div className="invalid-feedback">
                            {errorData.confirmpassword}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <div className="col-12">
                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-color-primary"
                              type="submit"
                            >
                              Sign Up
                            </button>
                          </div>

                          <div
                            className="pt-3"
                            style={{ fontSize: '14px', fontWeight: '600' }}
                          >
                            <span>Already have an Account? </span>
                            <Link to="/">
                              <span
                                style={{ color: '#004D8B', cursor: 'pointer' }}
                              >
                                Sign in
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};
export default connect(mapStateToProps, null)(FormRegister);
