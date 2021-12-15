import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import LoadMore from '../../shop/loadMore/LoadMore';
import './ServiceRecord.css';
import { format } from 'date-fns';
import { Modal } from 'bootstrap';
import AlertModal from '../../alertModal/AlertModal';

const ProductCard = (props) => {
  const newDate = format(
    new Date(props.data.created_at.slice(0, 10)),
    'dd-MM-yyyy'
  );
  const history = useHistory();

  const handleSubmit = () => {
    history.push(
      `/service-status/detail/${props.data.srnum}/${props.data.mobile_phone}`
    );
  };

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
              <tr>
                <td>Service Number</td>
                <td> &nbsp; : &nbsp;</td>
                <td>{props.data.srnum}</td>
              </tr>
              <tr>
                <td>Barcode</td>
                <td> &nbsp; : &nbsp;</td>
                <td>{props.data.barcode}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td> &nbsp; : &nbsp;</td>
                <td>{props.data.status ? 'Finish' : 'Process'}</td>
              </tr>
              <tr>
                <td colSpan="3">
                  <button
                    className="btn btn-sm btn-outline-primary mt-3 me-2"
                    onClick={handleSubmit}
                  >
                    Tracking Status Service
                  </button>
                  {
                    props.data.status === false ?
                    <button
                      className="btn btn-sm btn-outline-primary mt-3"
                      onClick={() => props.handleFinish(props.data.srnum)}
                    >
                      Finish
                    </button> : null
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceRecord = (props) => {
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  var token = localStorage.getItem('access_token');
  const [messageAlert, setMessageAlert] = useState({
    status: 'success',
    title: 'Success',
    subTitle: 'your password has been changed successfully',
  });

  const getServiceRequestAPI = async () => {
    await axios
      .get(props.base_url + 'register-service', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          page: currentPage,
          itemPerPage: 10,
        },
      })
      .then((res) => {
        if (res.data.last === true) {
          setLastPage(true);
        }
        setData(data.concat(res.data.content));
      });
  };

  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  };

  const onHideModal = () => {
    var alertModal = document.getElementById('alertModal');
    alertModal.addEventListener('hide.bs.modal', function (event) {
      window.location.reload();
    });
  };

  const handleFinish = async (SRNumber) => {
    let formData = new FormData()
    formData.append('SRNum', SRNumber)
    formData.append('status', 1)

    await axios.patch(props.base_url + 'register-service/status', formData, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(() => {
      setMessageAlert({
        status: 'success',
        title: 'Success',
        subTitle: 'your password has been changed successfully',
      })
      alertModal()
      onHideModal()
    }).catch((err) => {
      setMessageAlert({
        status: 'error',
        title: 'sorry',
        subTitle: 'Finish service status failed',
      })
      alertModal()
      onHideModal()
      console.log(err.response)
    })
  }

  useEffect(() => {
    getServiceRequestAPI();
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="service-record row justify-content-center">
      <div className="col-lg-8">
        <div className="row">
          {data.map((item, index) => (
            <ProductCard 
              key={index} data={item} 
              handleFinish={handleFinish}
            />
          ))}
          {!lastPage ? <LoadMore handleLoadData={handleLoadMore} /> : null}
        </div>
      </div>
      <AlertModal data={messageAlert} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};
export default connect(mapStateToProps, null)(ServiceRecord);
