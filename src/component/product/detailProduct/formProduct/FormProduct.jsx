import React, { Component } from "react";
import './FormProduct.css'

class FormProduct extends Component 
{
    render () {
        return (
            <div className="px-lg-5 px-1 py-5 mb-5 detail-product">
                <p className="title">Product Detail</p>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="barcode" className="form-label">Barcode</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="barcode"
                                    value={this.props.data.barcode}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product-id" className="form-label">Product ID</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="product-id" 
                                    value={this.props.data.product_id}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="brand" className="form-label">Brand</label>
                                <input type="text" className="form-control form-control-lg" id="brand" />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product" className="form-label">Product</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="product" 
                                    value={this.props.data.product_name}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product-model" className="form-label">Product Model</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="product-model" 
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="serial-number" className="form-label">Serial Number</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="serial-number" 
                                    value={this.props.data.serial_number}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="date-purchase" className="form-label">Date of Purchase</label>
                                <input type="date" className="form-control form-control-lg"  id="date-purchase" />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="store-name" className="form-label">Store Name</label>
                                <input type="text" className="form-control form-control-lg" id="store-name" />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-4">
                                <label htmlFor="store-location" className="form-label">Store Location</label>
                                <input type="text" className="form-control form-control-lg" id="store-location" />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-lg-6">
                                <div>
                                    <label htmlFor="visit-date" className="form-label">Visit Date</label>
                                    <input type="date" className="form-control form-control-lg" id="visit-date" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div>
                                    <label htmlFor="reapair-visit" className="form-label">Visit Hours</label>
                                    <select className="form-select form-select-lg" aria-label="Default select example">
                                        <option value="1">12:00-14:00</option>
                                        <option value="2">10:00-14:00</option>
                                        <option value="3">14:00-16:00</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-12 mt-2">
                                <p className="text-danger" style={{ fontSize: "13px", lineHeight: 1.3}}>
                                    Catatan: Pilihan Tanggal Kunjungan Perbaikan hanya untuk referensi Anda dan tunduk pada waktu pemrosesan internal kami. Kami akan berusaha untuk menghubungi Anda sesuai dengan pilihan tanggal kunjungan perbaikan Anda.
                                </p>
                            </div>
                        </div>


                        <div className="col-lg-12">
                            <div className="mb-2">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className="form-control form-control-lg" id="description" rows="5"></textarea>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Dapatkah kami menghubungi Anda menggunakan WhatsApp kedepannya. 
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-color-primary py-3 btn-submit" >Service Registration</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormProduct;