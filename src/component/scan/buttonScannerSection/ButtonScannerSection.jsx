import React, { Component } from "react"
import { withTranslation } from "react-i18next";
import './ButtonScannerSection.css'

class ButtonScannerSection extends Component {
    render() {
        const { t } = this.props
        return (
            <div className="btn-scanner-section">
                <div className="container my-5">
                    <div className="">
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="barcode-icon" src="/assets/images/barcode.png" alt="barcode" />
                        </div>
                        <div className="mt-lg-4 mt-3 d-flex justify-content-center">
                            <button className="btn btn-color-primary btn-scan px-4" data-bs-toggle="modal" data-bs-target="#cameraScan"> {t('landingPage.scan_your_product_here')} </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation('common')(ButtonScannerSection);