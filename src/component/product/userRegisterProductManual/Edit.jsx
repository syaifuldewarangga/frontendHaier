import React, { useEffect, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import UserRegisterProductManual from './UserRegisterProductManual'
import { format } from 'date-fns';
import axios from 'axios';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const Edit = (props) => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        setLoading(true)
        let token = localStorage.getItem('access_token');
        const res = await axios.get(props.base_url +'register-product/product', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                id,
            }
        })
        setData(res.data)
        setLoading(false)
    }

    useEffect(() => {
        let m = true
        if(m) getData()
        return () => m = false
    }, [id])
    return loading ? <h1>Loading...</h1> : <UserRegisterProductManual title='edit' barcode={data.barcode} data={data} idProduct={id}  />
}
const mapStatetoProps = (state) => {
    return {
      base_url: state.BASE_URL,
      image_url: state.URL
    };
};
export default connect(mapStatetoProps, null)(withTranslation('common')(withRouter(Edit)));