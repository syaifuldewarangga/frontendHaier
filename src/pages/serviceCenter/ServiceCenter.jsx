import axios from 'axios';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import LoadMore from '../../component/shop/loadMore/LoadMore';
import ShopHeader from '../../component/shop/shopHeader/ShopHeader';
import ShopList from '../../component/shop/shopList/ShopList';

const ServiceCenter = (props) => {
  const [lastPage, setLastPage] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [state, setState] = React.useState({
    isSearch: false,
    dataSearch: [],
  });

  const token = localStorage.getItem('access_token');

  React.useEffect(() => {
    const fetchAPI = async () => {
      const request = await axios
        .get(props.base_url + 'service-center/search', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          params: {
            param: props.data_search,
          },
        })
        .then((res) => {
          setState({
            ...state,
            ['dataSearch']: res.data,
            ['isSearch']: true,
          });
        })
        .catch((e) => {
          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log('request : ' + e.request);
          } else {
            console.log('message : ' + e.message);
          }
        });
      return request;
    };
    if (props.data_search === '') {
      setState({
        ...state,
        ['isSearch']: false,
      });
    } else {
      fetchAPI();
    }
  }, [props.data_search]);

  const getServiceCenterFromAPI = async () => {
    await axios
      .get(props.base_url + 'service-center', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        props: {
          page: currentPage,
          itemPerPage: 10,
        },
      })
      .then((res) => {
        if (res.data.last === true) {
          setLastPage(true);
        }
        setData(data.concat(res.data.content));
        console.log(res.data.content);
      });
  };

  useEffect(() => {
    getServiceCenterFromAPI();
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  console.log(props.data_search + 'kosong');
  const { t } = useTranslation('common')
  return (
    <div>
      <ShopHeader headerTitle={t('shop_list.service_center')} />
      <div className="container-fluid px-lg-5 shop">
        <div className="row px-lg-3">
          {state.isSearch === true
            ? state.dataSearch.map(function (item, i) {
                return (
                  <div key={i} className="col-lg-6 mb-5">
                    <ShopList data={item} />
                  </div>
                );
              })
            : data.map(function (item, i) {
                return (
                  <div key={i} className="col-lg-6 mb-5">
                    <ShopList data={item} />
                  </div>
                );
              })}
          <LoadMore />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
    data_search: state.DATA_SEARCH_SERVICE_CENTER,
  };
};
export default connect(mapStateToProps, null)(ServiceCenter);
