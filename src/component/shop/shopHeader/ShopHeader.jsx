import React from 'react';
import './ShopHeader.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const ShopHeader = (props) => {
  const { t } = useTranslation('common');
  const [state, setState] = React.useState({
    tempSearch: '',
  });

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (props.page === 'Shop') {
        props.handleDataSearchShop(state.tempSearch);
      } else {
        props.handleDataSearch(state.tempSearch);
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [state.tempSearch]);
  return (
    <div>
      <div className="mb-5">
        <img src="/assets/images/shop-banner.png" className="img-fluid" />
      </div>
      <div className="container-fluid">
        <div className="shop-header px-lg-5">
          <p className="title">{props.headerTitle}</p>
          <div>
            <div className="mb-lg-5 mb-4 mt-4">
              <span className="material-icons-outlined md-36 search-addon">
                {' '}
                search{' '}
              </span>
              <input
                type="text"
                className="form-control form-control-lg search-input"
                placeholder={t('shop_list.shop_list')}
                onChange={(e) =>
                  setState({ ...state, ['tempSearch']: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleDataSearch: (data) =>
      dispatch({ type: 'SET_DATA_SEARCH_SERVICE_CENTER', value: data }),
    handleDataSearchShop: (data) =>
      dispatch({ type: 'SET_DATA_SEARCH_SHOP_LIST', value: data }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShopHeader);
