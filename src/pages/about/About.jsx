import axios from "axios";
import { t } from "i18next";
import React, { Component, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import Banner from "../../component/banner/Banner";
import './About.css'


const About = (props) => {
    const [aboutData, setAboutData] = useState('')

    const getAboutFromAPI = async () => {
        let token = localStorage.getItem('access_token')
        await axios.get(props.base_url + 'about', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            setAboutData(res.data.content)
        })
    }

    useEffect(() => {
        getAboutFromAPI()
    }, [])

    const { t } = useTranslation('common')
    return (
        <div>
            <div className="about">
                <Banner />
                <div className="px-lg-5 px-3">
                    <p className="title mt-lg-5 mt-3 mb-3">{t('general.about_us')}</p>
                    <div className="description mb-5" >
                        <div dangerouslySetInnerHTML={{ __html: aboutData }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}
export default  connect(mapStateToProps, null) (About);