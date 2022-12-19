import React from 'react'
import { useParams } from 'react-router'
import UserRegisterProductManual from './UserRegisterProductManual'

const Add = () => {
    const { barcode } = useParams()
    return <UserRegisterProductManual barcode={barcode} />
}

export default Add