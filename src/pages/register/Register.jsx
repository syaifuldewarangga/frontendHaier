import React, { Component } from "react";
import LoginCover from "../../component/login/LoginCover";
import FormRegister from "../../component/register/FormRegister";

class Register extends Component 
{
    render() {
        return (
            <div className="row">
                {/* <LoginCover /> */}
                <FormRegister />
            </div>
        );
    }
}

export default Register;