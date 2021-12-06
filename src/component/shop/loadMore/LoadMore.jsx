import React from "react";
import { useTranslation } from "react-i18next";
import './LoadMore.css';

const LoadMore = (props) => {
    const {t} = useTranslation('common');
    return (
        <div className="text-center mb-5">
            <button 
                className="btn btn-danger btn-load-more"
                onClick={() => props.handleLoadData()}
            >
                {t('general.load_more')}
            </button>
        </div>
    );
}

export default LoadMore;