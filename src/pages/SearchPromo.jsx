import { Button } from 'bootstrap'
import Quagga from 'quagga';
import React, { useState } from 'react'
import { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import LoginCover from '../component/login/LoginCover'
import ModalPrivacy from '../component/login/ModalPrivacy'
import LoginMenu from '../component/loginMenu/LoginMenu';

const SearchPromo = () => {
  const [form, setForm] = useState({
    promo_code: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const onChange = (e) => {
    if(e.target.name =='promo_code'){
        setForm({
            ...form,
            email: '',
            [e.target.name]: e.target.value,
        })
    }
    if(e.target.name =='email'){
        setForm({
            ...form,
            promo_code: '',
            [e.target.name]: e.target.value,
        })
    }
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
        setIsLoading(false)
    }, 500);
  }

  const _onDetected = (res) => {
    stopScanner();
    setIsStart();
    setIsScan(false)
    setForm({
        ...form,
        promo_code: res.codeResult.code,
        email: ''
    })
  };

  const [isScan, setIsScan] = useState(false)
  const [inputBarcodeNumber, setInputBarcodeNumber] = useState(false);
  const setIsStart = () => {
    setInputBarcodeNumber(false);
  };

  const startScanner = () => {
    setIsScan(true)
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'environment', // or user
          },
        },
        numOfWorkers: navigator.hardwareConcurrency,
        locate: true,
        frequency: 1,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
        multiple: false,
        locator: {
          halfSample: false,
          patchSize: 'large', // x-small, small, medium, large, x-large
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: false,
              showTransformedBox: false,
              showBB: false,
            },
          },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader',
            'i2of5_reader',
            '2of5_reader',
            'code_93_reader',
          ],
        },
      },
      (err) => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(_onDetected);
    Quagga.onProcessed((result) => {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height'))
          );
          // result.boxes.filter(box => box !== result.box).forEach(box => {
          //     Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
          //         color: 'green',
          //         lineWidth: 2
          //     });
          // });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: '#00F',
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: 'x', y: 'y' },
            drawingCtx,
            { color: 'red', lineWidth: 3 }
          );
        }
      }
    });
  };

  const stopScanner = () => {
    Quagga.offProcessed();
    Quagga.offDetected();
    Quagga.stop();
    setIsScan(false)
    const scan = document.querySelector('#scanner-container')
    const temp = document.querySelector('.backgroundScan')
    while (scan.hasChildNodes()) {
        scan.removeChild(scan.firstChild);
    }
    scan.appendChild(temp)
  };
  return (
    <div className='row'>
        <LoginCover />
        <div className="col-md-6">
            <div className="card border-0">
                <div className="card-body p3 p-lg-5 right-content">
                    <LoginMenu />
                    <div className="d-flex justify-content-center form-content">
                        <div className="col-11 col-lg-7">
                            <form onSubmit={onSubmit}>
                                <div className="md-3">
                                    <div id="scanner-container">
                                        <div className="backgroundScan">
                                            <marquee
                                                className="background-line-scan"
                                                direction="up"
                                                behavior="ALTERNATE"
                                            >
                                            <div className="line-scan"></div>
                                            </marquee>
                                        </div>
                                    </div>
                                </div>
                                <div className="md-3">
                                    <div className="position-relative mb-4">
                                        <label
                                            htmlFor="exampleFormControlInput1"
                                            className="form-label color-primary d-flex justify-content-between"
                                        >
                                            Promo Code
                                            
                                            <button 
                                                type='button' 
                                                className='btn btn-sm btn-outline-primary mr-auto' 
                                                onClick={isScan ? stopScanner : startScanner}
                                            >
                                                {isScan ? 'Stop Scan' : 'Scan Promo Barcode'}   
                                            </button>
                                        </label>
                                        <input 
                                            name='promo_code'
                                            value={form.promo_code}
                                            onChange={onChange}
                                            type="text"
                                            className='form-control'
                                        />
                                    </div>
                                    <p>Or</p>
                                    <div className="position-relative mb-4">
                                        <label
                                            htmlFor="exampleFormControlInput1"
                                            className="form-label color-primary"
                                        >
                                            Email Address
                                        </label>
                                        <input 
                                            name='email'
                                            value={form.email}
                                            onChange={onChange}
                                            type="text"
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <a href="#">
                                        <div className="forgot-password d-flex justify-content-end gap-3">
                                            <Link to="/">
                                                <p>Login here</p>
                                            </Link>
                                        </div>
                                    </a>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <div className="col-12">
                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-color-primary"
                                                type="submit"
                                                disabled={isLoading && 'disabled'}
                                            >
                                                {
                                                isLoading ?
                                                <Fragment>
                                                    <span className="spinner-border spinner-border-sm me-1  " role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </Fragment> :
                                                    'Search'
                                                }
                                            </button>
                                        </div>

                                        <div
                                        className="pt-3"
                                        style={{ fontSize: '14px', fontWeight: '600' }}
                                        >
                                            <span>Not registered yet? </span>
                                            <Link to="/register">
                                                <span style={{ color: '#004D8B', cursor: 'pointer' }}>
                                                Create an Account
                                                </span>
                                            </Link>
                                        </div>
                                        
                                        <div 
                                            className="text-center mt-3"
                                            style={{ 
                                            fontSize: '12px'
                                            }}
                                        >
                                            <span>Dengan ini, Anda menyetujui syarat & ketentuan serta </span> 
                                            <span 
                                                style={{ 
                                                    color: '#266BAF',
                                                    cursor: 'pointer'
                                                }} 
                                                data-bs-toggle="modal" data-bs-target="#privacyModal"
                                                >
                                                Privacy E-Warranty {' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ModalPrivacy />
                    
                </div>
            </div>

        </div>

    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      customer_login: state.CUSTOMER_LOGIN,
      admin_login: state.ADMIN_LOGIN
    }
}
export default withRouter(connect(mapStateToProps, null)(SearchPromo))