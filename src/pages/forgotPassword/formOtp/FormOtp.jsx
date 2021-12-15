import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import './FormOtp.css'
import { useParams, useHistory } from "react-router-dom";
import { decode, encode } from "base-64";

const FormOtp = (props) => {
    const history = useHistory()
    const [errorData, setErrorData] = useState({
        otp: '',
        anyError: ''
    })
    const [otp, setOtp] = useState('')
    const { userID, createdAt } = useParams()
    const onChangeInput = (e) => {
        setOtp(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let userIdDecode = decode(userID)
        let formData = new FormData()
        formData.append('otp', otp)
        formData.append('userId', userIdDecode)

        await axios.post(props.base_url + 'forgot-password/otp', formData).then((res) => {
            let secureToken = encode(res.data.data.secureToken)
            history.push('/reset-password/' + userID + '/' + secureToken)
        }).catch((err) => {
            if(err.response !== undefined) {
                let responError = err.response.data.errors
                if(responError !== undefined) {
                    if(responError.location === 'otp') {
                        setErrorData({
                            ...errorData,
                            otp: responError.reason
                        })
                    }
                } else {
                    console.log(err.response)
                }   
            }
        })

    }

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
        <div className="container form-otp">
            <div className="col-lg-4 mx-auto" >
                <div className="card">
                    <div className="card-body">
                        <div className="text-center header">
                            <div className="title">
                                Enter Verification Code
                            </div>
                            <div className="sub-title">
                                The verification code has been sent via sms to the number
                            </div>
                            <div 
                                className="mt-3"
                                style={{ fontSize: '13px' }}
                            >
                                <span>Time remaining</span>
                                <span className="text-danger"> {timerComponents.length ? timerComponents : "00:00"} </span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div class="mb-3 mt-2">
                                <input
                                    type="number"
                                    class={`form-control ${errorData.otp !== '' ? 'is-invalid' : null}`}
                                    placeholder="Verification Code"
                                    onChange={onChangeInput}
                                />
                                <div className="invalid-feedback">
                                    { errorData.otp }
                                </div>
                            </div>
                            <div class="d-grid gap-2 mb-3 mt-4">
                                <button 
                                    class="btn btn-color-primary" 
                                    type="submit"
                                >
                                    Verification
                                </button>
                                <span className="send-code-button" onClick={handleResendOtp}>Send the code again</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}

export default  connect(mapStateToProps) (FormOtp)