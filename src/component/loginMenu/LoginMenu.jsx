import React, { Component } from "react";
import { Link } from "react-router-dom";
import './LoginMenu.css'

class LoginMenu extends Component {
    render() {
        return (
            <div className="d-flex justify-content-between align-items-center">
                <div className="right-menu">
                <a href="https://aquajapanid.com" target="_blank">
                        <img src="/assets/images/logo.png" style={{ height: 100 }} className="img-responsive col-9 col-lg-12" alt="logo-aqua-japan" />
                    </a>
                </div>
            </div>
        );
    }
}

export default LoginMenu;