import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Quagga from 'quagga';
import './CameraScan.css';
import axios from 'axios';
import { getToken } from '../../../action/action';
import { connect, useDispatch } from 'react-redux';

const CameraScan = (props) => {
  const firstUpdate = useRef(true);
  const [data, setData] = React.useState([]);
  const [barcode, setBarcode] = useState('');
  const [inputBarcodeNumber, setInputBarcodeNumber] = useState(false);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    tempSearch: '',
    isSearch: false,
  });

  useEffect(() => {
    return () => {
      if (props.cameraStatus) stopScanner();
    };
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      const request = await axios
        .post(
          props.gtm_url + 'pmtcommondata/GetProductListByCondition',
          {
            Barcode: barcode,
            ProductID: '',
            ProductName: '',
          },
          {
            headers: {
              Authorization: props.token,
              'Content-Type': 'text/plain',
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
          console.log(res.data.data);
        })
        .catch((e) => {
          dispatch(getToken());

          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log('request : ' + e.request);
          } else {
            console.log('message : ' + e.message);
          }
        });
      return request;
    }
    if (barcode !== '') {
      fetchData();
    }
  }, [props.token, barcode]);

  useEffect(() => {
    const timeOutId = setTimeout(() => setBarcode(state.tempSearch), 300);
    return () => clearTimeout(timeOutId);
  }, [state.tempSearch]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (props.cameraStatus) startScanner();
    else stopScanner();
  }, [props.cameraStatus]);

  const _onDetected = (res) => {
    stopScanner();
    setIsStart();
    setBarcode(res.codeResult.code);
  };

  const setIsStart = () => {
    props.onChangeCameraStatus(!props.cameraStatus);
    setInputBarcodeNumber(false);
  };

  const startScanner = () => {
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
  };

  const handleManualInput = () => {
    setInputBarcodeNumber(true);
    props.onChangeCameraStatus(false);
  };

  return (
    <div
      className="modal fade"
      id="cameraScan"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-scan">
          <div className="modal-body">
            <div className="d-flex justify-content-end cursor-pointer">
              <span
                className="material-icons md-36 color-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => props.onChangeCameraStatus(false)}
              >
                cancel
              </span>
            </div>
            <div className="manual-scan px-lg-4">
              <p className="title text-center mb-4">Search Your Product</p>

              <div className="camera-scan text-center">
                {!props.cameraStatus && (
                  <button
                    onClick={setIsStart}
                    style={{ marginBottom: 20 }}
                    className="btn btn-color-primary btn-play mt-3"
                  >
                    Retry
                  </button>
                )}
                {props.cameraStatus && (
                  <React.Fragment>
                    <div className="col-lg-12">
                      <div className="d-flex justify-content-center">
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
                    </div>
                  </React.Fragment>
                )}
              </div>

              <div className="mb-4">
                <div className="mb-4">
                  <label htmlFor="barcode-number" className="form-label">
                    Barcode Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="barcode-number"
                    onChange={(e) =>
                      setState({ ...state, ['tempSearch']: e.target.value })
                    }
                    placeholder="name@example.com"
                    disabled={inputBarcodeNumber ? '' : 'disabled'}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="product_name" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product_name"
                    placeholder="name@example.com"
                    value={data.length === 0 ? '' : data[0].ProductName}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="brand" className="form-label">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    placeholder="name@example.com"
                    value={data.length === 0 ? '' : data[0].Brand}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <Link to={'/product/register-product/' + barcode}>
                  <div className="d-grid gap-2">
                    <button className="btn btn-color-primary btn-detail">
                      Detail
                    </button>
                  </div>
                </Link>

                <div className="my-4">
                  <div className="border-center">
                    <span>or</span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-color-outline-primary btn-detail"
                    onClick={handleManualInput}
                  >
                    Manual Input
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    token: state.GTM_TOKEN,
  };
};

const mapPropsToState = (dispatch) => ({
  createToken: () => dispatch({ type: 'GET_TOKEN' }),
});

export default connect(mapStateToProps, mapPropsToState)(CameraScan);
