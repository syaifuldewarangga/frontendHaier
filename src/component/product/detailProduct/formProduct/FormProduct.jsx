import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import './FormProduct.css'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { format } from 'date-fns'
import AlertModal from "../../../alertModal/AlertModal";
import { Modal } from "bootstrap";
import { useHistory } from "react-router";
var X2JS = require("x2js")

const FormProduct = (props) =>  {
    const xtojson = new X2JS()
    const history = useHistory()
    const [newDate, setNewDate] = useState()
    const [data, setData] = useState({
        brand: '',
        category: '',
        product_model: '',
        serial_number: '',
        purchase_date: '',
        address: '',
        barcode: '',
        product_id: '',
        product_name: '',
        store_name: '',
        store_location: '',
        visit_date: '',
        visit_hours: '',
        description: '',
        agreements: '',
        mobile_phone: '',
    })
    const [errorData, setErrorData] = useState({
        store_name: '',
        visit_date: '',
        visit_hours: '',
        description: '',
        agreements: ''
    })
    const [errorGSIS, setErrorGSIS] = useState('')

    const [dataUser, setDataUser] = useState()
    const [serviceCenter, setServiceCenter] = useState('')
    const [dataServiceCenter, setDataServiceCenter] = useState([])
    const [serviceCenterLocation, setServiceCenterLocation] = useState('')
    const [dataAlert, setDataAlert] = useState({
        status: 'success',
        title: 'Success',
        subTitle: 'successfully requested service'
    })

    let token = localStorage.getItem('access_token');

    useEffect(() => {
        if(props.data.date !== undefined) {
            setNewDate(props.data.date.replaceAll('/', '-'))
        }
    }, [props.data.date])

    const getDataUserFromAPI = async () => {
        await axios.get(props.base_url + "user", {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                username: localStorage.getItem('username')
            }
        }).then((res) => {
            setDataUser(res.data)
        })
    }
    
    const getDataServiceCenterFromAPI = async () => {
        await axios.get(props.base_url + 'service-center', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }).then((res) => {
            setDataServiceCenter(res.data)
        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        getDataUserFromAPI()
        getDataServiceCenterFromAPI()
    }, [])

    useEffect(() => {
        setData({
            ...data, 
            brand: props.data.brand,
            category: 'TV',
            product_model: props.data.product_model,
            serial_number: props.data.serial_number,
            purchase_date: props.data.date,
            address: dataUser !== undefined ? dataUser.address : '',
            barcode: props.data.barcode,
            product_id: props.data.product_id,
            product_name: props.data.product_name,
            store_name: props.data.store_name,
            store_location: props.data.store_location,
            mobile_phone: dataUser !== undefined ? dataUser.phone : '',
        })
    }, [props.data, dataUser])

    useEffect(() => {
        let location = dataServiceCenter.filter((item) => item.service_center_name === serviceCenter);
        if(serviceCenter !== '') {
            setServiceCenterLocation(location[0].address)
            setData({
                ...data,
                store_name: serviceCenter,
                store_location: location[0].address
            })
        }
    }, [serviceCenter])

    let newDataServiceCenter = dataServiceCenter.map(({service_center_name}) => ({
        value: service_center_name,
        name: service_center_name
    }))

    const onChangeData = (e) => {
        if(e.target.name === 'agreements') {
            setData({
                ...data,
                agreements : e.target.checked ? '1' : ''
            })
        } else {
            setData({
                ...data,
                [e.target.name] : e.target.value
            })
        }
        console.log(data)
    }

    const InsertHSISRAPI = async () => {
        // format(new Date)
        const newPurchaseDate = format(new Date(data.purchase_date), 'dd/MM/yyyy')
        const newVisitDate = format(new Date(data.visit_date), 'MM/dd/yyyy')
        let xmls = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xml soap.org/soap/envelope/" xmlns:hai="http://haier.com" xmlns:spir="http://www.siebel.com/xml/SPIRightNowInboundObject">
                <soapenv:Header/>
                <soapenv:Body>
                <hai:HATProdReg0926>
                    <spi:ServiceRequest>
                        <spi:SerialNum>${data.serial_number}</spi:SerialNum>
                        <spi:Category>${data.category}</spi:Category>
                        <spi:ProductModel>${data.product_model}</spi:ProductModel>
                        <spi:PurchaseDate>${newPurchaseDate}</spi:PurchaseDate>
                        <spi:PreferredVisitDate>${newVisitDate}</spi:PreferredVisitDate>
                        <spi:PreferredTime></spi:PreferredTime>
                        <spi:Requirement>${data.description}</spi:Requirement>
                        <spi:FirstName>${dataUser.first_name}</spi:FirstName>
                        <spi:LastName>${dataUser.last_name}</spi:LastName>
                        <spi:HomePhone></spi:HomePhone>
                        <spi:MobilePhone>${dataUser.phone}</spi:MobilePhone>
                        <spi:Email>${dataUser.email}</spi:Email>
                        <spi:Country>Indonesia</spi:Country>
                        <spi:Brand>${data.brand}</spi:Brand>
                        <spi:SRNum>APID21111500119</spi:SRNum>
                        <spi:DetailAddress>${dataUser.address}</spi:DetailAddress>
                        <spi:AddressId></spi:AddressId>
                        <spi:SourceType>1</spi:SourceType>
                        <spi:SourceCode>1</spi:SourceCode>
                    </spi:ServiceRequest>
                </hai:HATProdReg0926>
                </soapenv:Body>
            </soapenv:Envelope>
        `;
        await axios.post(props.gsis_url, xmls, {
        headers: {
            "Content-Type": "text/xml",
            "SOAPAction": '"document/http://haier.com:InsertHSISR"'
        }
        }).then((res) => {
            var json = xtojson.xml2js(res.data)
            console.log(json)
            // let cek_error = json.Envelope.Body.InsertHSISR_Output
            // if(cek_error.ErrorCode.__text !== '0') {
            //     console.log(cek_error.ErrorMessage.__text)
            //     setErrorGSIS(cek_error.ErrorMessage.__text)
            // } else {
            //     InsertServiceRegister()
            // }
            // console.log(cek_error)
        
        }).catch((err) => {
            console.log(err)
        })
    }

    const InsertServiceRegister = async () => {
        const formData = new FormData()

        if(data.visit_date !== '') {
            data.visit_date.replaceAll('-', '/')
        }

        let newVisiteDate = ''
        if(data.visit_date !== '') {
            newVisiteDate = data.visit_date.replaceAll('-', '/')
        }

        formData.append('brand', data.brand)
        formData.append('category', data.category)
        formData.append('product_model', data.product_model)
        formData.append('serial_number', data.serial_number)
        formData.append('purchase_date', data.purchase_date)
        formData.append('address', data.address)
        formData.append('barcode', data.barcode)
        formData.append('product_id', data.product_id)
        formData.append('product_name', data.product_name)
        formData.append('store_name', data.store_name)
        formData.append('store_location', data.store_location)
        formData.append('visit_date', newVisiteDate)
        formData.append('visit_hours', data.visit_hours)
        formData.append('description', data.description)
        formData.append('agreements', data.agreements)
        formData.append('mobile_phone', data.mobile_phone)
        formData.append('status', 1)

        await axios.post(props.base_url + 'register-service', formData, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }).then((res) => {
            alertModal()
            onHideModal()
        }).catch((err) => {
            if(err.response.data.errors !== undefined) {
                let responError = err.response.data.errors
                if(responError.location === 'store_name') {
                    setErrorData({
                        ...errorData,
                        store_name: responError.reason
                    })
                }

                if(responError.location === 'visit_date') {
                    setErrorData({
                        ...errorData,
                        visit_date: responError.reason
                    })
                }
    
                if(responError.location === 'visit_hours') {
                    setErrorData({
                        ...errorData,
                        visit_hours: responError.reason
                    })
                }
    
                if(responError.location === 'description') {
                    setErrorData({
                        ...errorData,
                        description: responError.reason
                    })
                }
                
                if(responError.location === 'agreements') {
                    setErrorData({
                        ...errorData,
                        agreements: responError.reason
                    })
                }
            } else {
                console.log(err.response)
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        InsertServiceRegister()
    } 

    const alertModal = () => {
        let alertModal = new Modal(document.getElementById('alertModal'));
        alertModal.show();
    }

    const onHideModal = () => {
        var alertModal = document.getElementById('alertModal');
        alertModal.addEventListener('hide.bs.modal', function (event) {
            history.push('/landing-page')
        });
    };

    return (
        <div className="px-lg-5 px-1 py-5 mb-5 detail-product">
            <p className="title">Product Detail</p>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="barcode" className="form-label">Barcode</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="barcode"
                                    disabled
                                    value={props.data.barcode}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product-id" className="form-label">Product ID</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="product-id" 
                                    disabled
                                    value={props.data.product_id}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="brand" className="form-label">Brand</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="brand" 
                                    disabled
                                    value={props.data.brand}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product" className="form-label">Product</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="product" 
                                    disabled
                                    value={props.data.product_name}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="product-model" className="form-label">Product Model</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="product-model" 
                                    value={props.data.product_model}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="serial-number" className="form-label">Serial Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="serial-number" 
                                    disabled
                                    value={props.data.serial_number}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="date-purchase" className="form-label">Date of Purchase</label>
                                <input 
                                    type="date" 
                                    className="form-control"  
                                    id="date-purchase" 
                                    disabled
                                    value={newDate}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="store-name" className="form-label">Service Center Name</label>
                                <SelectSearch
                                    options={newDataServiceCenter}
                                    value={serviceCenter}
                                    onChange={setServiceCenter}
                                    search
                                    filterOptions={fuzzySearch}
                                    placeholder="Search something"
                                    
                                />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-4">
                                <label htmlFor="store-location" className="form-label">Service Center Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="store-location" 
                                    disabled
                                    value={serviceCenterLocation}
                                />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-lg-6">
                                <div>
                                    <label htmlFor="visit-date" className="form-label">Visit Date</label>
                                    <input 
                                        type="date" 
                                        className={`form-control ${errorData.visit_date !== '' ? 'is-invalid' : null}`}
                                        id="visit-date" 
                                        name="visit_date"
                                        onChange={onChangeData}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        { errorData.visit_date }
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div>
                                    <label htmlFor="reapair-visit" className="form-label">Visit Hours</label>
                                    {/* <select 
                                        className={`form-select ${errorData.visit_hours !== '' ? 'is-invalid' : null}`}
                                        name="visit_hours"
                                        onChange={onChangeData}
                                    > */}
                                    <input 
                                        type="time"
                                        className={`form-control ${errorData.visit_hours !== '' ? 'is-invalid' : null}`}
                                        name="visit_hours"
                                        onChange={onChangeData}
                                    />
                                    <div className="invalid-feedback">
                                        { errorData.visit_hours }
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-2">
                                <p 
                                    className="text-danger" 
                                    style={{ fontSize: "13px", lineHeight: 1.3}}
                                >
                                    Catatan: Pilihan Tanggal Kunjungan Perbaikan hanya untuk referensi Anda dan tunduk pada waktu pemrosesan internal kami. Kami akan berusaha untuk menghubungi Anda sesuai dengan pilihan tanggal kunjungan perbaikan Anda.
                                </p>
                            </div>
                        </div>


                        <div className="col-lg-12">
                            <div className="mb-2">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea 
                                    className={`form-control ${errorData.description !== '' ? 'is-invalid' : null}`} 
                                    id="description" 
                                    rows="5"
                                    name="description"
                                    onChange={onChangeData}
                                    required
                                >
                                </textarea>
                                <div className="invalid-feedback">
                                    { errorData.description }
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-4">
                                <div class="form-check">
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" value="1" 
                                        onChange={onChangeData}
                                        name="agreements"
                                        required
                                    />
                                    <label class="form-check-label" >
                                        Dapatkah kami menghubungi Anda menggunakan WhatsApp kedepannya. 
                                    </label>
                                </div>
                                {
                                    errorData.agreements !== '' ?
                                    <div className="text-danger">
                                        { errorData.agreements }    
                                    </div> : null
                                }   
                            </div>
                        </div>

                        {
                            errorGSIS !== '' ? 
                                <div className="text-danger mb-3">
                                    { errorGSIS }
                                </div>
                            : null
                        }
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-color-primary py-3 btn-submit" type="submit">Service Registration</button>
                    </div>
                </form>
            </div>
            <AlertModal 
                data={dataAlert}
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL,
        gsis_url: state.GSIS_URL
    }
}
export default connect(mapStateToProps, null) (FormProduct);