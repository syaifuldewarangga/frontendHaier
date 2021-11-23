import React from "react";
import './DetailStatusService.css'

const DetailStatusService = (props) => {
    return (
        <div className="detail-status-service">
            <div className="container-fluid">
                <div className="px-lg-5">
                    <div className="px-lg-3">
                        <div className="service-menu-header py-lg-3 pt-3">
                            <p>Repair Service Detail</p>
                        </div>
                        <div className="d-lg-flex justify-content-center">
                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="text-center">
                                            <h4 className="title">Browse Repair Service</h4>
                                        </div>
                                        <div className="row mt-5">
                                            <div className="col-lg-6">
                                                <div className="card header-title-status">
                                                    <p className="text-uppercase">
                                                        Repair Status Service
                                                    </p>
                                                </div>
                                                <div className="content mt-4">
                                                    <div>
                                                        <h6>Request Date : </h6>
                                                        <p>12-10-2021 11:45:09</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card header-title-status">
                                                    <p className="text-uppercase">
                                                        Informasi Product
                                                    </p>
                                                </div>
                                                <div className="content mt-4">
                                                    <div>
                                                        <h6>Product </h6>
                                                        <p>Kulkas 2 Pintu</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h6>Model </h6>
                                                        <p>Aqua Japan</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h6>Serial Number </h6>
                                                        <p>1234567890ASD</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h6>Date of Purchase </h6>
                                                        <p>09-01-2021</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-body header-title-status">
                                                        <div>
                                                            <h5 style={{ color: "#8D8D8D" }}>Status Information</h5>
                                                        </div>
                                                        <div style={{ overflowX: "auto" }}>
                                                            <table className="table table-white mt-3">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Number</th>
                                                                        <th scope="col">Status</th>
                                                                        <th scope="col">Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-nowrap">012121</td>
                                                                        <td className="text-nowrap">Received by Service Partner</td>
                                                                        <td className="text-nowrap">11-13-2021 16:29:00</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-nowrap">012121</td>
                                                                        <td className="text-nowrap">Received by Service Partner</td>
                                                                        <td className="text-nowrap">11-13-2021 16:29:00</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-nowrap">012121</td>
                                                                        <td className="text-nowrap">Received by Service Partner</td>
                                                                        <td className="text-nowrap">11-13-2021 16:29:00</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailStatusService