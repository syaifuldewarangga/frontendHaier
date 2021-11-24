import { encode } from "base-64";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import './../shopList/ShopList.css'

const NewShopList = (props) =>
{
    const { t } = useTranslation('common')
    const latitude = encode('latitude')
    const longitude = encode('longitude')
    return (
        <div className="card shop-list">
            <Link to={`/shop-location/${latitude}/${longitude}`}>
                <div className="card-body">
                    <div className="">
                        <p className="shop-name">{props.data.service_center_name}</p>
                        <div className="address row mb-3">
                            <div className="col-lg-2 col-12"> {t('general.address')} : </div>
                            <div className="col-lg-10 col-12">Isi alamat</div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default NewShopList;