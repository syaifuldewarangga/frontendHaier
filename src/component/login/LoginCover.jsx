import React, { Component } from "react"

class LoginCover extends Component 
{
    render() {
        return (
            <div className="col-lg-6 d-none d-lg-block">
                <div className="login-background">
                    <img src="/assets/images/bg-login.png" className="cover"/>
                </div>
            </div>
        );
    }
}

export default  LoginCover
