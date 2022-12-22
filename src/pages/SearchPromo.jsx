import { Button } from 'bootstrap'
import React, { useState } from 'react'
import { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import LoginCover from '../component/login/LoginCover'
import ModalPrivacy from '../component/login/ModalPrivacy'
import LoginMenu from '../component/loginMenu/LoginMenu';

const SearchPromo = () => {
  const [form, setForm] = useState({
    promo_code: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const onChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
        setIsLoading(false)
    }, 500);
  }
  return (
    <div className='row'>
        <LoginCover />
        <div className="col-md-6">
            <div className="card border-0">
                <div className="card-body p3 p-lg-5 right-content">
                    <LoginMenu />
                    <div className="d-flex justify-content-center form-content">
                        <div className="col-11 col-lg-7">
                            <form onSubmit={onSubmit}>
                                <div className="md-3">
                                    <div className="position-relative mb-4">
                                        <label
                                        htmlFor="exampleFormControlInput1"
                                        className="form-label color-primary"
                                        >
                                        Promo Code
                                        </label>
                                        <input 
                                            name='promo_code'
                                            value={form.promo_code}
                                            onChange={onChange}
                                            type="text"
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <a href="#">
                                        <div className="forgot-password d-flex justify-content-end gap-3">
                                            <Link to="/">
                                                <p>Login here</p>
                                            </Link>
                                        </div>
                                    </a>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <div className="col-12">
                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-color-primary"
                                                type="submit"
                                                disabled={isLoading && 'disabled'}
                                            >
                                                {
                                                isLoading ?
                                                <Fragment>
                                                    <span class="spinner-border spinner-border-sm me-1  " role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </Fragment> :
                                                    'Search'
                                                }
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
                                        
                                        <div 
                                            className="text-center mt-3"
                                            style={{ 
                                            fontSize: '12px'
                                            }}
                                        >
                                            <span>Dengan ini, Anda menyetujui syarat & ketentuan serta </span> 
                                            <span 
                                                style={{ 
                                                    color: '#266BAF',
                                                    cursor: 'pointer'
                                                }} 
                                                data-bs-toggle="modal" data-bs-target="#privacyModal"
                                                >
                                                Privacy E-Warranty {' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ModalPrivacy />
                    
                </div>
            </div>

        </div>

    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      customer_login: state.CUSTOMER_LOGIN,
      admin_login: state.ADMIN_LOGIN
    }
}
export default withRouter(connect(mapStateToProps, null)(SearchPromo))