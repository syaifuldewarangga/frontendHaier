import { useTranslation } from "react-i18next";
import LoadMore from "../../component/shop/loadMore/LoadMore";
import NewShopList from "../../component/shop/newShopList/NewShopList";
import ShopHeader from "../../component/shop/shopHeader/ShopHeader";
import ShopList from "../../component/shop/shopList/ShopList";
const Shop = () => 
{
    const { t } = useTranslation('common');
    return (
        <div>
            <ShopHeader headerTitle={t('shop_list.shop_list')}/>
            <div className="container-fluid px-lg-5 shop">
                <div className="row px-lg-3">
                    <div className="col-lg-6 mb-lg-5 mb-4">
                        <NewShopList data="" />
                    </div>

                    <LoadMore />
                </div>
            </div>
        </div>
    );
}

export default Shop;