import axios from 'axios';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LandingPage from '../../../pages/LandingPage';
import ListProduct from '../listProduct/ListProduct';
import './Product.css';
class Product extends Component {
  state = {
    products: [],
  };

  async getProductFromApi() {
    let token = localStorage.getItem('access_token');
    await axios
      .get(this.props.base_url + 'register-product/user', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          id: localStorage.getItem('id'),
          // itemPerPage:  8
        },
      })
      .then((res) => {
        let data = res.data;
        this.setState({
          products: data.content,
        });
      });
  }

  
  componentDidMount() {
    this.getProductFromApi();
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid">
        <div className="col-lg-11 m-auto">
          <div className="head-product d-flex justify-content-between align-items-center">
            <p>{(t('landingPage.your_product'))}</p>
            <Link to="/product/all-product" className="see-more-product">
            {(t('general.see_more'))}
            </Link>
          </div>
        </div>
        <div className="col-lg-10 mx-auto">
          <div className="row">
            {this.state.products.map((product) => (
              <ListProduct key={product.id} data={product} refresh={this.getProductFromApi}  />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};

export default connect(mapStatetoProps, null)(withTranslation('common')(Product));
