import { useTranslation } from 'react-i18next';
import React from 'react';
// import LoadMore from '../../component/shop/loadMore/LoadMore';
import NewShopList from '../../component/shop/newShopList/NewShopList';
import ShopHeader from '../../component/shop/shopHeader/ShopHeader';
// import ShopList from '../../component/shop/shopList/ShopList';
import axios from 'axios';
import { connect } from 'react-redux';
import '../../component/shop/loadMore/LoadMore.css';
import ModalOperationalHours from '../../component/shop/newShopList/ModalOperationalHours';
import { useState } from 'react';
import { client_id, client_secret, grant_type } from '../../variable';

const Shop = (props) => {
  const { t } = useTranslation('common');
  const [data, setData] = React.useState([]);
  let dataShowing;
  const [border, setBorder] = React.useState(10);
  const [storeDetail, setStoreDetail] = useState('')
  const token = localStorage.getItem('access_token')

  async function storeAPIGTM(gtmToken) {
    await axios.post(props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
      {
        StoreCode: '',
        StoreID: '',
        StoreName: props.search,
      },
      {
        headers: {
          Authorization: gtmToken,
          'Content-Type': 'text/plain',
        },
      }
    )
    .then((res) => {
      setData(res.data.data);
    })
    .catch((e) => {
      console.log(e.response)
    })
  }

  const fetchDataStoreGTM = async () => {
    await axios.post(props.gtm_token_url, {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: grant_type,
    }).then((res) => {
      const gtmToken = res.data.access_token
      storeAPIGTM(gtmToken)
    }).catch((err) => {
      console.log(err.response)
    })
  }

  React.useEffect(() => {
    fetchDataStoreGTM();
  }, [props.token, props.search]);

  const handleModalOperationl = async (StoreID) => {
    await axios.get(props.base_url + 'store', {
      headers: {
        Authorization: 'Bearer ' + token
      },
      params: {
        store_id: StoreID
      }
    }).then((res) => {
      setStoreDetail(res.data)
    }).catch(() => {
      setStoreDetail('')
    })
  }
  const List = () => {
    dataShowing = data.slice(0, border);
    return dataShowing.map((item, i) => (
      <div className="col-lg-6 mb-lg-5 mb-4">
        <NewShopList 
          data={item} 
          key={i} 
          handleModalOperationl = {handleModalOperationl}
        />
      </div>
    ));
  };

  return (
    <div>
      <ShopHeader headerTitle={t('shop_list.shop_list')} page="Shop" />
      <div className="container-fluid px-lg-5 shop">
        <div className="row px-lg-3">
            <List />
        </div>
        <div className="text-center mb-5">
          <button
            className="btn btn-danger btn-load-more"
            onClick={() => setBorder(border + 10)}
          >
            {t('general.load_more')}
          </button>
        </div>
      </div>
      <ModalOperationalHours 
        data = {storeDetail}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    gtm_token_url: state.GTM_TOKEN_URL,
    search: state.DATA_SEARCH_SHOP_LIST,
    base_url: state.BASE_URL
  };
};

export default connect(mapStateToProps, null)(Shop);
