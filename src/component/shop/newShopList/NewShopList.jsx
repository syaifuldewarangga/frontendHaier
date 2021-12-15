import { encode } from 'base-64';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './../shopList/ShopList.css';

const NewShopList = (props) => {
  const { t } = useTranslation('common');
  const name = encode(props.data.StoreName);
  const latitude = encode(props.data.Latitude);
  const longitude = encode(props.data.Longitude);

  return (
    <div className="card shop-list h-100">
      <Link to={`/shop-location/${name}/${latitude}/${longitude}`}>
        <div className="card-body">
          <div className="">
            <p className="shop-name">{props.data.StoreName}</p>
            <div className="address row mb-3">
              <div className="col-lg-2 col-12"> {t('general.address')} : </div>
              <div className="col-lg-10 col-12">{props.data.Street}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewShopList;
