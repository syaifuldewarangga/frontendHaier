import React from 'react'
import ButtonScannerSection from '../component/scan/buttonScannerSection/ButtonScannerSection'
import { useTranslation } from 'react-i18next'

const GuideSection = ({ handleButtonScanner }) => {
    const { t } = useTranslation('common')
    const translate = (name) => {
        return t(`landingPage.guide.${name}`)
    }
    return (
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-md-6'>
                    <small style={{ color: '#003D79', fontWeight: 'bold' }}>{translate('eyebrow')}</small>
                    <p style={{ color: '#003D79', fontWeight: 'bold', fontSize: '2rem' }}>{translate('title')}</p>
                    <p>{translate('sub_title')}</p>
                    <ol>
                        <li>{translate('1')}</li>
                        <li>{translate('2')}</li>
                        <li>{translate('3')}</li>
                    </ol>
                </div>
                <div className='col-md-6' onClick={handleButtonScanner}>
                    <ButtonScannerSection />
                </div>
            </div>
        </div>
    )
}

export default GuideSection