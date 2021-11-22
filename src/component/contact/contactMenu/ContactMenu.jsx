import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ContactMessage from "../message/ContactMessage";
import './ContactMenu.css';

const ContactMenu = (props) => {
    const [contactData, setContactData] = useState()

    const token = localStorage.getItem('access_token')

    const getContactInformationDataFromAPI = async () => {
        await axios.get(props.base_url + 'contact-information', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            setContactData(res.data.content)
        })
    }

    useEffect(() => {
        getContactInformationDataFromAPI()
    }, [])

    const { t } = useTranslation('common')
    return (
        <div className="contact-menu mt-5 row">
            <ul className="nav nav-pills mb-3 pe-0 d-flex justify-content-between" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <div className="text-center header active px-lg-4 px-3 py-lg-3 py-2" data-bs-toggle="pill" data-bs-target="#pills-information" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                        <span className="material-icons md-36 mb-lg-3 mb-2"> info </span>
                        <p className="title">{t('contact.information')}</p>
                    </div>
                </li>
                <li className="nav-item" role="presentation">
                    <div className="text-center header px-lg-4 px-3 py-lg-3 py-2" data-bs-toggle="pill" data-bs-target="#pills-location" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                        <span className="material-icons md-36 mb-lg-3 mb-2"> location_on </span>
                        <p className="title">{t('contact.our_location')}</p>
                    </div>
                </li>
                <li className="nav-item" role="presentation">
                    <div className="text-center header px-lg-4 px-3 py-lg-3 py-2" data-bs-toggle="pill" data-bs-target="#pills-message" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                    <span className="material-icons md-36 mb-lg-3 mb-2"> email </span>
                        <p className="title">{t('contact.send_message')}</p>
                    </div>
                </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-information" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="row mt-lg-3 mt-2 mb-5">
                        <div dangerouslySetInnerHTML={{ __html: contactData }}></div>
                        {/* <div className="col-lg-6">
                            <div className="fw-bold pb-lg-4 pb-3">
                                HEAD OFFICE
                            </div>
                            <p className="m-0">Jl. Danau Sunter Barat Blog AIII No.38-39 Jakarta Utara 14350</p>
                        </div>
                        <div className="col-lg-6">
                            <div className="fw-bold pb-lg-4 pb-3 pt-5 pt-lg-1">
                                OPERATIONAL HOUR
                            </div>
                            <div className="mb-3">
                                <p className="m-0">Senin - Jumat</p>
                                <p className="m-0">07:00 - 19:00 WIB</p>
                            </div>
                            <div className="mb-3">
                                <p className="m-0">Sabtu, Minggu & Hari Libur</p>
                                <p className="m-0">08:00 - 17:00 WIB</p>
                            </div>
                            <div>
                                <p className="m-0">Phone: +62 (21) 650-5668 (hunting)</p>
                                <p className="m-0">Fax: +62 (21) 651-2556</p>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-location" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.9309811223786!2d106.8577192592085!3d-6.144709675043267!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x984e758c0e5fb947!2sAQUA%20JAPAN!5e0!3m2!1sen!2sus!4v1635836336019!5m2!1sen!2sus" 
                        width="100%" 
                        height="500" 
                        style={{ border:0 }} 
                        allowfullscreen="" 
                        loading="lazy"
                    >    
                    </iframe>
                </div>
                <ContactMessage />
            </div>
        </div>
    );
} 

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}

export default  connect(mapStateToProps, null) (ContactMenu);