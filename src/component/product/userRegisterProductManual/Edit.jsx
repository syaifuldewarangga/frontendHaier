import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import UserRegisterProductManual from './UserRegisterProductManual'
import { format } from 'date-fns';

const Edit = () => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        setLoading(true)
        setTimeout(() => {
            setData({
                brand: 'aqua',
                product_model: 'AQ-WEADAW',
                category: 'ac',
                date: format(new Date(), 'yyyy-MM-dd'),
                warranty: '',
                invoice: '',
                aggrements: 'Y',
                store: 'FAMILY ELEKTRONIK SALAMAN',
            })
            setLoading(false)
        }, 500);
    }

    useEffect(() => {
        let m = true
        if(m) getData()
        return () => m = false
    }, [id])
    return loading ? <h1>Loading...</h1> : <UserRegisterProductManual barcode={'editbarcode'} data={data} idProduct={id}  />
}

export default Edit