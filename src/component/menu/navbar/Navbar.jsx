import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import './Navbar.css';



function Navbar(props) {
  const {t, i18n} = useTranslation('common');

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href="#"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ textDecoration: "none" }}
    >
      {children}
    </Link>
  ));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    props.history.push('/');
  };
  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }
  return (
    <div className="sidebar">
      <div className="navbar-bottom">
        <nav className="navbar navbar-expand-xl navbar-light navbar-custom fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <a
              href="https://aquajapanid.com/"
              className="navbar-brand d-block d-xl-none"
              target="_blank"
            >
              <img src="/assets/images/logo.png" alt="" height="35" />
            </a>
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div className="offcanvas-header">
                {/* <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5> */}
                <a href="https://aquajapanid.com/" target="_blank">
                  <div className="navbar-logo">
                    <img
                      src="/assets/images/logo.png"
                      className="img-responsive logo-menu"
                      style={{ width: '65px' }}
                      alt="aqua japan logo"
                    />
                  </div>
                </a>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav me-auto mb-lg-0 ps-xl-5 d-flex align-items-xl-center">
                  <li className="nav-item">
                    <Link className="nav-link" to="/landing-page">
                      {(t('navbar.home'))}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/shop-list">
                      {t('navbar.find_store')}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/service-center-list">
                      {(t('navbar.service_center'))}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/customer-voice">
                      {(t('navbar.customer_voice'))}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/service-status">
                      {(t('navbar.status_service'))}
                    </Link>
                  </li>
                </ul>
                <a href="https://aquajapanid.com/" target="_blank">
                  <div className="d-none d-xl-block navbar-logo">
                    <img
                      src="/assets/images/logo.png"
                      className="img-responsive logo-menu"
                      alt="aqua japan laogo"
                    />
                  </div>
                </a>
                <ul className="navbar-nav mb-2 mb-lg-0 ms-auto pe-lg-5 d-flex align-items-xl-center">
                  <li className="nav-item">
                    <Link className="nav-link" to="/blog/list">
                      {(t('navbar.promo_news_article'))}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      {(t('navbar.about'))}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      {(t('navbar.contact'))}
                    </Link>
                  </li>

                  <li className="nav-item d-xl-block d-xl-none">
                    <Link className="nav-link" to="/profile">
                      {(t('navbar.profile'))}
                    </Link>
                  </li>

                  <li className="nav-item d-xl-blog d-xl-none">
                    <span className="nav-link" onClick={handleLogout} style={{ cursor: "pointer" }}>
                      {(t('navbar.logout'))}
                    </span>
                  </li>
                  <li className="nav-item dropdown language-select">
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        <div className="nav-link d-flex align-items-center">
                          <span className="material-icons"> expand_more </span>
                          {
                            localStorage.getItem('language') === 'en' ?
                            <div>
                              <span className="pe-2">EN</span>
                              <img src="/assets/images/america.png" className="img-responsive" alt="america flag" />
                            </div>
                            : 
                            <div>
                              <span className="pe-2">IND</span>
                              <img src="/assets/images/indonesia.png" className="img-responsive" alt="indonesia flag" />
                            </div>
                          }
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#" onClick={() => changeLanguage('id')}>
                          <span className="pe-2">IND</span>
                          <img src="/assets/images/indonesia.png" className="img-responsive" alt="indonesia flag" />
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => changeLanguage('en')}>
                          <span className="pe-2">EN</span>
                          <img src="/assets/images/america.png" className="img-responsive" alt="america flag" />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <ul className="nav-item dropdown d-flex align-items-center user-menu d-none d-xl-block">
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        <div className="nav-link d-flex align-items-center">
                          <span className="material-icons"> expand_more </span>
                          <span className="font-size-13">
                            {props.user.fullname}
                          </span>
                          <img
                            src={props.user.photo !== '' ? props.image_url +""+ props.user.photo : '/assets/images/user.png'}
                            className="img-responsive rounded-circle user-image"
                            alt="profile"
                          />
                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="/profile">
                          <img
                            src={props.user.photo !== '' ? props.image_url +""+ props.user.photo : '/assets/images/user.png'}
                            className="img-responsive rounded-circle"
                            height="15px"
                            width="15px"
                            alt="user"
                          />
                          <span className="ms-2">{t('navbar.profile')}</span>
                        </Dropdown.Item>
                        <hr className="my-2" />
                        <Dropdown.Item onClick={handleLogout}>
                          <span>{t('navbar.logout')}</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.USER,
    image_url: state.URL
  };
};
export default withRouter(connect(mapStateToProps, null)(Navbar));
