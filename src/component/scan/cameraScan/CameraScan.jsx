import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Quagga from 'quagga';
import './CameraScan.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { client_id, client_secret, grant_type } from '../../../variable';
import { useTranslation } from 'react-i18next';

const CameraScan = (props) => {
  const { t } = useTranslation('common');
  const firstUpdate = useRef(true);
  const [data, setData] = React.useState([]);
  const [barcode, setBarcode] = useState('');
  const [inputBarcodeNumber, setInputBarcodeNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false) 

  useEffect(() => {
    return () => {
      if (props.cameraStatus) stopScanner();
    };
  }, []);

  const productAPIGTM = async (gtmToken) => {
    await axios.post(props.gtm_url + 'pmtcommondata/GetProfileUserByCondition', {
        Barcode: barcode,
        ProductID: '',
        PhoneNumber: '',
      },
      {
        headers: {
          Authorization: gtmToken,
          'Content-Type': 'text/plain',
        },
      }
    )
    .then((res) => {
      let count = res.data.data.length
      if(count > 0) {
        setData(res.data.data[0]);
      } else {
        // setData('')
        fetchDataProductWMS()
      }
    })
    .catch((e) => {
      console.log(e.response)
    }).finally(() => {
      setIsLoading(false)
    });
  }

  const fetchDataProductWMS = async () => {
    await axios.get(props.oapi_url + 'wms-order-out', {
      params: {
        barcode: barcode
      }
    }).then((res) => {
      let data = res.data
      let count = Object.keys(data).length
      if(count > 0) {
        setData({
          Barcode: data.BARCODE,
          ProductName: data.PRODUCT_DESC_ZH
        })
      } else {
        setData('')
      }
    })
  }

  const fetchDataProductGTM = async () => {
    await axios.post(props.gtm_token_url, {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: grant_type,
    }).then((res) => {
      const token = res.data.access_token
      productAPIGTM(token)
    }).catch((err) => {
      console.log(err.response)
    })
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (barcode !== '') {
        setIsLoading(true)
        fetchDataProductGTM();
      } else {
        setData('')
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [barcode]);

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
              <p className="title text-center mb-4">{t('product_register.search_barcode')}</p>

              <div className="camera-scan text-center">
                {!props.cameraStatus && (
                  <button
                    onClick={setIsStart}
                    style={{ marginBottom: 20 }}
                    className="btn btn-color-primary btn-play mt-3"
                  >
                    {t('product_register.retry')}
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
                  {t('product_register.barcode_number')}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="barcode-number"
                    onChange={(e) =>
                      setBarcode(e.target.value)
                    }
                    placeholder="name@example.com"
                    disabled={inputBarcodeNumber ? '' : 'disabled'}
                    value={barcode}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="product_name" className="form-label">
                  {t('product_register.product_name')}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="product_name"
                    placeholder="name@example.com"
                    value={
                      data.length === 0 ? '' : data.ProductName
                    }
                    disabled
                  />
                </div>

                {/* <div className="mb-4">
                  <label htmlFor="brand" className="form-label">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    placeholder="name@example.com"
                    value={data.length === 0 ? '' : data.Brand}
                    disabled
                  />
                </div> */}
              </div>

              <div className="mb-3">
                {data.length === 0 ? (
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-color-primary btn-detail"
                      disabled
                    >
                        {
                          isLoading ? 
                          <Fragment>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading...
                          </Fragment> :
                          'Detail'
                        }
                    </button>
                    <span 
                      className="text-danger"
                      style={{ 
                        fontSize: '12px'
                      }}
                    >
                      <div className='text-center'>
                        {t('product_register.alert')}
                        {' '}
                        <a href='http://wa.me/6285810003003'>wa.me/6285810003003</a>
                      </div>
                    </span>
                  </div>
                ) : (
                  <Link to={'/product/register-product/' + data.Barcode}>
                    <div className="d-grid gap-2">
                      <button className="btn btn-color-primary btn-detail">
                        Detail
                      </button>
                    </div>
                  </Link>
                )}

                <div className="my-4">
                  <div className="border-center">
                    <span>{t('product_register.or')}</span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-color-outline-primary btn-detail"
                    onClick={handleManualInput}
                  >
                    {t('product_register.manual_input')}
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
    gtm_token_url: state.GTM_TOKEN_URL,
    oapi_url: state.OAPI_URL
  };
};

export default connect(mapStateToProps, null)(CameraScan);
