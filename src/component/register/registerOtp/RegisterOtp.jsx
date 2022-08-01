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

    const { userID, phoneNumber, createdAt } = useParams()
    const [errorData, setErrorData] = useState({
        otp: ''
    })
    const [otp, setOtp] = useState('')
    const [alertTitle, setAlertTitle] = useState({
        status: 'success',
        title: 'Success',
        subTitle: 'Your account has been successfully registered and activated. please login to your account'
    })
    
    const [ countdown, setCountdown ] = useState(new Date(decode(createdAt)));

    const calculateTimeLeft = () => {
        let resendTime = localStorage.getItem('countdown') !== null ? new Date(localStorage.getItem('countdown')) : null;
        let d1 = resendTime !== null ? resendTime : countdown
        let d2 = new Date(d1)
        d2.setMinutes(d1.getMinutes() + 5);
        let difference = d2 - new Date();
        // let difference = new Date(`10/01/2022`) - new Date();
      
        let timeLeft = {};
      
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
      
        return timeLeft;
    }
    
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      
        return () => clearTimeout(timer);
    });
    
    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval, index) => {
        if (!timeLeft[interval]) {
          return;
        }
        timerComponents.push(
          <span key={index}>
            {timeLeft[interval]} {index !== 3 && ' : ' }
          </span>
        );
    });

    // useEffect(()=>{
    //     let myInterval = setInterval(() => {
    //         if (seconds > 0) {
    //             setSeconds(seconds - 1);
    //         }
    //         if (seconds === 0) {
    //             if (minutes === 0) {
    //                 clearInterval(myInterval)
    //             } else {
    //                 setMinutes(minutes - 1);
    //                 setSeconds(59);
    //             }
    //         } 
    //     }, 1000)
    //     return ()=> {
    //         clearInterval(myInterval);
    //     };
    // });

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
    
    const handleResendOtp = () => {
        let formData = new FormData()
        formData.append('userId', decode(userID))
        axios.post(props.base_url + 'register/otp/resend', formData)
        .then(() => {
            let date = new Date()
            localStorage.setItem('countdown', date)
        })
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
                        <span className="text-danger"> {timerComponents.length ? timerComponents : "00:00"} </span>
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
                            <div>
                                <span className="send-code-button" onClick={handleResendOtp}>Send the code again</span>
                            </div>
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