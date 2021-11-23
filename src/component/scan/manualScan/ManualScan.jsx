import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ManualScan.css';
class ManualScan extends Component {
  render() {
    return (
      <div
        className="modal fade"
        id="manualScan"
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
                >
                  cancel
                </span>
              </div>
              <div className="manual-scan px-4">
                <p className="title text-center mb-4">
                  Search Your Productdfddf
                </p>
                <div className="search-code">
                  <div className="mb-4">
                    {/* <div className="addon">
                                        </div> */}
                    <span className="material-icons-outlined md-24 code-addon">
                      {' '}
                      search{' '}
                    </span>
                    <input
                      type="text"
                      className="form-control input-code"
                      placeholder="Input Barcode Number"
                    />
                  </div>
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
                      placeholder="name@example.com"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_id" className="form-label">
                      Product ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="product_id"
                      placeholder="name@example.com"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="status"
                      placeholder="name@example.com"
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <Link to="/product/register-product">
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

                  <Link to="/scaner">
                    <div className="d-grid gap-2">
                      <button className="btn btn-color-outline-primary btn-detail">
                        Find Barcode
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManualScan;
