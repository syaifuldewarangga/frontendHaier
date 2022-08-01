import React, { Component } from "react";
import LoginCover from "../../component/login/LoginCover";
import RegisterOtp from "../../component/register/registerOtp/RegisterOtp";

class RegisterOtpPage extends Component 
{
    render() {
        return (
            <div className="row">
                <LoginCover />
                <RegisterOtp />
            </div>
        );
    }
}

export default RegisterOtpPage;