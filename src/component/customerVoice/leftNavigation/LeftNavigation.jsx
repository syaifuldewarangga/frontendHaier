import React from "react";
import { useTranslation } from "react-i18next";
import './LeftNavigation.css';

const LeftNavigation = (props) => {
    const { t } = useTranslation('common')
    return (
        <div className="left-navigation">
            <div className="bg">
                <div className="d-flex justify-content-center">
                    <div>
                        <div className="title col-lg-12 mb-5 text-center">
                            <p className="main-title">{t('question.total_question')}</p>
                            <p className="text-left sub-title">{props.questionTo} / {props.totalQuestion}</p>
                        </div>
                        {/* <div className="title mb-5 col-lg-12">
                            <p>Completion Rate</p>
                        </div>
                        <div className="pb-5">
                            <div className="row">
                                <div className="progress blue"> <span className="progress-left"> <span className="progress-bar"></span> </span> <span className="progress-right"> <span className="progress-bar"></span> </span>
                                    <div className="progress-value">
                                        100%
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftNavigation;