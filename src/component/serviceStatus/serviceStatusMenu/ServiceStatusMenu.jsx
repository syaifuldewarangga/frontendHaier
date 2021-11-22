import React from "react";
import { useTranslation } from "react-i18next";
import './ServiceStatusMenu.css'

const ServiceStatusMenu = () => {
    const { t } = useTranslation('common')
    return (
        <div>
            <div className="service-menu">
                <div className="service-menu-header py-lg-3 pt-3">
                    <p>{t('status_service.status_service')}</p>
                </div>

                <div className="service-menu-content">
                    <div className="row text-center mb-4">
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover active">All Status</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Appointment Scheduled</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Received by Service Partner</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Processing by Call Center</div>
                        </div>
                        <div className="col-12 col-lg p-lg-0">
                            <div className="cover">Repair Finished</div>
                        </div>
                    </div>
                    <div className="mb-5 mt-4">
                        <span className="material-icons-outlined md-36 search-addon"> search </span>
                        <input type="text" className="form-control form-control-lg search-input" placeholder={t('status_service.search_id_service')} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceStatusMenu;