import axios from "axios";
import { decode } from "base-64";
import { Modal } from "bootstrap";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router";
import AlertModal from "../../alertModal/AlertModal";
import './RegisterOtp.css'

const RegisterOtp = (props) => {
    const history = useHistory()

    const { userID, phoneNumber } = useParams()
    const [errorData, setErrorData] = useState({
        otp: ''
    })
    const [otp, setOtp] = useState('')
    const [alertTitle, setAlertTitle] = useState({
        status: 'success',
        title: 'Success',
        subTitle: 'Your account has been successfully registered and activated. please login to your account'
    })

    const [ minutes, setMinutes ] = useState(0);
    const [seconds, setSeconds ] =  useState(0);
    // var date1 = window.localStorage.getItem("date");
    // console.log(date1)

    // let d2 = new Date(d1)
    // let newTime = d2.setMinutes(d1.getMinutes() + 5);
    // console.log(newTime - d1)

    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    });

    const handleChangeInput = (e) => {
        setOtp(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(otp !== '') {
            let formData = new FormData()
            console.log(otp)
            let userIdDecode = decode(userID)
            formData.append('otp', otp)
            formData.append('userId', userIdDecode)

            await axios.post(props.base_url + 'register/otp', formData)
            .then((res) => {
                let idModal = document.getElementById('alertModal')
                let alertModal = new Modal(idModal);
                alertModal.show();
                idModal.addEventListener('hide.bs.modal', function (event) {
                    history.push('/')
                })
            }).catch((err) => {
                // console.log(err.response)
                if(err.response !== undefined) {
                    let responError = err.response.data.errors
                    if(responError !== undefined) {
                        if(responError.location === 'otp') {
                            setErrorData({
                                ...errorData,
                                otp:  err.response.data.message
                            })
                        }
                    } else {
                        console.log(err.response)
                    }   
                }
            })
        } else {
            setErrorData({
                otp: 'verification code is not the same'
            })
        }
    }

    return (
        <div>
            <div className="text-center">
                <p className="fw-bold fs-4">Enter Verification Code</p>
                <div>
                    <span className="font-size-15">
                        {" "}
                        We have just sent a verification code to{" "}
                    </span>
                    <span className="fw-bold font-size-15"> +{decode(phoneNumber)} </span>
                </div>

                <div className="mt-5">
                    <div>
                        <span>Time remaining</span>
                        <span className="text-danger"> {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="m-4">
                            <div className="mb-6 text-center col-lg-3 col-md-5 col-12 m-auto">
                                <div id="otp-register" className="d-flex justify-content-center">
                                    <input
                                        className="m-2 text-center form-control form-control-solid"
                                        type="text"
                                        name="otp"
                                        max="999999"
                                        onChange={handleChangeInput}
                                    />
                                </div>
                                <div className="text-danger" style={{ fontSize: "13px" }}>
                                    { errorData.otp }
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-color-primary px-5 mb-2" type="submit">
                                Submit
                            </button>
                            <p className="send-code-button">Send the code again</p>
                        </div>
                    </form>
                </div>
            </div>
            <AlertModal data={alertTitle}/>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}
export default connect(mapStateToProps, null) (RegisterOtp)