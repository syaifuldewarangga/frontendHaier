import { useTranslation } from 'react-i18next';
import React from 'react';
// import LoadMore from '../../component/shop/loadMore/LoadMore';
import NewShopList from '../../component/shop/newShopList/NewShopList';
import ShopHeader from '../../component/shop/shopHeader/ShopHeader';
// import ShopList from '../../component/shop/shopList/ShopList';
import axios from 'axios';
import { getToken } from '../../action/action';
import { connect, useDispatch } from 'react-redux';
import '../../component/shop/loadMore/LoadMore.css';

const Shop = (props) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = React.useState([]);
  let dataShowing;
  const [border, setBorder] = React.useState(10);

  React.useEffect(() => {
    async function fetchData() {
      const request = await axios
        .post(
          props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
          {
            StoreCode: '',
            StoreID: '',
            StoreName: props.search,
          },
          {
            headers: {
              Authorization: props.token,
              'Content-Type': 'text/plain',
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
        })
        .catch((e) => {
          dispatch(getToken());

          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log('request : ' + e.request);
          } else {
            console.log('message : ' + e.message);
          }
        });
      return request;
    }
    fetchData();
  }, [props.token, props.search]);

  const List = () => {
    dataShowing = data.slice(0, border);
    return dataShowing.map((item, i) => {
      return <NewShopList data={item} key={i} />;
    });
  };

  return (
    <div>
      <ShopHeader headerTitle={t('shop_list.shop_list')} page="Shop" />
      <div className="container-fluid px-lg-5 shop">
        <div className="row px-lg-3">
          <div className="col-lg-6 mb-lg-5 mb-4">
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
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    token: state.GTM_TOKEN,
    search: state.DATA_SEARCH_SHOP_LIST,
  };
};

export default connect(mapStateToProps, null)(Shop);
