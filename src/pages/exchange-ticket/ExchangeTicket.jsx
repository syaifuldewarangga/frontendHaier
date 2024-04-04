import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'
import './CardCss.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ModalConfirm = ({ v = 'default', handleClick, open, handleOpen }) => {
    const { t } = useTranslation('common')
    return (
        <Modal show={open} onHide={handleOpen}>
            <Modal.Header closeButton>
                <Modal.Title>{t('exchange_ticket.confirm')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column align-items-center">
                    <p>{t('exchange_ticket.confirm_description')}{v} ?</p>
                    <div className="d-flex gap-4">
                        <Button onClick={handleOpen} variant='outline-dark'>{t('exchange_ticket.no')}</Button>
                        <Button onClick={handleOpen}>{t('exchange_ticket.yes')}</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

const CardClaimComponent = ({ v }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)
    const { t } = useTranslation('common')
    return (
        <Card className='col-md-3 px-2 card-background' style={{ padding: '20px', width: 300, position: 'relative', overflow: 'hidden', height: 150 }}>
            <div>
                <h2 style={{ marginBottom: '0px' }}>
                    <span className="material-icons me-2" style={{ color: '#003d79' }}>discount</span>
                    {v}
                </h2>
                <p className='fw-light' style={{ color: 'grey' }}>{t('exchange_ticket.claim_as')}{v}</p>
                <div className='d-flex justify-content-center'>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: '0%', left: '0%', width: '100%', zIndex: -9 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#003d79" fill-opacity="1" d="M0,0L40,37.3C80,75,160,149,240,197.3C320,245,400,267,480,277.3C560,288,640,288,720,282.7C800,277,880,267,960,256C1040,245,1120,235,1200,245.3C1280,256,1360,288,1400,304L1440,320L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
            </div>
            <div 
                style={{ position: 'absolute', top: '5%', right: '0%', width: '20%', cursor: 'pointer' }}
            >
                <Button size='sm' onClick={handleOpen} variant='outline-secondary'>{t('exchange_ticket.as')}</Button>
            </div>
            <ModalConfirm 
                handleClick={() => {}}
                open={open}
                handleOpen={handleOpen}
                v={v}
            />
        </Card>
    )
}

const temp2 = ['Voucher', 'E-money']
const FormExchange = () => {
    const [value, setValue] = useState('')
    const handleChange = (e) => setValue(e.target.value)
    const { t } = useTranslation('common')
    return (
        <div style={{ padding: '20px' }} className='col'>
            <p>{t('exchange_ticket.current_ticket')} 2</p>
                <div className="row gap-2">
                    {temp2.map((v, i) => {
                        return <CardClaimComponent key={i} v={v} />
                    })}
                </div>
        </div>
    )
}

const temp = ['Voucher', 'E-money', 'Voucher', 'Voucher']
const ClaimedTicket = (props) => {
    const { t } = useTranslation('common');
    const createPDF = async (id) => {   
        const pdf = new jsPDF("landscape", "pt", [400, 200], true);
        const temp = document.getElementById(`voucher-${id}`)
        const data = await html2canvas(temp, {
            useCORS: true,
            quality: 2,
            scale: 5,
            proxy: props.image_url,
            allowTaint: false,
            logging: true,
        });
        const img = data.toDataURL("image/jpeg", 1);  
        
        pdf.addImage(img, "JPEG", 0, 0, 400, 200);
        pdf.save("voucher.pdf");
    };
    return (
        <div>
            <h1 className='mb-3'>{t('exchange_ticket.history')}</h1>
            <div className="container">
                <div className="row gap-2">
                    {temp.map((v, i) => {
                        return (
                            <Card key={i} id={`voucher-${i}`} className='col-md-3 px-2 card-background' style={{ padding: '20px', width: 300, position: 'relative', overflow: 'hidden', height: 150 }}>
                                <div>
                                    <h2 style={{ marginBottom: '0px' }}>
                                        <span className="material-icons me-2" style={{ color: '#003d79' }}> discount </span>
                                        {v}
                                    </h2>
                                    <p className='fw-light' style={{ color: 'grey',  }}>You claim Ticket as {v}</p>
                                    {v === 'Voucher' ?
                                        <div>
                                            <p style={{ textAlign: 'center', letterSpacing: '10px' }}>VCHR01</p>
                                        </div>
                                    : null
                                    }
                                </div>
                                <div style={{ position: 'absolute', bottom: '0%', left: '0%', width: '100%', zIndex: -9 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0056A7" fill-opacity="1" d="M0,0L40,37.3C80,75,160,149,240,197.3C320,245,400,267,480,277.3C560,288,640,288,720,282.7C800,277,880,267,960,256C1040,245,1120,235,1200,245.3C1280,256,1360,288,1400,304L1440,320L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
                                </div>
                                <div 
                                    onClick={() => createPDF(i)}
                                    style={{ position: 'absolute', top: '5%', right: '0%', width: '10%', cursor: 'pointer' }}
                                >
                                    <span className="material-icons me-2"> download </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const ExchangeTicket = (props) => {
    const { t } = useTranslation('common');
    return (
        <div>
            <div className="container-fluid contact py-5">
                <div className="px-lg-5 px-2">
                    <div className="row px-2">
                        <h1 className='col-12' style={{ marginBottom: '0px' }}>{t('navbar.exchange_ticket')}</h1>
                        <p className='col-12' style={{ color: 'grey' }}>{t('exchange_ticket.info')}</p>
                        <FormExchange />
                    </div>
                    <div className="row px-2 mt-5">
                        <ClaimedTicket />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExchangeTicket