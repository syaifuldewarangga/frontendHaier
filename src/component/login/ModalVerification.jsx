import React, { Component } from "react";
import "./ModalVerification.css";

class ModalVerification extends Component {
  componentDidMount() {
    Coba();
  }
  render() {
    return (
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "30px" }}>
            <div className="modal-body">
              <div className="d-flex justify-content-end cursor-pointer">
                <span
                  className="material-icons md-36 color-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  cancel
                </span>
              </div>
              <div className="text-center m-5">
                <p className="fw-bold fs-4">Enter Verification Code</p>
                <div>
                  <span className="font-size-15">
                    {" "}
                    We have just sent a verification code to{" "}
                  </span>
                  <span className="fw-bold font-size-15"> +62********066 </span>
                </div>

                <div className="mt-5">
                  <div>
                    <span>Time remaining</span>
                    <span className="text-danger"> 00:30</span>
                  </div>
                  <div className="m-4">
                    <form>
                      <div className="mb-6 text-center">
                        <div id="otp" className="d-flex justify-content-center">
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="first"
                            maxLength="1"
                          />
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="second"
                            maxLength="1"
                          />
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="third"
                            maxLength="1"
                          />
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="fourth"
                            maxLength="1"
                          />
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="fifth"
                            maxLength="1"
                          />
                          <input
                            className="m-2 text-center form-control form-control-solid rounded-circle"
                            type="text"
                            id="sixth"
                            maxLength="1"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div>
                    <a href="/landing-page">
                      <button className="btn btn-color-primary px-5 mb-2">
                        Submit
                      </button>
                    </a>
                    <p className="send-code-button">Send the code again</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Coba = () => {
  const inputs = document.querySelectorAll("#otp > *[id]");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("keydown", function (event) {
        if (event.key === "Backspace") {
            inputs[i].value = "";
            if (i !== 0) inputs[i - 1].focus();
        } else {
            if (i === inputs.length - 1 && inputs[i].value !== "") {
                return true;
            } else if (event.keyCode > 47 && event.keyCode < 58) {
                inputs[i].value = event.key;
                if (i !== inputs.length - 1) inputs[i + 1].focus();
                event.preventDefault();
            } else if (event.keyCode > 64 && event.keyCode < 91) {
                inputs[i].value = String.fromCharCode(event.keyCode);
                if (i !== inputs.length - 1) inputs[i + 1].focus();
                event.preventDefault();
            }
        }
    });
  }
};

export default ModalVerification;
