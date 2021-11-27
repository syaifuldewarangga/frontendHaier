import React, { Component } from "react";
import { Link } from "react-router-dom";
import './ListProduct.css'

class ListProduct extends Component {
    render() {
        return (
            <div className="list-product col-lg-3 col-6 mb-4 px-lg-4">
                <div className="card card-product">
                    <Link to={`/product/detail/${this.props.data.id}`}>
                        <div className="image-product d-flex justify-content-center">
                            <img src="/assets/images/product/product1.png" className="img-fluid" alt="" />
                        </div>
                        <div className="card-body">
                            <div className="title-product mb-2">{this.props.data.product_name}</div>
                            <div className="d-xxl-flex justify-content-between">
                                <p className="m-0" style={{ color: "#003D79" }}>{ this.props.data.brand } </p>
                                <p className="m-0">{this.props.data.barcode}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="sub-product mb-3">
                            <div className="d-flex justify-content-between align-items-center"> 
                                <div className="d-flex align-items-center">
                                    <span className="material-icons me-2"> date_range </span>
                                    <span>{this.props.data.date}</span> 
                                </div> 
                                {/* <span> 1 year </span> */}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default ListProduct