import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import ContactMenu from "../../component/contact/contactMenu/ContactMenu";
import './Contact.css'

class Contact extends Component 
{
    render () {
        const { t } = this.props
        return (
            <div>
                <div className="container-fluid contact">
                    <div className="px-lg-5 px-2">
                        <div className="row">
                            <div className="col-lg-6">
                                <img src="/assets/images/contact.png" className="img-fluid" alt="contact"/>
                            </div>
                            <div className="col-lg-5 contact-content mt-3">
                                <div className="title">
                                    <p className="main-title text-uppercase">{t('contact.title')}</p>
                                    <p className="sub-title">{t('contact.sub_title')}</p>
                                </div>
                                <ContactMenu />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Contact);