import React, { Component } from "react";
import Chat from "../chat/Chat";
import './Footer.css'

class Footer extends Component 
{
    render () {
        return (
            <div className="footer">
                <div className="container-fluid d-flex justify-content-center">
                    <div className="col-lg-11 py-5">
                        <div className="row">
                            <div className="col-lg-3 col-12 d-flex justify-content-center justify-content-lg-start">
                                <div className="footer-logo col-7 pb-5 text-center">
                                    <img src="/assets/images/logo-white.png" className="img-fluid"/>
                                </div>
                            </div>

                            <div className="col-lg-2 col-12 d-flex justify-content-center justify-content-lg-start sosmed-icon">
                                <div className="mb-lg-5 mb-3 sosmed-position text-center">
                                    <p className="fw-bold">FOLLOW US</p>
                                    <div className="footer-sosmed">
                                        <img src="/assets/icon/instagram.svg" />
                                        <img src="/assets/icon/facebook.svg" />
                                        <img src="/assets/icon/youtube.svg" />
                                        <img src="/assets/icon/twitter.svg" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 mb-5 d-none d-lg-block">
                                <p className="fw-bold">SUBSRIPTION</p>
                                <div className="row">
                                    <div className="col-8">
                                        <input type="text" className="form-control inputSubscribe" placeholder="Enter your email"></input>
                                    </div>
                                    <div className="col-2 m-0">
                                        <button className="btn-subscribe">Subscribe</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 mb-5 d-flex justify-content-end align-items-center d-none d-lg-flex">
                                <div className="contact">
                                    <p className="m-0">SMS dan Whatsapp</p>
                                    <p className="m-0">0858-1000-3003</p>
                                </div>
                                <div className="ms-3">
                                    <img src="/assets/images/qrcode.jpg" className="img-fluid" style={{ width: "100px" }}/>
                                </div>
                            </div>

                            <div className="col-lg-3 mt-4 text-center text-lg-start">
                                <div className="pb-lg-4 pt-2">
                                    <p className="m-0">PT.Haier Sales Indonesia</p>
                                    <p className="m-0">Copyright @ 2021 AQUA JAPAN</p>
                                    <p className="m-0">All Right Reserved</p>
                                </div>

                                <div className="fw-bold pb-lg-4 pb-3 pt-5 pt-lg-1">
                                    HEAD OFFICE
                                </div>

                                <div>
                                    <p className="m-0">Jl. Danau Sunter Barat</p>
                                    <p className="m-0">Blog AIII No.38-39</p>
                                    <p className="m-0">Jakarta Utara 14350</p>
                                    <p className="m-0">Phone: +62 (21) 650-5668 (hunting)</p>
                                    <p className="m-0">Fax: +62 (21) 651-2556</p>
                                </div>
                            </div>

                            <div className="col-lg-2 text-center text-lg-start">
                                <div className="pt-5">
                                    <p className="fw-bold"> OUR PRODUCT </p>
                                </div>
                                <div className="footer-menu m-0">
                                    <ul>
                                        <li>
                                            <a href="#">KULKAS</a>
                                        </li>
                                        <li>
                                            <a href="#">MESIN CUCI</a>
                                        </li>
                                        <li>
                                            <a href="#">AC</a>
                                        </li>
                                        <li>
                                            <a href="#">TELEVISI</a>
                                        </li>
                                        <li>
                                            <a href="#">COLD CHAIN</a>
                                        </li>
                                        <li>
                                            <a href="#">SMALL DOMESTIC APPLIANCES</a>
                                        </li>
                                        <li>
                                            <a href="#">360 THEMATIC PRODUCT</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 text-center text-lg-start">
                                <p className="fw-bold pt-5"> PROMO, NEWS, & ARTICLE </p>
                                <div className="footer-menu m-0">
                                    <ul>
                                        <li>
                                            <a href="#">EDUCATIONAL SERIES</a>
                                        </li>
                                        <li>
                                            <a href="#">NEWS UPDATE</a>
                                        </li>
                                        <li>
                                            <a href="#">VIDEO WEB SERIES</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="col-lg-4 text-center text-lg-start">
                                <p className="fw-bold pt-5"> ONLINE STORE </p>
                                <div className="row shop-logo d-flex justify-content-center justify-content-lg-start">
                                    <img src="/assets/images/shop/tokped.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/shopee.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/akulaku.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/bukalapak.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/lazada.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/jdid.png" className="img-fluid"/>
                                    <img src="/assets/images/shop/blibli.png" className="img-fluid"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Chat />
            </div>
        )
    }
}

export default Footer;