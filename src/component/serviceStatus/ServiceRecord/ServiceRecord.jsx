import React, { Component } from "react";
import { Link } from "react-router-dom";
import './ServiceRecord.css'

const ProductCard = () => {
    return (
        <div className="col-lg-6 mb-5 col-12">
            <div className="list-status-product">
                <div className="row col-lg-12">
                    <div className="col-4 image">
                        <img src="/assets/images/product/product1.png" alt="" />
                    </div>
                    <div className="col-8">
                        <div className="product-title">
                            <p className="title">Kulkas 2 Pintu 317 Liter dengan Inverter, Digital Temperature Control, Tempered Glass Tray</p>
                        </div>
                        <table className="detail-status mt-2">
                            <tr>
                                <td>Registered Service</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>12-10-2021</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>
                                    <span className="text-success">Repair Finish</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Last Update</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>22-10-2021</td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <Link to="/service-status/detail/1">
                                        <button className="btn btn-sm btn-outline-primary mt-3">Tracking Status Sertice</button>
                                    </Link>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
class ServiceRecord extends Component {
    render () {

        return (
            <div className="service-record row justify-content-center">
                <div className="col-lg-8 ">
                    <div className="row">
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceRecord;