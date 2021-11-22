import React, { Component } from "react";
import './UserRegisterProduct.css';

class UserRegisterProduct extends Component
{
    render() {
        return (
            <div className="user-register-product mb-5">
                <div className="container-fluid">
                    <div className="col-lg-11 m-auto pt-lg-0 pt-1">
                        <div className="head-product">
                            <p>Product Register</p>
                        </div>
                    </div>

                    <div className="col-lg-8 m-auto mt-3">
                        <div className="title">
                            <p>Data Product</p>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="barcode" className="form-label">Barcode</label>
                                    <input type="text" className="form-control form-control-lg" id="barcode" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="product-id" className="form-label">Product ID</label>
                                    <input type="text" className="form-control form-control-lg" id="product-id" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="brand" className="form-label">Brand</label>
                                    <input type="text" className="form-control form-control-lg" id="brand" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="product" className="form-label">Product</label>
                                    <input type="text" className="form-control form-control-lg" id="product" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="product-model" className="form-label">Product Model</label>
                                    <input type="text" className="form-control form-control-lg" id="product-model" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="serial-number" className="form-label">Serial Number</label>
                                    <input type="text" className="form-control form-control-lg" id="serial-number" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="date-purchase" className="form-label">Date of Purchase</label>
                                    <input type="date" className="form-control form-control-lg"  id="date-purchase" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-lg-5 mb-4">
                                    <label htmlFor="store-location" className="form-label">Store Location</label>
                                    <input type="text" className="form-control form-control-lg" id="store-location" />
                                </div>
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-color-primary py-lg-3 btn-submit" >Product Registration</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserRegisterProduct;