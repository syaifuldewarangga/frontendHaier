import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import ListProduct from "../listProduct/ListProduct";
import './AllProduct.css'

class AllProduct extends Component 
{
    constructor(props){
        super(props);
        this.timeout =  0;
    }

    state = ({
        products: []
    })

    doSearch(event){
        var searchText = event.target.value
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if(searchText !== '') {
            this.searchProductFromApi(searchText)
          } else {
            this.getProductFromApi()
          }
        }, 500);
    }

    async searchProductFromApi(search) {
        var token = localStorage.getItem('access_token');
        await axios.get(this.props.base_url + 'register-product/search', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                param: search,
            },
        }).then((res) => {
            let data = res.data
            console.log(data)
            this.setState({
                products: data
            })
        })
    }

    async getProductFromApi() {
        let token = localStorage.getItem('access_token')
        await axios.get(this.props.base_url + 'register-product/user', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                id: localStorage.getItem('id'),
                itemPerPage: 8
            }
        }).then((res) => {
            let data = res.data
            this.setState({
                products: data.content
            })
        })
    }

    componentDidMount() {
        this.getProductFromApi()
    }

    render () {
        return (
            <div className="all-product mb-5">
                <img src="/assets/images/shop-banner.png" className="img-fluid"/>
                <div className="container-fluid">
                    <div className="col-lg-10 m-auto">
                        <div className="head-product">
                            <p>Your Product</p>
                        </div>
                        <div className="mb-lg-5 my-4">
                            <span className="material-icons-outlined md-36 search-addon"> search </span>
                            <input 
                                type="text" 
                                className="form-control form-control-lg search-input" 
                                placeholder="Search your product"
                                onChange={event => this.doSearch(event)}
                            />
                        </div>
                    </div>
                    
                    <div className="col-lg-10 mx-auto">
                        <div className="row">
                            {
                                this.state.products.map((product) => (
                                    <ListProduct 
                                        key={product.id}
                                        data={product}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}

export default connect(mapStatetoProps, null) (AllProduct);