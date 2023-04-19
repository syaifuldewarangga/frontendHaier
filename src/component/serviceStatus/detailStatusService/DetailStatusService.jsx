import React from 'react';
import './DetailStatusService.css';
import { format } from 'date-fns';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
var X2JS = require('x2js');

const StatusData = {
  1: "Created",
  2: "Dispatched",
  3: "Allocated",
  4: "Rejected",
  5: "In Service",
  6: "Completed",
  7: "Closed",
  8: "Cancelled"
}

const SubStatusData = {
  1: "Pending Dispatch",
  2: "Pending SC Accept",
  3: "Pending Allocate To Technician",
  4: "Pending Technician Set Off",
  5: "Pending Confirm by SC",
  6: "Pending Confirm by BSM",
  7: "Pending Confirm by CC",
  8: "Pending Technician Start Service",
  9: "Pending Technician Complete",
  10: "Pending Pending SC Complete",
  11: "Pending Pending CC Complete",
  12: "Completed by SC",
  13: "Completed by CC with code",
  14: "Completed by CC without code",
  15: "Closed",
  16: "WO been reopend",
  17: "Non-Service WO"
}

const DetailStatusService = (props) => {
  const { srNumber, phoneNumber } = useParams();
  const xtojson = new X2JS();
  var token = localStorage.getItem('access_token');

  const [data, setData] = React.useState('');
  React.useEffect(() => {
    const getData = async () => {
      const fd = new FormData();

      fd.append('SRNum', srNumber);
      fd.append('MobilePhone', phoneNumber);

      await axios
        .post(props.gsis_url + 'checkhsisrstatus', fd, {
          headers: {
            Accept: 'application/xml',
          },
        })
        .then((res) => {
          var json = xtojson.xml2js(res.data);
          let cek_error = json.Envelope.Body.CheckHSISRStatus_Output;
          if (cek_error.ErrorCode.__text !== '0') {
            // console.log(cek_error.ErrorMessage.__text);
          } 
          else {
            setData(json.Envelope.Body.CheckHSISRStatus_Output.ListOfServiceRequest.ServiceRequest);
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    };
    const getStatusFromGCC = async () => {
      const formData = new FormData()
      formData.append('WorkOrderNumber', srNumber)
      formData.append('ApplyId', srNumber)
      formData.append('PhoneNumber', phoneNumber)
      try {
        const res = await axios.post(props.base_url + 'v2/register-service/status', formData, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        if(!!res.data.data.Data){
          if(res.data.data.Data.WorkOrderNumber !== ""){
            const formData2 = new FormData()
            formData2.append('WorkOrderNumber', srNumber)
            formData2.append('ApplyId', srNumber)
            formData2.append('PhoneNumber', phoneNumber)
            const res = await axios.post(props.base_url + 'v2/register-service/status', formData2, {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            })
            // console.log(res.data.data)
            setData({...res.data.data.Data})
            return;
          }
          // console.log(res.data.data)
          setData({...res.data.data.Data})
        }
      } catch (err) {
        // console.log(err.response)
      }
    }
    getStatusFromGCC()
  }, []);
  return (
    <div className="detail-status-service">
      <div className="container-fluid">
        <div className="px-lg-5">
          <div className="px-lg-3">
            <div className="service-menu-header py-lg-3 pt-3">
              <p>Repair Service Detail</p>
            </div>
            <div className="d-lg-flex justify-content-center">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center">
                      <h4 className="title">Browse Repair Service</h4>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-6">
                        <div className="card header-title-status">
                          <p className="text-uppercase">
                            Repair Status Service
                          </p>
                        </div>
                        <div className="content mt-4">
                          <div>
                            <h6>Request Date : </h6>
                            <p>-</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="card header-title-status">
                          <p className="text-uppercase">Product Information</p>
                        </div>
                        <div className="content mt-4">
                          <div>
                            <h6>Product </h6>
                            <p>{data.ProductGroup}</p>
                          </div>
                          <div className="mt-4">
                            <h6>Model</h6>
                            <p>{data.ModelType}</p>
                          </div>
                          <div className="mt-4">
                            <h6>Serial Number </h6>
                            <p>{data.SN}</p>
                          </div>
                          <div className="mt-4">
                            <h6>Date of Purchase </h6>
                            <p>{data.WorkOrderNumber !== "" ? moment(data.PurchaseDate).format('LL') : "-"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body header-title-status">
                            <div>
                              <h5 style={{ color: '#8D8D8D' }}>
                                Status Information
                              </h5>
                            </div>
                            {/* Old */}
                            {/* <div style={{ overflowX: 'auto' }}>
                              <table className="table table-white mt-3">
                                <thead>
                                  <tr>
                                    <th scope="col">Number</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    data === '' ? null : data.ListOfRepair === undefined || data.ListOfRepair === '' ? null : Array.isArray(data.ListOfRepair) ?
                                    data.ListOfRepair.Repair.map((item) => (
                                          <tr>
                                            <td className="text-nowrap">
                                              {item.ChangedNo}
                                            </td>
                                            <td className="text-nowrap">
                                              {item.ChangedStatus}
                                            </td>
                                            <td className="text-nowrap">
                                              {item.StatusChangeDate}
                                            </td>
                                          </tr>
                                    )) : 
                                    <tr>
                                      <td className="text-nowrap">
                                        {data.ListOfRepair.Repair.ChangedNo}
                                      </td>
                                      <td className="text-nowrap">
                                        {data.ListOfRepair.Repair.ChangedStatus}
                                      </td>
                                      <td className="text-nowrap">
                                        {data.ListOfRepair.Repair.StatusChangeDate}
                                      </td>
                                    </tr>
                                  }
                                  {data === ''
                                    ? null
                                    : data.ListOfRepair.Repair.map((item) => {
                                        return (
                                          <tr>
                                            <td className="text-nowrap">
                                              {item.ChangedNo}
                                            </td>
                                            <td className="text-nowrap">
                                              {item.ChangedStatus}
                                            </td>
                                            <td className="text-nowrap">
                                              {item.StatusChangeDate}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                </tbody>
                              </table>
                            </div> */}

                            {/* New */}
                            <div style={{ overflowX: 'auto' }}>
                              <table className="table table-white mt-3">
                                <thead>
                                  <tr>
                                    <th scope="col">Status</th>
                                    <th scope="col">Sub Status</th>
                                    <th scope="col">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-nowrap">
                                      {
                                        !!data.Status ? StatusData[data.Status] :
                                        !!data.StatusDescription ? data.StatusDescription : "-"
                                      }
                                    </td>
                                    <td className="text-nowrap">
                                      {
                                        !!data.SubStatus ? SubStatusData[data.SubStatus] :
                                        '-'
                                      }
                                    </td>
                                    <td className="text-nowrap">
                                      {data.WorkOrderNumber !== "" && !!data.ChangeTime ? moment(data.ChangeTime).format('LL')  : '-'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gsis_url: state.GSIS_URL,
    base_url: state.BASE_URL
  }  
}

export default connect(mapStateToProps, null) (DetailStatusService);
