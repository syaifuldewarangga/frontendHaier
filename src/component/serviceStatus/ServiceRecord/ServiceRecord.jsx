import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import LoadMore from "../../shop/loadMore/LoadMore";
import './ServiceRecord.css'
import { format } from 'date-fns';

const ProductCard = (props) => {
    const newDate = format(new Date(props.data.created_at.slice(0,10)), 'dd-MM-yyyy')
    const history = useHistory()

    const handleSubmit = () => {
        history.push(`/service-status/detail/APMY200623000626/${props.data.mobile_phone}`)
    }
    
    return (
        <div className="col-lg-6 mb-5 col-12">
            <div className="list-status-product">
                <div className="row col-lg-12">
                    <div className="col-4 image">
                        <img src="/assets/images/product/product1.png" alt="" />
                    </div>
                    <div className="col-8">
                        <div className="product-title">
                            <p className="title">{props.data.category}</p>
                        </div>
                        <table className="detail-status mt-2">
                            <tr>
                                <td>Registered Service</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>{newDate}</td>
                            </tr>
                            {/* <tr>
                                <td>Status</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>
                                    <span className="text-success">Repair Finish</span>
                                </td>
                            </tr> */}
                            {/* <tr>
                                <td>Last Update</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>22-10-2021</td>
                            </tr> */}
                            <tr>
                                <td>Service Number</td>
                                <td> &nbsp; : &nbsp;</td>
                                <td>APMY200623000626</td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <button 
                                        className="btn btn-sm btn-outline-primary mt-3"
                                        onClick={handleSubmit}
                                    >
                                        Tracking Status Service
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ServiceRecord = (props) => {
    const [data, setData] = useState([])
    const [lastPage, setLastPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    var token = localStorage.getItem('access_token');

    const getServiceRequestAPI = async () => {
        await axios.get(props.base_url + 'register-service', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                page: currentPage,
                itemPerPage: 10
            }
        }).then((res) => {
            if(res.data.last === true) {
                setLastPage(true)
            }
            setData(data.concat(res.data.content))
        })
    }

    useEffect(() => {
        getServiceRequestAPI()
    }, [currentPage])

    const handleLoadMore = () => {
        setCurrentPage(currentPage + 1);
    };
      
    return (
        <div className="service-record row justify-content-center">
            <div className="col-lg-8 ">
                <div className="row">
                    {
                        data.map((item, index) => (
                            <ProductCard 
                                key={index}
                                data={item}
                            />
                        ))
                    }
                    {
                        !lastPage ? 
                        <LoadMore 
                            handleLoadData = {handleLoadMore}
                        /> : null
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        base_url : state.BASE_URL
    }
}
export default connect(mapStateToProps, null) (ServiceRecord);