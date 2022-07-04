import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import LoadMore from "../../shop/loadMore/LoadMore";
import ListProduct from "../listProduct/ListProduct";
import './AllProduct.css'

class AllProduct extends Component 
{
    constructor(props){
        super(props);
        this.timeout =  0;
    }

    state = ({
        products: [],
        searchDataProduct: [],
        currentPage: 0,
        lastPage: false,
        search: false,
    })

    doSearch(event){
        var searchText = event.target.value
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if(searchText !== '') {
            this.setState({
                search: true
            })
            this.searchProductFromApi(searchText)
          } else {
            this.setState({
                search: false
            })
          }
        }, 500);
    }

    async searchProductFromApi(search) {
        var token = localStorage.getItem('access_token');
        await axios.get(this.props.base_url + 'register-product/user/search', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                id: localStorage.getItem('id'),
                param: search,
            },
        }).then((res) => {
            let data = res.data
            this.setState({
                searchDataProduct: data
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
                page: this.state.currentPage,
                itemPerPage: 8
            }
        }).then((res) => {
            let data = res.data
            if(data.last === true) {
                this.setState({
                    lastPage: true
                })
            }
            this.setState({
                products: this.state.products.concat(data.content)
            })
        })
    }

    componentDidMount() {
        this.getProductFromApi()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.state.currentPage) {
            this.getProductFromApi()
        }
    }

    handleLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
    };

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
                                this.state.search ? 
                                    this.state.searchDataProduct.map((sproduct) => (
                                        <ListProduct 
                                            key={sproduct.id}
                                            data={sproduct}
                                        />
                                    ))
                                :
                                    this.state.products.map((product) => (
                                        <ListProduct 
                                            key={product.id}
                                            data={product}
                                        />
                                    ))
                            }
                        </div>
                    </div>
                    {
                        !this.state.search ? !this.state.lastPage ? 
                            <LoadMore 
                            handleLoadData = {this.handleLoadMore}
                            /> 
                        : null : null
                    }
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