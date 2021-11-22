import React, { Component } from "react";
import { Link } from "react-router-dom";
import './LoginMenu.css'

class LoginMenu extends Component {
    render() {
        return (
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <a href="https://aquajapanid.com" target="_blank">
                        <img src="/assets/images/logo.png" className="img-responsive col-9 col-lg-12" alt="logo-aqua-japan" />
                    </a>
                </div>
                <div className="right-menu">
                    <div className="logo-quina-login">
                        <img src="/logo-quina.png" alt="logo-quina" className="img-responsive"/>
                    </div>
                    {/* <Link 
                        to="/" 
                        className={`pe-5 ${window.location.pathname === "/" ? "active" : ""}` }
                    > 
                        Sign In
                    </Link>
                    <Link 
                        to="/register"
                        className={ window.location.pathname === "/register" ? "active" : "" }
                    >
                        Sign Up
                    </Link> */}
                </div>
            </div>
        );
    }
}

export default LoginMenu;