import React from 'react';
import ModalVerification from './ModalVerification';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import LoginMenu from '../loginMenu/LoginMenu';

const FormLogin = (props) => {
  const history = useHistory();
  const [data, setData] = React.useState({
    phone_number: '',
    password: '',
    salah: false,
  });

  const onChangeData = (e) => {
    if(e.target.ariaLabel === 'phone_number' && data.phone_number.toString().slice(0,1) === '0') {
      setData({
        ...data,
        phone_number: '62' + e.target.value.toString().slice(1),
      });  
    } else {
      setData({
        ...data,
        [e.target.ariaLabel]: e.target.value,
      });
    }
  };

  const getProfile = async (token, email) => {
    const getData = await axios
      .get(props.base_url + 'user/get', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          identifier: email,
        },
      })
      .then((res) => {
        if (res.data.roles === 'CUSTOMER') {
          localStorage.setItem('access_token', token);
          localStorage.setItem('email', email);
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('role', res.data.roles);
          localStorage.setItem(
            'fullname',
            res.data.first_name + ' ' + res.data.last_name
          );
          localStorage.setItem('phone', res.data.phone);
          localStorage.setItem('username', res.data.username);
          if (res.data.image.length !== 0) {
            localStorage.setItem('photo', res.data.image[0].path);
          }
          localStorage.setItem(
            'permission',
            JSON.stringify(res.data.permissions)
          );
          props.handleCustomerLogin(true);
          props.handleUser(res.data);
          history.push('/landing-page');
        } else {
          setData({
            ...data,
            ['salah']: true,
          });
        }
      })
      .catch((e) => {
        if (e.response) {
          setData({
            ...data,
            ['salah']: true,
          });
          console.log(e.response);
        } else if (e.request) {
          console.log('request : ' + e.request);
        } else {
          console.log('message : ' + e.message);
        }
      });
    return getData;
  };

  const fetchAPI = async () => {
    const formData = new FormData();
    formData.append('email', data.phone_number);
    formData.append('password', data.password);
    setData({
      ...data,
      ['salah']: false,
    });

    const request = await axios
      .post(props.base_url + 'login', formData)
      .then((res) => {
        getProfile(res.data.access_token, res.data.identifier);
      })
      .catch((e) => {
        if (e.response) {
          setData({
            ...data,
            ['salah']: true,
          });
          console.log(e.response);
        } else if (e.request) {
          console.log('request : ' + e.request);
        } else {
          console.log('message : ' + e.message);
        }
      });
    return request;
  };
  return (
    <div className="col-lg-6">
      <div className="card border-0">
        <div className="card-body p-3 p-lg-5  right-content">
          <LoginMenu />
          <div className="d-flex justify-content-center form-content">
            <div className="col-11 col-lg-7">
              <div className="md-3">
                <div className="position-relative mb-4">
                  {/* <div className="addon px-2 py-2">
                    <span className="username-addon">+62</span>
                    <div className="line-right"></div>
                  </div> */}
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label color-primary"
                  >
                    Phone Number {props.customer_login}
                  </label>
                  <input
                    type="number"
                    className="form-control pl-65"
                    placeholder="Phone Number"
                    aria-label="phone_number"
                    onChange={onChangeData}
                    min="0"
                    value={data.phone_number}
                    required
                  />
                </div>
              </div>

              <div className="md-3">
                <div className="position-relative mb-3">
                  <label
                    htmlFor="password"
                    className="form-label color-primary"
                  >
                    Password
                  </label>
                  {/* <div className="addon px-3">
                    <span
                      className="material-icons md-18"
                      style={{ padding: '7px 0' }}
                    >
                      lock
                    </span>
                    <div className="line-right"></div>
                  </div> */}
                  <input
                    type="password"
                    id="password"
                    className="form-control pl-65"
                    placeholder="Password"
                    aria-label="password"
                    onChange={onChangeData}
                    required
                  />
                  <i
                    className="password mdi mdi-eye-off mdi-18px"
                    data-id="password"
                  ></i>
                </div>
              </div>
              {data.salah === false ? null : (
                <p style={{ fontSize: 13, color: '#eb4d4b' }}>
                  Login Failed! Check Your Phone Number or Password.
                </p>
              )}
              <div>
                <a href="#">
                  <div className="forgot-password">
                    <Link to="/forgot-password">
                      <p>Forgot Password</p>
                    </Link>
                  </div>
                </a>
              </div>

              <div className="d-flex justify-content-center">
                <div className="col-12">
                  <div className="d-grid gap-2">
                    {/* <button
                      className="btn btn-color-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      Sign In
                    </button> */}
                    <button
                      className="btn btn-color-primary"
                      onClick={fetchAPI}
                    >
                      Sign In
                    </button>
                  </div>

                  <div
                    className="pt-3"
                    style={{ fontSize: '14px', fontWeight: '600' }}
                  >
                    <span>Not registered yet? </span>
                    <Link to="/register">
                      <span style={{ color: '#004D8B', cursor: 'pointer' }}>
                        Create an Account
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalVerification />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
    customer_login: state.CUSTOMER_LOGIN,
    user_permission: state.USER_PERMISSION,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleCustomerLogin: (data) =>
      dispatch({ type: 'CHANGE_CUSTOMER_LOGIN', value: data }),
    handleUser: (data) => dispatch({ type: 'CHANGE_USER', value: data }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
