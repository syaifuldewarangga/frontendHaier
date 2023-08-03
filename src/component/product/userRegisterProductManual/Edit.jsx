import React, { useEffect, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import UserRegisterProductManual from './UserRegisterProductManual'
import { format } from 'date-fns';
import axios from 'axios';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const Edit = (props) => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    var token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const [detailProductBySerialNumber, setDetailProductBySerialNumber] = useState()
    const [dataUserByUsername, setDataUserByUsername] = useState()
    const navigate = useHistory()

    const getProductGcc = async (product_id) => {
        try {
            const res = await axios.get(props.base_url + "v2/product/gcc", {
                headers: {
                    Authorization: "Bearer " + token,
                },
                params: {
                    param: product_id,
                },
            });
            if (res.data.length > 0) {
                const data = res.data[0]
                setDetailProductBySerialNumber({
                    ProductName: data.productModel,
                    ProductID: data.productCode,
                    ProductCategoryName: data.category,
                    Brand: data.brand,
                    BrandValue: data.brandValue,
                    CategoryValue: data.categoryValue
                }) 
            }
            setLoading(false)
        } catch (err) {
            setLoading(false);
            // console.log(err.response)
        } 
    };
    const fetchDataProductHGWMS = async (barcode) => {
        try {
            const formData = new FormData();
            formData.append("serialNumber", barcode);
            const res = await axios.post(props.hgwms_url, formData);
            if (!!res.data.barcodeInfo?.serialNumber) {
                let product_code_length =
                    res.data.barcodeInfo?.productCode.split("").length;
                let product_code = res.data.barcodeInfo?.productCode;
                if (product_code_length == 9) {
                    product_code = `${product_code}00`;
                }
                getProductGcc(product_code);
                // getProductGcc('BY0K1FE0000')
            }else{
                setLoading(false);
            }
            
        } catch (error) {
            setLoading(false);
        }
    };
    const fetchDataProductWMS = async (barcode) => {
        await axios
            .get(props.oapi_url + "wms-order-out", {
                params: {
                    barcode: barcode,
                },
            })
            .then((res) => {
                let data = res.data;
                let count = Object.keys(data).length;
                if (count > 0) {
                    let product_code_length =
                        data.PRODUCT_CODE.split("").length;
                    let product_code = data.PRODUCT_CODE;
                    if (product_code_length == 9) {
                        product_code = `${data.PRODUCT_CODE}00`;
                    }
                    getProductGcc(product_code);
                } else {
                    fetchDataProductHGWMS(barcode);
                }
            })
            .catch((err) => {
                if (err.response?.status == 404) {
                    fetchDataProductHGWMS(barcode);
                }
            });
    };

    const getDataUserByUserName = async () => {
        try {
            const res = await axios.get(props.base_url+'user', {
                headers: {
                    Authorization: "Bearer " + token,
                },
                params: {
                    username,
                },
            })
            setDataUserByUsername(res.data)
        } catch (err) {
            console.log(err.response)
        }
    }


    const getData = async () => {
        setLoading(true)
        let token = localStorage.getItem('access_token');
        try {
            const res = await axios.get(props.base_url +'register-product/product', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                params: {
                    id,
                }
            })
            await fetchDataProductWMS(res.data.serial_number)
            setData(res.data)
        } catch (err) {
            
        }
    }
    useEffect(() => {
        let m = true
        if(m){
            Promise.all([getData(), getDataUserByUserName()]).then(v => {
                // setLoading(false)
            })
        } 
        return () => m = false
    }, [id])
    
    if(loading){
        return null
    }
    if(!!dataUserByUsername){
        if(!!dataUserByUsername?.birth_date){
            return <UserRegisterProductManual detailProductBySerialNumber={detailProductBySerialNumber} title='edit' barcode={data.barcode} data={data} idProduct={id}  />
        }else{
            return(
                <div className="container-fluid mt-5">
                    <div className="row mt-5">
                        <div className="col-lg-6">
                            <h5 className="title mt-5">
                                Lengkapi Data Diri Terlebih Dahulu, klik <span style={{ textDecoration: 'underline', fontStyle: 'italic', cursor: 'pointer' }} onClick={() => navigate.push('/profile')}>disini</span> 
                            </h5>
                        </div>
                    </div>
                </div>
            )
        }
    }
    return null
}
const mapStatetoProps = (state) => {
    return {
      base_url: state.BASE_URL,
      oapi_url: state.OAPI_URL,
      hgwms_url: state.HGWMS_URL,
      image_url: state.URL
    };
};
export default connect(mapStatetoProps, null)(withTranslation('common')(withRouter(Edit)));