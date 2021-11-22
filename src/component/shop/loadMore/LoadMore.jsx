import { t } from "i18next";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import './LoadMore.css';

class LoadMore extends Component 
{
    render () {
        const { t } = this.props
        return (
            <div className="text-center mb-5">
                <button className="btn btn-danger btn-load-more">{t('general.load_more')}</button>
            </div>
        );
    }
}

export default withTranslation('common')(LoadMore);