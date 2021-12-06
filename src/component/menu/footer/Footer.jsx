import axios from "axios";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Chat from "../chat/Chat";
import { Link } from 'react-router-dom';
import './Footer.css'

class Footer extends Component 
{
    constructor(props) {
        super(props)
        this.state = {
            contact: []
        }
    }

    
    getContactFromAPI = async () => {
        let token = localStorage.getItem('access_token');
        await axios.get(this.props.base_url + "contact", {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }).then((res) => {
            this.setState({
                contact: res.data
            })
        })
    }
    
    componentDidMount() {
        this.getContactFromAPI()
    }
    render () {
        const { t } = this.props
        return (
            <div className="footer">
                <div className="container d-flex justify-content-center">
                    <div className="py-5">
                        <div className="row">
                            <div className="col-lg-3 col-12">
                                <div className="d-flex justify-content-center justify-content-lg-start">
                                    <div className="footer-logo col-lg-7 pb-3 text-center">
                                        <img src="/assets/images/logo-white.png" className="img-fluid"/>
                                    </div>
                                </div>
                                <div className="text-center text-lg-start">
                                    <div className="pb-lg-4 pt-2 mb-4">
                                        <p className="m-0">PT.Haier Sales Indonesia</p>
                                        <p className="m-0">Copyright @ 2021 AQUA JAPAN</p>
                                        <p className="m-0">All Right Reserved</p>
                                    </div>
                                </div>
                                <div className="text-center text-lg-start">
                                    <div className="fw-bold pb-lg-2 pb-1 pt-4 pt-lg-1"> HEAD OFFICE </div>
                                    <div>
                                        <p className="m-0">{this.state.contact.address}</p>
                                        {/* <p className="m-0">Blog AIII No.38-39</p>
                                        <p className="m-0">Jakarta Utara 14350</p> */}
                                        <p className="m-0">Phone: { this.state.contact.phone }</p>
                                        <p className="m-0">Fax: { this.state.contact.fax }</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-12 text-center text-lg-start">
                                <div>
                                    <p className="fw-bold pb-lg-2 pb-1 pt-4 m-0"> AQUA JAPAN </p>
                                    <div className="footer-menu m-0">
                                        <ul>
                                            <li>
                                                <Link to="/shop-list" className="text-uppercase">{t('navbar.find_store')}</Link>
                                            </li>
                                            <li>
                                                <Link to="/service-center-list" className="text-uppercase">{t('navbar.service_center')}</Link>
                                            </li>
                                            <li>
                                                <Link to="/customer-voice" className="text-uppercase">{t('navbar.customer_voice')}</Link>
                                            </li>
                                            <li>
                                                <Link to="/service-status" className="text-uppercase">{t('navbar.status_service')}</Link>
                                            </li>
                                            <li>
                                                <Link to="/about" className="text-uppercase">{t('navbar.about')}</Link>
                                            </li>
                                            <li>
                                                <Link to="/contact" className="text-uppercase">{t('navbar.contact')}</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-lg-3">
                                    <Link to="/blog/list" style={{ color: 'inherit', textDecoration: 'none'}}>
                                        <p className="fw-bold pb-lg-2 pb-1 pt-3 m-0 text-uppercase"> {t('navbar.promo_news_article')} </p>
                                    </Link>
                                    <div className="footer-menu m-0">
                                        <ul>
                                            <li>
                                                <Link to="/blog/list/Educational Series">EDUCATIONAL SERIES</Link>
                                            </li>
                                            <li>
                                                <a href="/blog/list/News Update">NEWS UPDATE</a>
                                            </li>
                                            <li>
                                                <a href="/blog/list/Video Web Series">VIDEO WEB SERIES</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-12 text-center text-lg-start">
                                <p className="fw-bold pb-lg-2 pb-1 pt-3 m-0 text-uppercase"> {t('footer.our_product')} </p> 
                                <div className="footer-menu m-0">
                                    <ul>
                                        <li>
                                            <a href="https://aquajapanid.com/product/6/REFRIGERATOR" target="_blank">KULKAS</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/11/WASHING+MACHINE" target="_blank">MESIN CUCI</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/17/AIR+CONDITIONER" target="_blank">AC</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/22/TELEVISION" target="_blank">TELEVISI</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/25/COLD+CHAIN" target="_blank">COLD CHAIN</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/30/SMALL+DOMESTIC+APPLIANCES" target="_blank">SMALL DOMESTIC APPLIANCES</a>
                                        </li>
                                        <li>
                                            <a href="https://aquajapanid.com/product/tematic/1/TEMATHIC+PRODUCT" target="_blank">360 THEMATIC PRODUCT</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-12 text-center text-lg-start">
                                <div>
                                    <div className="mb-lg-5 mb-3 sosmed-position">
                                        <p className="fw-bold m-0 pt-3 mb-2 text-uppercase">{t('footer.follow_us')}</p>
                                        <div className="footer-sosmed">
                                            <a href="https://www.instagram.com/aquajapanid/" target="_blank">
                                                <img src="/assets/icon/instagram.svg" alt="instagram"/>
                                            </a>
                                            <a href="https://www.facebook.com/aquajapanid/?_rdc=2&_rdr" target="_blank">
                                                <img src="/assets/icon/facebook.svg" alt="facebook"/>
                                            </a>

                                            <a href="https://www.youtube.com/channel/UC8FuwvMchOEHIpqyyLV5EWg" target="_blank">
                                                <img src="/assets/icon/youtube.svg" alt="youtube"/>
                                            </a>
                                            <a href="https://twitter.com/aquajapan_id" target="_blank">
                                                <img src="/assets/icon/twitter.svg" className="rm-margin" alt="twitter" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="fw-bold pb-lg-3 pb-3 pt-4 m-0 text-uppercase"> {t('footer.online_shop')}</p>
                                    <div className="shop-logo">
                                        <a href="https://www.tokopedia.com/aquajapanofficia" target="_blank">
                                            <img src="/assets/images/shop/tokped.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="https://shopee.co.id/aquajapanofficial" target="_blank">
                                            <img src="/assets/images/shop/shopee.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="#">
                                            <img src="/assets/images/shop/akulaku.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="https://www.bukalapak.com/aqua-japan-official" target="_blank">
                                            <img src="/assets/images/shop/bukalapak.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="https://www.lazada.co.id/shop/aqua-japan" target="_blank">
                                            <img src="/assets/images/shop/lazada.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="https://www.jd.id/promotion/Aqua-Official-Store/3Xh4T8GkjKxgCsadDkgFHQnDi25m.html" target="_blank">
                                            <img src="/assets/images/shop/jdid.png" className="img-fluid px-2"/>
                                        </a>
                                        <a href="https://www.blibli.com/brand/aqua-japan-official-store" target="_blank">
                                            <img src="/assets/images/shop/blibli.png" className="img-fluid px-2"/>
                                        </a>
                                    </div>
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

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}
export default connect(mapStateToProps, null) (withTranslation('common')(Footer));