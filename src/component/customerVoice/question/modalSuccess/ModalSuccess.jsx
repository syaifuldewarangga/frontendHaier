import React from "react";
import './ModalSuccess.css'
const ModalSuccess = () => {
    return (
        <div className="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div>
                            <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ display: "flex" }}>
                                <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                <span className="swal2-success-line-tip"></span>
                                <span className="swal2-success-line-long"></span>
                                <div className="swal2-success-ring"></div> 
                                <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                            </div>
                            <div className="text-center">
                                <span className="modal-question-thanks">Thank You! </span>
                                <span className="modal-question-message">Your response has been recorded</span>

                                <div className="modal-question-button my-3">
                                    <button className="btn rounded-pill" data-bs-dismiss="modal" aria-label="Close">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalSuccess