import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { ImageFunction } from "../../../variable/ImageFunction";
import './ListProduct.css'
import axios from "axios"
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Button, Modal, Spinner } from "react-bootstrap";
import { withRouter } from 'react-router-dom';
import './AlertCss2.css'
import moment from 'moment'

class ListProduct extends Component {
    state = {
        modal1: false,
        modal2: false,
        modal3: false,
        loading: false,
    }

    closeModal1 = () => this.setState({ modal1: false });
    closeModal2 = () => this.setState({ modal2: false });
    closeModal3 = () => this.setState({ modal3: false });

    async setPromo(promo_id, product_id) {
        this.setState({...this.state, loading: true})
        let token = localStorage.getItem('access_token');
        let formData = new FormData();
        formData.append('product_id', product_id)
        formData.append('promo_id', promo_id)
        // setTimeout(() => {
        //     
            
        // }, 1000);

        await axios
          .post(this.props.base_url + 'extended-warranty-promo/register', formData, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((res) => {
            this.setState({...this.state, loading: false, modal3: true})
          });
      }
    

    render() {
        return (
            <div className="list-product col-lg-3 col-6 mb-4 px-lg-4 ">
                <div className="card card-product h-100">
                    <Link to={`/product/detail/${this.props.data.id}`}>
                        <div className="image-product d-flex justify-content-center">
                            <img src={ImageFunction(this.props.data.category)} className="img-fluid" alt="" />
                        </div>
                        <div className="card-body">
                            <div className="title-product mb-2">{this.props.data.product_name}</div>
                            <div className="d-xxl-flex justify-content-between">
                                <p className="m-0 small" style={{ color: "#003D79" }}>{ this.props.data.brand } </p>
                                <p className="m-0 small">{this.props.data.barcode}</p>
                            </div>
                            <div className="d-flex">
                            <span class={`badge ${this.props.data.status_product === true ? 'bg-success' : 'bg-danger'}`}> {this.props.data.status_product === true ? 'complete' : 'not complete'}</span>

                            </div>
                        </div>
                    </Link>
                        <hr />
                        <div className="sub-product mb-3 h-100">
                            <div className="d-flex justify-content-between align-items-center h-100"> 
                                <div className="d-flex align-items-center">
                                    <span className="material-icons me-2"> date_range </span>
                                    <span>{moment(this.props.data.date).format("DD-MM-YYYY")}</span> 
                                </div>
                                {this.props.data.promo !== null &&
                                <a href={`${this.props.data.promo.link}`} target="_blank">
                                    <img style={{ height: '60px', maxWidth: '60px', objectFit: 'cover', objectPosition: 'center' }} src={`${this.props.image_url}${this.props.data.promo.thumbnail}`} alt="test" className="img-fluid" />
                                </a> 
                                }
                                {this.props.data.avail_promo !== null && <span className="badge badge-lg cursor-pointer btn-primary" onClick={() => this.setState({...this.state, modal1: true})}>Aktifasi</span>}
                            </div>
                        </div>
                    
                    
                    
                    {/* Modal 1 */}
                    <Modal show={this.state.modal1} onHide={this.closeModal1}>
                            <Modal.Header closeButton>
                                <Modal.Title>Promo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h4>Congratulations!!, You're get a Promo!</h4>
                                <p>Click button below for activation</p>
                            </Modal.Body>
                            <Modal.Footer>
                                {this.state.loading ? 
                                <Button variant="success" disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Loading...
                                </Button>
                                :
                                <Button variant="success" onClick={() => this.setPromo(this.props.data.avail_promo.id, this.props.data.id)}>Activation</Button>
                                }
                                
                            </Modal.Footer>
                    </Modal>

                    {/* not active */}
                    {this.props.data.promo !== null && 
                    <Fragment>
                        {/* <span className="badge cursor-pointer my-2 mx-2 btn-secondary" onClick={() => this.setState({...this.state, modal2: true })}>Lihat Promo</span> */}

                        {/* {console.log(this.props.data.promo)} */}

                        {/* Modal 2 */}
                        {/* <Modal show={this.state.modal2} onHide={this.closeModal2}>
                            <Modal.Header closeButton>
                                <Modal.Title>{this.props.data.promo.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.props.data.promo.thumbnail !== null && 
                                <img src={ImageFunction(this.props.data.promo.thumbnail)} alt="test" className="img-fluid" />
                                }
                                {this.props.data.promo.notification_text !== null && 
                                <h1>{this.props.data.promo.notification_text}</h1>
                                }
                                
                                <p>Durasi Promo : {this.props.data.promo.ex_warranty_days} ({this.props.data.promo.ex_warranty_days_text})</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <a href={`${this.props.data.promo.link}`}>
                                    <Button variant="primary" onClick={this.closeModa2}>
                                        Lihat
                                    </Button>
                                </a>
                            </Modal.Footer>
                        </Modal> */}
                    </Fragment>
                    }

                    {/* Alert Activation Success  */}
                    <Modal show={this.state.modal3} onHide={this.closeModal3}>
                        <Modal.Header closeButton>
                            <Modal.Title>Activation Successfull</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex flex-column align-items-center">
                                <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ display: "flex" }}>
                                    <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                    <span className="swal2-success-line-tip"></span>
                                    <span className="swal2-success-line-long"></span>
                                    <div className="swal2-success-ring"></div> 
                                    <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                    <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                </div>
                                <Link to="/landing-page">
                                    <div className="modal-question-button my-3">
                                        <button className="btn rounded-pill" data-bs-dismiss="modal" aria-label="Close">OK</button>
                                    </div>
                                </Link>

                            </div>
                            
                        </Modal.Body>
                        <Modal.Footer>
                            
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        )
    }
}
const mapStatetoProps = (state) => {
    return {
      base_url: state.BASE_URL,
      image_url: state.URL
    };
};

export default connect(mapStatetoProps, null)(withTranslation('common')(withRouter(ListProduct)));