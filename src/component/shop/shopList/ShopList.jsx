import { encode } from "base-64";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import './ShopList.css'

const ShopList = (props) =>
{
    const { t } = useTranslation('common')
    const latitude = encode(props.data.latitude)
    const longitude = encode(props.data.longitude)
    const name = encode(props.data.service_center_name)
    return (
        <div className="card shop-list">
            <Link to={`/shop-location/${name}/${latitude}/${longitude}`}>
                <div className="card-body">
                    <div className="">
                        <p className="shop-name">{props.data.service_center_name}</p>
                        <div className="address row mb-3">
                            <div className="col-lg-2 col-12"> {t('general.address')} : </div>
                            <div className="col-lg-10 col-12">{props.data.address}</div>
                        </div>
                        <div className="address row mb-3">
                            <div className="col-lg-2 col-12"> {t('shop_list.open_day')} : </div>
                            <div className="col-lg-10 col-12">{props.data.open_day}</div>
                        </div>
                        <div className="address row mb-3">
                            <div className="col-lg-2 col-12"> {t('shop_list.close_day')} : </div>
                            <div className="col-lg-10 col-12">{props.data.close_day}</div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="m-0"></p>
                            <p className="m-0">{props.data.open_hour}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ShopList;